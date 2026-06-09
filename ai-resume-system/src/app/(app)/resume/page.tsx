"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import ResumeForm, { type ResumeFormData } from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import ATSScoreCard from "@/components/ATSScoreCard";
import SkillGapCard from "@/components/SkillGapCard";
import TemplatePicker from "@/components/TemplatePicker";
import { applyTemplate, DEFAULT_TEMPLATE, type TemplateName } from "@/templates";
import {
  recommendTemplate,
  type TemplateRecommendation,
} from "@/lib/recommend-template";
import { mergeResumeState } from "@/utils/helpers";
import type { SkillGapResult } from "@/types";

const DownloadPDFButton = dynamic(
  () => import("@/components/DownloadPDFButton"),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-400 opacity-50"
      >
        Download PDF
      </button>
    ),
  }
);

const InterviewQuestionsPanel = dynamic(
  () => import("@/components/InterviewQuestionsPanel"),
  { ssr: false }
);

export default function ResumePage() {
  const [generating, setGenerating] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [content, setContent] = useState("");
  const [contentSource, setContentSource] = useState<"ai" | "fallback" | null>(null);
  const [error, setError] = useState("");
  const [atsScore, setAtsScore] = useState(0);
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);
  const [template, setTemplate] = useState<TemplateName>(DEFAULT_TEMPLATE);
  const [recommendation, setRecommendation] = useState<TemplateRecommendation | null>(null);
  const [manualTemplate, setManualTemplate] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [lastProfile, setLastProfile] = useState<ResumeFormData | null>(null);

  const pdfFileName = useMemo(
    () => `${lastProfile?.name?.replace(/\s+/g, "-").toLowerCase() || "resume"}.pdf`,
    [lastProfile?.name]
  );

  const handleProfileChange = useCallback(
    (data: ResumeFormData) => {
      const hasInput =
        data.targetRole || data.skills || data.experience || data.jobDescription;
      if (!hasInput) return;

      const rec = recommendTemplate(data, data.jobDescription || "");
      setRecommendation((prev) => {
        if (
          prev?.recommended === rec.recommended &&
          prev.confidence === rec.confidence &&
          prev.reasons.join() === rec.reasons.join()
        ) {
          return prev;
        }
        return rec;
      });

      if (!manualTemplate) {
        setTemplate((prev) => (prev === rec.recommended ? prev : rec.recommended));
      }
    },
    [manualTemplate]
  );

  const handleTemplateSelect = useCallback((t: TemplateName) => {
    setManualTemplate(true);
    setTemplate(t);
  }, []);

  const handleGenerate = useCallback(
    async (data: ResumeFormData) => {
      setGenerating(true);
      setLastProfile(data);
      setError("");

      const rec = recommendTemplate(data, data.jobDescription || "");
      setRecommendation(rec);
      const chosenTemplate = manualTemplate ? template : rec.recommended;
      if (!manualTemplate) setTemplate(rec.recommended);

      try {
        const genRes = await fetch("/api/generate-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: data,
            jobDescription: data.jobDescription,
            template: chosenTemplate,
          }),
        });

        const genData = await genRes.json();
        let aiText = "";
        let source: "ai" | "fallback" = "ai";

        if (genRes.ok && genData.success && genData.resume) {
          aiText = genData.resume;
        } else {
          source = "fallback";
          aiText = applyTemplate(chosenTemplate, data);
          setError(
            genData.error
              ? "AI is temporarily unavailable. Showing a basic template instead."
              : "AI generation failed. Showing basic template."
          );
        }

        setContent(aiText);
        setContentSource(source);

        const atsRes = await fetch("/api/ats-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume: aiText,
            jobDescription: data.jobDescription,
            userSkills: data.skills.split(",").map((s) => s.trim()),
            requiredSkills:
              data.jobDescription?.match(/\b[A-Za-z+#.]+\b/g)?.slice(0, 15) ?? [],
          }),
        });
        const atsData = await atsRes.json();
        setAtsScore(atsData.atsScore ?? 0);
        setSkillGap(atsData.skillGap ?? null);

        if (source === "ai") {
          await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.email,
              profile: data,
              generatedContent: aiText,
              atsScore: atsData.atsScore,
              template: chosenTemplate,
            }),
          });
        }

        mergeResumeState({ atsScore: atsData.atsScore, content: aiText });
      } catch {
        setError("Something went wrong. Please try again.");
        setContent("");
        setContentSource(null);
      } finally {
        setGenerating(false);
      }
    },
    [manualTemplate, template]
  );

  const fetchInterviewQuestions = useCallback(async () => {
    if (!lastProfile || !content || loadingQuestions) return;
    setLoadingQuestions(true);
    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: lastProfile.targetRole, resume: content }),
      });
      const data = await res.json();
      setInterviewQuestions(data.questions ?? data.error ?? "");
    } finally {
      setLoadingQuestions(false);
    }
  }, [lastProfile, content, loadingQuestions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Resume Generator</h1>
        <p className="text-slate-500">
          AI picks the best template for each user and writes a professional resume
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <TemplatePicker
        selected={template}
        onSelect={handleTemplateSelect}
        recommendation={recommendation}
        autoApplied={!manualTemplate}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ResumeForm
          onSubmit={handleGenerate}
          onProfileChange={handleProfileChange}
          loading={generating}
        />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ATSScoreCard score={atsScore} />
            <DownloadPDFButton
              content={content}
              fileName={pdfFileName}
              template={template}
            />
          </div>
          <SkillGapCard gap={skillGap} />
          <ResumePreview
            content={content}
            source={contentSource}
            template={template}
          />
          <button
            type="button"
            onClick={fetchInterviewQuestions}
            disabled={!content || loadingQuestions || generating}
            className="w-full rounded-lg border border-slate-300 bg-white py-3 text-sm font-semibold hover:border-emerald-500 disabled:opacity-60"
          >
            {loadingQuestions ? "Generating questions..." : "Generate Interview Questions"}
          </button>
          {interviewQuestions ? (
            <InterviewQuestionsPanel questions={interviewQuestions} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
