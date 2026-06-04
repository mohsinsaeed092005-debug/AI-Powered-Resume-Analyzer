import { NextResponse } from "next/server";
import { getUsersCollection } from "../../../../lib/db";

export async function GET() {
  try {
    const collection = await getUsersCollection();
    const count = await collection.countDocuments({});
    return NextResponse.json({ users_count: count });
  } catch (error) {
    console.error("Error in /api/users/count GET:", error);
    return NextResponse.json(
      { error: "MongoDB is not running. Start MongoDB on localhost:27017 and try again." },
      { status: 503 }
    );
  }
}
