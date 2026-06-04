import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const result = await db.collection("users").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return Response.json({ id: result.insertedId });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const count = await db.collection("users").countDocuments();
    return Response.json({ users_count: count });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch users" },
      { status: 500 }
    );
  }
}
