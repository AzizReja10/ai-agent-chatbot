// src/components/uiverse/uiverse-button.jsx
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * UIverse Tactile Option Pill
 * Clean 3D micro-depth and interactive hover elevation.
 */
export function UiverseOptionButton({
  children,
  onClick,
  className,
  icon: Icon,
  badge,
  active = false,
  ...props
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all duration-200 outline-none select-none text-left cursor-pointer",
        active
          ? "border-indigo-500/80 bg-indigo-50/80 text-indigo-900 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500/50"
          : "border-zinc-200/90 bg-white/80 text-zinc-700 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_-2px_0_rgba(0,0,0,0.04)_inset] hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_-2px_0_rgba(255,255,255,0.03)_inset] dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80",
        className
      )}
      {...props}
    >
      {Icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-300">
          <Icon className="h-3 w-3" />
        </span>
      )}

      <span className="truncate leading-none">{children}</span>

      {badge && (
        <span className="ml-auto rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

