// src/components/landing/FloatingIcon.jsx
import { motion } from "framer-motion";

export default function FloatingIcon({ icon, style, duration = 3, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#1A1D23",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        ...style,
      }}
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
    >
      {icon}
    </motion.div>
  );
}