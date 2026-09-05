// src/components/AuthForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup } from "../api/auth";
import ThemeToggle from "./ThemeToggle";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = mode === "login" ? await login(email, password) : await signup(email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 24,
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glows */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          padding: "36px 32px",
          background: "var(--bg-glass)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border-glass)",
          borderRadius: 24,
          boxShadow: "var(--shadow-lg), var(--glow-primary)",
        }}
      >
        {/* Day/Night Theme Toggle in top-right */}
        <div style={{ position: "absolute", top: 18, right: 18 }}>
          <ThemeToggle size="sm" />
        </div>

        {/* Header Icon */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
              marginBottom: 14,
            }}
          >
            <Sparkles size={24} color="#FFFFFF" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 6px",
              color: "var(--text-primary)",
            }}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: 0 }}>
            {mode === "login" ? "Log in to access your AI agent workspace" : "Get started with your autonomous assistant"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-surface)",
            padding: 4,
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            marginBottom: 24,
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 0",
              background: "transparent",
              border: "none",
              color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              position: "relative",
              zIndex: 2,
              transition: "color 0.2s",
            }}
          >
            Sign In
            {mode === "login" && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--gradient-glass)",
                  borderRadius: 8,
                  border: "1px solid var(--border-glass)",
                  boxShadow: "var(--shadow-sm)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 0",
              background: "transparent",
              border: "none",
              color: mode === "signup" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              position: "relative",
              zIndex: 2,
              transition: "color 0.2s",
            }}
          >
            Sign Up
            {mode === "signup" && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--gradient-glass)",
                  borderRadius: 8,
                  border: "1px solid var(--border-glass)",
                  boxShadow: "var(--shadow-sm)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/auth/google/signin"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 0",
              borderRadius: 12,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 600,
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.2s ease",
            }}
          >
            <FaGoogle size={16} color="#EA4335" />
            <span>Continue with Google</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/auth/github/signin"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "11px 0",
              borderRadius: 12,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: 13.5,
              fontWeight: 600,
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.2s ease",
            }}
          >
            <FaGithub size={17} />
            <span>Continue with GitHub</span>
          </motion.a>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--text-muted)",
            fontSize: 12,
            margin: "20px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          <span>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg-base)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                padding: "10px 14px",
                transition: "border-color 0.2s",
              }}
            >
              <Mail size={16} color="var(--text-muted)" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--bg-base)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                padding: "10px 14px",
                transition: "border-color 0.2s",
              }}
            >
              <Lock size={16} color="var(--text-muted)" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  width: "100%",
                }}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#F87171",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "var(--gradient-brand)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
              marginTop: 6,
            }}
          >
            {loading ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}