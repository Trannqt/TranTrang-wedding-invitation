// src/pages/Location.jsx

import config from "@/config/config";
import {
  Clock,
  Navigation as MapPin,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatFullDateWithDay } from "@/lib/formatEventDate"; // Đảm bảo bạn đã có hàm này

export default function Location() {
  const { data, ui } = config;
  const { colors, fonts } = ui.landing; // Lấy màu sắc và font từ ui.landing

  // Variants cho hiệu ứng xuất hiện từng dòng (fade in and slide up)
  const sentenceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Variants cho toàn bộ khối nội dung chính (bản đồ + chi tiết)
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1, // Thời gian xuất hiện của card lớn hơn
        ease: "easeOut",
        staggerChildren: 0.15, // Các item con trong card sẽ xuất hiện lần lượt
        delayChildren: 0.5, // Delay sau khi card xuất hiện
      },
    },
  };

  // Variants cho từng dòng thông tin trong card
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Location section */}
      <section
        id="location"
        className="relative overflow-hidden py-16 sm:py-20" // Giữ padding để tạo khoảng cách với Events
        style={{
          color: colors.textColor,
          fontFamily: fonts.body,
          background: colors.background,
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
          className="container mx-auto px-4 relative z-10"
        >
          {/* Section Header */}
          <motion.div
            variants={sentenceVariants}
            className="text-center space-y-4"
          >
            <motion.span
              variants={sentenceVariants}
              className="inline-block font-medium"
              style={{ color: colors.highlightColor, fontFamily: fonts.body }}
            >
              {ui.location.subtitle}
            </motion.span>

            <motion.h2
              variants={sentenceVariants}
              className="text-4xl md:text-5xl font-serif leading-tight"
              style={{ color: colors.textColor, fontFamily: fonts.heading }}
            >
              {ui.location.title}
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              variants={sentenceVariants}
              className="flex items-center justify-center"
            >
              <div
                className="h-[1px] w-12"
                style={{ backgroundColor: colors.cardBorder }}
              />
              <MapPin className="w-5 h-5" style={{ color: colors.iconColor }} />
              <div
                className="h-[1px] w-12"
                style={{ backgroundColor: colors.cardBorder }}
              />
            </motion.div>
          </motion.div>

          {/* Main Location Card - Bao gồm Map và Details */}
          <motion.div
            variants={cardVariants} // Áp dụng animation cho toàn bộ card
            className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl py-4" // Card lớn hơn, padding nhiều hơn
            style={{
              background: colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: colors.textColor,
            }}
          >
            {/* Map Container - Đặt trong card chính */}
            <motion.div
              variants={itemVariants} // Hiệu ứng cho bản đồ xuất hiện trong card
              className="w-full h-[200px] rounded-2xl overflow-hidden mb-8 shadow-inner relative" // Thêm 'relative' để div phủ lên trên có thể position absolute
              style={{ border: `1px solid ${colors.cardBorder}` }} // Border nhẹ cho map
            >
              <iframe
                src={data.maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
              {/* Overlay Div để ngăn chặn tương tác với iframe */}
              <div
                className="absolute inset-0 z-10" // Phủ lên trên iframe
                style={{
                  cursor: "default", // Đổi con trỏ chuột thành mặc định để không gây nhầm lẫn là có thể kéo
                  // background: 'rgba(0,0,0,0.01)' // Có thể thêm màu nền nhẹ để dễ debug, sau đó xóa
                }}
              ></div>
            </motion.div>

            {/* Venue Details - Dưới Map trong cùng một card */}
            <div className="text-center">
              {" "}
              {/* Căn giữa nội dung chi tiết */}
              <motion.h3
                variants={itemVariants}
                className="text-3xl font-serif mb-4"
                style={{ color: colors.highlightColor }}
              >
                {data.location}
              </motion.h3>
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-3"
                >
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: colors.iconColor }}
                  />
                  <p className="text-sm sm:text-base opacity-90">
                    {data.address}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-3"
                >
                  <CalendarCheck
                    className="w-5 h-5"
                    style={{ color: colors.iconColor }}
                  />
                  <p className="text-sm sm:text-base opacity-90">
                    {formatFullDateWithDay(data.dateChurnch)}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-3"
                >
                  <Clock
                    className="w-5 h-5"
                    style={{ color: colors.iconColor }}
                  />
                  <p className="text-sm sm:text-base opacity-90">{data.time}</p>
                </motion.div>

                {/* Action Button */}
                <motion.div variants={itemVariants} className="pt-8">
                  <motion.a
                    href={data.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-xl transition-all text-lg" // Nút to hơn, font lớn hơn
                    style={{
                      background: colors.highlightColor,
                      color: colors.buttonTextColor || "white",
                      border: `1px solid ${colors.highlightColor}`,
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>{ui.location.viewMap}</span>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
