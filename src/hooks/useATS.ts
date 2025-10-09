"use client";

import { useState } from "react";
import type { ATSScore, ResumeData } from "@/types/resume";

export const useATS = () => {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);

  const calculateATSScore = async (resumeData?: ResumeData) => {
    // যদি আগেই স্কোর থেকে থাকে, সেটাই রিটার্ন করে দিচ্ছি
    if (atsScore) return atsScore;

    // resumeData থাকলে — কিছু লজিক্যাল স্কোর ক্যালকুলেশন করতে পারো
    // এটা শুধু উদাহরণ (তুমি পরে নিজের মতো স্কোরিং লজিক দিতে পারবে)
    const skillScore = resumeData?.skills?.length ? Math.min(100, resumeData.skills.length * 10) : 60;
    const projectScore = resumeData?.projects?.length ? Math.min(100, resumeData.projects.length * 5) : 50;
    const overall = Math.round((skillScore + projectScore) / 2);

    const score: ATSScore = {
      overall,
      breakdown: {
        keywords: skillScore,
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

  const getATSScoreColor = (score: number): string => {
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  const getATSScoreLabel = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return { atsScore, calculateATSScore, getATSScoreColor, getATSScoreLabel };
};
