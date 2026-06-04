"use client";

import { useState, useCallback, type DragEvent, type ChangeEvent } from "react";

interface RolePrediction {
  role: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

interface AnalysisResult {
  extractedText: string;
  skills: string[];
  predictions: RolePrediction[];
}

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setError(null);
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile]
  );

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data as AnalysisResult);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 hover:border-zinc-400 bg-zinc-50"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3">
          <div className="text-5xl">📄</div>
          <p className="text-lg font-semibold text-zinc-700">
            {file ? file.name : "Drop your resume here or click to browse"}
          </p>
          <p className="text-sm text-zinc-500">
            Supports PDF and TXT files (max 5 MB)
          </p>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Resume & Predict Jobs"}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Extracted Skills */}
          <section className="bg-white rounded-2xl shadow-md border border-zinc-100 p-6">
            <h2 className="text-xl font-bold text-zinc-800 mb-4">
              🛠️ Extracted Skills ({result.skills.length})
            </h2>
            {result.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">
                No recognizable skills found. Try a different resume.
              </p>
            )}
          </section>

          {/* Job Predictions */}
          <section className="bg-white rounded-2xl shadow-md border border-zinc-100 p-6">
            <h2 className="text-xl font-bold text-zinc-800 mb-4">
              🎯 Best Role Predictions
            </h2>
            {result.predictions.length > 0 ? (
              <div className="space-y-4">
                {result.predictions.map((pred, idx) => (
                  <div
                    key={pred.role}
                    className="border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-zinc-300">
                          #{idx + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-zinc-800">
                          {pred.role}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-3 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pred.matchScore}%`,
                              background:
                                pred.matchScore >= 70
                                  ? "#22c55e"
                                  : pred.matchScore >= 40
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-zinc-600 min-w-[3rem] text-right">
                          {pred.matchScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-green-700 mb-1.5">
                          ✅ Matched Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {pred.matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-orange-700 mb-1.5">
                          📚 Skills to Learn
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {pred.missingSkills.slice(0, 6).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs"
                            >
                              {s}
                            </span>
                          ))}
                          {pred.missingSkills.length > 6 && (
                            <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded text-xs">
                              +{pred.missingSkills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">
                No matching roles found. Upload a resume with more technical
                skills.
              </p>
            )}
          </section>

          {/* Resume Preview */}
          <section className="bg-white rounded-2xl shadow-md border border-zinc-100 p-6">
            <h2 className="text-xl font-bold text-zinc-800 mb-4">
              📝 Resume Text Preview
            </h2>
            <pre className="text-sm text-zinc-600 whitespace-pre-wrap max-h-60 overflow-y-auto bg-zinc-50 rounded-xl p-4 border border-zinc-200">
              {result.extractedText}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}
