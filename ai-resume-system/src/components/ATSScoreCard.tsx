"use client";

import { memo } from "react";

interface ATSScoreCardProps {
  score: number;
  label?: string;
}

function ATSScoreCard({ score, label = "ATS Match Score" }: ATSScoreCardProps) {
  const color =
    score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-5xl font-bold ${color}`}>{score}%</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default memo(ATSScoreCard);
