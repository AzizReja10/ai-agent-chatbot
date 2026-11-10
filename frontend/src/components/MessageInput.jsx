// src/components/MessageInput.jsx
import { useState, useRef } from "react";
import { Plus, Mic, ArrowUp, AudioLines } from "lucide-react";
import { cn } from "../lib/utils";

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 pb-5 pt-2">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-zinc-200/90 bg-white shadow-xs focus-within:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/60 dark:focus-within:border-zinc-600 transition-colors"
        >
          {/* Main prompt input */}
          <div className="flex items-center px-4 pt-3 pb-2">
            <button
              type="button"
              className="mr-2 flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              title="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              disabled={disabled}
              className="flex-1 max-h-48 resize-none bg-transparent text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500 font-sans leading-relaxed caret-zinc-900 dark:caret-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800"
            />

            <div className="ml-2 flex items-center gap-1.5">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                title="Audio"
              >
                <AudioLines className="h-4 w-4" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!text.trim() || disabled}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                  text.trim() && !disabled
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                    : "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                )}
                title="Send"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>

        {/* Minimal footer note */}
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-sans">
          <span>Nova is an AI and can make mistakes. Please verify important actions.</span>
          <span className="hidden sm:inline font-mono text-[10px]">Web Search Agent</span>
        </div>
      </div>
    </div>
  );
}
