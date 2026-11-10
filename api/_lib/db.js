import { MongoClient } from "mongodb";

// One client per warm serverless instance; reused across invocations.
let clientPromise = null;
let indexed = false;

export class NotConfigured extends Error {}

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new NotConfigured("MONGODB_URI is not set");
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 6000 }).connect();
    clientPromise.catch(() => { clientPromise = null; });
  }
  const db = (await clientPromise).db(process.env.MONGODB_DB || "lumen");
  if (!indexed) {
    indexed = true;
    await Promise.all([
      db.collection("inquiries").createIndex({ createdAt: -1 }),
      db.collection("inquiries").createIndex({ status: 1, createdAt: -1 }),
      db.collection("inquiries").createIndex({ ipHash: 1, createdAt: -1 }),
      db.collection("estimates").createIndex({ createdAt: -1 }),
    ]).catch(() => { indexed = false; });
  }
  return db;
}

// Test hook: lets the test suite swap in an in-memory server.
export function resetDb() {
  clientPromise = null;
  indexed = false;
}
