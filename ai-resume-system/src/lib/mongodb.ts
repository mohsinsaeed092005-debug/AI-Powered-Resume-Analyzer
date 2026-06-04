import { MongoClient } from "mongodb";
import { getMongoUri } from "@/lib/env";

let client: MongoClient | null = null;

function getClient(): MongoClient {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("Database is not configured. Contact the administrator.");
  }
  if (!client) {
    client = new MongoClient(uri);
  }
  return client;
}

export async function connectDB() {
  return getClient().db("resume_ai");
}
