import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const templatePrompts = {
  // ATS-Friendly Templates
  professional: `Create a professional, ATS-optimized resume with clear section headers. Use a formal tone and focus on achievements with metrics. Format with clear sections: CONTACT INFORMATION, PROFESSIONAL SUMMARY, SKILLS, PROFESSIONAL EXPERIENCE, EDUCATION.`,
  modern: `Generate a modern resume focusing on skills and technologies. Use a contemporary structure with skills highlighted early. Include a strong summary and focus on technical competencies.`,
  executive: `Create an executive-level resume with emphasis on leadership, strategy, and business impact. Use sophisticated language and highlight achievements with quantifiable results.`,
  minimalist: `Generate a clean, minimalist resume that is highly scannable. Focus on essential information with clear spacing and concise bullet points.`,

  // Non-ATS Creative Templates
  creative: `Create a visually appealing, creative resume that stands out. Use an engaging structure with personality while maintaining professionalism. Focus on storytelling and unique achievements.`,
  corporate: `Generate a corporate-style resume with modern design elements. Balance professionalism with contemporary formatting. Use clear sections with subtle design touches.`,
  tech: `Create a tech-focused resume with modern, clean design. Emphasize technical skills and projects. Use a structure that appeals to tech companies and startups.`,
  elegant: `Generate an elegant, sophisticated resume with refined language and structure. Focus on achievements and professional growth with a touch of personality.`,
  bold: `Create a bold, impactful resume that commands attention. Use strong language, clear achievements, and a confident tone. Make it memorable.`,
  clean: `Generate an extremely clean, well-organized resume with ample whitespace. Focus on readability and clear information hierarchy.`,
  "modern-2": `Create a modern professional resume with contemporary design elements. Balance creativity with professionalism for a fresh look.`,
  startup: `Generate a startup-style resume that shows innovation and adaptability. Focus on projects, initiatives, and results-oriented achievements.`,
  classic: `Create a classic, timeless resume with traditional structure but modern readability. Focus on career progression and stable achievements.`
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, jobTitle, role, summary, experience, education, skills, template = "professional", mode = "ats" } = body;

    // Validate inputs
    if (!fullName || !email || !jobTitle) {
      return NextResponse.json({ error: "Full Name, Email, and Job Title are required" }, { status: 400 });
    }

    // Create GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    });

    const templatePrompt = templatePrompts[template as keyof typeof templatePrompts] || templatePrompts.professional;

    const modeSpecificInstructions = mode === "ats" 
      ? `IMPORTANT: Ensure the resume is optimized for Applicant Tracking Systems with:
      - Standard section headers
      - Clear formatting
      - Keyword optimization
      - No tables or complex formatting
      - Use plain text only`
      : `IMPORTANT: Create a visually appealing resume with:
      - Engaging structure
      - Professional yet creative formatting
      - Emphasis on personality and achievements
      - Can include creative sections and layouts`;

    const prompt = `
      ${templatePrompt}
      
      Generate a ${mode === "ats" ? "clean, professional, ATS-friendly" : "creative, visually appealing"} resume based on the following details.
      Format the output as plain text with clear section headers. Do not use Markdown.
      
      ${modeSpecificInstructions}
      
      DETAILS:
      - Name: ${fullName}
      - Email: ${email}
      - Phone: ${phone || 'N/A'}
      - Target Job Title: ${jobTitle}
      - Intended Role: ${role || 'N/A'}
      - Professional Summary: ${summary || 'N/A'}
      - Work Experience: ${experience || 'N/A'}
      - Education: ${education || 'N/A'}
      - Skills: ${skills || 'N/A'}

      Ensure the output is well-structured, uses action verbs, and includes quantifiable achievements where possible.
      Return only the resume content without any additional explanations.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });




    const text = response.text;

    return NextResponse.json({ resume: text });
  } catch (err) {
    console.error("Error in API route:", err);
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}