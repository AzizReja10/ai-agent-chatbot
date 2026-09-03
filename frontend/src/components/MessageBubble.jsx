// src/components/MessageBubble.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

const userVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
};

const agentVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const variants = isUser ? userVariants : agentVariants;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: isUser ? 0.2 : 0.35, ease: "easeOut" }}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 6,
        maxWidth: "70%",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          background: isUser ? "var(--accent-primary)" : "#1A1D23",
          color: isUser ? "#0F1115" : "var(--text-primary)",
          padding: "10px 16px",
          borderRadius: 14,
        }}
      >
        {isUser ? (
          content
        ) : (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      <motion.button
        onClick={handleCopy}
        whileTap={{ scale: 0.85 }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 4,
          marginBottom: 8,
          color: "var(--text-muted)",
          flexShrink: 0,
        }}
      >
        {copied ? (
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            <Check size={14} color="var(--accent-success)" />
          </motion.div>
        ) : (
          <Copy size={14} />
        )}
      </motion.button>
    </motion.div>
  );
}