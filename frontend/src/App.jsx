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
  User as UserIcon
} from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

import { Button } from "./components/ui/button";
import { StatusPill } from "./components/uiverse/status-pill";
import { DotPattern } from "./components/magicui/dot-pattern";

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

  useEffect(() => {
    if (user) {
      getGoogleStatus().then((s) => setGoogleConnected(s.connected));
    }
  }, [user]);

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
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#090A0F]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-9 w-9 rounded-full border-3 border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent"
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

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white text-zinc-950 dark:bg-[#090A0F] dark:text-zinc-50 font-sans">
      {/* Background Architectural Dot Pattern */}
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)] opacity-50 dark:opacity-30" />

      {/* Workspace Header */}
      <header className="relative z-30 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-[#090A0F]/80">
        {/* Left Side: Toggle Sidebar & Brand */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowSidebar((prev) => !prev)}
            className="cursor-pointer text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title={showSidebar ? "Hide Mission Control" : "Show Mission Control"}
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Nova AI
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                autonomous agent
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Integrations Status & User Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Google Integration Status */}
          {googleConnected ? (
            <StatusPill
              status="active"
              label="Google"
              icon={FaGoogle}
              className="text-[11px]"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 text-xs border-amber-300 bg-amber-50/50 text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-300"
            >
              <a href="/auth/google/login" className="flex items-center gap-1.5">
                <FaGoogle className="h-3 w-3 text-amber-500" />
                <span className="hidden sm:inline">Connect Google</span>
              </a>
            </Button>
          )}

          {/* GitHub Integration Status */}
          {githubConnected ? (
            <StatusPill
              status="active"
              label="GitHub"
              icon={FaGithub}
              className="text-[11px]"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 text-xs"
            >
              <a href="/auth/github/login" className="flex items-center gap-1.5">
                <FaGithub className="h-3 w-3" />
                <span className="hidden sm:inline">Connect GitHub</span>
              </a>
            </Button>
          )}

          {/* User Profile Pill */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            <UserIcon className="h-3.5 w-3.5 text-indigo-500" />
            <span className="max-w-[110px] truncate font-medium">
              {user.email || "Account"}
            </span>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="cursor-pointer text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Workspace Split Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Collapsible Mission Control Sidebar */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden h-full shrink-0"
            >
              <ToolActivitySidebar activeTools={activeTools} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Chat Stream & Input Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-white/40 dark:bg-[#090A0F]/40 backdrop-blur-xs">
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
