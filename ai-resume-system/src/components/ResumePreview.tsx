"use client";

import { memo } from "react";

interface ResumePreviewProps {
  content: string;
  title?: string;
  source?: "ai" | "fallback" | null;
}

function ResumePreview({
  content,
  title = "Resume Preview",
  source,
}: ResumePreviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {source === "ai" && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            AI Generated
          </span>
        )}
        {source === "fallback" && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Basic Template
          </span>
        )}
      </div>
      <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap p-6 font-mono text-sm leading-7 text-slate-800">
        {content || "Fill the form and click Generate Resume to create your AI resume."}
      </pre>
    </div>
  );
}

export default memo(ResumePreview);
