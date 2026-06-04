import { NextResponse } from "next/server";
import { tryInsert } from "../../../../lib/db";
import { computeCosineSimilarity } from "../../../../lib/tfidf";

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function resumeToText(payload: any): string {
  const sections = [
    payload.name,
    payload.email,
    payload.target_role || "",
    payload.skills?.length ? "Skills: " + payload.skills.join(", ") : "",
    payload.education?.length ? "Education: " + payload.education.join(". ") : "",
    payload.experience?.length ? "Experience: " + payload.experience.join(". ") : "",
    payload.projects?.length ? "Projects: " + payload.projects.join(". ") : "",
    payload.certifications?.length ? "Certifications: " + payload.certifications.join(". ") : "",
  ];
  return normalizeText(sections.filter(Boolean).join(" "));
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { name, email, target_role, job_description } = payload;

    const resumeText = resumeToText(payload);
    const normalizedJobDescription = normalizeText(job_description || "");

    if (!resumeText || !normalizedJobDescription) {
      return NextResponse.json({ error: "Resume profile and job description are required." }, { status: 400 });
    }

    const similarity = computeCosineSimilarity(resumeText, normalizedJobDescription);
    const similarityScore = Math.round(similarity * 10000) / 100; // to 2 decimal places

    const result = {
      candidate: { name, email, target_role },
      similarity_score: similarityScore,
      match_label: `${similarityScore}% Match`,
      score_method: "pure-typescript TF-IDF cosine similarity",
      embedding_model: null,
      resume_text: resumeText,
      job_description: normalizedJobDescription,
    };

    const analysisId = await tryInsert("job_descriptions", result);

    return NextResponse.json({
      ...result,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error) {
    console.error("Error in /api/resume/score:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
