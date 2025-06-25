// src/components/Sparkle.jsx
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const Sparkle = ({ count, color, size, animationDuration }) => {
  const sparkles = Array.from({ length: count }).map((_, i) => {
    // Calculate initial position randomly
    const initialTop = Math.random() * 100;
    const initialLeft = Math.random() * 100;

    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          // Set initial position and ensure it's not clipped
          top: `${initialTop}%`,
          left: `${initialLeft}%`,
          opacity: 0, // Start hidden
          transform: 'translate(-50%, -50%)', // Center the sparkle on its calculated point
        }}
        animate={{
          opacity: [0, 1, 0], // Fade in, then fade out
          x: [0, Math.random() * 40 - 20, 0], // Gentle horizontal movement (adjust range)
          y: [0, Math.random() * 40 - 20, 0], // Gentle vertical movement (adjust range)
          scale: [1, 1.5, 1], // Slight scale change
        }}
        transition={{
          duration: parseFloat(animationDuration) * (0.8 + Math.random() * 0.4), // Vary duration slightly
          repeat: Infinity,
          delay: Math.random() * parseFloat(animationDuration), // Staggered delay for each sparkle
          ease: "easeInOut",
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{sparkles}</div>;
};

export default Sparkle;