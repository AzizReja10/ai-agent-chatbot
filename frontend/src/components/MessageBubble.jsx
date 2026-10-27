// src/components/MessageBubble.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Sparkles, User } from "lucide-react";
import { cn } from "../lib/utils";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full gap-3.5 mb-5",
        isUser ? "flex-row-reverse self-end justify-start" : "flex-row self-start"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all mt-0.5",
          isUser
            ? "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
            : "border-indigo-200/70 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/20 dark:border-indigo-400/30"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[78%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Role & Time metadata */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-tight">
            {isUser ? "You" : "Nova Assistant"}
          </span>
        </div>

        {/* Bubble Box */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm transition-all duration-200",
            isUser
              ? "bg-zinc-900 text-white dark:bg-indigo-600 dark:text-white rounded-tr-xs shadow-sm"
              : "border border-zinc-200/80 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-100 rounded-tl-xs"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed select-text font-sans">
              {content}
            </div>
          ) : (
            <div className="markdown-body select-text">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}

          {/* Action Footer for Assistant messages */}
          {!isUser && (
            <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-400 dark:border-zinc-800/80 dark:text-zinc-500">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                AI Verified Execution
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 cursor-pointer"
                title="Copy message"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="font-mono text-emerald-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="font-mono">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
