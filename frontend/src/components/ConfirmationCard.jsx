// src/components/ConfirmationCard.jsx
import { motion } from "framer-motion";
import { Mail, X, ShieldCheck, Check } from "lucide-react";
import { FaSlack } from "react-icons/fa";
import { BorderBeam } from "./magicui/border-beam";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function ConfirmationCard({ toolName, args, onConfirm, onCancel }) {
  const isEmail = toolName === "draft_email";
  const isSlack = toolName === "draft_slack_message";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-300/80 bg-white/95 p-5 shadow-lg backdrop-blur-xl dark:border-amber-500/30 dark:bg-zinc-900/90 dark:shadow-[0_8px_30px_rgba(245,158,11,0.12)]"
    >
      <BorderBeam size={180} duration={8} colorFrom="#F59E0B" colorTo="#EF4444" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20">
            {isEmail ? <Mail className="h-4 w-4" /> : <FaSlack className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {isEmail ? "Approval Required: Send Email" : "Approval Required: Post Slack Message"}
            </h4>
            <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
              Tool target: {toolName}
            </span>
          </div>
        </div>

        <Badge variant="warning" className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>Human-in-the-Loop</span>
        </Badge>
      </div>

      {/* Payload preview container */}
      <div className="my-4 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950/60 font-sans space-y-2.5">
        {isEmail && (
          <>
            <div className="flex items-start gap-2">
              <span className="w-16 shrink-0 font-mono text-zinc-400 dark:text-zinc-500 font-medium">To:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{args.to}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 shrink-0 font-mono text-zinc-400 dark:text-zinc-500 font-medium">Subject:</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{args.subject}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
              <span className="block font-mono text-zinc-400 dark:text-zinc-500 mb-1 font-medium">Body:</span>
              <div className="rounded-lg bg-white p-3 border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {args.body}
              </div>
            </div>
          </>
        )}

        {isSlack && (
          <>
            <div className="flex items-start gap-2">
              <span className="w-16 shrink-0 font-mono text-zinc-400 dark:text-zinc-500 font-medium">Channel:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">#{args.channel}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
              <span className="block font-mono text-zinc-400 dark:text-zinc-500 mb-1 font-medium">Message:</span>
              <div className="rounded-lg bg-white p-3 border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {args.message}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
          <span>Cancel & Reject</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-600/20 cursor-pointer"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Authorize & Send</span>
        </Button>
      </div>
    </motion.div>
  );
}
