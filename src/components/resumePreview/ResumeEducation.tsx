"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";

const ResumeEducation: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  if (!resumeData.education.length) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Education
      </h2>
      {resumeData.education.map((edu, index) => (
        <div key={edu.id || index} style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 600, color: getTextColor("subHeading") }}>{edu.degree}</h3>
            <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>{edu.graduationDate}</span>
          </div>
          <div style={{ color: getTextColor("subHeading") }}>{edu.institution} • {edu.location}</div>
          {edu.gpa && <div style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>GPA: {edu.gpa}</div>}
          {edu.honors && <div style={{ color: getTextColor("subHeading"), fontSize: "0.875rem", fontWeight: 500 }}>{edu.honors}</div>}
        </div>
      ))}
    </div>
  );
};

export default ResumeEducation;
