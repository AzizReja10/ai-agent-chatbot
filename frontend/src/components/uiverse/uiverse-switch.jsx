// src/components/uiverse/uiverse-switch.jsx
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * UIverse inspired Day / Night toggle switch.
 * Features tactile sliding thumb, icon transitions, and subtle glow.
 */
export function UiverseSwitch({ isDark, onToggle, className, showLabel = false }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus:outline-none",
          isDark
            ? "border-indigo-500/40 bg-zinc-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
            : "border-amber-300/80 bg-gradient-to-r from-amber-100 to-sky-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
        )}
      >
        <span className="sr-only">Toggle Day/Night Theme</span>

        {/* Sliding Thumb */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "pointer-events-none flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all duration-300",
            isDark
              ? "translate-x-7 bg-indigo-600 text-indigo-100 shadow-indigo-950/60"
              : "translate-x-1 bg-amber-400 text-amber-950 shadow-amber-300/50"
          )}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Sun className="h-3.5 w-3.5 stroke-[2.5]" />
          )}
        </motion.span>
      </button>

      {showLabel && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none">
          {isDark ? "Night" : "Day"}
        </span>
      )}
    </div>
  );
}

