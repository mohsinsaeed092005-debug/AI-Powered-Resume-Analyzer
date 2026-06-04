"use client";

import { memo } from "react";
import type { SkillGapResult } from "@/types";

interface SkillGapCardProps {
  gap: SkillGapResult | null;
}

function SkillGapCard({ gap }: SkillGapCardProps) {
  if (!gap) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-slate-900">Skill Gap Analysis</h3>
        <p className="mt-2 text-sm text-slate-500">Run analysis to see missing skills.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-bold text-slate-900">Skill Gap Analysis</h3>
      <div className="mt-4 grid gap-3 text-sm">
        <div>
          <p className="font-medium text-slate-600">Required</p>
          <p className="mt-1 text-slate-800">{gap.required.join(", ") || "-"}</p>
        </div>
        <div>
          <p className="font-medium text-emerald-600">You Have</p>
          <p className="mt-1 text-slate-800">{gap.userHas.join(", ") || "-"}</p>
        </div>
        <div>
          <p className="font-medium text-amber-600">Missing</p>
          <p className="mt-1 text-slate-800">{gap.missing.join(", ") || "None"}</p>
        </div>
      </div>
    </div>
  );
}

function gapEqual(a: SkillGapResult | null, b: SkillGapResult | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.required.join() === b.required.join() &&
    a.userHas.join() === b.userHas.join() &&
    a.missing.join() === b.missing.join()
  );
}

export default memo(SkillGapCard, (prev, next) => gapEqual(prev.gap, next.gap));
