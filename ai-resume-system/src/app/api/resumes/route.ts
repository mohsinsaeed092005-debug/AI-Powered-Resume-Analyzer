import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const doc = {
      email: body.email,
      profile: body.profile,
      generatedContent: body.generatedContent || "",
      atsScore: body.atsScore ?? null,
      createdAt: new Date(),
    };

    const result = await db.collection("resumes").insertOne(doc);

  return Response.json({ id: result.insertedId, saved: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save resume" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const db = await connectDB();
    const filter = email ? { email } : {};
    const resumes = await db
      .collection("resumes")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return Response.json({ resumes });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
