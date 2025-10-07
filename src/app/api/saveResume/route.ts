// src/app/api/saveResume/route.ts

import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = (await req.json()) as Partial<ResumeData>;

    if (!data || !data.id || !data.userEmail) {
      return NextResponse.json(
        { success: false, message: "Resume data and userEmail are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection<ResumeData>("resumes");

    const resumeDocument: ResumeData = {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    } as ResumeData;

    const result = await resumes.updateOne(
      { id: data.id, userEmail: data.userEmail },
      { $set: resumeDocument },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Resume saved successfully",
      result,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown server error";
    console.error("❌ Failed to save resume:", errorMessage);

    return NextResponse.json(
      { success: false, message: "Failed to save resume", error: errorMessage },
      { status: 500 }
    );
  }
}
