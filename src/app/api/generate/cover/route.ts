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
      name: name?.substring(0, 50),
      jobTitle: jobTitle?.substring(0, 50),
      companyName: companyName?.substring(0, 50),
      skillsLength: skills?.length,
      experienceLength: experience?.length
    });

    // Validate inputs
    if (!name?.trim() || !jobTitle?.trim() || !companyName?.trim() || !skills?.trim() || !experience?.trim()) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ 
        error: "Missing required fields",
        details: "All fields are required: name, job title, company name, skills, and experience."
      }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error("❌ GOOGLE_API_KEY is not configured");
      return NextResponse.json({ 
        error: "Configuration error",
        details: "API service is not properly configured."
      }, { status: 500 });
    }

    console.log("🔑 Initializing Google AI client");

    // Create GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const prompt = `Create a professional cover letter for a job application with the following details:

Applicant: ${name.trim()}
Target Position: ${jobTitle.trim()}
Company: ${companyName.trim()}
Key Skills: ${skills.trim()}
Experience: ${experience.trim()}

Requirements:
- Professional business letter format
- 150-300 words
- Confident and enthusiastic tone
- Highlight relevant skills and experience
- Personalized to the company
- Include a call to action
- Proper salutation and closing

Generate a compelling cover letter that will help the applicant stand out:`;

    console.log("📝 Sending request to Gemini API");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Use a more stable model
        contents: prompt,
      });

      console.log("✅ Received response from Gemini API");

      const text = response.text;

      if (!text?.trim()) {
        console.error("❌ Empty response from AI");
        return NextResponse.json({ 
          error: "Empty response",
          details: "The AI service returned an empty response. Please try again."
        }, { status: 500 });
      }

      console.log("📄 Generated cover letter length:", text.length, "characters");

      return NextResponse.json({ 
        text: text.trim(),
        length: text.length 
      });

    } catch (apiError: any) {
      console.error("❌ Google AI API error:", {
        message: apiError.message,
        status: apiError.status,
        code: apiError.code
      });

      // Handle specific Google AI errors
      if (apiError.message?.includes("404") || apiError.message?.includes("not found")) {
        return NextResponse.json({ 
          error: "Model unavailable",
          details: "The AI model is currently unavailable. Please try a different model or try again later."
        }, { status: 503 });
      }

      if (apiError.message?.includes("quota") || apiError.message?.includes("rate limit")) {
        return NextResponse.json({ 
          error: "Service limit reached",
          details: "API quota exceeded. Please try again later."
        }, { status: 429 });
      }

      if (apiError.message?.includes("permission") || apiError.message?.includes("403")) {
        return NextResponse.json({ 
          error: "Access denied",
          details: "API access denied. Please check your API configuration."
        }, { status: 403 });
      }

      throw apiError; // Re-throw to be caught by outer catch
    }

  } catch (err: any) {
    console.error("❌ API Route Error:", {
      name: err?.name,
      message: err?.message,
      stack: err?.stack?.split('\n')[0] // Only first line of stack for brevity
    });

    let errorMessage = "Service temporarily unavailable";
    let errorDetails = "We're experiencing technical difficulties. Please try again in a few moments.";
    let statusCode = 500;

    if (err instanceof SyntaxError) {
      errorMessage = "Invalid request data";
      errorDetails = "The request data is not properly formatted.";
      statusCode = 400;
    } else if (err.message?.includes("fetch") || err.name === "TypeError") {
      errorMessage = "Network error";
      errorDetails = "Unable to connect to the AI service. Please check your internet connection.";
      statusCode = 503;
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: statusCode });
  }
}