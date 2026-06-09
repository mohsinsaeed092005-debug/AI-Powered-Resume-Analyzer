"use client";

import { memo, useState } from "react";
import { Check, Eye, Sparkles, X } from "lucide-react";
import type { TemplateRecommendation } from "@/lib/recommend-template";
import {
  TEMPLATE_DESCRIPTIONS,
  TEMPLATE_LABELS,
} from "@/lib/recommend-template";
import { TEMPLATE_NAMES, type TemplateName } from "@/templates";

interface TemplatePickerProps {
  selected: TemplateName;
  onSelect: (t: TemplateName) => void;
  recommendation: TemplateRecommendation | null;
  autoApplied?: boolean;
}

const SWATCHES: Record<TemplateName, string[]> = {
  "pure-ats": ["#111827", "#2563eb", "#4f46e5", "#dc2626", "#d97706"],
  specialist: ["#0f172a", "#6b7280", "#2563eb", "#dc2626", "#d97706"],
  clean: ["#0f172a", "#2563eb", "#64748b"],
  "simple-ats": ["#3b82f6", "#d8a3b2", "#9ca3af", "#8a9278"],
  corporate: ["#0f172a", "#64748b"],
  clear: ["#4ade80", "#fef08a", "#67e8f9", "#fbbf24", "#e5e7eb"],
  "precision-ats": ["#c4622d", "#6b84c2", "#7b8794", "#6f9f85"],
  "two-column-ats": ["#fb923c", "#65a30d", "#818cf8", "#60a5fa"],
};

function TemplateThumbnail({ template }: { template: TemplateName }) {
  const twoColumn =
    template === "clean" ||
    template === "corporate" ||
    template === "clear" ||
    template === "two-column-ats";
  const accent = SWATCHES[template][1] ?? "#2563eb";
  const warm = template === "precision-ats" || template === "two-column-ats";

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <div
          className="h-3 w-28 rounded-sm"
          style={{ background: warm ? "#c4622d" : "#111827" }}
        />
        <div className="h-1.5 w-16 rounded-sm bg-slate-300" />
      </div>

      <div className={twoColumn ? "mt-5 grid grid-cols-[0.75fr_1.25fr] gap-4" : "mt-5"}>
        {twoColumn && (
          <div className="space-y-3">
            <div className="h-16 rounded-md bg-slate-100" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-1.5 w-10 rounded-sm" style={{ background: accent }} />
                <div className="h-1 w-full rounded-sm bg-slate-200" />
                <div className="h-1 w-4/5 rounded-sm bg-slate-200" />
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4">
          {[0, 1, 2, 3].map((section) => (
            <div key={section} className="space-y-1.5">
              <div
                className="h-1.5 w-20 rounded-sm"
                style={{ background: section === 0 ? accent : "#334155" }}
              />
              <div className="h-1 w-full rounded-sm bg-slate-200" />
              <div className="h-1 w-11/12 rounded-sm bg-slate-200" />
              <div className="h-1 w-2/3 rounded-sm bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {template === "clear" && (
        <div
          className="absolute inset-x-4 top-4 h-12 rounded"
          style={{ background: "rgba(74,222,128,0.35)" }}
        />
      )}
    </div>
  );
}

function TemplatePreviewModal({
  template,
  selected,
  onClose,
  onSelect,
}: {
  template: TemplateName;
  selected: boolean;
  onClose: () => void;
  onSelect: (template: TemplateName) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              {TEMPLATE_LABELS[template]}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {TEMPLATE_DESCRIPTIONS[template]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Close template preview"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-auto max-w-lg rounded-xl bg-slate-100 p-5">
          <TemplateThumbnail template={template} />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(template);
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {selected ? <Check size={16} /> : null}
            Use this template
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplatePicker({
  selected,
  onSelect,
  recommendation,
  autoApplied,
}: TemplatePickerProps) {
  const [preview, setPreview] = useState<TemplateName | null>(null);

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">Select Template</h3>
          <p className="text-xs text-slate-500">
            Preview a professional CV layout, then choose one before generating.
          </p>
        </div>
        {recommendation && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            <Sparkles size={12} />
            AI suggests {TEMPLATE_LABELS[recommendation.recommended]}
          </span>
        )}
      </div>

      {recommendation && autoApplied && selected === recommendation.recommended && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <p className="font-semibold">
            Recommended: {TEMPLATE_LABELS[recommendation.recommended]}
            <span className="ml-2 text-xs font-normal text-violet-600">
              (auto-selected)
            </span>
          </p>
          <ul className="mt-1 list-inside list-disc text-xs text-violet-800">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {TEMPLATE_NAMES.map((template) => {
          const active = selected === template;
          return (
            <button
              key={template}
              type="button"
              onClick={() => setPreview(template)}
              className={`group rounded-xl border bg-slate-50 p-3 text-left transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg ${
                active
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-slate-200"
              }`}
            >
              <div className="relative">
                <TemplateThumbnail template={template} />
                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/25 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">
                    <Eye size={15} />
                    Preview
                  </span>
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="flex gap-1.5">
                    {SWATCHES[template].map((color) => (
                      <span
                        key={color}
                        className="h-3 w-3 rounded-full"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {TEMPLATE_LABELS[template]}
                  </p>
                </div>
                {active && (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={16} />
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-1">
                <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  PDF
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          selected={selected === preview}
          onClose={() => setPreview(null)}
          onSelect={onSelect}
        />
      )}
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
