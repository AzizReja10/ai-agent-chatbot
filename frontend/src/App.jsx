// src/App.jsx
import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import ToolActivitySidebar from "./components/ToolActivitySidebar";
import { cancelPendingAction, streamChat } from "./api/chat";
import { getCurrentUser, logout, getGoogleStatus, finalizeSignin, getGitHubStatus } from "./api/auth";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  PanelLeftClose, 
  PanelLeft, 
  ChevronDown,
  SquarePen
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "./components/ui/button";

function generateThreadId() {
  return "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
}

function App() {
  const [threadId, setThreadId] = useState(() => generateThreadId());
  const [messages, setMessages] = useState([]);
  const [activeTools, setActiveTools] = useState([]);
  const [pendingDraft, setPendingDraft] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [started, setStarted] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
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
      getGoogleStatus().then((s) => setGoogleConnected(s.connected));
    }
  }, [user]);

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

  const handleNewChat = () => {
    setThreadId(generateThreadId());
    setMessages([]);
    setActiveTools([]);
    setPendingDraft(null);
    setIsWaiting(false);
  };

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setActiveTools([]);
    setPendingDraft(null);
    setIsWaiting(true);

    let agentReply = "";
    let toolIdCounter = 0;
    let firstTokenReceived = false;

    streamChat(text, threadId, {
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
    }).catch((error) => {
      setIsWaiting(false);
      setMessages((prev) => {
        const updated = [...prev];
        const message = `Request failed: ${error.message}`;
        if (updated.at(-1)?.role === "assistant") {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: `${updated.at(-1).content}\n\n${message}`.trim(),
          };
        } else {
          updated.push({ role: "assistant", content: message });
        }
        return updated;
      });
    });
  };

  const handleConfirm = () => {
    setPendingDraft(null);
    handleSend("yes send it");
  };

  const handleCancel = async () => {
    setPendingDraft(null);
    try {
      const result = await cancelPendingAction();
      if (!result.cancelled) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "There was no pending server draft to cancel. No message was sent.",
          },
        ]);
        return;
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Could not record cancellation: ${error.message}. The draft may still be pending on the server.`,
        },
      ]);
      return;
    }
    setMessages((prev) => [...prev, { role: "assistant", content: "Action cancelled. I did not send it." }]);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setStarted(false);
  };

  if (!authChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100 dark:border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    if (!started) {
      return <LandingPage onGetStarted={() => setStarted(true)} />;
    }
    return <AuthForm onAuthenticated={setUser} onBack={() => setStarted(false)} />;
  }

  const chatTitle = messages.length > 0
    ? (messages[0].content.length > 40 ? messages[0].content.slice(0, 40) + "..." : messages[0].content)
    : "New Chat";

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
      {/* Claude-style Clean Minimal Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Left: Sidebar toggle, New Chat & Chat title dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowSidebar((prev) => !prev)}
            className="cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title={showSidebar ? "Close Sidebar" : "Open Sidebar"}
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Start new fresh chat"
          >
            <SquarePen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 text-xs sm:text-sm font-medium text-zinc-800 hover:bg-zinc-100 rounded-md dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors max-w-[200px] sm:max-w-[320px] truncate"
          >
            <span className="truncate">{chatTitle}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          </button>
        </div>

        {/* Right: Integrations & Logout */}
        <div className="flex items-center gap-2">
          <a
            href="/auth/google/login"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
          >
            <FaGoogle className="h-3 w-3 text-amber-500" />
            <span>{googleConnected ? "Reconnect Google" : "Connect Google"}</span>
          </a>
          {!githubConnected && (
            <a
              href="/auth/github/login"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
            >
              <FaGithub className="h-3 w-3" />
              <span>Connect GitHub</span>
            </a>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="cursor-pointer text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden h-full shrink-0 border-r border-zinc-200 dark:border-zinc-800"
            >
              <ToolActivitySidebar activeTools={activeTools} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Chat Stream & Input Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950">
          <ChatWindow
            messages={messages}
            pendingDraft={pendingDraft}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isWaiting={isWaiting}
            onSelectPrompt={handleSend}
          />
          <MessageInput onSend={handleSend} disabled={isWaiting} />
        </main>
      </div>
    </div>
  );
}

export default App;
