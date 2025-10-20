import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface RequestBody {
  name: string;
  jobRole: string;
  companyName: string;
  conversationHistory: string;
  lastUserMessage: string;
  getQuestion?: boolean;
  evaluateAnswer?: boolean;
  getFeedback?: boolean;
  totalScore?: number;
  questionsAnswered?: number;
  previousScore?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { 
      name, 
      jobRole, 
      companyName, 
      conversationHistory, 
      lastUserMessage,
      getQuestion,
      evaluateAnswer,
      getFeedback,
      totalScore,
      questionsAnswered,
      previousScore
    } = body;

    if (!jobRole || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    });

    let prompt = '';

    if (getQuestion) {
      // If previous answer was wrong, ask a different type of question
      let questionContext = '';
      if (previousScore === 'INCORRECT') {
        questionContext = `The candidate struggled with the previous technical question. Ask a different type of question, perhaps behavioral or about fundamental concepts.`;
      } else if (previousScore === 'HALF_CORRECT') {
        questionContext = `The candidate was partially correct on the last question. Ask a follow-up question to clarify or a similar but simpler question.`;
      }

      prompt = `
        You are conducting a professional job interview for ${name} for a ${jobRole} position at ${companyName}.
        
        Guidelines:
        - Ask ONE clear technical or behavioral question
        - Make sure the question has a clear correct/incorrect answer
        - Keep it concise (1 sentence)
        - Make it relevant to ${jobRole} role
        ${questionContext}
        
        Conversation so far:
        ${conversationHistory}
        
        Provide only the next question, no additional text.
      `;
    } 
    else if (evaluateAnswer) {
      prompt = `
        You are evaluating an interview answer for a ${jobRole} position.
        
        JOB ROLE: ${jobRole}
        COMPANY: ${companyName}
        CANDIDATE: ${name}
        
        CONVERSATION HISTORY:
        ${conversationHistory}
        
        CANDIDATE'S ANSWER TO EVALUATE:
        "${lastUserMessage}"
        
        Evaluation Instructions:
        1. Analyze if the answer is FULL_CORRECT, HALF_CORRECT, or INCORRECT
        2. Provide brief constructive feedback (1 sentence)
        3. If answer is INCORRECT, provide a DIFFERENT type of question next (not the same topic)
        4. If answer is HALF_CORRECT, provide a follow-up question to clarify
        5. If answer is FULL_CORRECT, provide a more challenging question
        
        Scoring Criteria:
        - FULL_CORRECT: Answer is completely accurate, relevant, and well-explained
        - HALF_CORRECT: Answer is partially correct but missing key elements or unclear  
        - INCORRECT: Answer is wrong, irrelevant, or doesn't address the question
        
        Response Format (use this exact format):
        SCORE: [FULL_CORRECT/HALF_CORRECT/INCORRECT]
        FEEDBACK: [Your feedback here]
        NEXT_QUESTION: [Next question here - make it different based on score]
      `;
    }
    else if (getFeedback) {
      prompt = `
        Provide final interview feedback for ${name} who applied for ${jobRole} at ${companyName}.
        
        Performance: ${totalScore} out of ${questionsAnswered} questions correct
        Conversation History:
        ${conversationHistory}
        
        Provide constructive feedback on:
        - Technical knowledge
        - Communication skills
        - Areas for improvement
        - Overall recommendation
        
        Keep it professional and encouraging (3-4 sentences).
      `;
    }
    else {
      prompt = `
        Continue the interview conversation naturally.
        
        Job Role: ${jobRole}
        Company: ${companyName}
        Candidate: ${name}
        
        Conversation History:
        ${conversationHistory}
        
        Last Candidate Response:
        "${lastUserMessage}"
        
        Provide a relevant follow-up question or response.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    return NextResponse.json({ text });

  } catch (err) {
    // console.error("Error in interview API route:", err);
    return NextResponse.json({ 
      error: "Failed to generate interview response",
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}