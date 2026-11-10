// src/components/ChatWindow.jsx
import { useRef, useEffect } from "react";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ConfirmationCard from "./ConfirmationCard.jsx";

const STARTER_PROMPTS = [
  "What events do I have scheduled on my calendar today?",
  "List the most recent open issues in my repository",
  "Check my recent unread emails and give me a quick summary",
  "What's the current weather in New York?",
];

export default function ChatWindow({
  messages,
  pendingDraft,
  onConfirm,
  onCancel,
  isWaiting,
  onSelectPrompt,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingDraft, isWaiting]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-4 py-8 md:px-8">
      {/* Empty State / Welcome in Claude Style */}
      {messages.length === 0 && (
        <div className="my-auto mx-auto w-full max-w-2xl text-center py-12">
          <h2 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            What can I help you accomplish today?
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Connect tools, coordinate workflows, read documents, and run automated tasks with verified human confirmation.
          </p>

          {/* Quick Starter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
                className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message List - Claude centered reading column */}
      <div className="mx-auto w-full max-w-3xl">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
            message={msg}
          />
        ))}

        {/* Pending Confirmation Card */}
        {pendingDraft && (
          <div className="mb-6">
            <ConfirmationCard
              draft={pendingDraft}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          </div>
        )}

        {/* Typing indicator */}
        {isWaiting && (
          <div className="mb-6">
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
