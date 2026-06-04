"use client";

import { memo } from "react";
import type { RolePrediction } from "@/types";

interface JobPredictionCardsProps {
  predictions: RolePrediction[];
}

function JobPredictionCards({ predictions }: JobPredictionCardsProps) {
  if (!predictions.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Add skills and run job prediction to see matches.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {predictions.map((pred) => (
        <article
          key={pred.role}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-slate-900">{pred.role}</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {pred.matchScore}%
            </span>
          </div>
          {pred.matchedSkills.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Matched: {pred.matchedSkills.join(", ")}
            </p>
          )}
          {pred.missingSkills.length > 0 && (
            <p className="mt-1 text-xs text-amber-600">
              Missing: {pred.missingSkills.join(", ")}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

export default memo(JobPredictionCards);
