import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface RequestBody {
  jobRole: string;
  companyName: string;
  conversationHistory: string;
  lastUserMessage: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { jobRole, companyName, conversationHistory, lastUserMessage } = body;

    if (!jobRole || !companyName || !lastUserMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are a professional interview coach conducting a job interview for a ${jobRole} position at ${companyName}.
        
        INTERVIEW GUIDELINES:
        - Ask relevant technical and behavioral questions for a ${jobRole}
        - Keep responses natural and conversational (2-3 sentences max)
        - Be professional but friendly and encouraging
        - Ask follow-up questions based on the candidate's answers
        - Provide constructive feedback when appropriate
        - Focus on skills, experience, and cultural fit
        - End with a call to action or next question
        
        CONVERSATION HISTORY:
        ${conversationHistory}
        
        CANDIDATE'S LAST RESPONSE:
        "${lastUserMessage}"
        
        Your task: Provide the next interview question or response that continues the conversation naturally.
        Keep it professional, relevant to the role, and engaging.
      `,
    });

    const text = response.text;

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error in interview API route:", err);
    return NextResponse.json({ error: "Failed to generate interview response" }, { status: 500 });
  }
}