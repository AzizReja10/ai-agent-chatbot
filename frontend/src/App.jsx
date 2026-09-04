// src/App.jsx
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import ToolActivitySidebar from "./components/ToolActivitySidebar";
import { streamChat } from "./api/chat";
import LandingPage from "./pages/LandingPage";
import "./styles/theme.css";

const THREAD_ID = "frontend-session-1";

function App() {
  const [messages, setMessages] = useState([]);
  const [activeTools, setActiveTools] = useState([]);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setActiveTools([]);
    setPendingDraft(null);
    setIsWaiting(true);

    let agentReply = "";
    let toolIdCounter = 0;
    let firstTokenReceived = false;

    streamChat(THREAD_ID, text, {
      onToken: (chunk) => {
        if (!firstTokenReceived) {
          firstTokenReceived = true;
          setIsWaiting(false);
          setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        }
        agentReply += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: agentReply };
          return updated;
        });
      },
      onToolStart: (name, args) => {
        const id = toolIdCounter++;
        setActiveTools((prev) => [...prev, { id, name, done: false }]);
        if (name === "draft_email" || name === "draft_slack_message") {
          setPendingDraft({ toolName: name, args });
        }
      },
      onToolEnd: (name) => {
        setActiveTools((prev) =>
          prev.map((t) => (t.name === name && !t.done ? { ...t, done: true } : t))
        );
      },
      onDone: () => setIsWaiting(false),
    });
  };

  const handleConfirm = () => {
    setPendingDraft(null);
    handleSend("yes send it");
  };

  const handleCancel = () => {
    setPendingDraft(null);
    setMessages((prev) => [...prev, { role: "assistant", content: "Okay, I won't send that." }]);
  };

  if (!started) {
    return <LandingPage onGetStarted={() => setStarted(true)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ToolActivitySidebar activeTools={activeTools} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <ChatWindow
          messages={messages}
          pendingDraft={pendingDraft}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isWaiting={isWaiting}
        />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;