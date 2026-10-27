// src/components/ChatWindow.jsx
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ConfirmationCard from "./ConfirmationCard.jsx";
import { Sparkles, Calendar, Mail, CloudSun, GitBranch, ArrowUpRight } from "lucide-react";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";

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
      {/* Empty State / Welcome Hero */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="my-auto mx-auto w-full max-w-2xl text-center py-8"
        >
          {/* Subtle Tag */}
          <div className="mb-4 inline-flex">
            <AnimatedGradientText>
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 mr-2" />
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Ready for Multi-Tool Execution
              </span>
            </AnimatedGradientText>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            What would you like Nova to do?
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Nova can search web knowledge, manage calendars, query GitHub repos, triage emails, and trigger FastMCP automated tools.
          </p>

          {/* Quick Starter Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
            {STARTER_PROMPTS.map((starter, i) => {
              const IconComp = starter.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectPrompt && onSelectPrompt(starter.prompt)}
                  className="group relative flex items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/70 p-3.5 text-left shadow-sm transition-all duration-200 hover:border-indigo-400/80 hover:bg-zinc-50/80 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-indigo-500/50 dark:hover:bg-zinc-850 cursor-pointer"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-400">
                    <IconComp className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {starter.title}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {starter.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Messages List */}
      <div className="mx-auto w-full max-w-4xl">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {pendingDraft && (
            <ConfirmationCard
              key="pending-draft"
              toolName={pendingDraft.toolName}
              args={pendingDraft.args}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          )}
          {isWaiting && <TypingIndicator key="typing-indicator" />}
        </AnimatePresence>
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
