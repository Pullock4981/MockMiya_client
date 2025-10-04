"use client";

import { useState } from "react";
import { ATSScore, ResumeData } from "@/types/resume";

export const useATS = () => {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);

  // calculateATSScore now requires ResumeData
  const calculateATSScore = async (resumeData: ResumeData) => {
    // Demo scoring logic, replace with real calculation
    const score: ATSScore = {
      overall: 80,
      breakdown: {
        keywords: 75,
        formatting: 90,
        sections: 80,
        length: 70,
      },
      suggestions: ["Add more relevant keywords", "Improve summary section"],
      passedChecks: ["Has work experience", "Has skills listed"],
      failedChecks: ["No LinkedIn link found"],
    };
    setAtsScore(score);
    return score;
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  const getATSScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return { atsScore, calculateATSScore, getATSScoreColor, getATSScoreLabel };
};
