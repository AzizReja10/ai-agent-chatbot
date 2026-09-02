// src/components/MessageInput.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 8,
        padding: 16,
        borderTop: "1px solid #23262D",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask your agent anything..."
        style={{
          flex: 1,
          background: "#1A1D23",
          border: "1px solid #2A2E36",
          borderRadius: 10,
          padding: "10px 14px",
          color: "var(--text-primary)",
          fontSize: 14,
          outline: "none",
        }}
      />
      <motion.button
        type="submit"
        animate={{
          backgroundColor: text.trim() ? "var(--accent-primary)" : "#2A2E36",
          scale: text.trim() ? 1 : 0.9,
        }}
        transition={{ duration: 0.15 }}
        style={{
          border: "none",
          borderRadius: 10,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: text.trim() ? "pointer" : "default",
        }}
      >
        <ArrowUp size={18} color={text.trim() ? "#0F1115" : "#5A6070"} />
      </motion.button>
    </form>
  );
}