"use client";

import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, Search, Upload } from "lucide-react";
import JobPredictionCards from "@/components/JobPredictionCards";
import { mergeResumeState } from "@/utils/helpers";
import type { JobListing, RolePrediction } from "@/types";

type PredictorSeed = {
  skills?: string;
  targetRole?: string;
  resumeText?: string;
};

function consumePredictorSeed(): PredictorSeed | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("job-predictor-seed");
  if (!raw) return null;

  localStorage.removeItem("job-predictor-seed");
  try {
    return JSON.parse(raw) as PredictorSeed;
  } catch {
    return null;
  }
}

export default function JobPredictorPage() {
  const [generatedSeed] = useState(() => consumePredictorSeed());
  const generatedSeedSkills = [generatedSeed?.skills, generatedSeed?.targetRole]
    .filter(Boolean)
    .join(", ");
  const [skills, setSkills] = useState(
    generatedSeedSkills || "python, nextjs, mongodb, react"
  );
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [searchingJobs, setSearchingJobs] = useState(false);
  const [predictions, setPredictions] = useState<RolePrediction[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [resumeFileName, setResumeFileName] = useState("");
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [parsedNote, setParsedNote] = useState(
    generatedSeedSkills ? "Generated resume loaded. Predicting matching jobs now." : ""
  );
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async (nextSkills: string, nextPredictions: RolePrediction[]) => {
    setSearchingJobs(true);
    try {
      const res = await fetch("/api/job-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: nextSkills,
          roles: nextPredictions.map((prediction) => prediction.role),
        }),
      });
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } finally {
      setSearchingJobs(false);
    }
  }, []);

  const predictFromSkills = useCallback(async (nextSkills: string) => {
    const cleanSkills = nextSkills.trim();
    if (!cleanSkills) {
      setError("Please add skills or send a generated resume first.");
      return;
    }

    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/predict-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: cleanSkills }),
      });
      const data = await res.json();
      const nextPredictions = data.predictions ?? [];
      setPredictions(nextPredictions);
      await fetchJobs(data.skills?.join(", ") || cleanSkills, nextPredictions);

      await fetch("/api/job-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: data.skills,
          predictions: data.predictions,
        }),
      });

      mergeResumeState({ predictions: nextPredictions });
    } catch {
      setError("Job prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchJobs, loading]);

  const runPrediction = useCallback(async () => {
    await predictFromSkills(skills);
  }, [predictFromSkills, skills]);

  const parseResume = useCallback(
    async (file: File) => {
      setParsing(true);
      setError("");
      setResumeFileName(file.name);
      setParsedNote("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Resume parsing failed.");
        }

        const nextSkills = data.skillsText || "";
        const nextPredictions = data.predictions ?? [];
        setSkills(nextSkills);
        setPredictions(nextPredictions);
        setParsedNote(
          nextSkills
            ? `AI extracted ${data.skills?.length || 0} skills from your CV.`
            : "Resume parsed, but no clear skills were found."
        );
        await fetchJobs(nextSkills, nextPredictions);
        mergeResumeState({ predictions: nextPredictions });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Resume parsing failed.");
      } finally {
        setParsing(false);
      }
    },
    [fetchJobs]
  );

  const runCvPrediction = useCallback(async () => {
    if (!selectedResumeFile || parsing) return;
    await parseResume(selectedResumeFile);
  }, [parseResume, parsing, selectedResumeFile]);

  useEffect(() => {
    if (!generatedSeedSkills) return;
    const timeoutId = window.setTimeout(() => {
      void predictFromSkills(generatedSeedSkills);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [generatedSeedSkills, predictFromSkills]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Job Predictor</h1>
        <p className="text-slate-500">
          Compare your skills and find the best matching roles
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Upload size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Upload CV for AI Matching</h2>
              <p className="text-xs text-slate-500">
                AI reads your resume, extracts skills, then finds suitable roles.
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <FileText className="mb-3 text-blue-600" size={28} />
            <span className="text-sm font-semibold text-slate-900">
              {resumeFileName || "Choose PDF/DOC/TXT resume"}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Your parser API key stays on the server.
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setSelectedResumeFile(file);
                  setResumeFileName(file.name);
                  setParsedNote("");
                  setError("");
                }
                event.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={runCvPrediction}
            disabled={!selectedResumeFile || parsing || loading}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BriefcaseBusiness size={17} />
            {parsing ? "Reading CV and predicting..." : "Predict Jobs from CV"}
          </button>
          {!selectedResumeFile && (
            <p className="mt-2 text-center text-xs text-slate-500">
              Select a resume first, then run AI job prediction.
            </p>
          )}
          {parsedNote && (
            <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {parsedNote}
            </p>
          )}
          {parsing && (
            <p className="mt-3 text-xs text-slate-500">
              Parsing CV and preparing job matches...
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Search size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Predict from Skills</h2>
              <p className="text-xs text-slate-500">
                Keep the old flow: write skills manually and search matching jobs.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Your Skills (comma separated)
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={4}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={runPrediction}
            disabled={loading || parsing}
            className="mt-4 h-11 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Predict Best Jobs"}
          </button>
        </div>
      </div>

      <JobPredictionCards predictions={predictions} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <BriefcaseBusiness size={19} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Live Matching Jobs</h2>
              <p className="text-xs text-slate-500">
                Remote openings from Remotive, ranked against your CV/skills.
              </p>
            </div>
          </div>
          {searchingJobs && <span className="text-xs text-slate-500">Searching jobs...</span>}
        </div>

        {!jobs.length ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Upload a CV or run prediction to fetch live job listings.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article key={job.id} className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                    {job.matchScore}%
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                    {job.source}
                  </span>
                  {job.jobType && (
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      {job.jobType}
                    </span>
                  )}
                </div>
                {job.matchedSkills.length > 0 && (
                  <p className="mb-4 text-xs text-slate-500">
                    CV match: {job.matchedSkills.slice(0, 5).join(", ")}
                  </p>
                )}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
                >
                  View Job
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
