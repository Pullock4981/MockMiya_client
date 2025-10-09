// /src/app/api/getResume/route.ts
import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json({ success: false, message: "Resume ID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resume = await db.collection("resumes").findOne({ id: resumeId });

    if (!resume) {
      return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, resume });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
