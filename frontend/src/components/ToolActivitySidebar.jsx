// src/components/ToolActivitySidebar.jsx
import { useState } from "react";
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
  Terminal,
  Cpu
} from "lucide-react";
import { FaGithub, FaSlack } from "react-icons/fa";
import { StatusPill } from "./uiverse/status-pill";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const TOOL_CONFIG = {
  list_github_issues: { label: "GitHub Issues", icon: FaGithub, color: "text-purple-500" },
  get_weather: { label: "Weather API", icon: CloudSun, color: "text-amber-500" },
  list_google_tasks: { label: "Google Tasks", icon: CheckSquare, color: "text-blue-500" },
  list_upcoming_events: { label: "Calendar", icon: Calendar, color: "text-cyan-500" },
  read_google_docs: { label: "Google Docs", icon: FileText, color: "text-emerald-500" },
  list_recent_emails: { label: "Gmail Inbox", icon: Mail, color: "text-red-500" },
  draft_email: { label: "Draft Email", icon: Mail, color: "text-red-500" },
  list_slack_channels: { label: "Slack Channels", icon: FaSlack, color: "text-pink-500" },
  draft_slack_message: { label: "Draft Slack", icon: FaSlack, color: "text-pink-500" },
  web_search: { label: "DuckDuckGo", icon: Search, color: "text-indigo-500" },
};

const REGISTERED_TOOLS = [
  { name: "Google Workspace", desc: "Gmail, Calendar, Docs, Tasks", icon: Mail, tag: "OAuth 2.0" },
  { name: "GitHub Integration", desc: "Issues, Repositories & PRs", icon: FaGithub, tag: "REST API" },
  { name: "Slack Engine", desc: "Channels & Webhooks", icon: FaSlack, tag: "Bot Token" },
  { name: "Weather Service", desc: "OpenMeteo Global Forecast", icon: CloudSun, tag: "Live API" },
  { name: "FastMCP Tools", desc: "Custom Python Tool Protocols", icon: Terminal, tag: "FastMCP" },
];

export default function ToolActivitySidebar({ activeTools = [] }) {
  const [activeTab, setActiveTab] = useState("telemetry");
  const runningCount = activeTools.filter(t => !t.done).length;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-zinc-200/80 bg-zinc-50/70 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-500" />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
            Mission Control
          </span>
        </div>

        {runningCount > 0 ? (
          <StatusPill status="active" label={`${runningCount} running`} />
        ) : (
          <StatusPill status="idle" label="Standby" />
        )}
      </div>

      {/* Tabs navigation */}
      <div className="p-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="telemetry" className="text-xs">
              Live Feed {activeTools.length > 0 && `(${activeTools.length})`}
            </TabsTrigger>
            <TabsTrigger value="registry" className="text-xs">
              Registered
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: Live Telemetry Feed */}
      {activeTab === "telemetry" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {activeTools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 mb-2.5">
                <Terminal className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                No active tool calls
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                Trigger a query in chat to watch tool execution telemetry in real-time.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {activeTools.map((tool) => {
                const conf = TOOL_CONFIG[tool.name] || {
                  label: tool.name,
                  icon: Cpu,
                  color: "text-zinc-500",
                };
                const IconComponent = conf.icon;

                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group relative rounded-xl border border-zinc-200/80 bg-white p-3 text-xs shadow-xs dark:border-zinc-800 dark:bg-zinc-900/80"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-3.5 w-3.5 ${conf.color}`} />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {conf.label}
                        </span>
                      </div>

                      {tool.done ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Running
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-[10.5px] text-zinc-400 dark:text-zinc-500 truncate">
                      call::{tool.name}()
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Tab 2: Registered MCP Tools */}
      {activeTab === "registry" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {REGISTERED_TOOLS.map((reg, i) => {
            const Icon = reg.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-zinc-200/60 bg-white/60 p-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {reg.name}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500">
                      {reg.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                    {reg.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sidebar Footer telemetry */}
      <div className="border-t border-zinc-200/80 p-3 bg-white/40 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Protocol: FastMCP</span>
          <span className="text-emerald-500">Connected</span>
        </div>
      </div>
    </aside>
  );
}
