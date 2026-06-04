import { recommendTemplate } from "@/lib/recommend-template";

export async function POST(req: Request) {
  try {
    const { profile, jobDescription } = await req.json();
    if (!profile) {
      return Response.json({ error: "Profile is required" }, { status: 400 });
    }

    const recommendation = recommendTemplate(profile, jobDescription || "");
    return Response.json(recommendation);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Recommendation failed" },
      { status: 500 }
    );
  }
}
