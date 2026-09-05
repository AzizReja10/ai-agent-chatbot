// src/components/ThemeToggle.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ showLabel = false, size = "md" }) {
  const { isDark, toggleTheme } = useTheme();

  const isSmall = size === "sm";
  const iconSize = isSmall ? 15 : 17;

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      title={isDark ? "Switch to Day mode" : "Switch to Night mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: isSmall ? "5px 9px" : "7px 12px",
        borderRadius: 20,
        background: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.05)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.12)"
          : "1px solid rgba(0, 0, 0, 0.1)",
        color: isDark ? "#F8FAFC" : "#0F172A",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: isDark
          ? "0 0 15px rgba(99, 102, 241, 0.2)"
          : "0 2px 10px rgba(245, 158, 11, 0.25)",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{ position: "relative", width: iconSize, height: iconSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Moon size={iconSize} color="#818CF8" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Sun size={iconSize} color="#F59E0B" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span
          style={{
            fontSize: isSmall ? 12 : 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
          }}
        >
          {isDark ? "Night" : "Day"}
        </span>
      )}
    </motion.button>
  );
}
