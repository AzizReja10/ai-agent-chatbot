// src/components/AuthForm.jsx
import { useState } from "react";
import { login, signup } from "../api/auth";
import { Command, Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

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

  const handleOAuthLogin = (provider) => {
    // Direct redirect to backend OAuth sign-in routes
    if (provider === "google") {
      window.location.href = "/auth/google/signin";
    } else if (provider === "github") {
      window.location.href = "/auth/github/signin";
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Top back button */}
      {onBack && (
        <div className="absolute top-5 left-5 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-600 dark:text-zinc-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Button>
        </div>
      )}

      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 mb-2">
            <Command className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === "login"
              ? "Enter your credentials to access your autonomous workspace"
              : "Sign up to begin deploying autonomous agent workflows"}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <Tabs
              value={mode}
              onValueChange={(val) => {
                setMode(val);
                setError("");
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-xs font-medium cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-950">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                className="text-xs font-normal cursor-pointer"
                onClick={() => handleOAuthLogin("google")}
              >
                <FaGoogle className="h-3.5 w-3.5 mr-1" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                className="text-xs font-normal cursor-pointer"
                onClick={() => handleOAuthLogin("github")}
              >
                <FaGithub className="h-3.5 w-3.5 mr-1" />
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
