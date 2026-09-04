// src/components/landing/LogoMarquee.jsx
import { motion } from "framer-motion";

export default function LogoMarquee({ logos }) {
  // Duplicate the list so the loop feels seamless (no visible gap/jump)
  const items = [...logos, ...logos];

  return (
    <div style={{ overflow: "hidden", width: "100%", padding: "20px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 48, width: "fit-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {items.map((logo, i) => (
          <div key={i} style={{ flexShrink: 0, opacity: 0.7 }}>
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}