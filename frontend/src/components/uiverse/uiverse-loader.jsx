// src/components/uiverse/uiverse-loader.jsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * UIverse Orbital Thinking Loader
 * Multi-tier orbital ring + animated status pulses
 */
export function UiverseLoader({
  label = "Nova is executing workflow...",
  subtext = "Calling MCP tools & analyzing responses",
  className,
}) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white/90 p-3.5 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] max-w-fit",
        className
      )}
    >
      {/* Orbital spinner */}
      <div className="relative flex h-8 w-8 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 dark:border-indigo-400/20 dark:border-t-indigo-400"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute inset-1 rounded-full border border-dashed border-cyan-500/40"
        />
        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {label}
          </span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
        </div>
        {subtext && (
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

