import { predictJob } from "@/lib/predict";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const skills: string[] = Array.isArray(body.skills)
      ? body.skills
      : String(body.skills || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

    const predictions = predictJob(skills);
    return Response.json({ predictions, skills });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Prediction failed" },
      { status: 500 }
    );
  }
}
