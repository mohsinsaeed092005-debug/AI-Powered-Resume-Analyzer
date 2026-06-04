"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"signin" | "join">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  if (session) {
    return (
      <div className="p-8 text-white">
        <div className="max-w-md rounded-2xl border border-blue-500/15 bg-[#0b1120] p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl">
            {session.user?.name?.[0] ?? "U"}
          </div>
          <h2 className="mb-1 text-xl font-bold">{session.user?.name}</h2>
          <p className="text-sm text-slate-400">{session.user?.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] items-center justify-center bg-[#050912] p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mb-2 inline-flex items-center gap-2 text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-base">
              🧠
            </div>
            ResumeAI
          </div>
          <p className="text-sm text-slate-400">Your AI-powered career companion</p>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-[#0b1120] p-8">
          <div className="mb-7 flex border-b border-blue-500/15">
            {(["signin", "join"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm transition-all ${
                  tab === t
                    ? "-mb-px border-b-2 border-blue-500 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "signin" ? "Sign In" : "Join Free"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-blue-500/20 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-slate-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 12 characters..."
                className="w-full rounded-xl border border-blue-500/20 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {tab === "signin" ? "Sign In to Dashboard" : "Create Free Account"}
            </button>
          </div>

          <div className="relative my-5 text-center text-xs text-slate-600">
            <span className="relative z-10 bg-[#0b1120] px-3">or continue with</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-500/10" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              {
                label: "G",
                bg: "bg-white/5",
                onClick: () => signIn("google", { callbackUrl: "/dashboard" }),
              },
              {
                label: "🍎",
                bg: "bg-white/5",
                onClick: () => signIn("apple", { callbackUrl: "/dashboard" }),
              },
              {
                label: "𝕏",
                bg: "bg-white/5",
                onClick: () => signIn("twitter", { callbackUrl: "/dashboard" }),
              },
              {
                label: "💬",
                bg: "bg-[#5865f2]/15",
                onClick: () => signIn("discord", { callbackUrl: "/dashboard" }),
              },
            ].map(({ label, bg, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={`${bg} rounded-xl border border-white/10 py-3 text-sm transition-colors hover:bg-white/10`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
