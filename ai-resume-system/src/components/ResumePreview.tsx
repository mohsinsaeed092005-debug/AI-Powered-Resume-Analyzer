"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { TEMPLATE_LABELS } from "@/lib/recommend-template";
import { DEFAULT_TEMPLATE, type TemplateName } from "@/templates";

interface ResumePreviewProps {
  content: string;
  title?: string;
  source?: "ai" | "fallback" | null;
  template?: TemplateName;
  profilePhoto?: string;
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
  {
    accent: string;
    soft: string;
    heading: string;
    dark?: boolean;
    sidebar?: "left-dark" | "left-light" | "right" | "none";
    header?: "band" | "plain" | "photo-sidebar";
    serif?: boolean;
    photo?: boolean;
  }
> = {
  "pure-ats": {
    accent: "#0ea5e9",
    soft: "#e7e7e7",
    heading: "#111827",
    sidebar: "left-dark",
    header: "photo-sidebar",
    photo: true,
  },
  specialist: {
    accent: "#c9a227",
    soft: "#0d0d0c",
    heading: "#f5f5f4",
    dark: true,
    sidebar: "right",
    serif: true,
  },
  clean: {
    accent: "#00b7ff",
    soft: "#07111f",
    heading: "#e2e8f0",
    dark: true,
    sidebar: "left-dark",
  },
  "simple-ats": {
    accent: "#6d5bd0",
    soft: "linear-gradient(135deg,#5b5ca8,#bd6bbf)",
    heading: "#111827",
    header: "band",
    photo: true,
  },
  corporate: {
    accent: "#4f8a3b",
    soft: "#17391f",
    heading: "#111827",
    sidebar: "left-light",
    header: "band",
  },
  clear: {
    accent: "#c98331",
    soft: "#1d1916",
    heading: "#f5f5f4",
    dark: true,
    sidebar: "right",
  },
  "precision-ats": {
    accent: "#c45b1d",
    soft: "#fffdf6",
    heading: "#222222",
    sidebar: "right",
  },
  "two-column-ats": {
    accent: "#3b82f6",
    soft: "#f8fafc",
    heading: "#111827",
    sidebar: "left-dark",
    photo: true,
  },
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
  dark,
}: {
  title: string;
  body: string[];
  accent: string;
  dark?: boolean;
}) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h3
        className="mb-2 border-b pb-1 text-[11px] font-extrabold tracking-[0.16em]"
        style={{ color: accent, borderColor: `${accent}33` }}
      >
        {title}
      </h3>
      <div
        className={`space-y-1.5 text-[12px] leading-5 ${
          dark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {body.length ? (
          body.map((line, index) => (
            <p key={`${title}-${index}`}>
              {line.startsWith("-") ? line : line}
            </p>
          ))
        ) : (
          <p className={dark ? "text-slate-500" : "text-slate-400"}>
            Details will appear here.
          </p>
        )}
      </div>
    </section>
  );
}

function ProfilePhoto({
  src,
  name,
  dark,
}: {
  src?: string;
  name: string;
  dark?: boolean;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={96}
        height={96}
        unoptimized
        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
      />
    );
  }

  return (
    <div
      className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-xl font-black shadow-md ${
        dark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-700"
      }`}
    >
      {initials || "CV"}
    </div>
  );
}

