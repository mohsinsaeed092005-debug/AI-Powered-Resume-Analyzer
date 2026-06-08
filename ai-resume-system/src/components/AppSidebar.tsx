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
    <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-blue-500/15 bg-[#080e1e]/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:h-full lg:w-56 lg:flex-col lg:border-r lg:border-t-0 lg:bg-[#080e1e]">
      <div className="hidden border-b border-blue-500/15 px-5 py-5 lg:block">
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
      <nav className="grid grid-cols-4 gap-1 px-2 py-2 lg:block lg:flex-1 lg:px-0 lg:py-4">
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] transition-all sm:text-xs lg:flex-row lg:gap-3 lg:rounded-none lg:px-5 lg:py-3 lg:text-sm ${
                active
                  ? "bg-blue-500/10 font-medium text-blue-400 lg:border-r-2 lg:border-blue-500"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-blue-500/15 p-4 lg:block">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-slate-400">
          <div className="mb-1 font-medium text-blue-400">🚀 Pro Tip</div>
          Add a job description to boost your ATS score.
        </div>
      </div>
    </aside>
  );
}
