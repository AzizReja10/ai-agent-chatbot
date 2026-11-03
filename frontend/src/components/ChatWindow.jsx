// src/components/ChatWindow.jsx
import { useRef, useEffect } from "react";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ConfirmationCard from "./ConfirmationCard.jsx";
import { Calendar, Mail, CloudSun, GitBranch, ArrowUpRight, Command } from "lucide-react";

const STARTER_PROMPTS = [
  {
    icon: Calendar,
    title: "Check Schedule",
    prompt: "What events do I have scheduled on my calendar today?",
    badge: "Calendar",
  },
  {
    icon: GitBranch,
    title: "GitHub Issues",
    prompt: "List the most recent open issues in my repository",
    badge: "GitHub",
  },
  {
    icon: Mail,
    title: "Unread Emails",
    prompt: "Check my recent unread emails and give me a quick summary",
    badge: "Gmail",
  },
  {
    icon: CloudSun,
    title: "Weather Report",
    prompt: "What's the current weather in New York?",
    badge: "OpenMeteo",
  },
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
    <div className="relative flex flex-1 flex-col overflow-y-auto px-4 py-6 md:px-8">
      {/* Empty State / Welcome */}
      {messages.length === 0 && (
        <div className="my-auto mx-auto w-full max-w-xl text-center py-8">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 mb-3">
            <Command className="h-4 w-4" />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            How can Nova assist you today?
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
            Search live web sources, triage emails, coordinate meetings, and trigger local FastMCP tools directly from the prompt.
          </p>

          {/* Quick Starter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto text-left">
            {STARTER_PROMPTS.map((starter, i) => {
              const IconComp = starter.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectPrompt && onSelectPrompt(starter.prompt)}
                  className="group flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-xs transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-850 cursor-pointer"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <IconComp className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {starter.title}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {starter.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}

        {/* Pending Confirmation Card */}
        {pendingDraft && (
          <ConfirmationCard
            draft={pendingDraft}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        )}

        {/* Typing indicator */}
        {isWaiting && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
