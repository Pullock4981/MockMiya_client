"use client";

import { useState } from "react";
import { AIsuggestion, ResumeData } from "@/types/resume";

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);

  const getSuggestions = async (resumeData: ResumeData, section: string) => {
    // mock suggestion logic
    const mock: AIsuggestion[] = [
      {
        section: "summary",
        field: "summary",
        originalText: resumeData.summary,
        suggestedText: "Motivated developer with strong experience in TypeScript and React.",
        reason: "Make summary more impactful and keyword-rich",
        confidence: 0.9,
      },
    ];
    setSuggestions(mock);
    return mock;
  };

  return { suggestions, getSuggestions };
};
