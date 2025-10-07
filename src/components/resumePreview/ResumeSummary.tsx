"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeSummary: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const hasContent = resumeData.summary?.trim().length > 0;

  return (
    <section className="space-y-2">
      <h2 style={{ color: getTextColor("heading") }} className="text-xl font-semibold border-b border-gray-300 pb-1">
        Professional Summary
      </h2>

      {hasContent ? (
        <p style={{ color: getTextColor("subHeading"), fontSize: "0.875rem", lineHeight: 1.5 }}>
          {resumeData.summary}
        </p>
      ) : (
        <div className="h-16 bg-gray-100 rounded animate-pulse" />
      )}
    </section>
  );
};

export default ResumeSummary;
