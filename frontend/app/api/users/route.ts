import { NextResponse } from "next/server";
import { getUsersCollection } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const user = await req.json();
    const collection = await getUsersCollection();
    const result = await collection.insertOne(user);
    return NextResponse.json({ inserted_id: result.insertedId.toString() });
  } catch (error) {
    console.error("Error in /api/users POST:", error);
    return NextResponse.json(
      { error: "MongoDB is not running. Start MongoDB on localhost:27017 and try again." },
      { status: 503 }
    );
  }
}
