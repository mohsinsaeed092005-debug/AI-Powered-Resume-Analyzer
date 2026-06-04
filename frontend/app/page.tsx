"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RolePrediction = {
  role: string;
  matchScore: number;
};

export default function DashboardPage() {
  const [atsScore, setAtsScore] = useState(0);
  const [predictions, setPredictions] = useState<RolePrediction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-resume-state");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (typeof data.atsScore === "number") setAtsScore(data.atsScore);
        if (Array.isArray(data.predictions)) setPredictions(data.predictions);
      } catch {
        // ignore invalid saved state
      }
    }
  }, []);

  const quickActions = [
    {
      href: "/resume-analyzer",
      icon: "✍️",
      label: "Build Resume",
      desc: "Create or update your AI resume",
      color: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/30",
    },
    {
      href: "/resume-analyzer",
      icon: "🎯",
      label: "Predict Jobs",
      desc: "See your top matching roles",
      color: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/30",
    },
    {
      href: "/resume-analyzer",
      icon: "📊",
      label: "ATS Score",
      desc: "Check resume compatibility",
      color: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-2xl font-semibold text-white">
              <span className="rounded-2xl bg-blue-500/20 px-3 py-1 text-blue-300">🧠</span>
              ResumeAI
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Your AI resume dashboard with ATS score, job predictions, and builder access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/resume-analyzer"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 transition hover:border-blue-500 hover:text-blue-300"
            >
              Resume Builder
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
        <div className="rounded-[2rem] border border-slate-800 bg-[#090b14] p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.9)] sm:p-10">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Your job search command center for resume optimization, ATS scoring, and role predictions.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
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
                className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {label}
                </div>
                <div className={`mt-3 text-3xl font-bold ${color}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                <p className="text-sm text-slate-400">
                  Jump to the tools you need most.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map(({ href, icon, label, desc, color, border }) => (
                <Link
                  key={label}
                  href={href}
                  className={`rounded-3xl border bg-gradient-to-br ${color} ${border} p-6 transition hover:-translate-y-0.5`}
                >
                  <div className="mb-4 text-3xl">{icon}</div>
                  <div className="text-lg font-semibold text-white">{label}</div>
                  <p className="mt-2 text-sm text-slate-300">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-10 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-8 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ready to get started?</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Build your first AI resume to see your ATS score and job predictions here.
              </h3>
              <p className="mt-3 text-sm text-slate-400">
                Access your resume builder, optimize for ATS, and discover the roles that fit your profile.
              </p>
            </div>
            <div className="flex items-center justify-start sm:justify-end">
              <Link
                href="/resume-analyzer"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90"
              >
                Build My Resume →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
