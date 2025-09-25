import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = process.env.GOOGLE_API_KEY;

// Check if the API key is available
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables.");
}

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(apiKey);

// Configuration for the generative model
const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

// Safety settings to block harmful content
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, jobTitle, role, summary, experience, education, skills } = body;

    // --- Input Validation ---
    if (!fullName || !email || !jobTitle) {
      return NextResponse.json({ error: "Full Name, Email, and Job Title are required." }, { status: 400 });
    }
    
    // Select the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings
    });

    // Construct the prompt with clear instructions
    const prompt = `
      Please act as a professional resume writer.
      Generate a clean, professional, and ATS-friendly resume based on the following details.
      Format the output as plain text. Do not use Markdown.
      The resume should have the following sections in this order: Contact Information, Summary, Skills, Experience, Education.

      DETAILS:
      - Name: ${fullName}
      - Email: ${email}
      - Phone: ${phone}
      - Target Job Title: ${jobTitle}
      - Intended Role: ${role}
      - Professional Summary Points: ${summary}
      - Work Experience: ${experience}
      - Education: ${education}
      - Skills: ${skills}

      Ensure the output is well-structured and ready to be copied into a document.
    `;

    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ resume: text });

  } catch (err) {
    console.error("Resume API error:", err);
    // Provide a more specific error message if available
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
    return NextResponse.json({ error: `Failed to generate resume. Reason: ${errorMessage}` }, { status: 500 });
  }
}
