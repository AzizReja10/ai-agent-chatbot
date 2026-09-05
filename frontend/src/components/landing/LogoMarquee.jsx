// src/components/landing/LogoMarquee.jsx
import { motion } from "framer-motion";

export default function LogoMarquee({ items }) {
  // Duplicate the list for seamless continuous infinite scroll
  const duplicated = [...items, ...items, ...items];

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "24px 0",
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: 24, width: "max-content" }}
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: 12,
              background: "var(--bg-glass)",
              border: "1px solid var(--border-subtle)",
              backdropFilter: "blur(10px)",
              boxShadow: "var(--shadow-sm)",
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 500,
              flexShrink: 0,
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ color: item.color || "var(--accent-primary)", display: "flex", alignItems: "center" }}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}