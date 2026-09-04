// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import FloatingIcon from "../components/landing/FloatingIcon";
import LogoMarquee from "../components/landing/LogoMarquee";
import { FaGithub, FaSlack } from "react-icons/fa";
import { Mail, Calendar } from "lucide-react"; // these stay in lucide-react, no brand-logo issue
const iconPositions = [
  { icon: <FaGithub size={28} />, style: { top: "20%", left: "15%" }, duration: 3.2 },
  { icon: <FaSlack size={28} />, style: { top: "15%", left: "50%" }, duration: 2.8, delay: 0.5 },
  { icon: <Mail size={28} />, style: { top: "60%", left: "12%" }, duration: 3.6, delay: 1 },
  { icon: <Calendar size={28} />, style: { top: "55%", right: "12%" }, duration: 3, delay: 0.3 },
];

export default function LandingPage({ onGetStarted }) {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", padding: "0 24px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>YourAgent</div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          style={{
            background: "var(--accent-primary)",
            color: "#0F1115",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started
        </motion.button>
      </nav>

      <div style={{ position: "relative", textAlign: "center", padding: "100px 0" }}>
        {iconPositions.map((item, i) => (
          <FloatingIcon key={i} icon={item.icon} style={item.style} duration={item.duration} delay={item.delay} />
        ))}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 56, fontWeight: 700, margin: 0, lineHeight: 1.15 }}
        >
          Your agent does it for you
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ color: "var(--text-muted)", fontSize: 18, marginTop: 16 }}
        >
          One chat. Every tool. Real actions.
        </motion.p>
      </div>

      <div style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: 12 }}>
        connects with
      </div>
      <LogoMarquee
        logos={[
          <FaGithub key="gh" size={32} />,
          <FaSlack key="slack" size={32} />,
          <Mail key="gm" size={32} />,
          <Calendar key="cal" size={32} />,
        ]}
      />
    </div>
  );
}