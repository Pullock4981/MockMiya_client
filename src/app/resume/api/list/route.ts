// src/app/resume/api/list/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/context/MongoDB/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ success: false, message: "Missing userEmail" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = await db
      .collection("resumes")
      .find({ userEmail })
      .project({
        id: 1,
        userEmail: 1,
        title: 1,
        resumeStatus: 1,
        updatedAt: 1,
        createdAt: 1,
        template: 1,
        thumbnail: 1, // root-level thumbnail
      })
      .sort({ updatedAt: -1 })
      .toArray();

    // Binary thumbnail → Base64 URL
    const mapped = resumes.map((r) => {
      let thumbnailUrl = "";
      if (r.thumbnail?.buffer) {
        const base64 = Buffer.from(r.thumbnail.buffer).toString("base64");
        thumbnailUrl = `data:image/png;base64,${base64}`;
      }

      return {
        id: r.id,
        userEmail: r.userEmail,
        title: r.title || "Untitled Resume",
        resumeStatus: r.resumeStatus || "draft",
        updatedAt: r.updatedAt,
        createdAt: r.createdAt,
        template: r.template,
        thumbnailUrl, // ✅ frontend-ready
      };
    });

    return NextResponse.json({ success: true, resumes: mapped });
  } catch (err) {
    // console.error("❌ Fetch resumes failed:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch resumes" });
  }
}
