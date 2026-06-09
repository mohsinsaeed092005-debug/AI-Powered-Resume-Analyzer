"use client";

import { memo, useMemo } from "react";
import { TEMPLATE_LABELS } from "@/lib/recommend-template";
import { DEFAULT_TEMPLATE, type TemplateName } from "@/templates";

interface ResumePreviewProps {
  content: string;
  title?: string;
  source?: "ai" | "fallback" | null;
  template?: TemplateName;
}

const SECTION_HEADERS = [
  "PROFESSIONAL SUMMARY",
  "PROFILE",
  "CORE SKILLS",
  "CORE COMPETENCIES",
  "TECHNICAL SKILLS",
  "PROFESSIONAL EXPERIENCE",
  "WORK EXPERIENCE",
  "EXPERIENCE",
  "KEY PROJECTS",
  "PROJECTS",
  "EDUCATION",
  "CERTIFICATIONS",
  "SKILLS",
];

const THEME: Record<
  TemplateName,
  { accent: string; soft: string; heading: string; sidebar?: boolean; warm?: boolean }
> = {
  "pure-ats": { accent: "#111827", soft: "#f8fafc", heading: "#111827" },
  specialist: { accent: "#2563eb", soft: "#eff6ff", heading: "#111827" },
  clean: { accent: "#111827", soft: "#f8fafc", heading: "#111827", sidebar: true },
  "simple-ats": { accent: "#3b82f6", soft: "#eff6ff", heading: "#2563eb" },
  corporate: { accent: "#111827", soft: "#f8fafc", heading: "#111827", sidebar: true },
  clear: { accent: "#34d399", soft: "#ecfdf5", heading: "#111827", sidebar: true },
  "precision-ats": { accent: "#c4622d", soft: "#fff7ed", heading: "#c4622d", warm: true },
  "two-column-ats": { accent: "#fb923c", soft: "#fff7ed", heading: "#c4622d", sidebar: true, warm: true },
};

function parseResume(content: string) {
  const lines = content.replace(/\r/g, "").split("\n");
  const name = lines.find((line) => line.trim())?.trim() || "YOUR NAME";
  const nameIndex = lines.findIndex((line) => line.trim());
  const contact =
    lines
      .slice(nameIndex + 1)
      .find((line) => line.includes("@") || line.includes("|"))
      ?.trim() || "";

  const sections: { title: string; body: string[] }[] = [];
  let current: { title: string; body: string[] } | null = null;

  for (const raw of lines.slice(nameIndex + 1)) {
    const line = raw.trim();
    if (!line || line.includes("@") || line.startsWith("---")) continue;
    if (SECTION_HEADERS.includes(line.toUpperCase())) {
      current = { title: line.toUpperCase(), body: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: "PROFILE", body: [] };
      sections.push(current);
    }
    current.body.push(line);
  }

  return { name, contact, sections };
}

function SectionBlock({
  title,
  body,
  accent,
}: {
  title: string;
  body: string[];
  accent: string;
}) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h3
        className="mb-2 border-b pb-1 text-[11px] font-extrabold tracking-[0.16em]"
        style={{ color: accent, borderColor: `${accent}33` }}
      >
        {title}
      </h3>
      <div className="space-y-1.5 text-[12px] leading-5 text-slate-700">
        {body.length ? (
          body.map((line, index) => (
            <p key={`${title}-${index}`}>
              {line.startsWith("-") ? line : line}
            </p>
          ))
        ) : (
          <p className="text-slate-400">Details will appear here.</p>
        )}
      </div>
    </section>
  );
}

function StyledResume({
  content,
  template,
}: {
  content: string;
  template: TemplateName;
}) {
  const parsed = useMemo(() => parseResume(content), [content]);
  const theme = THEME[template];
  const sidebarSections = parsed.sections.filter((section) =>
    ["SKILLS", "CORE SKILLS", "CORE COMPETENCIES", "TECHNICAL SKILLS", "EDUCATION"].includes(
      section.title
    )
  );
  const mainSections = theme.sidebar
    ? parsed.sections.filter((section) => !sidebarSections.includes(section))
    : parsed.sections;

  if (theme.sidebar) {
    return (
      <div className="mx-auto min-h-[720px] max-w-[760px] bg-white text-slate-950 shadow-sm">
        <div
          className="px-8 py-7"
          style={{
            background:
              template === "clear"
                ? "linear-gradient(135deg, #34d399, #5eead4)"
                : theme.soft,
          }}
        >
          <h2 className="text-3xl font-black tracking-tight">{parsed.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{parsed.contact}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[0.8fr_1.4fr]">
          <aside className="space-y-5 border-b border-slate-200 pb-5 md:border-r md:border-b-0 md:pr-6">
            {sidebarSections.map((section) => (
              <SectionBlock
                key={section.title}
                title={section.title}
                body={section.body}
                accent={theme.accent}
              />
            ))}
          </aside>
          <main>
            {mainSections.map((section) => (
              <SectionBlock
                key={section.title}
                title={section.title}
                body={section.body}
                accent={theme.heading}
              />
            ))}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[720px] max-w-[760px] bg-white p-8 text-slate-950 shadow-sm">
      <header
        className="mb-7 border-b pb-5"
        style={{ borderColor: `${theme.accent}44` }}
      >
        <h2
          className="text-3xl font-black tracking-tight"
          style={{ color: theme.warm ? theme.accent : "#0f172a" }}
        >
          {parsed.name}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{parsed.contact}</p>
      </header>
      {mainSections.map((section) => (
        <SectionBlock
          key={section.title}
          title={section.title}
          body={section.body}
          accent={theme.heading}
        />
      ))}
    </div>
  );
}

function ResumePreview({
  content,
  title = "Resume Preview",
  source,
  template = DEFAULT_TEMPLATE,
}: ResumePreviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">
            {TEMPLATE_LABELS[template]} template preview
          </p>
        </div>
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
      <div className="max-h-[720px] overflow-auto bg-slate-100 p-4">
        {content ? (
          <StyledResume content={content} template={template} />
        ) : (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-500">
            Fill the form, select a template, and click Generate Resume to create
            your AI resume.
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ResumePreview);
