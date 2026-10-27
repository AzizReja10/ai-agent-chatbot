// src/components/ChatWindow.jsx
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ConfirmationCard from "./ConfirmationCard.jsx";
import { Sparkles, Calendar, Mail, CloudSun, GitBranch, ArrowUpRight } from "lucide-react";

const STARTER_PROMPTS = [
  {
    icon: <Calendar size={18} color="#06B6D4" />,
    title: "Check Schedule",
    prompt: "What events do I have scheduled on my calendar today?",
  },
  {
    icon: <GitBranch size={18} color="#A855F7" />,
    title: "GitHub Issues",
    prompt: "List the most recent open issues in my repository",
  },
  {
    icon: <Mail size={18} color="#EF4444" />,
    title: "Unread Emails",
    prompt: "Check my recent unread emails and give me a quick summary",
  },
  {
    icon: <CloudSun size={18} color="#F59E0B" />,
    title: "Weather Report",
    prompt: "What's the current weather in New York?",
  },
];

export default function ChatWindow({ 
  messages, 
  pendingDraft, 
  onConfirm, 
  onCancel, 
  isWaiting,
  onSelectPrompt,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingDraft, isWaiting]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "24px 32px",
        overflowY: "auto",
        flex: 1,
        position: "relative",
      }}
    >
      {/* Empty State / Welcome Hero */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            margin: "auto",
            maxWidth: 720,
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          {/* Animated Core Logo */}
          <div
            style={{
              position: "relative",
              width: 68,
              height: 68,
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, #6366F1, #A855F7, #06B6D4, #6366F1)",
                filter: "blur(8px)",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "relative",
                width: 68,
                height: 68,
                borderRadius: 22,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-glass)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Sparkles size={32} color="#818CF8" />
            </div>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 10px",
              color: "var(--text-primary)",
            }}
          >
            How can Nova assist you today?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 15,
              maxWidth: 500,
              margin: "0 auto 36px",
              lineHeight: 1.5,
            }}
          >
            Ask questions, execute automated actions, or select a prompt starter below to test your tools.
          </p>

          {/* Starter Prompt Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
              textAlign: "left",
            }}
          >
            {STARTER_PROMPTS.map((starter, i) => (
              <button
                key={i}
                type="button"
                className="button-option starter-prompt-option"
                role="button"
                onClick={() => onSelectPrompt && onSelectPrompt(starter.prompt)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div className="starter-icon-wrap">
                    {starter.icon}
                  </div>
                  <div>
                    <div className="starter-title">
                      {starter.title}
                    </div>
                    <div className="starter-desc">
                      {starter.prompt}
                    </div>
                  </div>
                </div>

                <div className="starter-arrow">
                  <ArrowUpRight size={15} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages List */}
      <AnimatePresence>
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {pendingDraft && (
          <ConfirmationCard
            key="pending-draft"
            toolName={pendingDraft.toolName}
            args={pendingDraft.args}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        )}
        {isWaiting && <TypingIndicator key="typing-indicator" />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}