function StyledResume({
  content,
  template,
  profilePhoto,
}: {
  content: string;
  template: TemplateName;
  profilePhoto?: string;
}) {
  const parsed = useMemo(() => parseResume(content), [content]);
  const theme = THEME[template];
  const sidebarSections = parsed.sections.filter((section) =>
    ["SKILLS", "CORE SKILLS", "CORE COMPETENCIES", "TECHNICAL SKILLS", "EDUCATION"].includes(
      section.title
    )
  );
  const mainSections = theme.sidebar && theme.sidebar !== "none"
    ? parsed.sections.filter((section) => !sidebarSections.includes(section))
    : parsed.sections;

  if (template === "pure-ats") {
    return (
      <div className="mx-auto grid min-h-[720px] max-w-[760px] grid-cols-[0.9fr_1.55fr] bg-[#e7e7e7] text-slate-950 shadow-sm">
        <aside className="bg-[#303236] px-6 py-8 text-white">
          <div className="mb-7 flex justify-center">
            <ProfilePhoto src={profilePhoto} name={parsed.name} dark />
          </div>
          <p className="mb-6 text-center text-[11px] text-slate-300">{parsed.contact}</p>
          {sidebarSections.map((section) => (
            <SectionBlock
              key={section.title}
              title={section.title}
              body={section.body}
              accent={theme.accent}
              dark
            />
          ))}
        </aside>
        <main className="px-8 py-9">
          <div className="mb-7 border-b-2 pb-4" style={{ borderColor: theme.accent }}>
            <h2 className="text-4xl font-black tracking-tight">{parsed.name}</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
              Professional Resume
            </p>
          </div>
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
    );
  }

  if (theme.sidebar && theme.sidebar !== "none") {
    const left = theme.sidebar === "left-dark" || theme.sidebar === "left-light";
    const sidebar = (
      <aside
        className={`space-y-5 p-7 ${
          theme.sidebar === "left-dark"
            ? "bg-[#0f1a2e] text-white"
            : "bg-[#f3f0e6] text-slate-900"
        }`}
      >
        {profilePhoto && theme.photo && (
          <div className="mb-2 flex justify-center">
            <ProfilePhoto src={profilePhoto} name={parsed.name} dark={theme.sidebar === "left-dark"} />
          </div>
        )}
        {sidebarSections.map((section) => (
          <SectionBlock
            key={section.title}
            title={section.title}
            body={section.body}
            accent={theme.accent}
            dark={theme.sidebar === "left-dark"}
          />
        ))}
      </aside>
    );
    const main = (
      <main className={`p-8 ${theme.dark ? "bg-[#1d1916] text-white" : "bg-white"}`}>
        <header className="mb-7 border-b pb-4" style={{ borderColor: `${theme.accent}66` }}>
          <h2
            className={`text-4xl font-black tracking-tight ${theme.serif ? "font-serif" : ""}`}
            style={{ color: theme.dark ? "#fff" : theme.heading }}
          >
            {parsed.name}
          </h2>
          <p className={theme.dark ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-500"}>
            {parsed.contact}
          </p>
        </header>
        {mainSections.map((section) => (
          <SectionBlock
            key={section.title}
            title={section.title}
            body={section.body}
            accent={theme.accent}
            dark={theme.dark}
          />
        ))}
      </main>
    );

    return (
      <div
        className={`mx-auto grid min-h-[720px] max-w-[760px] shadow-sm ${
          left ? "grid-cols-[0.85fr_1.55fr]" : "grid-cols-[1.5fr_0.85fr]"
        } ${theme.dark ? "bg-[#1d1916]" : "bg-white"}`}
      >
        {left ? sidebar : main}
        {left ? main : sidebar}
      </div>
    );
  }

  if (theme.header === "band") {
    return (
      <div className="mx-auto min-h-[720px] max-w-[760px] bg-white text-slate-950 shadow-sm">
        <header
          className="flex items-center gap-5 px-8 py-8 text-white"
          style={{ background: theme.soft }}
        >
          {theme.photo && <ProfilePhoto src={profilePhoto} name={parsed.name} dark />}
          <div>
            <h2 className="text-3xl font-black tracking-tight">{parsed.name}</h2>
            <p className="mt-1 text-sm text-white/80">{parsed.contact}</p>
          </div>
        </header>
        <div className="grid grid-cols-[1.35fr_0.85fr] gap-7 p-8">
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
          <aside className="border-l border-slate-200 pl-6">
            {sidebarSections.map((section) => (
              <SectionBlock
                key={section.title}
                title={section.title}
                body={section.body}
                accent={theme.accent}
              />
            ))}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[720px] max-w-[760px] bg-white p-8 text-slate-950 shadow-sm">
      <header className="mb-7 border-b pb-5" style={{ borderColor: `${theme.accent}44` }}>
        <h2
          className="text-3xl font-black tracking-tight"
          style={{ color: theme.accent }}
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
  profilePhoto,
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
          <StyledResume content={content} template={template} profilePhoto={profilePhoto} />
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
