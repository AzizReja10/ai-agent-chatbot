// src/App.jsx
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import ToolActivitySidebar from "./components/ToolActivitySidebar";
import { streamChat } from "./api/chat";
import "./styles/theme.css";

const THREAD_ID = "frontend-session-1"; // fine as a constant for now

function App() {
  const [messages, setMessages] = useState([]);
  const [activeTools, setActiveTools] = useState([]);
  const handleSend = (text) => {
  setMessages((prev) => [...prev, { role: "user", content: text }]);
  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
  setActiveTools([]);

  let agentReply = "";
  let toolIdCounter = 0;

  streamChat(THREAD_ID, text, {
    onToken: (chunk) => {
      agentReply += chunk;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: agentReply };
        return updated;
      });
    },
    onToolStart: (name) => {
      const id = toolIdCounter++;
      setActiveTools((prev) => [...prev, { id, name, done: false }]);
    },
    onToolEnd: (name) => {
      setActiveTools((prev) =>
        prev.map((t) => (t.name === name && !t.done ? { ...t, done: true } : t))
      );
    },
    onDone: () => {},
  });
};

  // src/App.jsx — the return statement specifically
return (
  <div style={{ display: "flex", height: "100vh" }}>
    <ToolActivitySidebar activeTools={activeTools} />
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ChatWindow messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  </div>
);
}

export default App;