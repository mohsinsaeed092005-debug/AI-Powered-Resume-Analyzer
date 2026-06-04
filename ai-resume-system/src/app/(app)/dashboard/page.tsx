"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RolePrediction } from "@/types";

export default function DashboardPage() {
  const [atsScore, setAtsScore] = useState(0);
  const [predictions, setPredictions] = useState<RolePrediction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-resume-state");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.atsScore) setAtsScore(data.atsScore);
        if (data.predictions) setPredictions(data.predictions);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const quickActions = [
    {
      href: "/resume",
      icon: "✍️",
      label: "Build Resume",
      desc: "Create or update your AI resume",
      color: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/30",
    },
    {
      href: "/job-predictor",
      icon: "🎯",
      label: "Predict Jobs",
      desc: "See your top matching roles",
      color: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/30",
    },
    {
      href: "/resume",
      icon: "📊",
      label: "ATS Score",
      desc: "Check resume compatibility",
      color: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/30",
    },
  ];

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1
          className="mb-1 text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-slate-400">Your job search command center</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "ATS Score",
            value: atsScore ? `${atsScore}%` : "—",
            color: "text-blue-400",
          },
          {
            label: "Top Match",
            value: predictions[0] ? `${predictions[0].matchScore}%` : "—",
            color: "text-emerald-400",
          },
          {
            label: "Predictions",
            value: predictions.length || "—",
            color: "text-violet-400",
          },
          {
            label: "Skills Gap",
            value: "Run ATS",
            color: "text-orange-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-blue-500/15 bg-[#0b1120] p-5"
          >
            <div className="mb-2 text-xs tracking-widest text-slate-500 uppercase">
              {label}
            </div>
            <div
              className={`text-2xl font-extrabold ${color}`}
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-sm font-medium tracking-widest text-slate-400 uppercase">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map(({ href, icon, label, desc, color, border }) => (
            <Link
              key={label}
              href={href}
              className={`rounded-2xl border bg-gradient-to-br ${color} ${border} p-6 transition-transform hover:scale-[1.02]`}
            >
              <div className="mb-3 text-2xl">{icon}</div>
              <div
                className="mb-1 font-semibold"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {label}
              </div>
              <div className="text-sm text-slate-400">{desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {atsScore > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-500/15 bg-[#0b1120] p-6">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-slate-400">ATS Compatibility Score</span>
            <span className="font-semibold text-blue-400">{atsScore} / 100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600 transition-all duration-1000"
              style={{ width: `${atsScore}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {atsScore >= 80
              ? "✅ Excellent — your resume is highly ATS compatible."
              : atsScore >= 60
                ? "⚠️ Good — a few improvements can boost your score."
                : "❌ Needs work — optimize your resume for better results."}
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="rounded-2xl border border-blue-500/15 bg-[#0b1120] p-6">
          <h2 className="mb-4 text-sm font-medium tracking-widest text-slate-400 uppercase">
            Top Predicted Roles
          </h2>
          <div className="flex flex-col gap-3">
            {predictions.slice(0, 5).map((p) => (
              <div key={p.role} className="flex items-center justify-between">
                <span className="text-sm text-white">{p.role}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                      style={{ width: `${p.matchScore}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-slate-400">
                    {p.matchScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!atsScore && predictions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-blue-500/20 bg-[#0b1120] p-12 text-center">
          <div className="mb-4 text-4xl">🚀</div>
          <h3
            className="mb-2 text-lg font-semibold"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Ready to get started?
          </h3>
          <p className="mb-6 text-sm text-slate-400">
            Build your first AI resume to see your ATS score and job predictions
            here.
          </p>
          <Link
            href="/resume"
            className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Build My Resume →
          </Link>
        </div>
      )}
    </div>
  );
}
