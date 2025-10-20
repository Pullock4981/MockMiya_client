import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add your MongoDB URI in .env");
}

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    // console.log("🔄 Using existing MongoDB connection");
    return;
  }

  try {
    // console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      dbName: "MockMiya",
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    // console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection failed");
      console.error("Error message:", error.message);
      throw new Error("MongoDB connection error: " + error.message);
    } else {
      console.error("❌ MongoDB connection failed with unknown error:", error);
      throw new Error("MongoDB connection error: Unknown error");
    }
  }
};
