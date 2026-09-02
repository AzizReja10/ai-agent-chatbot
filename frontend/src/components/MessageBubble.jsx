// src/components/MessageBubble.jsx
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: isUser ? 0.2 : 0.35, ease: "easeOut" }}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser ? "var(--accent-primary)" : "#1A1D23",
        color: isUser ? "#0F1115" : "var(--text-primary)",
        padding: "10px 16px",
        borderRadius: 14,
        maxWidth: "70%",
        marginBottom: 8,
      }}
    >
      {isUser ? (
        content
      ) : (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </motion.div>
  );
}