"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
import type { TemplateRecommendation } from "@/lib/recommend-template";
import {
  TEMPLATE_DESCRIPTIONS,
  TEMPLATE_LABELS,
} from "@/lib/recommend-template";
import type { TemplateName } from "@/templates";

interface TemplatePickerProps {
  selected: TemplateName;
  onSelect: (t: TemplateName) => void;
  recommendation: TemplateRecommendation | null;
  autoApplied?: boolean;
}

const ALL: TemplateName[] = ["minimal", "professional", "modern"];

function TemplatePicker({
  selected,
  onSelect,
  recommendation,
  autoApplied,
}: TemplatePickerProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">Resume Template</h3>
          <p className="text-xs text-slate-500">
            AI picks the best layout for each user — you can override anytime
          </p>
        </div>
        {recommendation && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            <Sparkles size={12} />
            {recommendation.confidence}% match
          </span>
        )}
      </div>

      {recommendation && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <p className="font-semibold">
            Recommended: {TEMPLATE_LABELS[recommendation.recommended]}
            {autoApplied && selected === recommendation.recommended && (
              <span className="ml-2 text-xs font-normal text-violet-600">
                (auto-selected)
              </span>
            )}
          </p>
          <ul className="mt-1 list-inside list-disc text-xs text-violet-800">
            {recommendation.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        {ALL.map((t) => {
          const isRecommended = recommendation?.recommended === t;
          const active = selected === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              className={`rounded-lg border p-3 text-left transition ${
                active
                  ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold capitalize text-slate-900">
                {TEMPLATE_LABELS[t]}
                {isRecommended && (
                  <span className="ml-1 text-xs text-violet-600">★</span>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">{TEMPLATE_DESCRIPTIONS[t]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function recEqual(
  a: TemplateRecommendation | null,
  b: TemplateRecommendation | null
) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.recommended === b.recommended &&
    a.confidence === b.confidence &&
    a.reasons.join() === b.reasons.join()
  );
}

export default memo(
  TemplatePicker,
  (prev, next) =>
    prev.selected === next.selected &&
    prev.autoApplied === next.autoApplied &&
    recEqual(prev.recommendation, next.recommendation)
);
