// src/components/AuthForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup } from "../api/auth";

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: 320,
          padding: 32,
          background: "#1A1D23",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>
          {mode === "login" ? "Log in" : "Create account"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: "#E85D5D", fontSize: 13 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          style={{
            background: "var(--accent-primary)",
            color: "#0F1115",
            border: "none",
            borderRadius: 10,
            padding: "10px 0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#2A2E36" }} />
          or
          <div style={{ flex: 1, height: 1, background: "#2A2E36" }} />
        </div>

        <a
          href="/auth/google/signin"
          style={{
            textAlign: "center",
            padding: "10px 0",
            borderRadius: 10,
            border: "1px solid #2A2E36",
            color: "var(--text-primary)",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Continue with Google
        </a>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13 }}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </motion.form>
    </div>
  );
}

const inputStyle = {
  background: "#0F1115",
  border: "1px solid #2A2E36",
  borderRadius: 8,
  padding: "10px 12px",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
};