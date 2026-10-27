// src/components/magicui/shimmer-button.jsx
import React from "react";
import { cn } from "../../lib/utils";

export const ShimmerButton = React.forwardRef(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.08em",
      shimmerDuration = "2.5s",
      borderRadius = "12px",
      background = "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(99, 102, 241, 0.4), rgba(15, 23, 42, 0.95))",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        }}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/15 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] active:scale-[0.98]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* Spark */}
          <div className="absolute inset-0 h-[100cqh] animate-[radar-sweep_4s_linear_infinite] [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* Spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight backdrop */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-[var(--radius)] px-4 py-1.5 text-sm font-medium shadow-[inset_0_-2px_6px_rgba(255,255,255,0.15)]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-4px_12px_rgba(255,255,255,0.25)]"
          )}
        />

        {/* Backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

