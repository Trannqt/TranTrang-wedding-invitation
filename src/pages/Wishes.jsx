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
import { useState, useEffect } from "react";
import { formatEventDate } from "@/lib/formatEventDate";
import config from "@/config/config.js";

// CẤU HÌNH GOOGLE FORM VÀ GOOGLE SHEET CỦA BẠN
// RẤT QUAN TRỌNG: THAY THẾ CÁC GIÁ TRỊ NÀY BẰNG CỦA RIÊNG BẠN!
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSffjOLiADBSPNExIUTNS-5FAmpKfMlzKKm5SBErWcqhJQEKlw/formResponse";
const ENTRY_ID_NAME = "entry.702848905"; // Thay bằng entry ID của trường "Tên của bạn"
const ENTRY_ID_MESSAGE = "entry.261536065"; // Thay bằng entry ID của trường "Lời chúc"
const ENTRY_ID_ATTENDING = "entry.827242592"; // Thay bằng entry ID của trường "Bạn có thể tham dự?"

// --- CẤU HÌNH CHO GOOGLE SHEET (NƠI LƯU PHẢN HỒI FORM) ---
const GOOGLE_SHEET_ID = "137IxqxZKU3MqEfC-JrTGp3VgYhlXBrjxADdZVugA8F0"; // Đã sửa lại ID chính xác
const GOOGLE_SHEET_GID = "264356337"; // Thay bằng GID của tab (sheet) chứa phản hồi trong Google Sheet

// Xây dựng URL gốc đến Google Sheet Visualization API
const GOOGLE_SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Sử dụng CORS Anywhere proxy để giải quyết vấn đề CORS khi GET dữ liệu
const GOOGLE_SHEET_FETCH_URL = GOOGLE_SHEET_BASE_URL;

