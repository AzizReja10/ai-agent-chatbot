// src/components/landing/FloatingIcon.jsx
import { motion } from "framer-motion";

export default function FloatingIcon({ icon, label, style, duration = 3.5, delay = 0, glowColor = "rgba(99, 102, 241, 0.4)" }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        zIndex: 2,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -14, 0],
        rotate: [-2, 2, -2]
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay },
        y: { repeat: Infinity, duration, delay, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: duration * 1.3, delay, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.15, rotate: 0 }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`,
          color: "#FFFFFF",
          cursor: "pointer",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {icon}
      </div>
      {label && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)",
            background: "rgba(11, 14, 23, 0.75)",
            padding: "2px 8px",
            borderRadius: 6,
            border: "1px solid var(--border-subtle)",
            backdropFilter: "blur(8px)",
          }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}