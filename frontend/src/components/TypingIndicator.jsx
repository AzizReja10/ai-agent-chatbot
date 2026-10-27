// src/components/TypingIndicator.jsx
import { motion } from "framer-motion";
import { UiverseLoader } from "./uiverse/uiverse-loader";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="my-3 flex items-center"
    >
      <UiverseLoader
        label="Nova is reasoning..."
        subtext="Synthesizing multi-tool context"
      />
    </motion.div>
  );
}
