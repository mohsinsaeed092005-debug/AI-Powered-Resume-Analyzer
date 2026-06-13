"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import type { UserProfile } from "@/types";
import { debounce } from "@/utils/helpers";

export type ResumeFormData = UserProfile;

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => void;
  onProfileChange?: (data: ResumeFormData) => void;
  profilePhoto?: string;
  onProfilePhotoChange?: (photo: string) => void;
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
  profilePhoto,
  onProfilePhotoChange,
  loading,
  defaultValues,
}: ResumeFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const originalPhotoRef = useRef<HTMLImageElement | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoStyle, setPhotoStyle] = useState<"bw" | "color">("bw");
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

  const renderPhoto = (img: HTMLImageElement, style: "bw" | "color") => {
    const size = 360;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sourceSize = Math.min(img.width, img.height);
    const sx = (img.width - sourceSize) / 2;
    const sy = (img.height - sourceSize) / 2;
    ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, size, size);

    if (style === "bw") {
      const imageData = ctx.getImageData(0, 0, size, size);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const gray =
          imageData.data[i] * 0.299 +
          imageData.data[i + 1] * 0.587 +
          imageData.data[i + 2] * 0.114;
        const contrast = Math.max(0, Math.min(255, (gray - 128) * 1.15 + 128));
        imageData.data[i] = contrast;
        imageData.data[i + 1] = contrast;
        imageData.data[i + 2] = contrast;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    onProfilePhotoChange?.(canvas.toDataURL("image/jpeg", 0.88));
  };

  const processPhoto = async (file: File) => {
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    originalPhotoRef.current = img;
    renderPhoto(img, photoStyle);
  };

  const updatePhotoStyle = (style: "bw" | "color") => {
    setPhotoStyle(style);
    if (originalPhotoRef.current) {
      renderPhoto(originalPhotoRef.current, style);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">Resume Builder</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Profile Picture</h3>
            <p className="text-xs text-slate-500">
              Optional. Photo templates will place it in the resume automatically.
            </p>
          </div>
          {profilePhoto && (
            <Image
              src={profilePhoto}
              alt="Profile preview"
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
            />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void processPhoto(file);
            event.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
          >
            <ImagePlus size={15} />
            {profilePhoto ? "Change Photo" : "Add Profile Picture"}
          </button>
          {profilePhoto && (
            <button
              type="button"
              onClick={() => {
                originalPhotoRef.current = null;
                onProfilePhotoChange?.("");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Remove Photo
            </button>
          )}
        </div>
        {profilePhoto && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2">
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Photo finish
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: "bw" as const,
                  label: "Professional B&W",
                  desc: "Polished grayscale for formal CVs.",
                },
                {
                  value: "color" as const,
                  label: "Original Color",
                  desc: "Keep the uploaded photo colors.",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePhotoStyle(option.value)}
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    photoStyle === option.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-xs font-bold">{option.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {photoError && <p className="mt-2 text-xs text-red-500">{photoError}</p>}
      </div>

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
