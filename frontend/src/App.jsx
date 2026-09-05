// src/App.jsx
import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import ToolActivitySidebar from "./components/ToolActivitySidebar";
import { streamChat } from "./api/chat";
import { getCurrentUser, logout, getGoogleStatus, finalizeSignin, getGitHubStatus } from "./api/auth";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  LogOut, 
  PanelLeftClose, 
  PanelLeft, 
  CheckCircle2, 
  AlertCircle,
  User as UserIcon 
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

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
  const [showSidebar, setShowSidebar] = useState(true);
  const finalizeRan = useRef(false);

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

  useEffect(() => {
    if (finalizeRan.current) return;
    finalizeRan.current = true;

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
    setMessages((prev) => [...prev, { role: "assistant", content: "Action cancelled. I did not send it." }]);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setStarted(false);
  };

  if (!authChecked) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#07090E" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #6366F1", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!user) {
    if (!started) {
      return <LandingPage onGetStarted={() => setStarted(true)} />;
    }
    return <AuthForm onAuthenticated={setUser} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative" }}>
      {/* Background Ambience */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      {/* Top Navigation Bar */}
      <header
        style={{
          position: "relative",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "rgba(11, 14, 23, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSidebar((prev) => !prev)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              padding: 6,
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Toggle Mission Control"
          >
            {showSidebar ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
          </motion.button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "var(--gradient-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
              }}
            >
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "var(--font-heading)", letterSpacing: "-0.3px" }}>
                Nova AI
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                autonomous agent
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status & Profile Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Google Integration Badge */}
          {googleConnected ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 8,
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: 12,
                color: "var(--accent-success)",
                fontWeight: 500,
              }}
            >
              <FaGoogle size={12} />
              <span>Google Connected</span>
              <CheckCircle2 size={12} />
            </div>
          ) : (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/auth/google/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#FDE68A",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <FaGoogle size={12} />
              <span>Connect Google</span>
              <AlertCircle size={12} />
            </motion.a>
          )}

          {/* GitHub Integration Badge */}
          {githubConnected ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 8,
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: 12,
                color: "var(--accent-success)",
                fontWeight: 500,
              }}
            >
              <FaGithub size={13} />
              <span>GitHub Connected</span>
              <CheckCircle2 size={12} />
            </div>
          ) : (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/auth/github/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <FaGithub size={13} />
              <span>Connect GitHub</span>
            </motion.a>
          )}

          {/* User Profile Pill */}
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                fontSize: 12,
                color: "var(--text-secondary)",
              }}
            >
              <UserIcon size={13} color="var(--accent-primary)" />
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email || "Account"}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Log out"
          >
            <LogOut size={14} />
          </motion.button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 10 }}>
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden", height: "100%" }}
            >
              <ToolActivitySidebar activeTools={activeTools} />
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <ChatWindow
            messages={messages}
            pendingDraft={pendingDraft}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isWaiting={isWaiting}
            onSelectPrompt={handleSend}
          />
          <MessageInput onSend={handleSend} disabled={isWaiting} />
        </div>
      </div>
    </div>
  );
}

export default App;