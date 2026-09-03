// src/components/TypingIndicator.jsx
import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        gap: 4,
        alignSelf: "flex-start",
        padding: "10px 16px",
        background: "#1A1D23",
        borderRadius: 14,
        marginBottom: 8,
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--text-muted)",
          }}
        />
      ))}
    </motion.div>
  );
}