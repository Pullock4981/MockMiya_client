"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";


const ResumeSummary: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  if (!resumeData.summary) return null;

  return (
    <div className="space-y-2">
      <h2 style={{ color: getTextColor("heading") }} className="text-xl font-semibold border-b border-gray-300 pb-1">
        Professional Summary
      </h2>
      <p style={{ color: getTextColor("subHeading"), fontSize: "0.875rem", lineHeight: 1.5 }}>
        {resumeData.summary}
      </p>
    </div>
  );
};

export default ResumeSummary;
