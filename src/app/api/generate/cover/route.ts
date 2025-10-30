import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface RequestBody {
  name: string;
  jobTitle: string;
  companyName: string;
  skills: string;
  experience: string;
}

// Define error types
interface GoogleAIError extends Error {
  status?: number;
  code?: string;
}

interface ApiError extends Error {
  status?: number;
  details?: string;
  code?: string;
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

    } catch (apiError: unknown) {
      console.error("❌ Google AI API error:", apiError);

      let errorMessage = "AI service error";
      let errorDetails = "The AI service encountered an error. Please try again.";
      let statusCode = 500;

      // Type-safe error handling for Google AI API errors
      if (apiError instanceof Error) {
        const error = apiError as GoogleAIError;
        
        if (error.message?.includes("404") || error.message?.includes("not found")) {
          errorMessage = "Model unavailable";
          errorDetails = "The AI model is currently unavailable. Please try a different model or try again later.";
          statusCode = 503;
        } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
          errorMessage = "Service limit reached";
          errorDetails = "API quota exceeded. Please try again later.";
          statusCode = 429;
        } else if (error.message?.includes("permission") || error.message?.includes("403")) {
          errorMessage = "Access denied";
          errorDetails = "API access denied. Please check your API configuration.";
          statusCode = 403;
        } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
          errorMessage = "Network error";
          errorDetails = "Unable to connect to the AI service. Please check your internet connection.";
          statusCode = 503;
        }

        console.error("🔍 Google AI API error details:", {
          message: error.message,
          status: error.status,
          code: error.code
        });
      } else {
        console.error("🔍 Unknown Google AI API error type:", typeof apiError);
      }

      return NextResponse.json({ 
        error: errorMessage,
        details: errorDetails
      }, { status: statusCode });
    }

  } catch (err: unknown) {
    console.error("❌ API Route Error:", err);

    let errorMessage = "Service temporarily unavailable";
    let errorDetails = "We're experiencing technical difficulties. Please try again in a few moments.";
    let statusCode = 500;

    // Type-safe error handling for outer catch block
    if (err instanceof Error) {
      const error = err as ApiError;
      
      if (err instanceof SyntaxError) {
        errorMessage = "Invalid request data";
        errorDetails = "The request data is not properly formatted.";
        statusCode = 400;
      } else if (error.message?.includes("fetch") || err.name === "TypeError") {
        errorMessage = "Network error";
        errorDetails = "Unable to connect to the AI service. Please check your internet connection.";
        statusCode = 503;
      }

      console.error("🔍 API Route error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n')[0] // Only first line of stack for brevity
      });
    } else {
      console.error("🔍 Unknown API Route error type:", typeof err);
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: statusCode });
  }
}
