"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const RESUMES = [
  {
    name: "Sarah Chen",
    role: "Senior Product Manager",
    color: "#1e3a5f",
    accent: "#4f86c6",
    skills: ["Product Strategy", "Agile", "User Research"],
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    color: "#1a3a2a",
    accent: "#4ade80",
    skills: ["React", "Node.js", "Python"],
  },
  {
    name: "Aisha Patel",
    role: "UX/UI Designer",
    color: "#3b1f5e",
    accent: "#a78bfa",
    skills: ["Figma", "User Testing", "Prototyping"],
  },
] as const;

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Resume Analysis",
    desc: "Our AI scans your resume against job requirements, scoring keyword match, readability, and ATS compatibility in seconds.",
  },
  {
    icon: "🎯",
    title: "Job Match Prediction",
    desc: "Predict your chances before applying. Our ML model analyzes 50+ factors to show your fit score for any job posting.",
  },
  {
    icon: "✨",
    title: "Smart Suggestions",
    desc: "Get personalized, role-specific suggestions to strengthen weak areas and highlight your most relevant achievements.",
  },
  {
    icon: "📊",
    title: "Skills Gap Analysis",
    desc: "See exactly which skills you're missing for your dream job, with curated learning paths to bridge the gap fast.",
  },
  {
    icon: "🔍",
    title: "ATS Optimization",
    desc: "Never get filtered out again. We ensure your resume passes Applicant Tracking Systems at 500+ top companies.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "Get your complete analysis report in under 10 seconds with no waiting required to get started.",
  },
] as const;

const STEPS = [
  { num: "01", title: "Build Resume", desc: "Add your details and target role" },
  { num: "02", title: "Run AI Analysis", desc: "Generate resume, ATS score, and gaps" },
  { num: "03", title: "Predict Jobs", desc: "Find roles that match your skills" },
] as const;

const STATS = [
  { value: "94%", label: "ATS Pass Rate" },
  { value: "3.2x", label: "More Interviews" },
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "10s", label: "Analysis Time" },
] as const;

const FOOTER_LINKS = {
  RESUME: ["AI Resume Builder", "ATS Scorer", "Resume Examples", "Resume Templates"],
  "COVER LETTER": ["Cover Letter Examples", "Cover Letter Templates"],
  "JOB SEEKERS": ["Job Search", "Job Interview", "Career"],
  RESOURCES: ["Blog", "Resume Help", "Writing A Resume", "Writing A Cover Letter"],
  "OUR COMPANY": ["About Us", "Pricing", "Updates", "Affiliates"],
  SUPPORT: ["FAQ", "Contact Us", "Terms Of Service", "Privacy"],
} as const;

type Resume = (typeof RESUMES)[number];

