"use client";

import { useCallback, useState } from "react";
import JobPredictionCards from "@/components/JobPredictionCards";
import { mergeResumeState } from "@/utils/helpers";
import type { RolePrediction } from "@/types";

export default function JobPredictorPage() {
  const [skills, setSkills] = useState("python, nextjs, mongodb, react");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<RolePrediction[]>([]);

  const runPrediction = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/predict-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const data = await res.json();
      const nextPredictions = data.predictions ?? [];
      setPredictions(nextPredictions);

      await fetch("/api/job-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: data.skills,
          predictions: data.predictions,
        }),
      });

      mergeResumeState({ predictions: nextPredictions });
    } finally {
      setLoading(false);
    }
  }, [loading, skills]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Job Predictor</h1>
        <p className="text-slate-500">
          Compare your skills and find the best matching roles
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
          disabled={loading}
          className="mt-4 h-11 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Predicting..." : "Predict Best Jobs"}
        </button>
      </div>

      <JobPredictionCards predictions={predictions} />
    </div>
  );
}
