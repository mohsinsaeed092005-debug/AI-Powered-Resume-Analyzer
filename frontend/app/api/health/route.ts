import { NextResponse } from "next/server";
import { getMongoClient } from "../../../lib/db";

export async function GET() {
  try {
    const client = await getMongoClient();
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json({ database: "online", message: "MongoDB connection is ready" });
  } catch (error) {
    return NextResponse.json({
      database: "offline",
      message: "MongoDB is not running on localhost:27017"
    });
  }
}
