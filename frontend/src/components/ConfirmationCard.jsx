import {motion} from 'framer-motion';
import {Mail,Send,X} from 'lucide-react';
export default function ConfirmationCard({toolName,args,onConfirm,onCancel}){
    const isEmail=toolName==="defat_email";
    return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        alignSelf: "flex-start",
        maxWidth: "75%",
        border: "1px solid var(--accent-warning)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 8,
        background: "rgba(232,163,61,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Mail size={16} color="var(--accent-warning)" />
        <span style={{ fontSize: 13, color: "var(--accent-warning)", fontFamily: "var(--font-mono)" }}>
          {isEmail ? "Draft email" : "Draft Slack message"}
        </span>
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
        {isEmail ? (
          <>
            <div><b>To:</b> {args.to}</div>
            <div><b>Subject:</b> {args.subject}</div>
            <div style={{ marginTop: 6 }}>{args.body}</div>
          </>
        ) : (
          <>
            <div><b>Channel:</b> #{args.channel}</div>
            <div style={{ marginTop: 6 }}>{args.text}</div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--accent-success)", color: "#0F1115",
            border: "none", borderRadius: 8, padding: "8px 14px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          <Send size={14} /> Send
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", color: "var(--text-muted)",
            border: "1px solid #2A2E36", borderRadius: 8, padding: "8px 14px",
            fontSize: 13, cursor: "pointer",
          }}
        >
          <X size={14} /> Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}