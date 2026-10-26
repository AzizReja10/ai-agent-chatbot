// src/lib/utils.js

/**
 * Utility helper to conditionally join CSS class names.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