function ResumeCard({
  resume,
  style,
  className,
}: {
  resume: Resume;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`resume-card ${className || ""}`}
      style={{
        background: "#0f1629",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: 16,
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.5), 0 4px 16px rgba(99,102,241,0.15)",
        padding: 0,
        overflow: "hidden",
        width: 240,
        minHeight: 320,
        ...style,
      }}
    >
      <div
        style={{
          background: resume.color,
          padding: "20px 20px 16px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
          }}
        >
          {resume.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
          {resume.name}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 11,
            marginTop: 2,
          }}
        >
          {resume.role}
        </div>
      </div>
      <div style={{ padding: "14px 20px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#6366f1",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          SKILLS
        </div>
        {resume.skills.map((skill) => (
          <div
            key={skill}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: resume.accent,
              }}
            />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{skill}</span>
          </div>
        ))}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#6366f1",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            EXPERIENCE
          </div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                background: "rgba(99,102,241,0.15)",
                borderRadius: 4,
                marginBottom: 6,
                width: `${85 - i * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingResumes() {
  return (
    <div className="floating-resumes">
      <style>{`
        @keyframes landing-float0 { 0%,100%{transform:translateY(0px) rotate(-6deg)} 50%{transform:translateY(-18px) rotate(-6deg)} }
        @keyframes landing-float1 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1.05)} 50%{transform:translateY(-14px) rotate(0deg) scale(1.05)} }
        @keyframes landing-float2 { 0%,100%{transform:translateY(0px) rotate(5deg)} 50%{transform:translateY(-22px) rotate(5deg)} }
        @keyframes badge-pulse { 0%,100%{transform:scale(1);box-shadow:0 4px 20px rgba(99,102,241,0.4)} 50%{transform:scale(1.04);box-shadow:0 8px 32px rgba(99,102,241,0.7)} }
      `}</style>
      <div className="resume-float-left">
        <ResumeCard resume={RESUMES[0]} />
      </div>
      <div className="resume-float-center">
        <ResumeCard resume={RESUMES[1]} />
        <div className="ats-badge">
          <span style={{ fontSize: 14 }}>✓</span> ATS Perfect
        </div>
      </div>
      <div className="resume-float-right">
        <ResumeCard resume={RESUMES[2]} />
      </div>
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible] as const;
}

function RevealSection({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        overflowX: "hidden",
        background: "#080d1a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .landing-page * { box-sizing: border-box; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #a78bfa; }
        .btn-primary {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; border: none; border-radius: 10px; padding: 12px 24px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          text-decoration: none; display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5); }
        .btn-secondary {
          background: rgba(99,102,241,0.1); color: #a78bfa;
          border: 1px solid rgba(99,102,241,0.3); border-radius: 10px;
          padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.15s; text-decoration: none; display: inline-block;
        }
        .btn-secondary:hover { background: rgba(99,102,241,0.2); border-color: #6366f1; }
        .feature-card {
          background: #0d1526; border: 1px solid rgba(99,102,241,0.15);
          border-radius: 20px; padding: 32px 28px;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); }
        .stat-card {
          background: #0d1526; border-radius: 20px; padding: 32px 24px;
          text-align: center; border: 1px solid rgba(99,102,241,0.15);
          transition: transform 0.2s, border-color 0.2s;
        }
        .stat-card:hover { transform: scale(1.04); border-color: rgba(99,102,241,0.4); }
        @keyframes hero-appear { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        .hero-text { animation: hero-appear 0.9s ease both; }
        .hero-text-d1 { animation-delay: 0.1s; }
        .hero-text-d2 { animation-delay: 0.25s; }
        .hero-text-d3 { animation-delay: 0.4s; }
        .hero-text-d4 { animation-delay: 0.55s; }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .gradient-text {
          background: linear-gradient(135deg,#6366f1,#a78bfa,#38bdf8);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: gradient-shift 4s ease infinite;
        }
        .upload-zone {
          border: 2px dashed rgba(99,102,241,0.4); border-radius: 16px;
          padding: 48px 32px; text-align: center;
          background: rgba(99,102,241,0.05);
          transition: all 0.2s; cursor: pointer;
        }
        .upload-zone:hover { border-color: #6366f1; background: rgba(99,102,241,0.1); }
        .footer-link { color: #64748b; text-decoration: none; font-size: 14px; display: block; margin-bottom: 10px; transition: color 0.2s; }
        .footer-link:hover { color: #a78bfa; }
        .footer-heading { color: #475569; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
        .social-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; font-size: 14px; cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .social-btn:hover { background: rgba(99,102,241,0.2); border-color: #6366f1; color: #a78bfa; }
        .landing-nav-links { display: flex; align-items: center; gap: 32px; }
        .landing-nav-actions { display: flex; align-items: center; gap: 12px; }
        .floating-resumes { position: relative; width: 100%; height: 480px; display: flex; align-items: center; justify-content: center; }
        .resume-float-left { position: absolute; left: 5%; top: 10%; animation: landing-float0 4.5s ease-in-out infinite; z-index: 1; opacity: 0.8; }
        .resume-float-center { position: relative; animation: landing-float1 5s ease-in-out infinite; z-index: 3; }
        .resume-float-right { position: absolute; right: 5%; bottom: 10%; animation: landing-float2 6s ease-in-out infinite; z-index: 1; opacity: 0.8; }
        .ats-badge {
          position: absolute; top: -18px; right: -22px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; border-radius: 50px; padding: 8px 16px;
          font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;
          animation: badge-pulse 2.5s ease-in-out infinite; white-space: nowrap;
        }
        .how-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; position: relative; }
        .how-line { position: absolute; top: 40px; left: 16%; right: 16%; height: 1px; background: linear-gradient(90deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3)); z-index: 0; }

        @media (max-width: 900px) {
          .landing-nav-links { display: none; }
          .hero-grid { flex-direction: column !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: repeat(2,1fr) !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .how-line { display: none; }
        }
        @media (max-width: 640px) {
          .landing-nav { padding: 0 16px !important; height: 64px !important; }
          .landing-nav-actions .nav-link { display: none; }
          .landing-nav-actions .btn-primary { display: none; }
          .hero-title { font-size: 38px !important; }
          .section-title { font-size: 32px !important; }
          .hero-section { padding-top: 86px !important; min-height: auto !important; padding-bottom: 44px !important; }
          .hero-inner { padding: 0 18px !important; gap: 28px !important; }
          .floating-resumes { height: 360px; transform: scale(0.78); transform-origin: center top; margin-bottom: -72px; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .landing-section { padding-left: 18px !important; padding-right: 18px !important; }
          .resume-float-left, .resume-float-right { opacity: 0.5; }
        }
      `}</style>

      <div className="landing-page">
        <nav
          className="landing-nav"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0 40px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: scrollY > 20 ? "rgba(8,13,26,0.95)" : "transparent",
            backdropFilter: scrollY > 20 ? "blur(16px)" : "none",
            borderBottom:
              scrollY > 20 ? "1px solid rgba(99,102,241,0.15)" : "none",
            transition: "all 0.3s",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🎯
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>
              ResumeAI
            </span>
          </Link>

          <div className="landing-nav-links">
            <a className="nav-link" href="#features">
              Features
            </a>
            <a className="nav-link" href="#how-it-works">
              How It Works
            </a>
            <a className="nav-link" href="#stats">
              Results
            </a>
            <a className="nav-link" href="#start">
              Start
            </a>
          </div>

          <div className="landing-nav-actions">
            <Link className="btn-secondary" href="/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link" href="/profile">
              Sign In
            </Link>
            <Link className="btn-primary" href="/resume">
              Analyze My Resume
            </Link>
          </div>
        </nav>

        <section
          className="hero-section"
          style={{
            minHeight: "100vh",
            paddingTop: 100,
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 60%), #080d1a",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div
            className="hero-grid hero-inner"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 40px",
              display: "flex",
              alignItems: "center",
              gap: 60,
              width: "100%",
              position: "relative",
            }}
          >
            <div style={{ flex: 1, maxWidth: 560 }}>
              <div
                className="hero-text hero-text-d1"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 50,
                  padding: "6px 16px",
                  marginBottom: 24,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#a78bfa",
                }}
              >
                <span>✨</span> AI-Powered Resume Intelligence
              </div>

              <h1
                className="hero-text hero-text-d2 hero-title"
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: 20,
                  color: "#f1f5f9",
                }}
              >
                Get Hired <span className="gradient-text">Faster</span>
                <br />
                with AI Resume
                <br />
                Analysis
              </h1>

              <p
                className="hero-text hero-text-d3"
                style={{
                  fontSize: 18,
                  color: "#64748b",
                  lineHeight: 1.7,
                  marginBottom: 36,
                }}
              >
                Build your resume, get instant AI feedback, ATS score, job match
                prediction, and a personalized action plan in under 10 seconds.
              </p>

              <div
                className="hero-text hero-text-d4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  className="btn-primary"
                  href="/resume"
                  style={{ fontSize: 16, padding: "16px 32px" }}
                >
                  Analyze My Resume Free →
                </Link>
                <Link className="btn-secondary" href="/dashboard">
                  Open Dashboard
                </Link>
              </div>

              <div
                className="hero-text hero-text-d4"
                style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}
              >
                {["Results in 10 seconds", "100% free to start", "ATS optimized"].map(
                  (text) => (
                    <div
                      key={text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#4ade80",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>✓</span> {text}
                    </div>
                  )
                )}
              </div>
            </div>

            <div style={{ flex: 1, maxWidth: 580 }}>
              <FloatingResumes />
            </div>
          </div>
        </section>

        <section
          id="stats"
          className="landing-section"
          style={{
            padding: "80px 40px",
            background: "#080d1a",
            borderTop: "1px solid rgba(99,102,241,0.1)",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <RevealSection>
              <div
                className="stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 24,
                }}
              >
                {STATS.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <div
                      style={{
                        fontSize: 48,
                        fontWeight: 900,
                        background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 14,
                        fontWeight: 500,
                        marginTop: 8,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        <section
          id="how-it-works"
          className="landing-section"
          style={{ padding: "100px 40px", background: "#0a0f1e" }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <RevealSection>
              <p
                style={{
                  color: "#6366f1",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                HOW IT WORKS
              </p>
              <h2
                className="section-title"
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  marginBottom: 16,
                }}
              >
                3 Steps to Your Dream Job
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: 17,
                  maxWidth: 500,
                  margin: "0 auto 60px",
                }}
              >
                From resume building to job prediction, the AI guides each step.
              </p>
            </RevealSection>

            <div className="how-grid">
              <div className="how-line" />
              {STEPS.map((step, i) => (
                <RevealSection key={step.num} delay={i * 150}>
                  <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#fff",
                        boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
                      }}
                    >
                      {step.num}
                    </div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: 15 }}>{step.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="landing-section"
          style={{ padding: "100px 40px", background: "#080d1a" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <RevealSection>
              <div style={{ textAlign: "center", marginBottom: 64 }}>
                <p
                  style={{
                    color: "#6366f1",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  POWERFUL FEATURES
                </p>
                <h2
                  className="section-title"
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: "#f1f5f9",
                    marginBottom: 16,
                  }}
                >
                  Everything You Need to Land the Job
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: 17,
                    maxWidth: 520,
                    margin: "0 auto",
                  }}
                >
                  Our AI does not just score your resume, it gives you a complete
                  roadmap to get hired.
                </p>
              </div>
            </RevealSection>

            <div
              className="features-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {FEATURES.map((feature, i) => (
                <RevealSection key={feature.title} delay={i * 80}>
                  <div className="feature-card">
                    <div style={{ fontSize: 36, marginBottom: 16 }}>
                      {feature.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        marginBottom: 10,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
                      {feature.desc}
                    </p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        <section
          id="start"
          className="landing-section"
          style={{
            padding: "100px 40px",
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%), #0a0f1e",
          }}
        >
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <RevealSection>
              <h2
                className="section-title"
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  marginBottom: 16,
                }}
              >
                Analyze Your Resume Now
              </h2>
              <p style={{ color: "#64748b", fontSize: 17, marginBottom: 40 }}>
                Start with your details and receive an instant AI-powered analysis.
              </p>
              <Link href="/resume" className="upload-zone" style={{ display: "block", textDecoration: "none" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#a78bfa",
                    marginBottom: 8,
                  }}
                >
                  Open the resume builder
                </p>
                <p style={{ color: "#475569", fontSize: 14, marginBottom: 20 }}>
                  Generate resume, ATS score, skill gaps, and interview questions
                </p>
                <span className="btn-primary">Get Started</span>
              </Link>
              <p style={{ color: "#334155", fontSize: 13, marginTop: 20 }}>
                🔒 Your data stays private in your workflow
              </p>
            </RevealSection>
          </div>
        </section>

        <section
          className="landing-section"
          style={{
            padding: "100px 40px",
            textAlign: "center",
            background:
              "linear-gradient(135deg,rgba(99,102,241,0.15) 0%,rgba(139,92,246,0.1) 50%,transparent 100%), #080d1a",
            borderTop: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <RevealSection>
            <h2
              className="section-title"
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#f1f5f9",
                marginBottom: 16,
              }}
            >
              Ready to Get Hired Faster?
            </h2>
            <p style={{ color: "#64748b", fontSize: 18, marginBottom: 40 }}>
              Join job seekers who improved their resume with AI.
            </p>
            <Link
              href="/resume"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                padding: "16px 40px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
              }}
            >
              Analyze My Resume Free →
            </Link>
          </RevealSection>
        </section>

        <footer
          className="landing-section"
          style={{
            background: "#050810",
            borderTop: "1px solid rgba(99,102,241,0.1)",
            padding: "64px 40px 32px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              className="footer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "200px repeat(6,1fr)",
                gap: 32,
                marginBottom: 48,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                    }}
                  >
                    🎯
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                    ResumeAI
                  </span>
                </div>
                <p style={{ color: "#334155", fontSize: 12, lineHeight: 1.6 }}>
                  AI-powered career tools
                </p>
              </div>

              {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                <div key={heading}>
                  <p className="footer-heading">{heading}</p>
                  {links.map((link) => (
                    <a key={link} href="#" className="footer-link">
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 28,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div>
                <p
                  style={{
                    color: "#334155",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  SELECT YOUR COUNTRY
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  <span>🌐</span> International
                </div>
              </div>

              <div>
                <p
                  style={{
                    color: "#334155",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  JOIN US ON SOCIAL MEDIA
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {["💼", "▶", "📌", "📷", "f", "♪"].map((icon, i) => (
                    <a key={i} href="#" className="social-btn">
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ color: "#334155", fontSize: 13 }}>
                Copyright 2026 - ResumeAI
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
