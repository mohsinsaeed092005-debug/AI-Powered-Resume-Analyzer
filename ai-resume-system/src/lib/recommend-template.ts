import type { UserProfile } from "@/types";
import type { TemplateName } from "@/templates";

export interface TemplateRecommendation {
  recommended: TemplateName;
  confidence: number;
  reasons: string[];
  scores: Record<TemplateName, number>;
}

const TECH_SKILLS = [
  "python", "javascript", "typescript", "react", "nextjs", "next.js", "nodejs",
  "mongodb", "sql", "java", "c++", "c", "embedded", "esp32", "arduino", "stm32",
  "firmware", "iot", "ml", "ai", "docker", "kubernetes", "aws", "linux", "git",
  "api", "fastapi", "django", "flutter", "hardware", "pcb", "rtos",
];

const CORPORATE_ROLES = [
  "manager", "analyst", "consultant", "coordinator", "administrator", "hr",
  "marketing", "sales", "accountant", "finance", "operations", "executive",
  "director", "supervisor",
];

const TECH_ROLES = [
  "developer", "engineer", "programmer", "architect", "devops", "sre",
  "embedded", "firmware", "data scientist", "ml engineer", "full stack",
  "backend", "frontend", "software", "hardware",
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function parseExperienceYears(experience: string): number {
  const match = experience.match(/(\d+(?:\.\d+)?)\s*(?:\+?\s*)?(?:years?|yrs?|y\b)/i);
  if (match) return parseFloat(match[1]);
  if (/fresher|student|intern|entry|graduate|no experience/i.test(experience)) return 0;
  if (experience.trim().length > 20) return 1.5;
  return 0.5;
}

function countMatches(text: string, keywords: string[]): number {
  const lower = normalize(text);
  return keywords.filter((k) => lower.includes(k)).length;
}

export function recommendTemplate(
  profile: UserProfile,
  jobDescription = ""
): TemplateRecommendation {
  const combined = [
    profile.targetRole,
    profile.skills,
    profile.experience,
    profile.projects,
    profile.education,
    jobDescription,
  ].join(" ");

  const lower = normalize(combined);
  const years = parseExperienceYears(profile.experience);
  const techSkillCount = countMatches(profile.skills, TECH_SKILLS);
  const techRoleScore = countMatches(profile.targetRole, TECH_ROLES);
  const corporateScore = countMatches(profile.targetRole, CORPORATE_ROLES);
  const jdTechScore = countMatches(jobDescription, TECH_SKILLS);
  const isStudent =
    /student|fresher|intern|graduate|b\.s|bs |bachelor|university|college/i.test(
      combined
    ) && years < 1.5;

  const scores: Record<TemplateName, number> = {
    "pure-ats": 0,
    specialist: 0,
    clean: 0,
    "simple-ats": 0,
    corporate: 0,
    clear: 0,
    "precision-ats": 0,
    "two-column-ats": 0,
  };

  // ATS/simple templates: freshers, short profiles, students
  if (years <= 1) scores["pure-ats"] += 35;
  if (isStudent) scores["pure-ats"] += 25;
  if (profile.experience.length < 80) scores.clean += 15;
  if (profile.projects.split(",").length <= 2) scores["simple-ats"] += 10;

  // Specialist/corporate: corporate, senior, business-facing
  if (years >= 5) scores.specialist += 25;
  if (corporateScore > 0) scores.corporate += 40;
  if (years >= 2 && years < 5 && corporateScore === 0 && techRoleScore === 0) {
    scores.specialist += 20;
  }
  if (/leadership|management|stakeholder|client|business/i.test(lower)) {
    scores.corporate += 20;
  }

  // Modern/technical templates: tech roles, developers, engineers, project-heavy
  if (techRoleScore > 0) scores["two-column-ats"] += 35;
  if (techSkillCount >= 3) scores.clear += 30;
  if (jdTechScore >= 2) scores["precision-ats"] += 15;
  if (/embedded|firmware|esp32|stm32|arduino|iot/i.test(lower)) scores["two-column-ats"] += 25;
  if (profile.projects.length > 60) scores.clear += 15;
  if (years >= 1 && years <= 6 && techRoleScore > 0) scores["precision-ats"] += 15;

  // Tie-break: embedded/hardware leans modern; pure corporate leans professional
  if (scores.specialist === scores["two-column-ats"] && techRoleScore > 0) {
    scores["two-column-ats"] += 5;
  }

  const sorted = (Object.entries(scores) as [TemplateName, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const [recommended, topScore] = sorted[0];
  const secondScore = sorted[1][1];
  const confidence = Math.min(
    95,
    Math.max(55, Math.round(50 + (topScore - secondScore) * 2))
  );

  const reasons: string[] = [];

  if (recommended === "pure-ats" || recommended === "simple-ats") {
    reasons.push("Entry-level or concise profile detected");
    if (isStudent) reasons.push("Student/fresher profile suits a clean short layout");
  } else if (recommended === "specialist" || recommended === "corporate") {
    reasons.push("Corporate or senior-style role detected");
    if (years >= 5) reasons.push(`${years}+ years experience fits formal structure`);
  } else {
    reasons.push("Technical role and skills detected");
    if (techSkillCount >= 3) reasons.push(`${techSkillCount}+ tech skills — project-focused layout works best`);
    if (/embedded|firmware|iot/i.test(lower)) {
      reasons.push("Embedded/IoT profile — modern engineering template recommended");
    }
  }

  return { recommended, confidence, reasons, scores };
}

export const TEMPLATE_LABELS: Record<TemplateName, string> = {
  "pure-ats": "Pure ATS",
  specialist: "Specialist",
  clean: "Clean",
  "simple-ats": "Simple ATS",
  corporate: "Corporate",
  clear: "Clear",
  "precision-ats": "Precision ATS",
  "two-column-ats": "Two Column ATS",
};

export const TEMPLATE_DESCRIPTIONS: Record<TemplateName, string> = {
  "pure-ats": "Strict ATS layout with clean black text and simple sections",
  specialist: "Traditional specialist layout for experienced professionals",
  clean: "Modern white-space focused resume with a left profile column",
  "simple-ats": "Light ATS resume with blue headings and easy scanning",
  corporate: "Corporate layout for business, HR, finance, and operations",
  clear: "Fresh layout with strong header and skill emphasis",
  "precision-ats": "Precise ATS layout with warm headings and balanced spacing",
  "two-column-ats": "Two-column ATS format for skills-heavy profiles",
};
