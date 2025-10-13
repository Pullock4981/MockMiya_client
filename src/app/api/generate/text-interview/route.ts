import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Types for the request
interface GenerateRequestBody {
  role: string;
  type: "text" | "mcq";
  questionCount: number;
}

// Type for MCQ question structure
interface MCQQuestion {
  id: number;
  q: string;
  options: string[];
  correct: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();

    const { role, type, questionCount } = body;

    if (!role || !type || !questionCount) {
      return NextResponse.json(
        { error: "Role, type, and questionCount are required" },
        { status: 400 }
      );
    }

    if (!ai) {
      return NextResponse.json({ questions: [] }, { status: 200 });
    }

    let prompt = "";

    if (type === "text") {
      prompt = `
Generate ${questionCount} realistic interview questions for the role "${role}".
- Use professional tone
- Do not include answers
- Each question should be unique and job-specific
- Return as plain lines, numbered 1-${questionCount}
      `;
    } else if (type === "mcq") {
      prompt = `
Generate ${questionCount} multiple-choice interview questions for the role "${role}".
- Each question must have 4 options (A, B, C, D)
- Clearly indicate the correct option with "[correct]" after it
- Format example:
1. Question text?
A) option1
B) option2 [correct]
C) option3
D) option4
      `;
    }

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = resp.text ?? "";

    let questions: string[] | MCQQuestion[] = [];

    if (type === "text") {
      questions = text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^\d+\s*[\.\)]\s*/, ""));
    } else if (type === "mcq") {
      const blocks = text.split(/\n(?=\d+\.)/).map((b) => b.trim()).filter(Boolean);
      questions = blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        const qText = lines[0].replace(/^\d+\.\s*/, "");
        const options = lines.slice(1).map((opt) => opt.replace(/\[correct\]/, "").trim());
        const correctLine = lines.find((l) => l.includes("[correct]"));
        const correct =
          correctLine?.replace(/[A-D]\)|\[correct\]/g, "").trim() ?? null;

        return {
          id: i + 1,
          q: qText,
          options,
          correct,
        };
      });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    const err = error instanceof Error ? error : { message: "Unknown error" };
    console.error("AI generate error:", err.message);
    return NextResponse.json({ questions: [] }, { status: 200 });
  }
}
