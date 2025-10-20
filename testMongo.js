import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://ৃুািৃুাাৃু:াৃুািুািাুুাি@cluster0.tks1y5a.mongodb.net/MockMiya";

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "MockMiya",
      serverSelectionTimeoutMS: 10000, // 10 seconds
    });
    console.log("✅ MongoDB connected successfully!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    if (error instanceof Error) console.error(error.message);
    else console.error(error);
  }
}

testConnection();
