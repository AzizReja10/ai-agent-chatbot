// src/components/MessageInput.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Sparkles, CornerDownLeft } from "lucide-react";
import { cn } from "../lib/utils";

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative z-20 w-full px-4 pb-5 pt-2 md:px-8">
      <div className="mx-auto max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative flex items-center gap-3 rounded-2xl border bg-white/90 p-2 pl-4 shadow-sm backdrop-blur-xl transition-all duration-200 dark:bg-zinc-900/90",
            isFocused
              ? "border-indigo-500/80 ring-4 ring-indigo-500/10 shadow-lg dark:border-indigo-500/60 dark:ring-indigo-500/15"
              : "border-zinc-200/90 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
          )}
        >
          {/* Agent sparkle indicator */}
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
              isFocused
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400"
                : "text-zinc-400 dark:text-zinc-500"
            )}
          >
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nova to summarize emails, inspect GitHub PRs, check events, or run MCP tools..."
            disabled={disabled}
            className="flex-1 bg-transparent py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 dark:text-zinc-100 dark:placeholder:text-zinc-500 font-sans"
          />

          {/* Keyboard shortcut hint */}
          <div className="hidden sm:flex items-center gap-1 rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-1 text-[11px] font-mono text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-500">
            <span>Enter</span>
            <CornerDownLeft className="h-3 w-3" />
          </div>

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!text.trim() || disabled}
            whileHover={text.trim() && !disabled ? { scale: 1.05 } : {}}
            whileTap={text.trim() && !disabled ? { scale: 0.95 } : {}}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 outline-none select-none",
              text.trim() && !disabled
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
            )}
            title="Send prompt"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </motion.button>
        </form>

        <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-600">
          <span>Nova AI Engine v2.4</span>
          <span>•</span>
          <span>FastMCP Protocol</span>
          <span>•</span>
          <span>Enterprise Guardrails Active</span>
        </div>
      </div>
    </div>
  );
}
