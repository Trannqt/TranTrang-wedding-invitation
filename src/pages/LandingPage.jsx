// src/pages/LandingPage.jsx
/* eslint-disable react/prop-types */
import config from "@/config/config";
import { formatDayOfWeek, formatEventDate } from "@/lib/formatEventDate";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import Sparkle from "@/components/Sparkle";
import Heart from "@/components/Heart";

const LandingPage = ({ onOpenInvitation }) => {
  const {
    colorsHomePage: colors,
    fonts,
    sparkleEffect,
    heartEffect,
  } = config.ui.landing;

  // Function to create character-by-character animation
  const characterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Helper function to render an event box group
  const EventBoxGroup = ({ label, date, time }) => (
    <div
      // Thay đổi items-center thành items-start ở đây
      className="flex flex-col items-start space-y-3 p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
      style={{
        background: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      {/* Tiêu đề "Gia đình chú rể" hoặc "Gia đình cô dâu" cũng sẽ được căn trái */}
      <p
        className="font-bold text-xl mb-1"
        style={{ color: colors.highlightColor, fontFamily: fonts.heading }}
      >
        {label}
      </p>
      {/* Box cho ngày */}
      <div className="flex items-center space-x-2">
        <Calendar
          className="w-5 h-5 flex-shrink-0"
          style={{ color: colors.iconColor }}
        />
        <p className="font-medium text-sm" style={{ color: colors.textColor }}>
          {formatEventDate(date)}
        </p>
      </div>
      {/* Box cho thứ, giờ */}
      <div className="flex items-center space-x-2">
        <Clock
          className="w-5 h-5 flex-shrink-0"
          style={{ color: colors.iconColor }}
        />
        <p className="font-medium text-sm" style={{ color: colors.textColor }}>
          {formatDayOfWeek(date)}, {time}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: colors.backgroundGradient,
        fontFamily: fonts.body,
      }}
    >
      {/* Sparkle Effect */}
      {sparkleEffect.enabled && (
        <Sparkle
          count={sparkleEffect.count}
          color={sparkleEffect.color}
          size={sparkleEffect.size}
          animationDuration={sparkleEffect.animationDuration}
        />
      )}

      {/* Heart Effect */}
      {heartEffect.enabled && (
        <Heart
          count={heartEffect.count}
          color={heartEffect.color}
          size={heartEffect.size}
          animationDuration={heartEffect.animationDuration}
          delayOffset={heartEffect.delayOffset}
        />
      )}

      {config.data.heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${config.data.heroImage})`,
            zIndex: 0,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-10" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div
            className="p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300"
            style={{
              background: colors.cardBackground,
              border: `1px solid ${colors.cardBorder}`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {/* SAVE THE DATE - Nổi bật và in hoa */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-center tracking-widest uppercase font-bold mb-3"
              style={{
                color: colors.textColor,
                fontSize: "0.9rem",
                opacity: 0.8,
              }}
            >
              {config.data.saveTheDate}
            </motion.p>

            {/* Love Quote - Ngắn gọn, italic, thanh lịch */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-center text-sm sm:text-base italic mb-6"
              style={{
                color: colors.textColor,
                fontFamily: fonts.heading,
                opacity: 0.9,
              }}
            >
              “{config.data.loveQuote}”
            </motion.p>

            {/* Couple Names - Hiệu ứng xuất hiện từng chữ */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.8 }}
              className="text-center space-y-2 mb-8"
            >
              <div
                className="text-4xl sm:text-4xl md:text-5xl font-serif leading-tight drop-shadow-md"
                style={{ color: colors.textColor, fontFamily: fonts.heading }}
              >
                <p>
                  {config.data.brideName.split("").map((char, index) => (
                    <motion.span key={index} variants={characterVariants}>
                      {char}
                    </motion.span>
                  ))}
                </p>
                <motion.span
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{
                    delay: 1.2,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120,
                  }}
                  className="mx-2 sm:mx-3 inline-block"
                  style={{ color: colors.highlightColor }}
                >
                  ♥
                </motion.span>
                <p>
                  {config.data.groomName.split("").map((char, index) => (
                    <motion.span key={index} variants={characterVariants}>
                      {char}
                    </motion.span>
                  ))}
                </p>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="h-0.5 mx-auto mt-4"
                style={{ backgroundColor: colors.highlightColor }}
              />
            </motion.div>

            {/* Date and Time - New layout for groom and bride events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" // Use grid for 2 columns on small screens and up
            >
              {/* Box for Bride's event */}
              {config.data.brideEvent && (
                <EventBoxGroup
                  label={config.ui.landing.brideEventLabel}
                  date={config.data.brideEvent.date}
                  time={config.data.brideEvent.time}
                />
              )}

              {/* Box for Groom's event */}
              {config.data.groomEvent && (
                <EventBoxGroup
                  label={config.ui.landing.groomEventLabel}
                  date={config.data.groomEvent.date}
                  time={config.data.groomEvent.time}
                />
              )}

              {/* Nếu không có sự kiện riêng cho nam/nữ, có thể hiển thị sự kiện chung */}
              {!config.data.groomEvent && !config.data.brideEvent && (
                <EventBoxGroup
                  label="Lễ Thành Hôn" // Hoặc một nhãn chung nào đó
                  date={config.data.date}
                  time={config.data.time}
                />
              )}
            </motion.div>

            {/* Open Invitation Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.8 }}
              className="mt-6 sm:mt-8"
            >
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 8px 20px ${colors.highlightColor}40`,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenInvitation}
                className="relative w-full text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-semibold shadow-lg transition-all duration-300 overflow-hidden"
                style={{ background: colors.buttonBackground }}
              >
                <span
                  className="relative z-10 flex items-center justify-center gap-2"
                  style={{ color: colors.buttonText }}
                >
                  <span>{config.ui.landing.openInvitation}</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: colors.buttonHoverBackground }}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
