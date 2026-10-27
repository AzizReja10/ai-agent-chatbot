// src/components/Button.jsx
import React from "react";

/**
 * 3D Tactile Push Button / Option Button
 *
 * Implements the tactile 3D inset-bottom mechanical button physics with
 * theme-adaptive styling for Day / Night modes.
 */
export default function Button({
  children = "Button-name",
  className = "",
  onClick,
  type = "button",
  variant = "default", // "default" | "pill" | "card"
  disabled = false,
  style,
  ...props
}) {
  let variantClass = "";
  if (variant === "pill") {
    variantClass = "prompt-pill-option";
  } else if (variant === "card") {
    variantClass = "starter-prompt-option";
  }

  return (
    <button
      type={type}
      role="button"
      className={`button-option ${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
