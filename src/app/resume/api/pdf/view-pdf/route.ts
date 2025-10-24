// src/app/resume/api/pdf/view-pdf/route.ts

import clientPromise from "@/context/MongoDB/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return new NextResponse("Missing resumeId", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    const resume = await collection.findOne({ id: resumeId });

    if (!resume || !resume.pdf) {
      return new NextResponse("PDF not found", { status: 404 });
    }

    const pdfBuffer = Buffer.from(resume.pdf.buffer);

    // ✅ Chrome print-view style display
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=resume.pdf",
      },
    });
  } catch (error) {
    // console.error("❌ Error loading PDF:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
