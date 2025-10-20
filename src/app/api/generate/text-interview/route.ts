

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.TEXT_INTERVIEW_API_KEY!);
// Use whichever model you have access to; change if needed
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helpers to clean model output
function stripCodeFences(s: string) {
  // remove ```json or ```lang or ``` and trailing ```
  return s.replace(/```[a-zA-Z0-9\-]*\n?/g, "").replace(/```/g, "").trim();
}

function extractFirstJsonArray(s: string): string | null {
  const match = s.match(/\[[\s\S]*?\]/);
  return match ? match[0] : null;
}

function extractFirstJsonObject(s: string): string | null {
  const match = s.match(/\{[\s\S]*?\}/);
  return match ? match[0] : null;
}

function linesToArray(s: string, maxItems = 5) {
  // split lines, remove numbering/bullets and surrounding quotes/commas
  const lines = s
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) =>
      l
        .replace(/^\d+[\).\-\s]+/, "") // remove leading "1. " or "1) " or "1 - "
        .replace(/^[\-\*\u2022]\s*/, "") // remove bullets -, *, •
        .replace(/^"(.*)",?$/, "$1")
        .replace(/^'(.*)',?$/, "$1")
        .replace(/,$/, "")
        .trim()
    )
    .filter(Boolean)
    .slice(0, maxItems);
  return lines;
}

function parseArrayFromModelText(raw: string, maxItems = 5): string[] {
  if (!raw) return [];
  const s = stripCodeFences(raw);

  // try JSON array
  const arrJson = extractFirstJsonArray(s);
  if (arrJson) {
    try {
      const parsed = JSON.parse(arrJson);
      if (Array.isArray(parsed)) return parsed.slice(0, maxItems).map(String);
    } catch {
      // fallthrough to line-splitting
    }
  }

  // sometimes model returns a JSON-like but with trailing text; try to clean
  try {
    const direct = JSON.parse(s);
    if (Array.isArray(direct)) return direct.slice(0, maxItems).map(String);
  } catch {
    // ignore
  }

  // fallback: split lines and sanitize
  const byLines = linesToArray(s, maxItems);
  if (byLines.length > 0) return byLines;

  // final fallback: try to extract quoted items within text
  const quoted = Array.from(s.matchAll(/"([^"]{3,}?)"/g))
    .map((m) => m[1])
    .slice(0, maxItems);
  if (quoted.length > 0) return quoted;

  // give safe defaults if nothing found
  return Array.from({ length: maxItems }, (_, i) => `Question ${i + 1}`);
}

function parseEvaluationFromModelText(raw: string) {
  const s = stripCodeFences(raw);

  // try JSON object first
  const objJson = extractFirstJsonObject(s);
  if (objJson) {
    try {
      const parsed = JSON.parse(objJson);
      return parsed;
    } catch {
      // try looser parse below
    }
  }

  // fallback: simple heuristics
  const scoreMatch = s.match(/score[:\s]+(\d{1,3})/i) || s.match(/(\d{1,3})\s*%/);
  const score = scoreMatch
    ? Math.max(0, Math.min(100, Number(scoreMatch[1] || scoreMatch[0])))
    : 0;
  const feedback = s.replace(/\r?\n/g, " ").trim();

  return { score, feedback };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "generateQuestions") {
      const { topic } = body;
      // Request the model to only return a JSON array - but we still sanitize.
      const prompt = `Generate 5 professional and concise interview questions for a "${topic}" role. Each question should be specific enough that the candidate can answer in 5 to 10 words. Focus on technical skills, teamwork, and problem-solving. For each question, also provide a sample answer (5–10 words) that demonstrates a strong candidate response.
Return them ONLY as a JSON array, e.g. ["Q1", "Q2", "Q3", "Q4", "Q5"].`;

      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.() ?? String(result);

      const arr = parseArrayFromModelText(text, 5);
      // ensure length 5
      while (arr.length < 5) arr.push(`Question ${arr.length + 1}`);
      return NextResponse.json({ questions: arr.slice(0, 5) });
    }

    if (action === "evaluateSession") {
      const { questions = [], answers = [] } = body;
      const prompt = `
You are an experienced interviewer. Evaluate the given session of 5 questions and candidate answers.
Return only a JSON object in this exact format:

{
  "score": number,        // overall percentage 0-100
  "feedback": "Short overall feedback"
}

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

Provide a concise, honest assessment. No extra text outside the JSON.
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.() ?? String(result);
      const parsed = parseEvaluationFromModelText(text);
      return NextResponse.json({ evaluation: parsed });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unknown error occurred";
    // console.error("Gemini API Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
