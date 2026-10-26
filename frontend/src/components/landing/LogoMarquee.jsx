// src/components/landing/LogoMarquee.jsx
import React from "react";
import { cn } from "../../lib/utils";

// Default reviews dataset as provided in the MagicUI Marquee demo
export const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

/**
 * Reusable Card component supporting review avatars, icons, badges, and quotes.
 */
export const ReviewCard = ({
  img,
  icon,
  color,
  name,
  username,
  body,
  onClick,
  className = "",
  style = {},
}) => {
  return (
    <figure
      onClick={onClick}
      className={cn("magic-card", className)}
      style={style}
    >
      <div className="magic-card-header">
        {img ? (
          <img
            className="magic-card-avatar"
            width="34"
            height="34"
            alt={name || "Avatar"}
            src={img}
            loading="lazy"
          />
        ) : icon ? (
          <div
            className="magic-card-icon-box"
            style={{ color: color || "var(--accent-primary)" }}
          >
            {icon}
          </div>
        ) : (
          <div
            className="magic-card-avatar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--accent-primary)",
            }}
          >
            {name ? name.charAt(0) : "★"}
          </div>
        )}
        <div className="magic-card-meta">
          <figcaption className="magic-card-name">{name}</figcaption>
          {username && <p className="magic-card-username">{username}</p>}
        </div>
      </div>
      {body && <blockquote className="magic-card-body">{body}</blockquote>}
    </figure>
  );
};

/**
 * Marquee Track Row component supporting continuous infinite scroll,
 * pause on hover, reverse direction, custom speed and repetitions.
 */
export const Marquee = ({
  className = "",
  reverse = false,
  pauseOnHover = true,
  children,
  repeat = 4,
  duration = "24s",
  style = {},
}) => {
  return (
    <div
      className={cn("magic-marquee", pauseOnHover && "pause-on-hover", className)}
      style={{
        "--duration": duration,
        ...style,
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn("magic-marquee-inner", reverse && "reverse")}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

/**
 * MagicUI Marquee Demo implementation with dual reversed rows and edge fades.
 */
export function MarqueeDemo({ duration = "20s", className = "" }) {
  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <div className={cn("magic-marquee-container", className)}>
      <Marquee pauseOnHover duration={duration}>
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover duration={duration}>
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="magic-marquee-fade-left" aria-hidden="true" />
      <div className="magic-marquee-fade-right" aria-hidden="true" />
    </div>
  );
}

/**
 * Main LogoMarquee component:
 * Accepts `items` (either stack integrations or reviews).
 * If items are omitted, defaults seamlessly to the MagicUI reviews dataset.
 */
export default function LogoMarquee({
  items,
  pauseOnHover = true,
  duration = "24s",
  className = "",
  style = {},
}) {
  const data = items && items.length > 0 ? items : reviews;
  const firstRow = data.slice(0, Math.ceil(data.length / 2));
  const secondRow = data.slice(Math.ceil(data.length / 2));

  return (
    <div className={cn("magic-marquee-container", className)} style={style}>
      <Marquee pauseOnHover={pauseOnHover} duration={duration}>
        {firstRow.map((item, idx) => (
          <ReviewCard key={item.username || item.name || idx} {...item} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={pauseOnHover} duration={duration}>
        {secondRow.map((item, idx) => (
          <ReviewCard key={item.username || item.name || idx} {...item} />
        ))}
      </Marquee>
      <div className="magic-marquee-fade-left" aria-hidden="true" />
      <div className="magic-marquee-fade-right" aria-hidden="true" />
    </div>
  );
}