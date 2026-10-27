// src/components/uiverse/status-pill.jsx
import { cn } from "../../lib/utils";

/**
 * UIverse Live Ping Status Badge
 * Modern live telemetry indicator with pulsing radar dot.
 */
export function StatusPill({
  status = "active", // "active" | "idle" | "warning" | "error"
  label,
  icon: Icon,
  className,
}) {
  const configs = {
    active: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      ping: "bg-emerald-400",
    },
    idle: {
      bg: "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400",
      dot: "bg-zinc-400 dark:bg-zinc-500",
      ping: "bg-zinc-400",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/40 text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
      ping: "bg-amber-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/40 border-red-200/80 dark:border-red-800/40 text-red-700 dark:text-red-300",
      dot: "bg-red-500",
      ping: "bg-red-400",
    },
  };

  const current = configs[status] || configs.idle;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md select-none transition-all",
        current.bg,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {status === "active" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              current.ping
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", current.dot)} />
      </span>

      {Icon && <Icon className="h-3 w-3" />}
      {label && <span className="font-mono tracking-tight text-[11px]">{label}</span>}
    </div>
  );
}

