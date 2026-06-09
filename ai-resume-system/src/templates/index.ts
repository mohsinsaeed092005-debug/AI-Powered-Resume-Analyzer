import type { UserProfile } from "@/types";

export function minimalTemplate(profile: UserProfile) {
  return [
    profile.name.toUpperCase(),
    profile.email,
    `Target Role: ${profile.targetRole}`,
    "",
    "SKILLS",
    profile.skills,
    "",
    "EXPERIENCE",
    profile.experience,
    "",
    "PROJECTS",
    profile.projects,
    "",
    "EDUCATION",
    profile.education,
  ].join("\n");
}

export function professionalTemplate(profile: UserProfile) {
  const skills = profile.skills.split(",").slice(0, 3).join(", ");
  return [
    profile.name.toUpperCase(),
    `${profile.email} | ${profile.targetRole}`,
    "----------------------------------------",
    "",
    "PROFESSIONAL SUMMARY",
    `Dedicated ${profile.targetRole} with hands-on experience in ${skills}. Skilled in delivering practical embedded and software solutions with strong problem-solving ability.`,
    "",
    "CORE COMPETENCIES",
    profile.skills,
    "",
    "PROFESSIONAL EXPERIENCE",
    `- ${profile.experience}`,
    "",
    "KEY PROJECTS",
    `- ${profile.projects}`,
    "",
    "EDUCATION",
    profile.education,
  ].join("\n");
}

export function modernTemplate(profile: UserProfile) {
  return [
    profile.name,
    profile.email,
    profile.targetRole,
    "",
    "Skills",
    profile.skills,
    "",
    "Experience",
    profile.experience,
    "",
    "Projects",
    profile.projects,
    "",
    "Education",
    profile.education,
  ].join("\n");
}

export type TemplateName =
  | "pure-ats"
  | "specialist"
  | "clean"
  | "simple-ats"
  | "corporate"
  | "clear"
  | "precision-ats"
  | "two-column-ats";

export const DEFAULT_TEMPLATE: TemplateName = "specialist";

export const TEMPLATE_NAMES: TemplateName[] = [
  "pure-ats",
  "specialist",
  "clean",
  "simple-ats",
  "corporate",
  "clear",
  "precision-ats",
  "two-column-ats",
];

export function applyTemplate(name: TemplateName, profile: UserProfile) {
  switch (name) {
    case "specialist":
    case "simple-ats":
    case "precision-ats":
      return professionalTemplate(profile);
    case "clean":
    case "clear":
    case "two-column-ats":
      return modernTemplate(profile);
    case "corporate":
      return [
        profile.name.toUpperCase(),
        `${profile.email} | ${profile.targetRole}`,
        "",
        "PROFILE",
        `Organized ${profile.targetRole} with practical experience across ${profile.skills}. Known for clear communication, consistent execution, and measurable delivery.`,
        "",
        "WORK EXPERIENCE",
        `- ${profile.experience}`,
        "",
        "SKILLS",
        profile.skills,
        "",
        "PROJECTS",
        `- ${profile.projects}`,
        "",
        "EDUCATION",
        profile.education,
      ].join("\n");
    default:
      return minimalTemplate(profile);
  }
}