export default function Wishes() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [name, setName] = useState("");
  const [newWish, setNewWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(""); // State cho emoji, nếu bạn có sử dụng

  // State mới để quản lý dữ liệu lời chúc thực tế từ Google Sheet
  const [wishes, setWishes] = useState([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [errorLoadingWishes, setErrorLoadingWishes] = useState(null);

  // New state to control marquee pause on hover
  const [isCardHovered, setIsCardHovered] = useState(false);

  const options = config.ui.wishes.attendanceOptions;

  // --- Hàm fetchWishes để tải lời chúc từ Google Sheet ---
  const fetchWishes = async () => {
    setIsLoadingWishes(true);
    setErrorLoadingWishes(null);
    try {
      const response = await fetch(GOOGLE_SHEET_FETCH_URL);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`
        );
      }

      const text = await response.text();
      // Google Visualization API trả về JSON được bao bọc trong một hàm callback
      const jsonString = text.substring(
        text.indexOf("{"),
        text.lastIndexOf("}") + 1
      );
      const data = JSON.parse(jsonString);

      if (data.status === "error") {
        throw new Error(
          data.errors[0]?.detailed_message ||
            "Lỗi khi tải dữ liệu từ Google Sheet."
        );
      }

      if (!data.table || !data.table.rows) {
        setWishes([]); // Không có dữ liệu hoặc định dạng không đúng
        return;
      }

      const rows = data.table.rows;
      const cols = data.table.cols;

      // Xây dựng map từ nhãn cột sang index để truy cập dễ dàng hơn
      const headerMap = {};
      cols.forEach((col, index) => {
        headerMap[col.label] = index;
      });

      const parsedWishes = rows
        .map((row) => {
          const timestampRaw = row.c[headerMap["Dấu thời gian"]]?.v;
          const name = row.c[headerMap["Tên của bạn"]]?.v;
          const attendingRaw = row.c[headerMap["Bạn có thể tham dự?"]]?.v;
          const message = row.c[headerMap["Lời chúc của bạn"]]?.v;

          // Chuyển đổi timestamp từ chuỗi "Date(yyyy,m,d,h,m,s)" sang Date object
          let parsedTimestamp = null;
          if (
            typeof timestampRaw === "string" &&
            timestampRaw.startsWith("Date(")
          ) {
            // Extract numbers from "Date(yyyy,m,d,h,m,s)"
            const matches = timestampRaw.match(
              /Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/
            );
            if (matches && matches.length === 7) {
              // Month is 0-indexed in JS Date, so subtract 1
              parsedTimestamp = new Date(
                parseInt(matches[1]), // Year
                parseInt(matches[2]), // Month (0-indexed)
                parseInt(matches[3]), // Day
                parseInt(matches[4]), // Hour
                parseInt(matches[5]), // Minute
                parseInt(matches[6]) // Second
              );
            }
          } else if (
            typeof timestampRaw === "number" ||
            (typeof timestampRaw === "string" && !isNaN(new Date(timestampRaw)))
          ) {
            // Handle raw numbers or ISO strings if they appear
            parsedTimestamp = new Date(timestampRaw);
          }

          // Chuẩn hóa trạng thái tham dự
          let attendingStatus = "";
          if (attendingRaw) {
            const lowerCaseAttending = String(attendingRaw).toLowerCase();
            if (lowerCaseAttending.includes("có")) {
              attendingStatus = "attending";
            } else if (lowerCaseAttending.includes("không")) {
              attendingStatus = "not-attending";
            } else if (lowerCaseAttending.includes("chưa chắc")) {
              attendingStatus = "maybe";
            }
          }

          return {
            id: parsedTimestamp
              ? parsedTimestamp.getTime() + Math.random()
              : Math.random(), // ID dựa trên timestamp + random
            timestamp: parsedTimestamp,
            name: name || "Ẩn danh",
            message: message || "Không có lời chúc",
            attending: attendingStatus,
          };
        })
        .filter(
          (wish) => wish.timestamp instanceof Date && !isNaN(wish.timestamp)
        ); // Lọc bỏ các mục không có timestamp hợp lệ

      // Sắp xếp lời chúc mới nhất lên đầu
      parsedWishes.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      setWishes(parsedWishes);
    } catch (error) {
      console.error("Lỗi khi tải lời chúc từ Google Sheet:", error);
      setErrorLoadingWishes(
        `Không thể tải lời chúc. Vui lòng kiểm tra quyền truy cập Sheet và cấu hình CORS Proxy. Lỗi: ${error.message}`
      );
    } finally {
      setIsLoadingWishes(false);
    }
  };

  // Sử dụng useEffect để fetch lời chúc khi component mount
  useEffect(() => {
    fetchWishes();
  }, []); // [] đảm bảo chỉ chạy một lần khi component được mount

  const handleSubmitWish = async (e) => {
    e.preventDefault();

    if (!name.trim() || !newWish.trim() || !selectedAttendance) {
      alert("Vui lòng điền đầy đủ tên, lời chúc và trạng thái tham dự.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append(ENTRY_ID_NAME, name.trim());
      formData.append(
        ENTRY_ID_MESSAGE,
        newWish.trim() + (selectedEmoji ? ` ${selectedEmoji}` : "")
      );
      const attendanceLabel =
        options.find((opt) => opt.value === selectedAttendance)?.label ||
        selectedAttendance;
      formData.append(ENTRY_ID_ATTENDING, attendanceLabel);

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      console.log(
        "Phản hồi từ Google Form (không truy cập nội dung với no-cors):",
        "Dữ liệu đã được gửi thành công (dựa trên việc không có lỗi mạng)."
      );

      // Reset form
      setNewWish("");
      setName("");
      setSelectedAttendance("");
      setSelectedEmoji("");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      alert(
        "Lời chúc của bạn đã được gửi thành công! Có thể mất vài giây để xuất hiện."
      );

      // Sau khi gửi thành công, đợi một chút để Google Sheet cập nhật, rồi fetch lại
      setTimeout(() => {
        fetchWishes();
      }, 3000); // Đợi 3 giây trước khi fetch lại
    } catch (error) {
      console.error("Lỗi khi gửi lời chúc:", error);
      alert("Đã xảy ra lỗi khi gửi lời chúc. Vui lòng thử lại.");
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

          {/* Wishes List (Marquee) - Hiển thị dữ liệu từ Google Sheet */}
          <div className="max-w-2xl mx-auto space-y-6">
            {isLoadingWishes && (
              <p
                className="text-center"
                style={{ color: config.ui.landing.colors.textColor }}
              >
                Đang tải lời chúc...
              </p>
            )}
            {errorLoadingWishes && (
              <p className="text-center text-red-500">{errorLoadingWishes}</p>
            )}
            {!isLoadingWishes && !errorLoadingWishes && wishes.length === 0 && (
              <p
                className="text-center"
                style={{ color: config.ui.landing.colors.textColor }}
              >
                Chưa có lời chúc nào. Hãy là người đầu tiên gửi nhé!
              </p>
            )}
            <AnimatePresence>
              {wishes.length > 0 && (
                <Marquee
                  speed={10}
                  gradient={false}
                  className="[--duration:40s] py-2"
                  pauseOnHover={isCardHovered} // Pause marquee on card hover
                >
                  {wishes.map((wish, index) => (
                    <motion.div
                      key={wish.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative w-[280px] flex-shrink-0 mx-2"
                      onMouseEnter={() => setIsCardHovered(true)} // Set state to true on hover
                      onMouseLeave={() => setIsCardHovered(false)} // Set state to false when not hovering
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
                                {/* Đảm bảo wish.timestamp là đối tượng Date hợp lệ */}
                                {wish.timestamp
                                  ? formatEventDate(wish.timestamp)
                                  : "N/A"}
                              </time>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <p
                          className="text-sm leading-relaxed mb-2 overflow-y-auto" // Đã bỏ line-clamp-5, thêm overflow-y-auto
                          style={{
                            color: config.ui.landing.colors.textColor,
                            opacity: 0.9,
                            height: "3.5rem", // Đặt chiều cao cố định cho phần lời chúc (ví dụ 6rem, bạn có thể điều chỉnh)
                            // Bỏ minHeight nếu bạn đặt height cố định
                          }}
                        >
                          {wish.message}
                        </p>

                        {/* Optional: Time indicator for recent messages */}
                        {wish.timestamp &&
                          Date.now() - wish.timestamp.getTime() < 3600000 && (
                            <div className="absolute top-2 right-2">
                              <span
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${config.ui.landing.colors.highlightColor}20`,
                                  color:
                                    config.ui.landing.colors.highlightColor,
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
                          isSubmitting ? "bg-gray-300 cursor-not-allowed" : ""
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
