// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import FloatingIcon from "../components/landing/FloatingIcon";
import LogoMarquee from "../components/landing/LogoMarquee";
import ThemeToggle from "../components/ThemeToggle";
import { FaGithub, FaSlack, FaGoogle } from "react-icons/fa";
import { 
  Mail, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  CloudSun, 
  Search, 
  FileText 
} from "lucide-react";

const floatingItems = [
  { 
    icon: <FaGithub size={26} />, 
    label: "GitHub", 
    style: { top: "16%", left: "8%" }, 
    duration: 3.8, 
    delay: 0.1,
    glowColor: "rgba(168, 85, 247, 0.4)" 
  },
  { 
    icon: <FaSlack size={26} />, 
    label: "Slack", 
    style: { top: "18%", right: "8%" }, 
    duration: 3.2, 
    delay: 0.4,
    glowColor: "rgba(236, 72, 153, 0.4)" 
  },
  { 
    icon: <Mail size={26} />, 
    label: "Gmail", 
    style: { top: "62%", left: "10%" }, 
    duration: 4.2, 
    delay: 0.8,
    glowColor: "rgba(239, 68, 68, 0.4)" 
  },
  { 
    icon: <Calendar size={26} />, 
    label: "Calendar", 
    style: { top: "60%", right: "10%" }, 
    duration: 3.5, 
    delay: 0.6,
    glowColor: "rgba(6, 182, 212, 0.4)" 
  },
];

const marqueeIntegrations = [
  { name: "Google Mail", icon: <Mail size={18} />, color: "#EA4335" },
  { name: "GitHub Issues & PRs", icon: <FaGithub size={18} />, color: "#F8FAFC" },
  { name: "Slack Channels", icon: <FaSlack size={18} />, color: "#E01E5A" },
  { name: "Google Calendar", icon: <Calendar size={18} />, color: "#4285F4" },
  { name: "Google Docs", icon: <FileText size={18} />, color: "#34A853" },
  { name: "Live Weather API", icon: <CloudSun size={18} />, color: "#F59E0B" },
  { name: "DuckDuckGo Web Search", icon: <Search size={18} />, color: "#06B6D4" },
  { name: "FastMCP Protocol", icon: <Terminal size={18} />, color: "#A855F7" },
];

const features = [
  {
    icon: <Cpu size={24} color="#6366F1" />,
    title: "Autonomous Execution",
    desc: "Understands intent, queries relevant tools, chains multi-step workflows, and reports structured findings.",
  },
  {
    icon: <ShieldCheck size={24} color="#10B981" />,
    title: "Human-in-the-Loop Safe",
    desc: "Sensitive mutations like sending emails or posting to Slack require your explicit card confirmation before firing.",
  },
  {
    icon: <Sparkles size={24} color="#06B6D4" />,
    title: "Live Streaming & Tool Logs",
    desc: "Watch tool execution in real-time with visual indicators for active network calls and token-by-token streaming.",
  },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Background Glows */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* Top Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 36px",
          background: "var(--bg-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "var(--text-primary)",
            }}
          >
            Nova
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent-success)",
              marginLeft: 12,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-success)",
              }}
            />
            FastMCP Ready
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle showLabel={true} />
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onGetStarted}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--gradient-brand)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(99, 102, 241, 0.35)",
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Main Hero Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1080,
          margin: "0 auto",
          padding: "70px 24px 40px",
          textAlign: "center",
        }}
      >
        {/* Floating Tool Badges */}
        {floatingItems.map((item, i) => (
          <FloatingIcon
            key={i}
            icon={item.icon}
            label={item.label}
            style={item.style}
            duration={item.duration}
            delay={item.delay}
            glowColor={item.glowColor}
          />
        ))}

        {/* Hero Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 30,
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            marginBottom: 24,
            fontSize: 13,
            fontWeight: 600,
            color: "#C7D2FE",
          }}
        >
          <Sparkles size={14} color="#818CF8" />
          <span>The Autonomous Multi-Tool AI Agent</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 6vw, 68px)",
            fontWeight: 800,
            margin: "0 0 20px",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
          }}
        >
          Your agent doesn't just chat.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            It executes for you.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(16px, 2vw, 19px)",
            maxWidth: 680,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Connect your Google Workspace, GitHub, Slack, and live web tools. Nova plans,
          queries APIs, streams reasoning, and drafts actions with human confirmation.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(99, 102, 241, 0.7)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onGetStarted}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--gradient-brand)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              padding: "14px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            <span>Launch Workspace</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Interactive Prompt Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 40,
          }}
        >
          {[
            "📅 What events do I have scheduled today?",
            "🐙 List open issues in my repository",
            "✉️ Check unread emails & summarize",
            "🌤️ What's the weather in San Francisco?",
          ].map((promptText, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, borderColor: "rgba(99, 102, 241, 0.5)" }}
              onClick={onGetStarted}
              style={{
                background: "var(--bg-glass)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 24,
                padding: "8px 16px",
                fontSize: 13,
                color: "var(--text-secondary)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
              }}
            >
              {promptText}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Ecosystem Marquee */}
      <div style={{ marginTop: 20, marginBottom: 50 }}>
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          Connected To Your Modern Stack
        </div>
        <LogoMarquee items={marqueeIntegrations} />
      </div>

      {/* Feature Grid */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto 80px",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
          position: "relative",
          zIndex: 10,
        }}
      >
        {features.map((feat, i) => (
          <motion.div
            key={i}
            className="glass-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            style={{ padding: "30px 24px", textAlign: "left" }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                border: "1px solid var(--border-subtle)",
              }}
            >
              {feat.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 10px",
                color: "var(--text-primary)",
              }}
            >
              {feat.title}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "24px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--text-muted)",
          fontSize: 13,
          background: "var(--bg-glass)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          <span>Nova AI Agent Platform</span>
        </div>
        <div>Built with FastAPI, LangChain & FastMCP</div>
      </footer>
    </div>
  );
}