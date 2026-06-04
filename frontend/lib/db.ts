import { MongoClient, Collection } from "mongodb";
import { getMongoUri } from "@/lib/env";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function resolveMongoUri(): string {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error(
      "Database is not configured. Set MONGODB_URI or MONGO_URI in environment variables."
    );
  }
  return uri;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (client) {
    return client;
  }

  if (!clientPromise) {
    client = new MongoClient(resolveMongoUri(), {
      serverSelectionTimeoutMS: 2000,
    });
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb() {
  const conn = await getMongoClient();
  return conn.db("resume_ai");
}

export async function getUsersCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection("users");
}

export async function getJobDescriptionsCollection(): Promise<Collection> {
  const db = await getDb();
  return db.collection("job_descriptions");
}

export async function tryInsert(collectionName: "users" | "job_descriptions", document: any): Promise<string | null> {
  try {
    const db = await getDb();
    const result = await db.collection(collectionName).insertOne({ ...document });
    return result.insertedId ? result.insertedId.toString() : null;
  } catch (error) {
    console.error("MongoDB error during insertion:", error);
    return null;
  }
}
