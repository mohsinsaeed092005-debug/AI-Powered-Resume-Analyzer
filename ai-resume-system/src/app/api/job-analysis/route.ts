import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const result = await db.collection("job_analysis").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return Response.json({ id: result.insertedId, saved: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save analysis" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const analyses = await db
      .collection("job_analysis")
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return Response.json({ analyses });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
