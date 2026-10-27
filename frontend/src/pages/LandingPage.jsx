// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import LogoMarquee from "../components/landing/LogoMarquee";
import { FaGithub, FaSlack } from "react-icons/fa";
import { 
  Mail, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CloudSun, 
  Search, 
  FileText, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight, 
  ChevronRight,
  GitBranch 
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DotPattern } from "../components/magicui/dot-pattern";
import { BorderBeam } from "../components/magicui/border-beam";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { AnimatedGradientText } from "../components/magicui/animated-gradient-text";
import { BentoGrid, BentoCard } from "../components/magicui/bento-grid";
import { UiverseOptionButton } from "../components/uiverse/uiverse-button";
import { StatusPill } from "../components/uiverse/status-pill";

const marqueeIntegrations = [
  { 
    name: "Google Mail", 
    username: "@gmail", 
    body: "Triage inbox, search thread histories, and safely draft email responses.", 
    icon: <Mail size={16} />, 
    color: "#EA4335" 
  },
  { 
    name: "GitHub Issues & PRs", 
    username: "@github", 
    body: "Review diffs, query repository issues, inspect commits, and track releases.", 
    icon: <FaGithub size={16} />, 
    color: "#8B5CF6" 
  },
  { 
    name: "Slack Channels", 
    username: "@slack", 
    body: "Broadcast live team notices, dispatch alerts, and confirm message drafts.", 
    icon: <FaSlack size={16} />, 
    color: "#EC4899" 
  },
  { 
    name: "Google Calendar", 
    username: "@calendar", 
    body: "Inspect availability, avoid conflicting invites, and schedule calendar meetings.", 
    icon: <Calendar size={16} />, 
    color: "#06B6D4" 
  },
  { 
    name: "Google Docs", 
    username: "@docs", 
    body: "Read unstructured briefs, draft specs, and organize documentation cleanly.", 
    icon: <FileText size={16} />, 
    color: "#10B981" 
  },
  { 
    name: "OpenMeteo Forecast", 
    username: "@weather", 
    body: "Global real-time meteorological forecasts, wind velocity, and hourly alerts.", 
    icon: <CloudSun size={16} />, 
    color: "#F59E0B" 
  },
  { 
    name: "FastMCP Engine", 
    username: "@fastmcp", 
    body: "Standardized Model Context Protocol exposing local python CLI tools to agents.", 
    icon: <Terminal size={16} />, 
    color: "#6366F1" 
  },
  { 
    name: "DuckDuckGo Web Search", 
    username: "@ddg", 
    body: "Privacy-first live web search with citations and up-to-the-minute web retrieval.", 
    icon: <Search size={16} />, 
    color: "#3B82F6" 
  },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="relative min-h-screen bg-white text-zinc-950 dark:bg-[#090A0F] dark:text-zinc-50 overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Architectural Patterns */}
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_85%)] opacity-60 dark:opacity-40" />

      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-[#090A0F]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Nova
              </span>
              <StatusPill status="active" label="FastMCP Online" className="hidden sm:inline-flex text-[10px]" />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={onGetStarted}
              className="cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 md:pt-24 text-center">
        {/* Magic UI Animated Gradient Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex"
        >
          <AnimatedGradientText>
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 mr-2" />
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Introducing Nova Autonomous Agent 2.0
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 ml-1" />
          </AnimatedGradientText>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08] mb-6"
        >
          Stop chatting with AI.
          <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Start executing with it.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10"
        >
          Connect your Google Workspace, GitHub, Slack, and live web tools. Nova reasons across multi-step workflows, streams telemetry in real-time, and safeguards actions with human confirmation.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <ShimmerButton
            onClick={onGetStarted}
            borderRadius="14px"
            className="px-8 py-3.5 text-sm font-semibold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span>Launch Autonomous Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </ShimmerButton>

          <Button
            variant="outline"
            size="lg"
            onClick={onGetStarted}
            className="rounded-xl cursor-pointer"
          >
            <span>Live Agent Demo</span>
            <ArrowUpRight className="h-4 w-4 text-zinc-400" />
          </Button>
        </motion.div>

        {/* UIverse Tactile Prompt Options */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto"
        >
          {[
            { text: "What events do I have scheduled today?", icon: Calendar },
            { text: "List open issues in my repository", icon: GitBranch },
            { text: "Check unread emails & summarize", icon: Mail },
            { text: "What's the weather in San Francisco?", icon: CloudSun },
          ].map((item, i) => (
            <UiverseOptionButton
              key={i}
              icon={item.icon}
              onClick={onGetStarted}
            >
              {item.text}
            </UiverseOptionButton>
          ))}
        </motion.div>
      </section>

      {/* Interactive Hero Showcase / Mission Control Preview with BorderBeam */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-[#10131E]/90 dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <BorderBeam size={260} duration={14} colorFrom="#6366F1" colorTo="#06B6D4" />

          {/* Window Frame Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                nova-workspace — agent-session::active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill status="active" label="Telemetry Live" />
            </div>
          </div>

          {/* Simulated Workspace Flow */}
          <div className="p-6 md:p-8 space-y-4 text-left">
            {/* User message */}
            <div className="flex items-start justify-end gap-3">
              <div className="rounded-2xl rounded-tr-xs bg-zinc-900 dark:bg-indigo-600 text-white px-4 py-2.5 text-xs max-w-md shadow-sm">
                Check my unread emails, pull high-priority tasks, and prepare a Slack update for the engineering channel.
              </div>
            </div>

            {/* Simulated Tool execution stream */}
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 space-y-3 max-w-xl">
                <div className="rounded-2xl rounded-tl-xs border border-zinc-200/80 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <span className="text-indigo-500 font-semibold">Chaining 3 MCP Tools</span>
                    <span>Elapsed: 420ms</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>gmail.list_recent_emails() → Found 2 urgent client briefs</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>github.list_issues() → 1 PR awaiting approval</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Human-in-the-Loop Safe Card */}
                <div className="rounded-xl border border-amber-300/80 bg-amber-50/50 p-3.5 dark:border-amber-500/30 dark:bg-amber-950/20 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-[11px]">
                        Draft Slack Message awaiting your approval
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Target: #engineering-sync • Channel Mutation
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onGetStarted}
                    className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                  >
                    Authorize & Run
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ecosystem Infinite Marquee */}
      <section className="relative z-10 py-12 border-y border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 text-center mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
            Universal Tool Interoperability
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Plugs directly into your daily workflow stack
          </h2>
        </div>

        <LogoMarquee items={marqueeIntegrations} />
      </section>

      {/* Magic UI BentoGrid Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="indigo" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            Engineered for high-trust agentic autonomy
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Unlike simple prompt wrappers, Nova executes as an autonomous runtime with multi-step reasoning loops and hardware-level safety checks.
          </p>
        </div>

        <BentoGrid>
          <BentoCard
            name="Autonomous Tool Orchestration"
            className="md:col-span-2"
            Icon={Cpu}
            description="Nova understands intent, breaks down compound goals, and autonomously schedules sequential or parallel tool calls via FastMCP protocol."
            badge="Reasoning Loop"
            cta="Explore FastMCP integration"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent" />
            }
          />

          <BentoCard
            name="Human-in-the-Loop Safe"
            className="md:col-span-1"
            Icon={ShieldCheck}
            description="Sensitive operations like sending emails or pushing commits require your explicit one-click confirmation card before firing."
            badge="Zero Accidental Mutations"
            cta="View Guardrail Specs"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
            }
          />

          <BentoCard
            name="Real-Time Telemetry & Logs"
            className="md:col-span-1"
            Icon={Terminal}
            description="Watch every tool invocation with live latency metrics, argument diffs, and token-by-token streaming response."
            badge="Mission Control"
            cta="Inspect Live Logs"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
            }
          />

          <BentoCard
            name="OAuth 2.0 Security Boundary"
            className="md:col-span-2"
            Icon={Lock}
            description="Seamless Google Workspace and GitHub OAuth authentication with granular per-session tokens and end-to-end token encryption."
            badge="Enterprise Ready"
            cta="Review Security Architecture"
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
            }
          />
        </BentoGrid>
      </section>

      {/* Community Testimonials Marquee */}
      <section className="relative z-10 py-16 border-t border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-4xl px-4 text-center mb-8">
          <Badge variant="outline" className="mb-2">
            Developer Loved
          </Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Trusted by teams automating daily workflows
          </h2>
        </div>

        <LogoMarquee />
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50 p-8 sm:p-12 shadow-xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <BorderBeam size={220} duration={10} colorFrom="#6366F1" colorTo="#A855F7" />
          
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Ready to upgrade your workflow?
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-8">
            Experience the next era of autonomous AI agents. Connect tools, test prompts, and supervise executions with complete confidence.
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="cursor-pointer"
          >
            <span>Launch Nova Workspace Now</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white/70 py-8 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#090A0F]/80">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Nova AI Agent Workspace</span>
            <span>—</span>
            <span>FastAPI, LangChain & FastMCP</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
            <span>•</span>
            <span>Apache 2.0 License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
