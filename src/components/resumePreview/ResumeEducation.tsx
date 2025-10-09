"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeEducation: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const hasEducation = resumeData.education.length > 0;

  return (
    <section style={{ marginBottom: "1rem" }}>
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Education
      </h2>

      {hasEducation ? (
        resumeData.education.map((edu, index) => (
          <div key={edu.id || index} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <h3 style={{ fontWeight: 600, color: getTextColor("subHeading") }}>{edu.degree}</h3>
              <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>{edu.graduationDate}</span>
            </div>
            <div style={{ color: getTextColor("subHeading") }}>{edu.institution} {edu.location}</div>
          </div>
        ))
      ) : (
        <div className="h-24 bg-gray-100 rounded animate-pulse mt-2" />
      )}
    </section>
  );
};

export default ResumeEducation;
