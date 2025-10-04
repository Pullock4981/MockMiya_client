"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";

const ResumeSkills: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  if (!resumeData.skills.length) return null;

  return (
    <div className="space-y-3">
      <h2 style={{ color: getTextColor("heading") }} className="text-xl font-semibold border-b border-gray-300 pb-1">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill, index) => (
          <div
            key={skill.id || index}
            style={{
              backgroundColor: "rgba(52,52,52,0.1)",
              color: getTextColor("subHeading"),
              border: "1px solid rgba(52,52,52,0.2)",
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "0.875rem",
            }}
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeSkills;
