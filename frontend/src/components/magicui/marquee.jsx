// src/components/magicui/marquee.jsx
import { cn } from "../../lib/utils";

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] select-none",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 justify-around [gap:var(--gap)]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
        {children}
      </div>
    </div>
  );
}

