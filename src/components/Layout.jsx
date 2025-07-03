/* eslint-disable react/prop-types */

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, PauseCircle, PlayCircle } from "lucide-react";
import config from "@/config/config";
import BottomBar from "@/components/BottomBar";
import Sparkle from "./Sparkle";
import Heart from "./Heart";

// Tạo Context mới cho việc kiểm soát nhạc
export const MusicControlContext = createContext(null);

const Layout = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false); // New state to track video end
  const audioRef = useRef(null);
  const wasPlayingRef = useRef(false); // Lưu trạng thái nhạc trước khi tab bị ẩn

  const {
    colorsHomePage: colors,
    fonts,
    sparkleEffect,
    heartEffect,
  } = config.ui.landing;

  // Hàm này sẽ được gọi từ Hero khi video kết thúc
  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  // Setup audio and initial play attempt
  useEffect(() => {
    // Chỉ tạo và xử lý audio khi video đã kết thúc
    if (!videoEnded) {
      return; // Không làm gì cho đến khi video kết thúc
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(config.data.audio.src);
      audioRef.current.loop = config.data.audio.loop;
    }

    // Attempt to play audio
    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        wasPlayingRef.current = true;
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Ẩn toast sau 3 giây
      } catch (error) {
        console.log(
          "Audio autoplay failed, waiting for user interaction:",
          error
        );
        setIsPlaying(false); // Đảm bảo trạng thái không phát
        // We rely on the user clicking the play button or interacting later if autoplay is blocked.
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [videoEnded]); // Dependency on videoEnded

  // Handle visibility and focus changes (logic for persistent music)
  useEffect(() => {
    // Only apply these listeners if video has ended
    if (!videoEnded || !audioRef.current) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasPlayingRef.current = isPlaying;
        if (audioRef.current && isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        if (audioRef.current && wasPlayingRef.current) {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    };

    const handleWindowBlur = () => {
      wasPlayingRef.current = isPlaying;
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleWindowFocus = () => {
      if (audioRef.current && wasPlayingRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    };

    const handlePlayEvent = () => {
      setIsPlaying(true);
      setShowToast(true);
      setTimeout(
        () => setShowToast(false),
        config.audio?.toastDuration || 3000
      );
    };

    const handlePauseEvent = () => {
      setIsPlaying(false);
      setShowToast(false);
    };

    audioRef.current.addEventListener("play", handlePlayEvent);
    audioRef.current.addEventListener("pause", handlePauseEvent);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlayEvent);
        audioRef.current.removeEventListener("pause", handlePauseEvent);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [isPlaying, videoEnded]);

  // Toggle music function
  const toggleMusic = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          wasPlayingRef.current = false;
        } else {
          await audioRef.current.play();
          wasPlayingRef.current = true;
        }
      } catch (error) {
        console.error("Playback error during toggle:", error);
      }
    }
  };

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <MusicControlContext.Provider value={{ handleVideoEnded, videoEnded }}>
      {/* Khung nền toàn màn hình của layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen relative flex flex-col items-center justify-center" // Đã bỏ `overflow-hidden` ở đây, nếu các hiệu ứng vượt ra ngoài khung điện thoại
        style={{
          background: colors.backgroundLayoutGradient,
          fontFamily: fonts.body,
        }}
      >
        {/* Nền hình ảnh hero được định vị tuyệt đối */}
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

        {/* Container cho hiệu ứng Sparkle và Heart - được định vị cố định (fixed) và z-index cao */}
        {/* QUAN TRỌNG: Đảm bảo các component Sparkle và Heart tự xử lý vị trí toàn màn hình của chúng */}
        {/* Đặt z-index cao hơn các phần tử khác để đảm bảo chúng luôn nằm trên cùng */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 1000 }}
        >
          {sparkleEffect.enabled && (
            <Sparkle
              count={sparkleEffect.count}
              color={sparkleEffect.color}
              size={sparkleEffect.size}
              animationDuration={sparkleEffect.animationDuration}
            />
          )}

          {heartEffect.enabled && (
            <Heart
              count={heartEffect.count}
              color={heartEffect.color}
              size={heartEffect.size}
              animationDuration={heartEffect.animationDuration}
              delayOffset={heartEffect.delayOffset}
            />
          )}
        </div>

        {/* Div này là khung điện thoại của bạn */}
        <div className="relative min-h-screen w-full from-gray-50 to-gray-100 flex items-center justify-center">
          <motion.div
            className="mx-auto w-full max-w-[430px] min-h-screen bg-white relative overflow-hidden border border-gray-200 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Nút điều khiển nhạc với chỉ báo trạng thái */}
            {videoEnded && ( // <--- CHỈ HIỂN THỊ NÚT KHI VIDEO ĐÃ KẾT THÚC
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMusic}
                className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-rose-100/50"
              >
                {isPlaying ? (
                  <div className="relative">
                    <PauseCircle className="w-6 h-6 text-rose-500" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                ) : (
                  <PlayCircle className="w-6 h-6 text-rose-500" />
                )}
              </motion.button>
            )}

            <main className="relative h-full w-full pb-[100px]">
              {children}
            </main>
            <BottomBar />
            {/* Toast thông tin nhạc */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
                >
                  <div className="bg-black/80 text-white transform -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2">
                    <Music className="w-4 h-4 animate-pulse" />
                    <span className="text-sm whitespace-nowrap">
                      {config.data.audio.title}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </MusicControlContext.Provider>
  );
};

export default Layout;
