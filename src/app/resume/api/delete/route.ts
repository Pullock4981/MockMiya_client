// /app/resume/api/delete/route.ts
import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");
    const userEmail = searchParams.get("userEmail");

    if (!resumeId || !userEmail) {
      return NextResponse.json(
        { success: false, message: "Both id and userEmail are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection("resumes");

    const result = await resumes.deleteOne({ id: resumeId, userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Resume not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    // console.error("❌ Failed to delete resume:", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting resume" },
      { status: 500 }
    );
  }
}
