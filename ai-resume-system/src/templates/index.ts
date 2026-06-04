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

export type TemplateName = "minimal" | "professional" | "modern";

export function applyTemplate(name: TemplateName, profile: UserProfile) {
  switch (name) {
    case "professional":
      return professionalTemplate(profile);
    case "modern":
      return modernTemplate(profile);
    default:
      return minimalTemplate(profile);
  }
}
