
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

interface GeminiResult {
  matchScore: number;
  skillsHave: string[];
  skillsMissing: string[];
  recommendations: string[];
  company?: string;
  role?: string;
  rawText?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { jobTextOrUrl, userEmail } = await req.json();

    if (!jobTextOrUrl || !userEmail) {
      return NextResponse.json(
        { error: "Missing jobTextOrUrl or userEmail" },
        { status: 400 }
      );
    }

    // Step 1: Fetch user's resume
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resumeRes = await fetch(
      `${baseUrl}/resume/api/getResume?userEmail=${userEmail}&latestDraft=true`,
      { cache: "no-store" }
    );
    const resumeData = await resumeRes.json();

    if (!resumeData.success || !resumeData.resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resumeText = resumeData.resume?.resumeText || "";

    // Step 2: Send to Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Compare the following job description and resume.
Return ONLY this JSON:
{
  "matchScore": 0–100,
  "skillsHave": [],
  "skillsMissing": [],
  "recommendations": [],
  "company": "",
  "role": ""
}

Job Description:
${jobTextOrUrl}

User Resume:
${resumeText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Step 3: Clean & parse JSON
    const cleanedText = aiText.replace(/```json|```/g, "").trim();
    let parsedResult: GeminiResult = { matchScore: 0, skillsHave: [], skillsMissing: [], recommendations: [] };

    try {
      parsedResult = JSON.parse(cleanedText);
    } catch {
      parsedResult.rawText = aiText;
    }

    // Step 4: Save to MongoDB
    const { db } = await connectDB();
    await db.collection("job_analyses").insertOne({
      userEmail,
      company: `${parsedResult.company || "AI Analyzed Job"}`,
      role: `${parsedResult.role || "Analyzed Role"}`,
      match: `${parsedResult.matchScore || 0}%`,
      result: parsedResult,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, result: parsedResult });
  } catch (err) {
    console.error("❌ Error in job analyzer:", err);
    return NextResponse.json({ error: (err as Error).message || "Server Error" }, { status: 500 });
  }
}
