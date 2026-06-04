import { NextResponse } from "next/server";
import { tryInsert } from "../../../../lib/db";
import { callLLM, getLlmModelName } from "../../../../lib/llm";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Missing or invalid description" }, { status: 400 });
    }

    const normalized = description.replace(/\s+/g, " ").trim();
    const prompt = `Analyze this job description.\nExtract:\n- Required skills\n- Experience level\n- Keywords\n- Soft skills\n\nJob Description:\n${normalized}`;

    const openrouterResponse = await callLLM([
      {
        role: "system",
        content: "You are an assistant that extracts structured hiring requirements from a job description."
      },
      {
        role: "user",
        content: prompt
      }
    ], 700);

    const result = {
      job_description: normalized,
      openrouter_response: openrouterResponse,
      openrouter_meta: {
        model: getLlmModelName()
      }
    };

    const analysisId = await tryInsert("job_descriptions", result);

    return NextResponse.json({
      ...result,
      analysis_id: analysisId,
      stored: !!analysisId
    });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
