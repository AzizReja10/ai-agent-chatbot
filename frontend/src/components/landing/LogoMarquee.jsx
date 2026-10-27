// src/components/landing/LogoMarquee.jsx
import React from "react";
import { cn } from "../../lib/utils";
import { Marquee } from "../magicui/marquee";

export const reviews = [
  {
    name: "Alex Rivera",
    username: "@arivera_dev",
    body: "Nova replaced our complex shell scripts with a single autonomous agent. The Card Confirmation for Slack & email saved us from catastrophic accidents.",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sarah Chen",
    username: "@schen_ai",
    body: "FastMCP integration works out of the box. I can plug local python CLI tools and Nova discovers and calls them seamlessly.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Marcus Vance",
    username: "@marcus_v",
    body: "The latency telemetry and real-time tool logs give me 100% visibility into what the AI agent is thinking before it commits any mutation.",
    img: "https://avatar.vercel.sh/marcus",
  },
  {
    name: "Elena Rostova",
    username: "@elena_builds",
    body: "Finally an agent chatbot that doesn't just hallucinate text. It actually fetches live pull requests and drafts real Gmail replies accurately.",
    img: "https://avatar.vercel.sh/elena",
  },
  {
    name: "David Kim",
    username: "@dkim_ops",
    body: "The human-in-the-loop confirmation card is brilliant. We run production commands with complete confidence.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Maya Patel",
    username: "@mayapatel",
    body: "Multi-tool reasoning is blazing fast. The clean UI and mission control sidebar make this feel like a spacecraft console.",
    img: "https://avatar.vercel.sh/maya",
  },
];

export const ReviewCard = ({
  img,
  icon,
  color,
  name,
  username,
  body,
  onClick,
  className = "",
}) => {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "relative w-72 md:w-80 cursor-pointer overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-2.5">
        {img ? (
          <img
            className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
            alt={name || "Avatar"}
            src={img}
            loading="lazy"
          />
        ) : icon ? (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
            style={{ color: color }}
          >
            {icon}
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs">
            {name ? name.charAt(0) : "★"}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <figcaption className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {name}
          </figcaption>
          {username && (
            <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
              {username}
            </p>
          )}
        </div>
      </div>
      {body && (
        <blockquote className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-sans">
          {body}
        </blockquote>
      )}
    </figure>
  );
};

export default function LogoMarquee({
  items,
  pauseOnHover = true,
  className = "",
}) {
  const data = items && items.length > 0 ? items : reviews;
  const firstRow = data.slice(0, Math.ceil(data.length / 2));
  const secondRow = data.slice(Math.ceil(data.length / 2));

  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center overflow-hidden py-4", className)}>
      <Marquee pauseOnHover={pauseOnHover}>
        {firstRow.map((item, idx) => (
          <ReviewCard key={item.username || item.name || idx} {...item} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={pauseOnHover}>
        {secondRow.map((item, idx) => (
          <ReviewCard key={item.username || item.name || idx} {...item} />
        ))}
      </Marquee>

      {/* Gradient Edge Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#090A0F] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#090A0F] to-transparent z-10" />
    </div>
  );
}
