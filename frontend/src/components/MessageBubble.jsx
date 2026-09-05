// src/components/MessageBubble.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Sparkles, User } from "lucide-react";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 12,
        maxWidth: isUser ? "75%" : "85%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        marginBottom: 18,
        width: "100%",
      }}
    >
      {/* Role Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isUser
            ? "rgba(255, 255, 255, 0.08)"
            : "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
          border: isUser
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(168, 85, 247, 0.4)",
          boxShadow: isUser ? "none" : "0 0 16px rgba(99, 102, 241, 0.35)",
          marginTop: 2,
        }}
      >
        {isUser ? (
          <User size={16} color="#CBD5E1" />
        ) : (
          <Sparkles size={16} color="#FFFFFF" />
        )}
      </div>

      {/* Message Content Bubble */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 46px)",
        }}
      >
        {/* Name / Role Label */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            marginBottom: 5,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {isUser ? "You" : "Nova AI"}
        </div>

        <div
          style={{
            position: "relative",
            background: isUser
              ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
              : "rgba(17, 22, 36, 0.8)",
            backdropFilter: isUser ? "none" : "blur(14px)",
            WebkitBackdropFilter: isUser ? "none" : "blur(14px)",
            border: isUser
              ? "1px solid rgba(255, 255, 255, 0.15)"
              : "1px solid rgba(255, 255, 255, 0.08)",
            color: isUser ? "#FFFFFF" : "var(--text-primary)",
            padding: "12px 18px",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            boxShadow: isUser
              ? "0 4px 18px rgba(99, 102, 241, 0.3)"
              : "0 6px 24px rgba(0, 0, 0, 0.4)",
            wordBreak: "break-word",
          }}
        >
          {isUser ? (
            <div style={{ fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {content}
            </div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}

          {/* Action Bar (Copy Button) for Assistant */}
          {!isUser && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
                paddingTop: 6,
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 11.5,
                  fontFamily: "var(--font-mono)",
                  color: copied ? "var(--accent-success)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {copied ? (
                  <>
                    <Check size={12} color="var(--accent-success)" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}