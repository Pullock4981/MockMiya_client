// src/context/MongoDB/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const options: MongoClientOptions = {};

// Global declaration for Next.js hot reload
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client: MongoClient = new MongoClient(uri, options);

const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? client.connect().catch((err) => {
    console.error("MongoDB connection failed:", err instanceof Error ? err.message : err);
    throw err;
  });

global._mongoClientPromise = clientPromise;

export default clientPromise;
