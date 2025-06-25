// src/components/Heart.jsx
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import styles from './Heart.module.css'; // Import CSS module

const Heart = ({ count, color, size, animationDuration, delayOffset = 0 }) => {
  const hearts = Array.from({ length: count }).map((_, i) => {
    const initialTop = Math.random() * 100;
    const initialLeft = Math.random() * 100;

    const endY = -(50 + Math.random() * 150);
    const endX = Math.random() * 100 - 50;

    return (
      <motion.div
        key={i}
        className={styles.heart} // Use the CSS module class
        style={{
          // Inline styles for dynamic properties
          width: size,
          height: size,
          backgroundColor: color,
          top: `${initialTop}%`,
          left: `${initialLeft}%`,
          opacity: 0,
          // You might need to adjust pseudo-element positioning if `size` changes dynamically
          // For now, let's rely on the fixed percentages in CSS module
        }}
        animate={{
          opacity: [0, 0.8, 0],
          y: [0, endY],
          x: [0, endX],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: parseFloat(animationDuration) * (0.8 + Math.random() * 0.4),
          repeat: Infinity,
          delay: delayOffset + Math.random() * parseFloat(animationDuration),
          ease: "easeOut",
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{hearts}</div>;
};

export default Heart;