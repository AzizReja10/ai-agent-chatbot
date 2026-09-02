// src/components/ChatWindow.jsx
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages }) {
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
      </AnimatePresence>
    </div>
  );
}