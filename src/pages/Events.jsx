// src/pages/Events.jsx

import EventCards from '@/components/EventsCard' // Giả định EventCards đã có sẵn và xử lý data.agenda
import config from '@/config/config'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Events() {
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

    return (
        <>
            {/* Event Section */}
            <section
                id="event"
                className="relative overflow-hidden"
                style={{ color: colors.textColor, fontFamily: fonts.body }} // Áp dụng font và màu chữ mặc định
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Animation sẽ chạy khi 20% của element xuất hiện trên màn hình
                    transition={{ staggerChildren: 0.2 }} // Các element con sẽ xuất hiện lần lượt
                    className="relative z-10 container mx-auto px-4"
                >
                    {/* Section Header */}
                    <div className="text-center space-y-4 mb-16">
                        <motion.span
                            variants={sentenceVariants}
                            className="inline-block font-medium mb-2"
                            style={{ color: colors.highlightColor, fontFamily: fonts.body }}
                        >
                            {ui.events.subtitle}
                        </motion.span>

                        <motion.h2
                            variants={sentenceVariants}
                            className="text-4xl md:text-5xl font-serif leading-tight"
                            style={{ color: colors.textColor, fontFamily: fonts.heading }} // Sử dụng font heading
                        >
                            {ui.events.title}
                        </motion.h2>

                        <motion.p
                            variants={sentenceVariants}
                            className="max-w-md mx-auto text-lg italic"
                            style={{ color: colors.textColor, opacity: 0.8 }}
                        >
                            {ui.events.description}
                        </motion.p>

                        {/* Decorative Line */}
                        <motion.div
                            variants={sentenceVariants}
                            className="flex items-center justify-center gap-4 mt-6"
                        >
                            <div className="h-[1px] w-12" style={{ backgroundColor: colors.cardBorder }} />
                            <div style={{ color: colors.iconColor }}>
                                <Heart className="w-4 h-4" fill="currentColor" />
                            </div>
                            <div className="h-[1px] w-12" style={{ backgroundColor: colors.cardBorder }} />
                        </motion.div>
                    </div>

                    {/* Events Grid */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.5 }} // Delay sau header
                        className="max-w-2xl mx-auto"
                    >
                        {/* Truyền TOÀN BỘ mảng data.agenda vào prop 'events' của EventCards */}
                        <EventCards events={data.agenda} />
                    </motion.div>
                </motion.div>
            </section>
        </>
    )
}