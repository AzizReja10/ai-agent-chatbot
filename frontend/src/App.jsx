// src/App.jsx
import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import ToolActivitySidebar from "./components/ToolActivitySidebar";
import { streamChat } from "./api/chat";
// src/App.jsx — update this import line
import { getCurrentUser, logout, getGoogleStatus, finalizeSignin, getGitHubStatus } from "./api/auth";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";

import "./styles/theme.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [activeTools, setActiveTools] = useState([]);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [started, setStarted] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
const [githubConnected, setGithubConnected] = useState(false);
  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthChecked(true);
    });
  }, []);
  useEffect(() => {
  if (user) {
    getGitHubStatus().then((s) => setGithubConnected(s.connected));
  }
}, [user, window.location.search]);
// and update this useEffect
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const signinToken = params.get("signin_token");
  if (signinToken) {
    finalizeSignin(signinToken).then(() => {
      window.history.replaceState({}, "", "/");
      getCurrentUser().then((u) => {
        setUser(u);
        setAuthChecked(true);
      });
    });
  }
}, []);
  useEffect(() => {
    if (user) {
      getGoogleStatus().then((s) => setGoogleConnected(s.connected));
    }
  }, [user, window.location.search]);

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setActiveTools([]);
    setPendingDraft(null);
    setIsWaiting(true);

    let agentReply = "";
    let toolIdCounter = 0;
    let firstTokenReceived = false;

    streamChat(text, {
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

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setStarted(false);
  };

  if (!authChecked) {
    return null;
  }

  if (!user) {
    if (!started) {
      return <LandingPage onGetStarted={() => setStarted(true)} />;
    }
    return <AuthForm onAuthenticated={setUser} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8, zIndex: 10 }}>
        {!googleConnected && (
          <a
            href="/auth/google/login"
            style={{
              background: "var(--accent-warning)",
              color: "#0F1115",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Connect Google Account
          </a>
        )}
        {!githubConnected && (
          <a href="/auth/github/login"
          style={{
            background: "#2A2E36",
            color: "var(--text-primary)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid #3A3E46",
          }}
        >
    Connect GitHub
  </a>
)}
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #2A2E36",
            color: "var(--text-muted)",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>

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