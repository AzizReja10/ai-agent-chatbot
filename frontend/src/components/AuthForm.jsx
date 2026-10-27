// src/components/AuthForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, signup } from "../api/auth";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { DotPattern } from "./magicui/dot-pattern";
import { BorderBeam } from "./magicui/border-beam";

export default function AuthForm({ onAuthenticated, onBack, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
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
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Background Architectural Dot Pattern */}
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)]" />

      {/* Top Controls */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20 max-w-5xl mx-auto">
        {onBack && (
          <Button
            variant="glass"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Button>
        )}
      </div>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="relative overflow-hidden border-zinc-200/90 dark:border-zinc-800 shadow-xl backdrop-blur-2xl">
          <BorderBeam size={220} duration={12} colorFrom="#6366F1" colorTo="#A855F7" />

          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              {mode === "login" ? "Welcome back to Nova" : "Create your Nova account"}
            </CardTitle>
            <CardDescription className="text-xs">
              {mode === "login"
                ? "Enter your credentials to access your autonomous workspace"
                : "Sign up in seconds to start building multi-tool agent workflows"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-8">
            {/* Mode Tabs */}
            <div className="flex justify-center mb-2">
              <Tabs value={mode} onValueChange={(val) => { setMode(val); setError(""); }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-xs">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-xs">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full mt-2 cursor-pointer text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In to Workspace" : "Get Started Free"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Social Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <span className="relative bg-white px-2 text-[11px] uppercase font-mono text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
                Or Continue With
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full cursor-pointer text-xs"
              >
                <a href="/auth/google/login" className="flex items-center justify-center gap-2">
                  <FaGoogle className="h-3.5 w-3.5 text-red-500" />
                  <span>Google</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full cursor-pointer text-xs"
              >
                <a href="/auth/github/login" className="flex items-center justify-center gap-2">
                  <FaGithub className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              </Button>
            </div>

            <div className="pt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
              By continuing, you agree to Nova's Terms of Service and Privacy Policy.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
