// src/pages/LandingPage.jsx
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Lock, 
  CheckCircle2, 
  Mail, 
  Calendar, 
  Sparkles,
  Command,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { FaGithub, FaSlack } from "react-icons/fa";

const INTEGRATIONS = [
  { name: "Google Mail", icon: Mail, tag: "Gmail API", desc: "Triage inbox, search threads, draft responses" },
  { name: "GitHub", icon: FaGithub, tag: "Git API", desc: "List issues, check PRs, review code changes" },
  { name: "Slack", icon: FaSlack, tag: "Bot Token", desc: "Team notices, alerts, human notifications" },
  { name: "Google Calendar", icon: Calendar, tag: "Calendar API", desc: "Inspect schedule, coordinate meetings" },
  { name: "FastMCP Protocol", icon: Terminal, tag: "MCP Standard", desc: "Plug any local Python or system CLI tools" },
  { name: "Safe Guardrails", icon: ShieldCheck, tag: "Approval Loop", desc: "Review and approve sensitive actions before execution" },
];

const PROMPT_SUGGESTIONS = [
  "What events do I have scheduled on my calendar today?",
  "List open issues in my repository",
  "Check my unread emails and draft a summary",
  "Query the weather forecast for San Francisco",
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
              <Command className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Nova Agent</span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-normal text-zinc-600 dark:text-zinc-400">
              v2.0
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetStarted}
              className="text-xs"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={onGetStarted}
              className="text-xs gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 mb-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>FastMCP & Multi-Tool Autonomous Runtime</span>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
        </div>

        {/* Clean, Editorial Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-3xl mx-auto leading-[1.15]">
          Stop chatting with AI.
          <br />
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Start executing with it.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Connect your Google Workspace, GitHub, Slack, and live web tools. Nova executes multi-step workflows with real-time logs and human-in-the-loop safeguards.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="gap-2 text-sm shadow-xs"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onGetStarted}
            className="text-sm gap-1.5"
          >
            <span>Live Preview</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </Button>
        </div>

        {/* Quick Example Prompts */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-zinc-100 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-zinc-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Clean UI Interactive Mockup / Telemetry Card */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 overflow-hidden">
          {/* Mockup Window Titlebar */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 font-mono">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </span>
              <span className="ml-2 text-zinc-400">nova-session // execution-engine</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Telemetry Live</span>
            </div>
          </div>

          {/* Mockup Content */}
          <div className="p-6 space-y-4 font-sans text-xs">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="rounded-lg bg-zinc-900 text-zinc-50 px-3.5 py-2 max-w-md dark:bg-zinc-100 dark:text-zinc-900 font-medium">
                Check my unread emails, pull high-priority tasks, and prepare a Slack update for the engineering channel.
              </div>
            </div>

            {/* Agent Tool Execution Stream */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800 font-mono text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Tool Execution Plan</span>
                <span>Latency: 380ms</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>gmail.list_recent_emails() → 2 urgent client briefs found</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>github.list_issues() → 1 PR awaiting approval</span>
                </div>
              </div>
            </div>

            {/* Human Confirmation Guardrail */}
            <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Draft Slack message awaiting your confirmation
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Target: #engineering-sync • Human-in-the-loop validation
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  onClick={onGetStarted}
                  className="h-8 text-xs cursor-pointer"
                >
                  Authorize & Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Grid Features */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <Badge variant="outline" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Engineered for high-trust agentic autonomy
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            A production-ready stack designed around safety boundaries, verified tool execution, and clear observability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Autonomous Tool Loops
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Decomposes complex requests into deterministic steps, handling dependencies across local and remote APIs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Human-in-the-Loop Safe
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Irreversible actions like sending emails or making edits require explicit approval cards before firing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <Terminal className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Real-Time Telemetry
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Live inspection of arguments, latency, and status for every tool call directly in the mission sidebar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                OAuth 2.0 Security
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Scoped authentication tokens stored securely, avoiding blanket system access and credential leaks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <Command className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                FastMCP Standard
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Compatible with Model Context Protocol standards. Expose any local Python function as a tool.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 mb-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                FastAPI & LangChain
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Clean modern backend with streaming responses, clear event handling, and deterministic tool schemas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Clean Integrations Section */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Supported Integrations
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Tools and services pre-configured and ready to invoke
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {INTEGRATIONS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-medium text-xs text-zinc-900 dark:text-zinc-100">{tool.name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{tool.tag}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-16 dark:border-zinc-800 dark:bg-zinc-900/40 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Ready to test autonomous execution?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Open the workspace, connect your accounts, and let Nova handle multi-tool requests.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gap-2 text-sm shadow-xs cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Nova AI Agent</span>
            <span>•</span>
            <span>FastAPI, LangChain & FastMCP</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
