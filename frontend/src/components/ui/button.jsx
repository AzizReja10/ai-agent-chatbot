// src/components/ui/button.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white",
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:shadow-indigo-500/30",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-sm dark:bg-red-600/90 dark:hover:bg-red-500",
        outline:
          "border border-zinc-200 bg-white/50 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 backdrop-blur-sm",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50",
        link:
          "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400 p-0 h-auto",
        glass:
          "border border-white/20 bg-white/60 text-zinc-900 shadow-sm backdrop-blur-md hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800/70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };

