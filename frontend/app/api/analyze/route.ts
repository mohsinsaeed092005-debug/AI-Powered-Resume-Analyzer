import { NextResponse } from "next/server";
import { tryInsert } from "../../../lib/db";
import { SKILL_CANDIDATES, ROLE_CANDIDATES } from "../../../lib/constants";

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractTerms(description: string, candidates: string[]): string[] {
  const lowerText = description.toLowerCase();
  return candidates.filter((candidate) => lowerText.includes(candidate.toLowerCase()));
}

function summarizeDescription(description: string): string {
  const sentences = description.split(/(?<=[.!?])\s+/);
  return sentences[0] || description;
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
    const { description } = await req.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Missing or invalid description" }, { status: 400 });
    }

    const normalized = normalizeText(description);
    const analysis = {
      summary: summarizeDescription(normalized),
      required_skills: extractTerms(normalized, SKILL_CANDIDATES),
      suggested_roles: suggestRoles(normalized),
      original_description: normalized,
    };

    const storedPayload = { description: normalized, analysis };
    const analysisId = await tryInsert("job_descriptions", storedPayload);

    return NextResponse.json({
      ...analysis,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
