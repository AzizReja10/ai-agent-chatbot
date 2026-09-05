// src/components/TypingIndicator.jsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        alignSelf: "flex-start",
        padding: "10px 18px",
        background: "rgba(17, 22, 36, 0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        borderRadius: "16px 16px 16px 4px",
        marginBottom: 12,
        width: "fit-content",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.15)",
      }}
    >
      <motion.div
        animate={{ rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          background: "var(--gradient-brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles size={13} color="#FFFFFF" />
      </motion.div>

      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-secondary)",
          letterSpacing: "0.2px",
        }}
      >
        Thinking & executing tools
      </span>

      <div style={{ display: "flex", gap: 5, alignItems: "center", marginLeft: 4 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -5, 0],
              opacity: [0.4, 1, 0.4],
              backgroundColor: ["#818CF8", "#C084FC", "#818CF8"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#818CF8",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}