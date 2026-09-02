import {motion,AnimatePresence} from 'framer-motion';
const TOOL_LABELS={
    list_github_issues: "GitHub",
  get_weather: "Weather",
  list_google_tasks: "Tasks",
  list_upcoming_events: "Calendar",
  read_google_docs: "Docs",
  list_recent_emails: "Gmail",
  draft_email: "Gmail",
  list_slack_channels: "Slack",
  draft_slack_message: "Slack",
  web_search: "Web Search"
}
export default function ToolActivitySidebar({activeTools}) {
return(
    <div style={{ width: 200, padding: 16, borderRight: "1px solid #23262D" }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        TOOL ACTIVITY
      </div>
      <AnimatePresence>
        {activeTools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              marginBottom: 6,
              borderRadius: 8,
              background: tool.done ? "rgba(62,207,142,0.1)" : "rgba(91,141,239,0.1)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          >
            <motion.div
              animate={tool.done ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ repeat: tool.done ? 0 : Infinity, duration: 1 }}
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: tool.done ? "var(--accent-success)" : "var(--accent-primary)",
              }}
            />
            {TOOL_LABELS[tool.name] || tool.name}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}