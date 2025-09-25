import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface RequestBody {
  name: string;
  jobTitle: string;
  companyName: string;
  skills: string;
  experience: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { name, jobTitle, companyName, skills, experience } = body;

    // Validate inputs
    if (!name || !jobTitle || !companyName || !skills || !experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
      // Optionally: vertexai: true if you want to use Vertex AI integration :contentReference[oaicite:1]{index=1}
    });

    // Generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Write a professional and compelling cover with 150 to 300  letter for the following:

        Name: ${name}
        Job Title: ${jobTitle}
        Company: ${companyName}
        Skills: ${skills}
        Experience: ${experience}

        Tone: enthusiastic but professional. End with a call to action.
      `,
    });

    // `response.text` gives the generated text
    const text = response.text;

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
