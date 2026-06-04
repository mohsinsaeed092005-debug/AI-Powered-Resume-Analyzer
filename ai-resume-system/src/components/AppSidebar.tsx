"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/resume", icon: "📄", label: "Resume Builder" },
  { href: "/job-predictor", icon: "💼", label: "Job Predictor" },
  { href: "/profile", icon: "👤", label: "Profile" },
] as const;

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed z-20 flex h-full w-56 flex-col border-r border-blue-500/15 bg-[#080e1e]">
      <div className="border-b border-blue-500/15 px-5 py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm">
            🧠
          </div>
          ResumeAI
        </Link>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                active
                  ? "border-r-2 border-blue-500 bg-blue-500/10 font-medium text-blue-400"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-blue-500/15 p-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-slate-400">
          <div className="mb-1 font-medium text-blue-400">🚀 Pro Tip</div>
          Add a job description to boost your ATS score.
        </div>
      </div>
    </aside>
  );
}
