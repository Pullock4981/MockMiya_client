"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";

const ResumeProjects: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  if (!resumeData.projects.length) return null;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Projects
      </h2>
      {resumeData.projects.map((project, index) => (
        <div key={project.id || index} style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 600, color: getTextColor("subHeading") }}>{project.name}</h3>
            <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>
              {project.startDate} - {project.endDate || "Present"}
            </span>
          </div>
          <p style={{ color: getTextColor("subHeading"), fontSize: "0.875rem", margin: "0.25rem 0" }}>{project.description}</p>
          {project.technologies.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {project.technologies.map((tech, idx) => (
                <div key={idx} style={{
                  border: "1px solid rgba(52,52,52,0.2)",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  color: getTextColor("subHeading")
                }}>
                  {tech}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeProjects;
