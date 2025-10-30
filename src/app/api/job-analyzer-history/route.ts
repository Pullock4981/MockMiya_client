import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing userEmail" }, { status: 400 });
    }

    const { db } = await connectDB();
    const history = await db
      .collection("job_analyses")
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error("❌ Error fetching job analyzer history:", err);
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
