// src/components/MessageInput.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles, CornerDownLeft } from "lucide-react";

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        padding: "16px 24px 24px",
        background: "linear-gradient(180deg, transparent 0%, rgba(7, 9, 14, 0.95) 100%)",
        position: "relative",
        zIndex: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 12px 8px 18px",
          background: "rgba(17, 22, 36, 0.8)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 16,
          border: isFocused
            ? "1px solid rgba(99, 102, 241, 0.6)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isFocused
            ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(99, 102, 241, 0.25)"
            : "0 8px 24px rgba(0, 0, 0, 0.4)",
          transition: "all 0.25s ease",
        }}
      >
        <div style={{ color: isFocused ? "var(--accent-primary)" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
          <Sparkles size={18} />
        </div>

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nova to check emails, schedule meetings, query GitHub, or search..."
          disabled={disabled}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#F8FAFC",
            fontSize: 14.5,
            fontFamily: "var(--font-sans)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "3px 7px",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <span>Enter</span>
            <CornerDownLeft size={10} />
          </div>

          <motion.button
            type="submit"
            disabled={!text.trim() || disabled}
            whileHover={text.trim() ? { scale: 1.08 } : {}}
            whileTap={text.trim() ? { scale: 0.92 } : {}}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: text.trim() ? "var(--gradient-brand)" : "rgba(255, 255, 255, 0.05)",
              color: text.trim() ? "#FFFFFF" : "var(--text-muted)",
              cursor: text.trim() && !disabled ? "pointer" : "default",
              boxShadow: text.trim() ? "0 4px 14px rgba(99, 102, 241, 0.4)" : "none",
              transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}