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

    console.log("🔄 Received cover letter request:", {
      name,
      jobTitle,
      companyName,
      skillsLength: skills?.length,
      experienceLength: experience?.length
    });

    // Validate inputs
    if (!name || !jobTitle || !companyName || !skills || !experience) {
      console.error("❌ Missing required fields:", {
        name: !!name,
        jobTitle: !!jobTitle,
        companyName: !!companyName,
        skills: !!skills,
        experience: !!experience
      });
      return NextResponse.json({ 
        error: "Missing required fields",
        details: "Please fill in all fields: name, job title, company name, skills, and experience."
      }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error("❌ GOOGLE_API_KEY is not configured");
      return NextResponse.json({ 
        error: "Server configuration error",
        details: "API key is not configured. Please contact support."
      }, { status: 500 });
    }

    console.log("🔑 API Key present, creating GenAI client");

    // Create GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Use the same model that works in your voice interview
    const prompt = `Write a professional and compelling cover letter (150-300 words) for the following applicant:

Applicant Name: ${name}
Target Position: ${jobTitle}
Company: ${companyName}
Key Skills: ${skills}
Professional Experience: ${experience}

Requirements:
- Tone: Professional, enthusiastic, and confident
- Structure: Proper business letter format with salutation, body paragraphs, and closing
- Content: Highlight relevant skills and experience, show enthusiasm for the role and company
- Length: 150-300 words
- Include a call to action encouraging an interview

Please generate a well-structured cover letter that will help this candidate stand out.`;

    console.log("📝 Sending request to Gemini API with model: gemini-2.5-flash");

    // Generate content - USE THE SAME MODEL AS YOUR WORKING VOICE INTERVIEW
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use the same model that works
      contents: prompt,
    });

    console.log("✅ Received response from Gemini API");

    // Extract the generated text
    const text = response.text;

    if (!text || text.trim().length === 0) {
      console.error("❌ Empty response from AI model");
      return NextResponse.json({ 
        error: "Empty response",
        details: "The AI model returned an empty response. Please try again."
      }, { status: 500 });
    }

    console.log("📄 Generated cover letter length:", text.length, "characters");
    console.log("✨ Cover letter preview:", text.substring(0, 100) + "...");

    return NextResponse.json({ text });

  } catch (err: any) {
    console.error("❌ API Route Error:", {
      name: err?.name,
      message: err?.message,
      status: err?.status,
      code: err?.code
    });

    // Enhanced error handling
    let errorMessage = "Failed to generate cover letter";
    let errorDetails = "An unexpected error occurred. Please try again.";
    let statusCode = 500;

    if (err?.message?.includes("404") || err?.message?.includes("not found")) {
      errorMessage = "Model Not Available";
      errorDetails = "The AI model is currently unavailable. Please try again later or contact support.";
      statusCode = 503;
    } else if (err?.message?.includes("API key") || err?.message?.includes("401")) {
      errorMessage = "Invalid API Key";
      errorDetails = "There's an issue with the service configuration. Please contact support.";
      statusCode = 500;
    } else if (err?.message?.includes("403") || err?.message?.includes("PERMISSION_DENIED")) {
      errorMessage = "API Access Denied";
      errorDetails = "Service access denied. Please ensure the Generative Language API is enabled.";
      statusCode = 403;
    } else if (err?.message?.includes("quota") || err?.message?.includes("rate limit")) {
      errorMessage = "Service Limit Reached";
      errorDetails = "We've reached our service limit. Please try again in a few hours.";
      statusCode = 429;
    } else if (err?.message?.includes("network") || err?.name === "FetchError") {
      errorMessage = "Network Error";
      errorDetails = "Unable to connect to the AI service. Please check your internet connection.";
      statusCode = 503;
    }

    console.error(`❌ Final Error: ${errorMessage} - ${errorDetails}`);

    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: statusCode });
  }
}