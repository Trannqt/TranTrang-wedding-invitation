/* eslint-disable react/prop-types */

import { Calendar, Clock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useContext } from "react";
import config from "@/config/config"; // Assuming config.js exists and holds relevant data
import { formatEventDate } from "@/lib/formatEventDate";
import { safeBase64 } from "@/lib/base64";
import { MusicControlContext } from "@/components/Layout"; // Đảm bảo đúng đường dẫn này

// Import the bouquet image directly
import coupleImage from '/images/LQP05285.jpg'; // This is the change!

export default function Hero() {
  const [guestName, setGuestName] = useState("");
  const [showVideoIntro, setShowVideoIntro] = useState(true);
  const iframeRef = useRef(null);

  // Sử dụng context để lấy handleVideoEnded
  const { handleVideoEnded } = useContext(MusicControlContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("guest");

    if (guestParam) {
      try {
        const decodedName = safeBase64.decode(guestParam);
        setGuestName(decodedName);
      } catch (error) {
        console.error("Error decoding guest name:", error);
        setGuestName("");
      }
    }

    // Nếu không có video ID, bỏ qua phần video intro và hiển thị nội dung chính ngay lập tức
    if (!config.data.youtubeVideoId) {
      setShowVideoIntro(false);
      handleVideoEnded(); // Báo hiệu cho Layout rằng video đã kết thúc
    }
  }, [handleVideoEnded]); // Thêm handleVideoEnded vào dependency array

  const handleSkipVideo = () => {
    setShowVideoIntro(false);
    // Gọi hàm từ context để báo hiệu video đã kết thúc
    handleVideoEnded();
    // Dừng video khi bỏ qua
    if (iframeRef.current) {
      iframeRef.current.src = ""; // Xóa src để dừng video
    }
  };

  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          Ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
          Giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
          Phút: Math.floor((difference / 1000 / 60) % 60),
          Giây: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    // Ensure two digits for display if less than 10
    const formatTime = (value) => String(value).padStart(2, '0');

    return (
      <div className="flex justify-center mt-4">
        {Object.keys(timeLeft).map((interval) => (
          <motion.div
            key={interval}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center mx-2" // Adjust margin for spacing
          >
            <span className="text-3xl font-bold text-rose-600">
              {formatTime(timeLeft[interval])}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {interval}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  const FloatingHearts = () => {
    // Only render FloatingHearts if video is off (or showVideoIntro is false)
    if (showVideoIntro) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: window.innerHeight,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: Math.random() * window.innerWidth,
              y: -100,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute"
          >
            <Heart
              className={`w-${
                Math.floor(Math.random() * 2) + 8
              } h-${Math.floor(Math.random() * 2) + 8} ${
                i % 3 === 0
                  ? "text-rose-400"
                  : i % 3 === 1
                  ? "text-pink-400"
                  : "text-red-400"
              }`}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showVideoIntro && config.data.youtubeVideoId ? ( // <--- Kiểm tra youtubeVideoId
          <motion.section
            key="video-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                ref={iframeRef}
                className="absolute top-0 left-0 w-full h-full"
                // Đường dẫn nhúng YouTube, sử dụng config.data.youtubeVideoId
                src={`https://www.youtube.com/embed/${config.data.youtubeVideoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Wedding Intro Video"
              ></iframe>
            </div>
            <motion.button
              onClick={handleSkipVideo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 px-6 py-3 bg-white text-rose-600 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
            >
              Bỏ qua Video
            </motion.button>
            <p className="mt-4 text-sm text-gray-400">
              (Video sẽ tự động tắt tiếng, bạn có thể bật tiếng trên trình phát
              YouTube)
            </p>
          </motion.section>
        ) : (
          <motion.section
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            id="home"
            className="min-h-screen flex flex-col items-center relative overflow-hidden"
          >
            {/* Background image of the couple - Adjusted to match the image */}
            <div
              className="w-full h-[60vh] bg-cover bg-center"
              style={{
                backgroundImage: `url(${coupleImage.src || coupleImage})`, // Assuming coupleImage path in config
                backgroundPosition: "top center", // Adjust if needed
              }}
            ></div>

            {/* Content area that overlaps the image */}
            <div className="relative z-10 bg-white rounded-t-3xl shadow-lg -mt-16 w-full max-w-lg mx-auto p-6 sm:p-8 flex flex-col items-center">
              {/* Date and Year */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-6"
              >
                {/* Hardcoded for now to match the image: 15/9 2024 */}
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-none">13/7 & 15/7</p>
                <p className="text-5xl sm:text-5xl md:text-6xl font-bold text-gray-800 mt-2">2025</p>
              </motion.div>

              {/* Save the date text */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block mx-auto mb-6"
              >
                <span className="px-6 py-2 text-md bg-rose-50 text-rose-600 rounded-full border border-rose-200 uppercase font-semibold tracking-wide">
                  {config.ui.hero.saveDate}
                </span>
              </motion.div>

              {/* Countdown Timer */}
              <CountdownTimer targetDate={config.data.date} />

              {/* Location */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-gray-600 text-sm mt-8"
              >
                {config.data.location}
              </motion.div> */}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}