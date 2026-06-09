import { askAIText } from "@/lib/openrouter";
import { buildResumePrompt } from "@/lib/resume-prompt";
import { sanitizeResumeText } from "@/utils/resume-text";
import { DEFAULT_TEMPLATE, type TemplateName } from "@/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const profile = body.profile;
    const jobDescription = body.jobDescription || "";
    const template: TemplateName = body.template || DEFAULT_TEMPLATE;

    if (!profile?.name || !profile?.email) {
      return Response.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const resumeText = await askAIText(
      [
        {
          role: "system",
          content:
            "You are an expert professional resume writer. Rewrite the candidate's own details into polished, ATS-friendly CV language. Make weak or short input sound professional, specific, and achievement-focused, but do not invent facts, employers, dates, certifications, degrees, locations, metrics, or projects. Use only details provided by the candidate and matching keywords from the job description. Output only the final resume in plain text with clear uppercase section headings. Never use markdown symbols like # or **. Never use Unicode box-drawing characters.",
        },
        {
          role: "user",
          content: buildResumePrompt(profile, jobDescription, template),
        },
      ],
      { maxTokens: 1000, temperature: 0.25 }
    );

    return Response.json({
      success: true,
      resume: sanitizeResumeText(resumeText),
      source: "ai",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate resume",
      },
      { status: 500 }
    );
  }
}
