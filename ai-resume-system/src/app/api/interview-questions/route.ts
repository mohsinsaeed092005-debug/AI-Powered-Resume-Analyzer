import { askAIText } from "@/lib/openrouter";

export async function POST(req: Request) {
  try {
    const { role, resume } = await req.json();

    const content = await askAIText([
      {
        role: "system",
        content: "You are a technical interviewer. Generate practical interview questions.",
      },
      {
        role: "user",
        content: `Generate 8 interview questions for a ${role || "Next.js developer"} role based on this resume:\n\n${resume}\n\nReturn numbered questions only.`,
      },
    ]);

    return Response.json({ questions: content });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate questions" },
      { status: 500 }
    );
  }
}
