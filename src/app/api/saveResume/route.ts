// /app/api/saveResume/route.ts
import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Define Resume interface (for type safety)
interface ResumeData {
  id: string;
  userEmail: string;
  personalInfo?: Record<string, unknown>;
  summary?: string;
  workExperience?: Record<string, unknown>[];
  education?: Record<string, unknown>[];
  skills?: string[];
  projects?: Record<string, unknown>[];
  certifications?: Record<string, unknown>[];
  socialLinks?: Record<string, unknown>[];
  additionalInfo?: Record<string, unknown>;
  template?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = (await req.json()) as ResumeData;

    // ✅ Validate required fields
    if (!data || !data.id || !data.userEmail) {
      return NextResponse.json(
        { success: false, message: "Resume data and userEmail are required" },
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection<ResumeData>("resumes");

    // ✅ Prepare upsert document
    const resumeDocument: ResumeData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // ✅ Perform upsert (update if exists, insert if not)
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
    // Type narrowing without "any"
    const errorMessage =
      err instanceof Error ? err.message : "Unknown server error";

    console.error("❌ Failed to save resume:", errorMessage);

    return NextResponse.json(
      { success: false, message: "Failed to save resume", error: errorMessage },
      { status: 500 }
    );
  }
}
