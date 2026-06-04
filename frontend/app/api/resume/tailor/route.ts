import { NextResponse } from "next/server";
import { tryInsert } from "../../../../lib/db";
import { callLLM, getLlmModelName } from "../../../../lib/llm";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { name, email, target_role, skills, education, experience, projects, certifications, job_description } = payload;

    if (!job_description || typeof job_description !== "string") {
      return NextResponse.json({ error: "Missing or invalid job_description" }, { status: 400 });
    }

    const normalizedDescription = job_description.replace(/\s+/g, " ").trim();
    const profile = {
      name,
      email,
      target_role,
      skills,
      education,
      experience,
      projects,
      certifications,
    };

    const prompt = `Generate ATS optimized resume content for this job description using this profile.

Improve:
- Skills section
- ATS keywords
- Professional summary
- Experience bullet points
- Project bullet points

Return the answer with these headings:
1. ATS Optimized Summary
2. Optimized Skills
3. ATS Keywords to Add
4. Improved Experience Bullets
5. Improved Project Bullets
6. Missing Items to Add

Profile:
${JSON.stringify(profile, null, 2)}

Job Description:
${normalizedDescription}
`;

    const tailoredContent = await callLLM([
      {
        role: "system",
        content: "You are an expert resume writer and ATS optimization assistant. Keep suggestions truthful to the user's profile."
      },
      {
        role: "user",
        content: prompt
      }
    ], 1200);

    const result = {
      profile,
      job_description: normalizedDescription,
      tailored_resume_content: tailoredContent,
      openrouter_meta: { model: getLlmModelName() },
    };

    const analysisId = await tryInsert("job_descriptions", result);

    return NextResponse.json({
      ...result,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error: any) {
    console.error("Error in /api/resume/tailor:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
