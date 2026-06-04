import { NextResponse } from "next/server";
import { tryInsert } from "../../../../lib/db";
import { SKILL_CANDIDATES, ROLE_CANDIDATES } from "../../../../lib/constants";

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractTerms(description: string, candidates: string[]): string[] {
  const lowerText = description.toLowerCase();
  return candidates.filter((candidate) => lowerText.includes(candidate.toLowerCase()));
}

function suggestRoles(description: string): string[] {
  const roles = extractTerms(description, ROLE_CANDIDATES);
  const lowerText = description.toLowerCase();
  
  if (roles.length === 0) {
    if (lowerText.includes("python") && lowerText.includes("developer")) {
      roles.push("Python Developer");
    } else if (lowerText.includes("backend")) {
      roles.push("Backend Developer");
    } else if (lowerText.includes("engineer")) {
      roles.push("Software Engineer");
    } else if (lowerText.includes("data")) {
      roles.push("Data Engineer");
    }
  }
  return roles.length > 0 ? roles : ["Technical role"];
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { name, email, skills, education, experience, projects, certifications, target_role, job_description } = payload;

    if (!job_description || typeof job_description !== "string") {
      return NextResponse.json({ error: "Missing or invalid job_description" }, { status: 400 });
    }

    const normalizedDescription = normalizeText(job_description);
    const requiredSkills = extractTerms(normalizedDescription, SKILL_CANDIDATES);
    const resumeSkills = (skills || []).map((s: string) => s.toLowerCase());

    const experienceAndProjectsText = normalizeText(
      [...(experience || []), ...(projects || [])].join(" ")
    ).toLowerCase();

    const matchedSkills = requiredSkills.filter(
      (skill) =>
        resumeSkills.includes(skill.toLowerCase()) ||
        experienceAndProjectsText.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter((skill) => !matchedSkills.includes(skill));
    const matchScore = requiredSkills.length > 0 ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0;

    const summary = normalizedDescription.split(/(?<=[.!?])\s+/)[0] || normalizedDescription;

    const analysis = {
      candidate: { name, email, target_role },
      summary: summary,
      required_skills: requiredSkills,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      suggested_roles: suggestRoles(normalizedDescription),
      match_score: matchScore,
      recommendations: missingSkills
        .slice(0, 5)
        .map((skill) => `Add evidence for ${skill} in projects or experience.`),
    };

    const storedPayload = { resume: payload, analysis };
    const analysisId = await tryInsert("job_descriptions", storedPayload);

    return NextResponse.json({
      ...analysis,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error) {
    console.error("Error in /api/resume/analyze:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
