// src/components/magicui/bento-grid.jsx
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function BentoGrid({ children, className }) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
}) {
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/50 dark:backdrop-blur-xl hover:border-zinc-300 dark:hover:border-white/20",
        className
      )}
    >
      {background && (
        <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70">
          {background}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/60 dark:border-zinc-700/60 transition-transform duration-300 group-hover:scale-110">
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>

        {cta && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>{cta}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </div>
  );
}

