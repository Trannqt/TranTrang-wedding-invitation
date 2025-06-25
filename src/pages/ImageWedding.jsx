// src/pages/ImageWedding.jsx

import config from "@/config/config";
import { Heart, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

// IMPORT TẤT CẢ CÁC ẢNH TẠI ĐÂY
import img1 from '/images/LQP04640.jpg';
import img2 from '/images/LQP04716.jpg';
import img3 from '/images/LQP04722.jpg';
import img4 from '/images/LQP04793.jpg';
import img5 from '/images/LQP04844.jpg';
import img6 from '/images/LQP05050.jpg';

const importedImages = [
    img1, img2, img3, img4, img5, img6
];

export default function ImageWedding() {
    const { ui } = config;
    const { colors, fonts } = ui.landing;
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    // Variants cho tiêu đề và phụ đề
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

    const photoItemVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.5
            }
        },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    const fullViewImageVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        })
    };

    const openFullView = (index) => {
        setSelectedImageIndex(index);
    };

    const closeFullView = useCallback(() => {
        setSelectedImageIndex(null);
    }, []);

    const navigateImage = useCallback((direction) => {
        if (selectedImageIndex === null) return;

        let newIndex = selectedImageIndex + direction;
        if (newIndex < 0) {
            newIndex = importedImages.length - 1;
        } else if (newIndex >= importedImages.length) {
            newIndex = 0;
        }
        setSelectedImageIndex(newIndex);
    }, [selectedImageIndex, importedImages.length]);

    const handleKeyDown = useCallback((e) => {
        if (selectedImageIndex !== null) {
            if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            } else if (e.key === 'Escape') {
                closeFullView();
            }
        }
    }, [selectedImageIndex, navigateImage, closeFullView]);

    useEffect(() => {
        if (selectedImageIndex !== null) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImageIndex, handleKeyDown]);

    const currentImage = selectedImageIndex !== null ? importedImages[selectedImageIndex] : null;

    const photoGridClasses = [
        "md:col-span-2 md:row-span-2 aspect-[3/4]",
        "md:col-span-1 md:row-span-1 aspect-[4/3]",
        "md:col-span-1 md:row-span-1 aspect-[4/3]",
        "md:col-span-1 md:row-span-2 aspect-[3/4]",
        "md:col-span-2 md:row-span-1 aspect-[4/3]",
        "md:col-span-1 md:row-span-1 aspect-[4/3]",
    ];

    return (
        <section
            id="image-wedding"
            className="relative overflow-hidden py-16 sm:py-20"
            style={{ color: colors.textColor, fontFamily: fonts.body, background: colors.background }}
        >
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }} // Giữ nguyên cho tiêu đề section (chỉ chạy 1 lần)
                transition={{ staggerChildren: 0.2 }}
                className="container mx-auto px-4 relative z-10"
            >
                {/* Section Header */}
                <motion.div variants={sentenceVariants} className="text-center space-y-4 mb-16">
                    <motion.span variants={sentenceVariants} className="inline-block font-medium" style={{ color: colors.highlightColor, fontFamily: fonts.body }}>{ui.imageWedding.subtitle}</motion.span>
                    <motion.h2 variants={sentenceVariants} className="text-4xl md:text-5xl font-serif leading-tight" style={{ color: colors.textColor, fontFamily: fonts.heading }}>{ui.imageWedding.title}</motion.h2>
                    <motion.p variants={sentenceVariants} className="max-w-md mx-auto text-lg italic" style={{ color: colors.textColor, opacity: 0.8 }}>{ui.imageWedding.description}</motion.p>
                    <motion.div variants={sentenceVariants} className="flex items-center justify-center gap-4 pt-4">
                        <div className="h-[1px] w-12" style={{ backgroundColor: colors.cardBorder }} />
                        <Heart className="w-5 h-5" style={{ color: colors.iconColor }} />
                        <div className="h-[1px] w-12" style={{ backgroundColor: colors.cardBorder }} />
                    </motion.div>
                </motion.div>

                {/* Photo Grid */}
                <motion.div
                    initial="hidden" // ✨ Giữ initial state
                    whileInView="visible" // ✨ Animation khi vào viewport
                    viewport={{ once: false, amount: 0.1 }} // ✨ Thay đổi: once: false
                    transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto grid-flow-dense"
                >
                    {importedImages.map((src, index) => (
                        <motion.div
                            key={index}
                            variants={photoItemVariants}
                            className={`relative w-full overflow-hidden rounded-xl shadow-lg group cursor-pointer ${photoGridClasses[index] || "aspect-[4/3]"}`}
                            style={{ border: `1px solid ${colors.cardBorder}` }}
                        >
                            <img
                                src={src.src || src}
                                alt={`Ảnh cưới ${index + 1}`}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openFullView(index);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-highlightColor hover:bg-opacity-80 font-semibold rounded-full px-4 py-2 text-sm flex items-center gap-2"
                                    style={{ fontFamily: fonts.body }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Xem Full
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Full View Modal */}
                <AnimatePresence>
                    {selectedImageIndex !== null && currentImage && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={overlayVariants}
                            className="fixed inset-0 w-full h-full bg-black z-[9999] flex items-center justify-center full-view-overlay"
                            onClick={closeFullView}
                        >
                            <motion.button
                                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                                className="absolute left-4 sm:left-8 text-white text-5xl cursor-pointer p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 z-[10000]"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronLeft size={48} />
                            </motion.button>

                            <motion.img
                                key={selectedImageIndex}
                                variants={fullViewImageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                custom={selectedImageIndex}
                                src={currentImage.src || currentImage}
                                alt={`Ảnh cưới full view ${selectedImageIndex + 1}`}
                                className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-lg relative z-[9999]"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <motion.button
                                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                                className="absolute right-4 sm:right-8 text-white text-5xl cursor-pointer p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 z-[10000]"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronRight size={48} />
                            </motion.button>

                            <motion.button
                                onClick={closeFullView}
                                className="absolute top-4 right-4 text-white text-4xl font-bold cursor-pointer hover:opacity-80 z-[10000]"
                                style={{ fontFamily: fonts.heading }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                &times;
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}