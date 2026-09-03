// src/components/ChatWindow.jsx
import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ConfirmationCard from "./ConfirmationCard.jsx";

export default function ChatWindow({ messages, pendingDraft, onConfirm, onCancel, isWaiting }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingDraft, isWaiting]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: 24,
      overflowY: "auto",
      flex: 1,
    }}>
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