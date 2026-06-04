export function splitCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function profileToText(profile: {
  name: string;
  email: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  targetRole: string;
}): string {
  return [
    profile.name,
    profile.email,
    profile.targetRole,
    profile.skills,
    profile.experience,
    profile.projects,
    profile.education,
  ].join(" ");
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number
): ((...args: Args) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, waitMs);
  }) as ((...args: Args) => void) & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/** Merge into ai-resume-state without dropping other dashboard fields. */
export function mergeResumeState(patch: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("ai-resume-state");
    const current = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    localStorage.setItem(
      "ai-resume-state",
      JSON.stringify({ ...current, ...patch })
    );
  } catch {
    /* ignore quota / parse errors */
  }
}
