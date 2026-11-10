// src/components/MessageBubble.jsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { cn } from "../lib/utils";

export default function MessageBubble(props) {
  const role = props.role || props.message?.role;
  const content = props.content !== undefined ? props.content : props.message?.content;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100 whitespace-pre-wrap leading-relaxed select-text font-sans">
          {content}
        </div>
      </div>
    );
  }

  // Assistant message in Claude-like document layout
  return (
    <div className="group w-full mb-8">
      <div className="prose prose-zinc dark:prose-invert max-w-none text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 select-text font-sans">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            code: ({ inline, className, children, ...rest }) => {
              return (
                <code
                  className={cn(
                    "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200",
                    className
                  )}
                  {...rest}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-xs text-zinc-100 dark:bg-zinc-900">
                {children}
              </pre>
            ),
          }}
        >
          {content || ""}
        </ReactMarkdown>
      </div>

      {/* Claude-style minimalist action bar: Copy, Thumbs, Retry */}
      <div className="mt-2 flex items-center gap-1 text-zinc-400 opacity-90 transition-opacity">
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          title="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => {
            setLiked(!liked);
            if (disliked) setDisliked(false);
          }}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer",
            liked && "text-zinc-900 dark:text-zinc-100"
          )}
          title="Good response"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            setDisliked(!disliked);
            if (liked) setLiked(false);
          }}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer",
            disliked && "text-zinc-900 dark:text-zinc-100"
          )}
          title="Bad response"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          title="Retry"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <span className="ml-2 font-sans text-xs text-zinc-400">
          just now
        </span>
      </div>
    </div>
  );
}
