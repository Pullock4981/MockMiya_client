// app/api/debug/connection/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

export async function GET() {
  try {
    console.log("🔄 Testing connection in API route...");
    
    // Test the exact same connection as register
    const { db, client } = await connectDB();
    
    // Test if we can access users collection
    const usersCollection = db.collection("users");
    const userCount = await usersCollection.countDocuments();
    
    console.log("✅ Connection successful - User count:", userCount);
    
    return NextResponse.json({
      success: true,
      userCount,
      database: db.databaseName,
      connection: "Working"
    });
    
  } catch (error: any) {
    console.error("❌ Connection failed in API:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}