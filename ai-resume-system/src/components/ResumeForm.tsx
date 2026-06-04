"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { UserProfile } from "@/types";
import { debounce } from "@/utils/helpers";

export type ResumeFormData = UserProfile;

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => void;
  onProfileChange?: (data: ResumeFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<ResumeFormData>;
}

const fields: { name: keyof ResumeFormData; label: string; rows?: number }[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "targetRole", label: "Target Role" },
  { name: "skills", label: "Skills", rows: 2 },
  { name: "experience", label: "Experience", rows: 4 },
  { name: "projects", label: "Projects", rows: 3 },
  { name: "education", label: "Education", rows: 2 },
  { name: "jobDescription", label: "Job Description", rows: 5 },
];

export default function ResumeForm({
  onSubmit,
  onProfileChange,
  loading,
  defaultValues,
}: ResumeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResumeFormData>({
    defaultValues: {
      name: "",
      email: "",
      skills: "",
      experience: "",
      projects: "",
      education: "",
      targetRole: "",
      jobDescription: "",
      ...defaultValues,
    },
  });

  const watched = useWatch({ control });

  const debouncedProfileChange = useMemo(() => {
    if (!onProfileChange) return null;
    return debounce(onProfileChange, 350);
  }, [onProfileChange]);

  useEffect(() => {
    if (!debouncedProfileChange || !watched) return;
    debouncedProfileChange(watched as ResumeFormData);
    return () => debouncedProfileChange.cancel();
  }, [watched, debouncedProfileChange]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">Resume Builder</h2>

      {fields.map(({ name, label, rows }) => (
        <label key={name} className="grid gap-1.5 text-sm font-medium text-slate-700">
          {label}
          {rows ? (
            <textarea
              {...register(name, {
                required:
                  name === "name" || name === "email"
                    ? `${label} is required`
                    : false,
              })}
              rows={rows}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          ) : (
            <input
              {...register(name, {
                required:
                  name === "name" || name === "email"
                    ? `${label} is required`
                    : false,
              })}
              className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          )}
          {errors[name] && (
            <span className="text-xs text-red-500">{errors[name]?.message}</span>
          )}
        </label>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-11 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Generate Resume"}
      </button>
    </form>
  );
}
