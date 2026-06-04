"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  Check,
  Database,
  Download,
  FileSearch,
  FileText,
  Gauge,
  Sparkles,
  Target,
  Upload
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

const API_BASE = "/api";

type Profile = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  target_role: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
  summary: string;
  declaration: string;
};

const initialProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  target_role: "",
  skills: "",
  education: "",
  experience: "",
  projects: "",
  certifications: "",
  summary: "",
  declaration: ""
};

const splitList = (value: string) =>
  value
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const splitMultiline = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

function profilePayload(profile: Profile) {
  return {
    name: profile.name.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim() || null,
    linkedin: profile.linkedin.trim() || null,
    github: profile.github.trim() || null,
    portfolio: profile.portfolio.trim() || null,
    target_role: profile.target_role.trim() || null,
    skills: splitList(profile.skills),
    education: splitMultiline(profile.education),
    experience: splitMultiline(profile.experience),
    projects: splitMultiline(profile.projects),
    certifications: splitList(profile.certifications),
    summary: profile.summary.trim() || null,
    declaration: profile.declaration.trim() || null
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 1
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      {rows > 1 ? (
        <textarea
          className="min-h-[88px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-blue-500 focus:outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm transition focus:border-blue-500 focus:outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  busy
}: {
  label: string;
  icon: typeof Activity;
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-wait disabled:opacity-60"
      type="button"
      onClick={onClick}
      disabled={busy}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function ResumeAnalyzerPage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [jobDescription, setJobDescription] = useState(
    "We need a Python developer with FastAPI and MongoDB experience."
  );
  const [response, setResponse] = useState("Run an action to view Next.js API output.");
  const [busy, setBusy] = useState(false);

  const payload = useMemo(() => profilePayload(profile), [profile]);

  const updateProfile = (key: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const showJson = (data: unknown) => {
    setResponse(JSON.stringify(data, null, 2));
  };

  const requestJson = async (path: string, body?: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: body ? "POST" : "GET",
        headers: body
          ? { "Content-Type": "application/json", accept: "application/json" }
          : { accept: "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      showJson(data);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  const requireProfile = () => {
    if (!payload.name || !payload.email) {
      setResponse("Name and email are required.");
      return false;
    }
    return true;
  };

  const requireJobDescription = () => {
    if (!jobDescription.trim()) {
      setResponse("Paste a job description first.");
      return false;
    }
    return true;
  };

  const runProfileWithJob = (path: string) => {
    if (!requireProfile() || !requireJobDescription()) return;
    requestJson(path, { ...payload, job_description: jobDescription.trim() });
  };

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("text") && !file.name.endsWith(".txt")) {
      setResponse("For this frontend upload, use a .txt resume or paste PDF content into the fields.");
      return;
    }

    const text = await file.text();
    updateProfile("experience", text);
    setResponse(`Loaded resume text from ${file.name}`);
  };

  const downloadPdf = () => {
    if (!requireProfile()) return;

    const doc = new jsPDF();
    let y = 0;

    const addText = (
      text: string,
      x = 15,
      size = 9.5,
      bold = false,
      italic = false,
      color = [51, 65, 85],
      lineSpacing = 5
    ) => {
      doc.setFont("helvetica", bold ? (italic ? "bolditalic" : "bold") : italic ? "italic" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, 180 - (x - 15));
      lines.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 15;
        }
        doc.text(line, x, y);
        y += lineSpacing;
      });
    };

    const drawSectionHeader = (title: string) => {
      if (y > 265) {
        doc.addPage();
        y = 15;
      }
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(29, 78, 216);
      doc.text(title.toUpperCase(), 15, y);
      y += 2;

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, y, 195, y);
      y += 5;
    };

    doc.setFillColor(26, 42, 71);
    doc.rect(0, 0, 210, 38, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(payload.name, 15, 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.text(payload.target_role || "", 15, 19);

    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    const contactLine1 = [
      payload.phone ? `Phone: ${payload.phone}` : "",
      payload.email ? `Email: ${payload.email}` : ""
    ]
      .filter(Boolean)
      .join("    |    ");
    doc.text(contactLine1, 15, 26);

    const contactLine2 = [
      payload.linkedin ? `LinkedIn: ${payload.linkedin}` : "",
      payload.github ? `GitHub: ${payload.github}` : "",
      payload.portfolio ? `Site: ${payload.portfolio}` : ""
    ]
      .filter(Boolean)
      .join("    |    ");
    doc.text(contactLine2, 15, 31);

    y = 46;

    if (profile.summary.trim()) {
      drawSectionHeader("profile");
      addText(profile.summary.trim(), 15, 9.5, false, false, [51, 65, 85], 5.2);
    }

    if (payload.education.length) {
      drawSectionHeader("education");
      payload.education.forEach((edu: string) => {
        if (edu.includes("|")) {
          const parts = edu.split("|").map((p) => p.trim());
          const degree = parts[0];
          const institution = parts[1] || "";
          const date = parts[2] || "";
          const location = parts[3] || "";

          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          doc.text(degree, 15, y);

          if (date) {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 116, 139);
            doc.text(date, 195, y, { align: "right" });
          }
          y += 5;

          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(institution, 15, y);

          if (location) {
            doc.text(location, 195, y, { align: "right" });
          }
          y += 6;
        } else {
          addText(edu, 15, 9.5, false, false, [51, 65, 85], 5);
          y += 1;
        }
      });
    }

    if (payload.projects.length) {
      drawSectionHeader("projects");
      payload.projects.forEach((proj: string) => {
        if (proj.includes("|")) {
          const parts = proj.split("|").map((p) => p.trim());
          const title = parts[0];
          const subtitle = parts[1] || "";
          const bullets = parts.slice(2);

          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          doc.text(title, 15, y);
          y += 4.5;

          if (subtitle) {
            if (y > 275) {
              doc.addPage();
              y = 15;
            }
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            doc.text(subtitle, 15, y);
            y += 4.5;
          }

          bullets.forEach((bullet) => {
            if (y > 275) {
              doc.addPage();
              y = 15;
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            doc.text("•", 17, y);

            const bulletLines = doc.splitTextToSize(bullet, 172);
            bulletLines.forEach((line: string) => {
              if (y > 275) {
                doc.addPage();
                y = 15;
              }
              doc.text(line, 22, y);
              y += 4.5;
            });
          });
          y += 2.5;
        } else {
          addText(proj, 15, 9.5, false, false, [51, 65, 85], 5);
          y += 1.5;
        }
      });
    }

    if (payload.experience.length) {
      drawSectionHeader("experience");
      payload.experience.forEach((exp: string) => {
        if (exp.includes("|")) {
          const parts = exp.split("|").map((p) => p.trim());
          const roleTitle = parts[0];
          const dates = parts[1] || "";
          const location = parts[2] || "";
          const bullets = parts.slice(3);

          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          doc.text(roleTitle, 15, y);

          if (dates) {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 116, 139);
            doc.text(dates, 195, y, { align: "right" });
          }
          y += 5;

          if (y > 275) {
            doc.addPage();
            y = 15;
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(location, 15, y);
          y += 5;

          bullets.forEach((bullet) => {
            if (y > 275) {
              doc.addPage();
              y = 15;
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);

            doc.text("•", 17, y);
            const bulletLines = doc.splitTextToSize(bullet, 170);
            bulletLines.forEach((line: string) => {
              if (y > 275) {
                doc.addPage();
                y = 15;
              }
              doc.text(line, 22, y);
              y += 4.5;
            });
          });
          y += 2.5;
        } else {
          addText(exp, 15, 9.5, false, false, [51, 65, 85], 5);
          y += 1.5;
        }
      });
    }

    if (payload.certifications.length) {
      drawSectionHeader("certifications");
      payload.certifications.forEach((cert) => {
        addText(`• ${cert}`, 15, 9, false, false, [51, 65, 85], 5);
      });
    }

    if (profile.declaration.trim()) {
      drawSectionHeader("declaration");
      addText(profile.declaration.trim(), 15, 9, false, false, [51, 65, 85], 5);
    }

    if (y > 250) {
      doc.addPage();
      y = 15;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(payload.name, 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    y += 4.5;
    doc.text("Lahore, Pakistan", 15, y);

    const fileName = `${payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}-resume.pdf`;
    doc.save(fileName);
    setResponse(`PDF generated: ${fileName}`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 lg:px-8">
        <header className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">AI Resume Analyzer</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">ATS resume builder dashboard</h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="font-bold text-slate-800">8</p>
              <p className="text-slate-500">API actions</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="font-bold text-slate-800">PDF</p>
              <p className="text-slate-500">Claude Style</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="font-bold text-slate-800">API</p>
              <p className="text-slate-500">Next.js routes</p>
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-5 xl:grid-cols-[450px_1fr_420px]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Candidate profile</h2>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600">
                <Upload size={16} />
                <span>Upload</span>
                <input className="hidden" type="file" accept=".txt,text/plain" onChange={handleResumeUpload} />
              </label>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={profile.name} onChange={(value) => updateProfile("name", value)} placeholder="Mohsin Saeed" />
                <Field label="Email" value={profile.email} onChange={(value) => updateProfile("email", value)} placeholder="moh@gmail.com" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Phone" value={profile.phone} onChange={(value) => updateProfile("phone", value)} placeholder="+92 335 ..." />
                <Field label="LinkedIn" value={profile.linkedin} onChange={(value) => updateProfile("linkedin", value)} placeholder="linkedin.com/..." />
                <Field label="GitHub" value={profile.github} onChange={(value) => updateProfile("github", value)} placeholder="github.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Portfolio Site" value={profile.portfolio} onChange={(value) => updateProfile("portfolio", value)} placeholder="site.sbs" />
                <Field label="Target Role / Tagline" value={profile.target_role} onChange={(value) => updateProfile("target_role", value)} placeholder="Web Developer" />
              </div>
              <Field label="Professional Summary" value={profile.summary} onChange={(value) => updateProfile("summary", value)} placeholder="Passionate developer..." rows={3} />
              <Field label="Skills (separate groups with Semicolon, e.g. Langs: Python, C++; Databases: Mongo)" value={profile.skills} onChange={(value) => updateProfile("skills", value)} placeholder="Languages: Python, JS; Tools: Git" rows={3} />
              <Field label="Education (use | to split Degree | Inst | Dates | Loc)" value={profile.education} onChange={(value) => updateProfile("education", value)} placeholder="Degree | Institution | Dates | Location" rows={3} />
              <Field label="Experience (split with | for Role | Dates | Location | Bullets)" value={profile.experience} onChange={(value) => updateProfile("experience", value)} placeholder="Role | Dates | Location | Bullet 1 | Bullet 2" rows={4} />
              <Field label="Projects (split with | for Title | Dates/Type | Bullets)" value={profile.projects} onChange={(value) => updateProfile("projects", value)} placeholder="Title | Web App | Bullet 1 | Bullet 2" rows={4} />
              <Field label="Certifications" value={profile.certifications} onChange={(value) => updateProfile("certifications", value)} placeholder="AWS, Udemy" rows={2} />
              <Field label="Declaration" value={profile.declaration} onChange={(value) => updateProfile("declaration", value)} placeholder="I hereby declare..." rows={2} />
            </div>
          </aside>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Job description workspace</h2>
                <p className="mt-1 text-sm text-slate-500">Paste a JD, run ATS checks, tailor content, score similarity, and predict roles.</p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                type="button"
                onClick={downloadPdf}
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>

            <textarea
              className="min-h-[220px] w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste job description here..."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ActionButton label="DB Health" icon={Database} busy={busy} onClick={() => requestJson("/health")} />
              <ActionButton label="Analyze JD" icon={FileSearch} busy={busy} onClick={() => requireJobDescription() && requestJson("/analyze", { description: jobDescription.trim() })} />
              <ActionButton label="AI Analyze" icon={Bot} busy={busy} onClick={() => requireJobDescription() && requestJson("/ai/analyze", { description: jobDescription.trim() })} />
              <ActionButton label="Match Resume" icon={Activity} busy={busy} onClick={() => runProfileWithJob("/resume/analyze")} />
              <ActionButton label="Score Resume" icon={Gauge} busy={busy} onClick={() => runProfileWithJob("/resume/score")} />
              <ActionButton label="Tailor Resume" icon={Sparkles} busy={busy} onClick={() => runProfileWithJob("/resume/tailor")} />
              <ActionButton label="Predict Jobs" icon={Brain} busy={busy} onClick={() => requireProfile() && requestJson("/jobs/predict", payload)} />
              <ActionButton label="Create Profile" icon={FileText} busy={busy} onClick={() => requireProfile() && requestJson("/users", payload)} />
            </div>
          </section>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">API response</h2>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{busy ? "Running" : "Ready"}</span>
            </div>
            <pre className="min-h-[560px] overflow-auto rounded-md border border-slate-900 bg-slate-950 p-4 text-xs leading-5 text-slate-100">
              {response}
            </pre>
          </aside>
        </section>
      </div>
    </main>
  );
}
