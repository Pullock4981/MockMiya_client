"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";

const ResumeWorkExperience: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  if (!resumeData.workExperience.length) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Work Experience
      </h2>
      {resumeData.workExperience.map((exp, index) => (
        <div key={exp.id || index} style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h3 style={{ color: getTextColor("subHeading"), fontWeight: 600 }}>{exp.jobTitle}</h3>
            <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>
              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </span>
          </div>
          <div style={{ fontWeight: 500, color: getTextColor("subHeading") }}>
            {exp.company} • {exp.location}
          </div>
          {exp.responsibilities.length > 0 && (
            <ul style={{ marginLeft: "1rem", color: getTextColor("subHeading"), fontSize: "0.875rem" }}>
              {exp.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)}
            </ul>
          )}
          {exp.achievements.length > 0 && (
            <ul style={{ marginLeft: "1rem", color: getTextColor("subHeading"), fontSize: "0.875rem", fontWeight: 500 }}>
              {exp.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeWorkExperience;
