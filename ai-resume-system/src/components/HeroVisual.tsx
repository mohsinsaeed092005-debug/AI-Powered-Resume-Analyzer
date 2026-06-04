"use client";

export default function HeroVisual() {
  return (
    <div className="relative h-[440px] w-full">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-4 right-0 z-10 w-56 overflow-hidden rounded-2xl border border-indigo-500/30 bg-[#0d1230] motion-reduce:transform-none md:animate-[float1_4s_ease-in-out_infinite]">
        <div
          className="flex items-center gap-3 p-4"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#2d1b6e)" }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
          >
            AK
          </div>
          <div>
            <div className="text-sm font-medium text-indigo-100">Ahmed Khan</div>
            <div className="text-xs text-indigo-400">Full Stack Developer</div>
          </div>
        </div>
        <div className="p-3.5">
          <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-indigo-500">
            Summary
          </div>
          <div className="mb-2 h-1.5 w-[90%] rounded-full bg-white/8" />
          <div className="mb-3 h-1.5 w-[75%] rounded-full bg-white/8" />
          <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-indigo-500">
            Skills
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {["React", "Node.js", "TypeScript", "MongoDB"].map((s) => (
              <span
                key={s}
                className="rounded border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[9px] text-indigo-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] px-3.5 py-2.5">
          <span className="rounded border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            ATS 87%
          </span>
          <span className="rounded border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-[10px] text-purple-400">
            AI Generated
          </span>
        </div>
      </div>

      <div className="absolute top-10 left-0 z-10 w-36 rounded-xl border border-emerald-500/35 bg-[#0d1230] p-3.5 motion-reduce:transform-none md:animate-[float2_5s_ease-in-out_infinite]">
        <div className="mb-1.5 text-[10px] tracking-wide text-slate-500">ATS SCORE</div>
        <div
          className="text-4xl font-extrabold leading-none text-emerald-400"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          87
        </div>
        <div className="mt-1 text-[10px] text-emerald-400/70">Excellent match</div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full w-[87%] rounded-full"
            style={{ background: "linear-gradient(90deg,#34d399,#059669)" }}
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-2 z-10 w-44 rounded-xl border border-purple-500/30 bg-[#0d1230] p-3 motion-reduce:transform-none md:animate-[float3_3.5s_ease-in-out_infinite]">
        <div className="mb-2.5 text-[10px] tracking-wide text-slate-500">TOP JOB MATCHES</div>
        {[
          { role: "Frontend Dev", pct: 94 },
          { role: "Full Stack Dev", pct: 88 },
          { role: "React Engineer", pct: 79 },
        ].map(({ role, pct }) => (
          <div key={role} className="mb-2">
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-indigo-100">{role}</span>
              <span className="font-semibold text-indigo-400">{pct}%</span>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-1 bottom-5 z-10 flex w-40 items-center gap-2.5 rounded-xl border border-indigo-500/25 bg-[#0d1230] p-3 motion-reduce:transform-none md:animate-[float4_4.5s_ease-in-out_infinite]">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        >
          🤖
        </div>
        <div>
          <div className="text-[11px] leading-tight text-indigo-200">
            Resume optimized for ATS
          </div>
          <div className="mt-1 text-[9px] font-semibold tracking-wide text-indigo-500">
            SMART AI POWERED
          </div>
        </div>
      </div>
    </div>
  );
}
