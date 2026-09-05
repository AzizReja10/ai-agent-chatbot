// src/components/ConfirmationCard.jsx
import { motion } from "framer-motion";
import { Mail, Send, X, AlertTriangle, MessageSquare, ShieldAlert } from "lucide-react";

export default function ConfirmationCard({ toolName, args, onConfirm, onCancel }) {
  const isEmail = toolName === "draft_email";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        alignSelf: "flex-start",
        maxWidth: "85%",
        width: "100%",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 16,
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(17, 22, 36, 0.85) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(245, 158, 11, 0.15)",
      }}
    >
      {/* Header Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(245, 158, 11, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            {isEmail ? <Mail size={16} color="#F59E0B" /> : <MessageSquare size={16} color="#F59E0B" />}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FDE68A", fontFamily: "var(--font-heading)" }}>
              {isEmail ? "Approval Required: Draft Email" : "Approval Required: Slack Message"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              tool: {toolName}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: "#F59E0B",
          }}
        >
          <ShieldAlert size={12} />
          <span>Pending Confirmation</span>
        </div>
      </div>

      {/* Payload Details */}
      <div
        style={{
          background: "rgba(11, 14, 23, 0.7)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 12,
          padding: 14,
          fontSize: 13.5,
          lineHeight: 1.6,
          marginBottom: 18,
        }}
      >
        {isEmail ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 60 }}>Recipient:</span>
              <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{args.to}</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 60 }}>Subject:</span>
              <span style={{ color: "#F8FAFC", fontWeight: 500 }}>{args.subject}</span>
            </div>
            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
              }}
            >
              {args.body}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color: "var(--text-muted)", minWidth: 60 }}>Channel:</span>
              <span style={{ color: "#60A5FA", fontWeight: 600 }}>#{args.channel}</span>
            </div>
            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
              }}
            >
              {args.text}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onConfirm}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          }}
        >
          <Send size={14} />
          <span>Authorize & Send</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onCancel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255, 255, 255, 0.04)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <X size={14} />
          <span>Cancel</span>
        </motion.button>
      </div>
    </motion.div>
  );
}