import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Marquee from "@/components/ui/marquee";
import {
  Calendar,
  Clock,
  ChevronDown,
  User,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { formatEventDate } from "@/lib/formatEventDate";
import config from "@/config/config.js";

// CẤU HÌNH GOOGLE FORM CỦA BẠN
// RẤT QUAN TRỌNG: THAY THẾ CÁC GIÁ TRỊ NÀY BẰNG CỦA RIÊNG BẠN!
// Để an toàn, bạn nên sử dụng biến môi trường (ví dụ: process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL)
// Nếu bạn đang dùng Create React App, hãy đặt biến môi trường bắt đầu bằng REACT_APP_
// Nếu bạn đang dùng Next.js, hãy đặt biến môi trường bắt đầu bằng NEXT_PUBLIC_
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSffjOLiADBSPNExIUTNS-5FAmpKfMlzKKm5SBErWcqhJQEKlw/formResponse"; // Thay YOUR_FORM_ID
const ENTRY_ID_NAME = "entry.702848905"; // Thay bằng entry ID của trường "Tên của bạn"
const ENTRY_ID_MESSAGE = "entry.261536065"; // Thay bằng entry ID của trường "Lời chúc"
const ENTRY_ID_ATTENDING = "entry.827242592"; // Thay bằng entry ID của trường "Bạn có thể tham dự?"

export default function Wishes() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [name, setName] = useState("");
  const [newWish, setNewWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const options = config.ui.wishes.attendanceOptions;

  // DỮ LIỆU LỜI CHÚC CỨNG - KHÔNG LOAD TỪ DATABASE, CHỈ DÙNG ĐỂ HIỂN THỊ MẪU
  const [wishes, setWishes] = useState([
    {
      id: 1,
      name: "John Doe",
      message:
        "Wishing you both a lifetime of love, laughter, and happiness! 🎉",
      timestamp: "2024-12-24T23:20:00Z",
      attending: "attending",
    },
    {
      id: 2,
      name: "Natalie",
      message:
        "Wishing you both a lifetime of love, laughter, and happiness! 🎉",
      timestamp: "2024-12-24T23:20:00Z",
      attending: "attending",
    },
    {
      id: 3,
      name: "Abdur Rofi",
      message:
        "Congratulations on your special day! May Allah bless your union! 🤲",
      timestamp: "2024-12-25T23:08:09Z",
      attending: "maybe",
    },
  ]);

  const handleSubmitWish = async (e) => {
    e.preventDefault();

    if (!name.trim() || !newWish.trim() || !selectedAttendance) {
      alert("Vui lòng điền đầy đủ tên, lời chúc và trạng thái tham dự.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu để gửi tới Google Form
      const formData = new FormData();
      formData.append(ENTRY_ID_NAME, name.trim());
      formData.append(
        ENTRY_ID_MESSAGE,
        newWish.trim() + (selectedEmoji ? ` ${selectedEmoji}` : "")
      );
      // Lấy label từ options để gửi đúng giá trị mà Google Form hiển thị cho dropdown/multiple choice
      const attendanceLabel =
        options.find((opt) => opt.value === selectedAttendance)?.label ||
        selectedAttendance;
      formData.append(ENTRY_ID_ATTENDING, attendanceLabel);
      // Gửi emoji và timestamp nếu bạn có các trường này trong Google Form

      // Gửi dữ liệu tới Google Form
      const response = await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Rất quan trọng khi gửi đến Google Form từ frontend
      });

      // Google Form sẽ trả về phản hồi opaque (không truy cập được nội dung) với mode: 'no-cors'
      // Nên chúng ta chỉ kiểm tra xem fetch có thành công hay không
      // Nếu không có lỗi, coi như thành công
      console.log(
        "Phản hồi từ Google Form (không truy cập nội dung với no-cors):",
        response
      );

      // Cập nhật UI cục bộ để hiển thị lời chúc vừa gửi
      const newWishObj = {
        id: Date.now(), // Sử dụng timestamp làm ID duy nhất
        name: name.trim(),
        message: newWish.trim() + (selectedEmoji ? ` ${selectedEmoji}` : ""),
        attending: selectedAttendance,
        timestamp: new Date().toISOString(),
      };
      setWishes((prev) => [newWishObj, ...prev]);

      // Reset form
      setNewWish("");
      setName("");
      setSelectedAttendance("");
      setSelectedEmoji("");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      alert("Lời chúc của bạn đã được gửi thành công!"); // Thông báo thành công
    } catch (error) {
      console.error("Lỗi khi gửi lời chúc:", error);
      alert("Đã xảy ra lỗi khi gửi lời chúc. Vui lòng thử lại."); // Thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case "attending":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "not-attending":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <section
        id="wishes"
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: config.ui.landing.colors.background,
          color: config.ui.landing.colors.textColor,
          fontFamily: config.ui.landing.fonts.body,
        }}
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        <div className="container mx-auto px-4 py-20 relative z-1">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.2 }}
              className="inline-block font-medium"
              style={{ color: config.ui.landing.colors.highlightColor }}
            >
              {config.ui.wishes.subtitle}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-serif leading-tight"
              style={{
                color: config.ui.landing.colors.textColor,
                fontFamily: config.ui.landing.fonts.heading,
              }}
            >
              {config.ui.wishes.title}
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div
                className="h-[1px] w-12"
                style={{ backgroundColor: config.ui.landing.colors.cardBorder }}
              />
              <MessageCircle
                className="w-5 h-5"
                style={{ color: config.ui.landing.colors.iconColor }}
              />
              <div
                className="h-[1px] w-12"
                style={{ backgroundColor: config.ui.landing.colors.cardBorder }}
              />
            </motion.div>
          </motion.div>

          {/* Wishes List (Marquee) - Hiển thị dữ liệu cứng */}
          <div className="max-w-2xl mx-auto space-y-6">
            <AnimatePresence>
              {/* Chỉ hiển thị marquee nếu có lời chúc */}
              {wishes.length > 0 && (
                <Marquee
                  speed={20}
                  gradient={false}
                  className="[--duration:20s] py-2"
                >
                  {wishes.map((wish, index) => (
                    <motion.div
                      key={wish.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative w-[280px] flex-shrink-0 mx-2"
                    >
                      {/* Background gradient */}
                      <div
                        className="absolute inset-0 rounded-xl transform transition-transform group-hover:scale-[1.02] duration-300"
                        style={{
                          background: `linear-gradient(to right, ${config.ui.landing.colors.highlightColor}20, ${config.ui.landing.colors.highlightColor}20)`,
                        }}
                      />

                      {/* Card content */}
                      <div
                        className="relative backdrop-blur-sm p-4 rounded-xl shadow-md"
                        style={{
                          backgroundColor: `${config.ui.landing.colors.cardBackground}D9`,
                          border: `1px solid ${config.ui.landing.colors.cardBorder}`,
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start space-x-3 mb-2">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{
                                background: `linear-gradient(to right bottom, ${config.ui.landing.colors.highlightColor}, ${config.ui.landing.colors.highlightColor}BB)`,
                              }}
                            >
                              {wish.name[0]?.toUpperCase() || "G"}
                            </div>
                          </div>

                          {/* Name, Time, and Attendance */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4
                                className="font-medium text-sm truncate"
                                style={{
                                  color: config.ui.landing.colors.textColor,
                                }}
                              >
                                {wish.name}
                              </h4>
                              {getAttendanceIcon(wish.attending)}
                            </div>
                            <div
                              className="flex items-center space-x-1 text-xs"
                              style={{
                                color: config.ui.landing.colors.textColor,
                                opacity: 0.7,
                              }}
                            >
                              <Clock className="w-3 h-3" />
                              <time className="truncate">
                                {formatEventDate(wish.timestamp)}
                              </time>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <p
                          className="text-sm leading-relaxed mb-2 line-clamp-3"
                          style={{
                            color: config.ui.landing.colors.textColor,
                            opacity: 0.9,
                          }}
                        >
                          {wish.message}
                        </p>

                        {/* Optional: Time indicator for recent messages */}
                        {Date.now() - new Date(wish.timestamp).getTime() <
                          3600000 && (
                          <div className="absolute top-2 right-2">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${config.ui.landing.colors.highlightColor}20`,
                                color: config.ui.landing.colors.highlightColor,
                              }}
                            >
                              New
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </Marquee>
              )}
            </AnimatePresence>
          </div>

          {/* Wishes Form - Gửi dữ liệu tới Google Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <form onSubmit={handleSubmitWish} className="relative">
              <div
                className="backdrop-blur-sm p-6 rounded-2xl shadow-lg"
                style={{
                  backgroundColor: `${config.ui.landing.colors.cardBackground}D9`,
                  border: `1px solid ${config.ui.landing.colors.cardBorder}`,
                }}
              >
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center space-x-2 text-sm mb-1"
                      style={{
                        color: config.ui.landing.colors.textColor,
                        opacity: 0.7,
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>{config.ui.wishes.nameLabel}</span>
                    </div>
                    <input
                      type="text"
                      placeholder={config.ui.wishes.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border focus:ring focus:ring-opacity-50 transition-all duration-200 placeholder-gray-400"
                      style={{
                        backgroundColor: `${config.ui.landing.colors.cardBackground}AA`,
                        borderColor: config.ui.landing.colors.cardBorder,
                        color: config.ui.landing.colors.textColor,
                        "--tw-ring-color": `${config.ui.landing.colors.highlightColor}80`,
                      }}
                      required
                    />
                  </div>

                  {/* Attendance Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2 relative"
                  >
                    <div
                      className="flex items-center space-x-2 text-sm mb-1"
                      style={{
                        color: config.ui.landing.colors.textColor,
                        opacity: 0.7,
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{config.ui.wishes.attendanceLabel}</span>
                    </div>

                    {/* Custom Select Button */}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-2.5 rounded-xl border focus:ring focus:ring-opacity-50 transition-all duration-200 text-left flex items-center justify-between"
                      style={{
                        backgroundColor: `${config.ui.landing.colors.cardBackground}AA`,
                        borderColor: config.ui.landing.colors.cardBorder,
                        color: selectedAttendance
                          ? config.ui.landing.colors.textColor
                          : config.ui.landing.colors.textColor + "80",
                        "--tw-ring-color": `${config.ui.landing.colors.highlightColor}80`,
                      }}
                    >
                      <span>
                        {selectedAttendance
                          ? options.find(
                              (opt) => opt.value === selectedAttendance
                            )?.label
                          : config.ui.wishes.attendancePlaceholder}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isDropdownOpen ? "transform rotate-180" : ""
                        }`}
                        style={{ color: config.ui.landing.colors.iconColor }}
                      />
                    </button>

                    {/* Dropdown Options */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 rounded-xl shadow-lg border overflow-hidden"
                          style={{
                            backgroundColor:
                              config.ui.landing.colors.cardBackground,
                            borderColor: config.ui.landing.colors.cardBorder,
                          }}
                        >
                          {options.map((option) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSelectedAttendance(option.value);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left transition-colors`}
                              style={{
                                backgroundColor:
                                  selectedAttendance === option.value
                                    ? `${config.ui.landing.colors.highlightColor}10`
                                    : "transparent",
                                color:
                                  selectedAttendance === option.value
                                    ? config.ui.landing.colors.highlightColor
                                    : config.ui.landing.colors.textColor,
                              }}
                              whileHover={{
                                backgroundColor: `${config.ui.landing.colors.highlightColor}08`,
                              }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Wish Textarea */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center space-x-2 text-sm mb-1"
                      style={{
                        color: config.ui.landing.colors.textColor,
                        opacity: 0.7,
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{config.ui.wishes.wishLabel}</span>
                    </div>
                    <textarea
                      placeholder={config.ui.wishes.wishPlaceholder}
                      value={newWish}
                      onChange={(e) => setNewWish(e.target.value)}
                      className="w-full h-32 p-4 rounded-xl border focus:ring focus:ring-opacity-50 resize-none transition-all duration-200 placeholder-gray-400"
                      style={{
                        backgroundColor: `${config.ui.landing.colors.cardBackground}AA`,
                        borderColor: config.ui.landing.colors.cardBorder,
                        color: config.ui.landing.colors.textColor,
                        "--tw-ring-color": `${config.ui.landing.colors.highlightColor}80`,
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-white font-medium transition-all duration-200
                                                ${
                                                  isSubmitting
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : ""
                                                }`}
                    style={{
                      backgroundColor: isSubmitting
                        ? ""
                        : config.ui.landing.colors.highlightColor,
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? config.ui.wishes.submitting
                        : config.ui.wishes.submitButton}
                    </span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
