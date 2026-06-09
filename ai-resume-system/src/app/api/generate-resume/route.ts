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
            "You are an expert resume writer. Rewrite the candidate's input into a polished, professional resume. Do not echo raw input verbatim. If any section is short or fragmentary, expand it into complete resume-style sentences or bullet points. Output only the final resume in plain text with clear section headings. Never use markdown symbols like # or **. Never use Unicode box-drawing characters.",
        },
        {
          role: "user",
          content: buildResumePrompt(profile, jobDescription, template),
        },
      ],
      { maxTokens: 1200, temperature: 0.35 }
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
