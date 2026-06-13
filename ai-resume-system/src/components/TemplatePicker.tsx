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
  "pure-ats": ["#2f3033", "#e5e7eb", "#0ea5e9", "#111827"],
  specialist: ["#0d0d0c", "#c9a227", "#f5f5f4", "#3f3f46"],
  clean: ["#07111f", "#00b7ff", "#1e3a5f", "#e2e8f0"],
  "simple-ats": ["#5b5ca8", "#b76bc0", "#ffffff", "#1f2937"],
  corporate: ["#16351e", "#f3f0e6", "#6aa84f", "#111827"],
  clear: ["#1d1916", "#c98331", "#f5f5f4", "#57534e"],
  "precision-ats": ["#fffdf6", "#c45b1d", "#222222", "#e7e0d1"],
  "two-column-ats": ["#0f1a2e", "#3b82f6", "#f8fafc", "#93c5fd"],
};

function TemplateThumbnail({ template }: { template: TemplateName }) {
  const accent = SWATCHES[template][1];

  if (template === "pure-ats") {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#e7e7e7] shadow-sm">
        <div className="absolute inset-y-0 left-0 w-[34%] bg-[#303236] p-3">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border-2 border-white bg-gradient-to-br from-slate-300 to-slate-500" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-1.5">
              <div className="h-1.5 w-14 bg-white/80" />
              <div className="h-1 w-full bg-sky-400" />
              <div className="h-1 w-4/5 bg-white/35" />
              <div className="h-1 w-3/5 bg-white/35" />
            </div>
          ))}
        </div>
        <div className="ml-[34%] p-4">
          <div className="mb-1 h-4 w-24 bg-slate-950" />
          <div className="mb-4 h-2 w-20 bg-sky-500" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-1.5">
              <div className="h-1.5 w-20 bg-slate-800" />
              <div className="h-1 w-full bg-slate-300" />
              <div className="h-1 w-5/6 bg-slate-300" />
              <div className="h-1 w-2/3 bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template === "specialist" || template === "clean" || template === "clear") {
    const dark = template === "clean" ? "#07111f" : template === "clear" ? "#1d1916" : "#0d0d0c";
    const side = template === "clean";
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-sm" style={{ background: dark }}>
        <div className="border-b border-white/10 p-4">
          <div className="mb-2 h-5 w-32 bg-white/90" />
          <div className="h-1.5 w-24" style={{ background: accent }} />
          <div className="mt-3 flex gap-3">
            <div className="h-1 w-16 bg-white/45" />
            <div className="h-1 w-14 bg-white/45" />
            <div className="h-1 w-12 bg-white/45" />
          </div>
        </div>
        <div className={side ? "grid grid-cols-[0.75fr_1.25fr]" : "grid grid-cols-[1.2fr_0.8fr]"}>
          <div className="space-y-3 border-r border-white/10 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-1.5 w-20" style={{ background: accent }} />
                <div className="h-1 w-full bg-white/30" />
                <div className="h-1 w-4/5 bg-white/30" />
              </div>
            ))}
          </div>
          <div className="space-y-4 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-1.5 w-24 bg-white/80" />
                <div className="h-1 w-full bg-white/25" />
                <div className="h-1 w-5/6 bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "simple-ats" || template === "corporate") {
    const header =
      template === "simple-ats"
        ? "linear-gradient(135deg,#5b5ca8,#c06bbd)"
        : "#17391f";
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="p-4 text-white" style={{ background: header }}>
          <div className="mb-2 h-8 w-8 rounded-full border border-white/60 bg-white/20" />
          <div className="h-4 w-28 bg-white/90" />
          <div className="mt-2 h-1.5 w-24 bg-white/55" />
        </div>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 p-4">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-1.5 w-20 bg-slate-900" />
                <div className="h-1 w-full bg-slate-300" />
                <div className="h-1 w-4/5 bg-slate-300" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-1.5 w-16" style={{ background: accent }} />
                <div className="h-1 w-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#fffdf6] p-4 shadow-sm">
      {template === "two-column-ats" && (
        <div className="absolute inset-y-0 left-0 w-[38%] bg-[#0f1a2e] p-4">
          <div className="mb-4 h-10 w-10 rounded-full border border-blue-300 bg-blue-500/30" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-1">
              <div className="h-1.5 w-16 bg-blue-300" />
              <div className="h-1 w-full bg-white/35" />
              <div className="h-1 w-4/5 bg-white/35" />
            </div>
          ))}
        </div>
      )}
      <div className={template === "two-column-ats" ? "ml-[42%]" : ""}>
        <div className="mb-4">
          <div className="mb-2 h-5 w-28 bg-[#222]" />
          <div className="h-1.5 w-20" style={{ background: accent }} />
        </div>
        {[0, 1, 2, 3].map((section) => (
          <div key={section} className="mb-4 space-y-1.5">
            <div className="h-1.5 w-20 bg-slate-800" />
            <div className="h-1 w-full bg-slate-300" />
            <div className="h-1 w-11/12 bg-slate-300" />
            <div className="h-1 w-2/3 bg-slate-300" />
          </div>
        ))}
      </div>
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
