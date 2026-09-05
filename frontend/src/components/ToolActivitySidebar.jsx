// src/components/ToolActivitySidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  CheckCircle2, 
  Loader2, 
  CloudSun, 
  Calendar, 
  Mail, 
  FileText, 
  Search, 
  CheckSquare, 
  MessageSquare, 
  GitBranch, 
  Layers,
  Cpu
} from "lucide-react";
import { FaGithub, FaSlack } from "react-icons/fa";

const TOOL_CONFIG = {
  list_github_issues: { label: "GitHub Issues", icon: <FaGithub size={14} />, color: "#A855F7" },
  get_weather: { label: "Weather API", icon: <CloudSun size={14} />, color: "#F59E0B" },
  list_google_tasks: { label: "Google Tasks", icon: <CheckSquare size={14} />, color: "#3B82F6" },
  list_upcoming_events: { label: "Calendar", icon: <Calendar size={14} />, color: "#06B6D4" },
  read_google_docs: { label: "Google Docs", icon: <FileText size={14} />, color: "#10B981" },
  list_recent_emails: { label: "Gmail", icon: <Mail size={14} />, color: "#EF4444" },
  draft_email: { label: "Draft Email", icon: <Mail size={14} />, color: "#EF4444" },
  list_slack_channels: { label: "Slack Channels", icon: <FaSlack size={14} />, color: "#EC4899" },
  draft_slack_message: { label: "Draft Slack", icon: <FaSlack size={14} />, color: "#EC4899" },
  web_search: { label: "Web Search", icon: <Search size={14} />, color: "#818CF8" },
};

const REGISTERED_TOOLS = [
  { name: "Google Workspace", desc: "Gmail, Calendar, Docs, Tasks", icon: <Mail size={13} color="#EF4444" /> },
  { name: "GitHub Integration", desc: "Issues & Pull Requests", icon: <FaGithub size={13} color="#A855F7" /> },
  { name: "Slack Messaging", desc: "Channels & Direct Messages", icon: <FaSlack size={13} color="#EC4899" /> },
  { name: "Realtime Weather", desc: "OpenMeteo Global Forecast", icon: <CloudSun size={13} color="#F59E0B" /> },
  { name: "Web Discovery", desc: "DuckDuckGo Live Search", icon: <Search size={13} color="#06B6D4" /> },
];

export default function ToolActivitySidebar({ activeTools = [] }) {
  const runningCount = activeTools.filter(t => !t.done).length;

  return (
    <div
      style={{
        width: 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRight: "1px solid var(--border-subtle)",
        overflowY: "auto",
        zIndex: 15,
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "20px 18px 14px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color="var(--accent-primary)" />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1px",
              color: "var(--text-secondary)",
            }}
          >
            TOOL EXECUTION
          </span>
        </div>

        {runningCount > 0 ? (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              background: "rgba(99, 102, 241, 0.2)",
              color: "#A5B4FC",
              padding: "2px 8px",
              borderRadius: 10,
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            {runningCount} active
          </span>
        ) : (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            Idle
          </span>
        )}
      </div>

      {/* Live Active / Recent Tools Feed */}
      <div style={{ padding: 14, flex: 1 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 8 }}>
          LIVE FEED
        </div>

        {activeTools.length === 0 ? (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 12.5,
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: 12,
              border: "1px dashed var(--border-subtle)",
            }}
          >
            <Cpu size={24} style={{ opacity: 0.3, margin: "0 auto 8px" }} />
            <div>No tools currently running. Ask Nova a query to trigger actions.</div>
          </div>
        ) : (
          <AnimatePresence>
            {activeTools.map((tool) => {
              const config = TOOL_CONFIG[tool.name] || {
                label: tool.name,
                icon: <Activity size={14} />,
                color: "#6366F1",
              };

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    marginBottom: 8,
                    borderRadius: 10,
                    background: tool.done
                      ? "rgba(16, 185, 129, 0.08)"
                      : "rgba(99, 102, 241, 0.12)",
                    border: tool.done
                      ? "1px solid rgba(16, 185, 129, 0.25)"
                      : "1px solid rgba(99, 102, 241, 0.3)",
                    boxShadow: tool.done
                      ? "none"
                      : "0 0 14px rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        color: config.color,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#F8FAFC",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {config.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {tool.name}
                      </div>
                    </div>
                  </div>

                  <div>
                    {tool.done ? (
                      <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                        <CheckCircle2 size={16} color="var(--accent-success)" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Loader2 size={15} color="var(--accent-primary)" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Capabilities Section */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              marginBottom: 10,
            }}
          >
            <Layers size={13} />
            <span>FAST TOOLS CONNECTED</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {REGISTERED_TOOLS.map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>{t.icon}</div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}