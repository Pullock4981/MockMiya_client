"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeProjects: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const hasProjects = resumeData.projects.length > 0;

  return (
    <section style={{ marginBottom: "1rem" }}>
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Projects
      </h2>

      {hasProjects ? (
        resumeData.projects.map((project, index) => (
          <div key={project.id || index} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <h3 style={{ fontWeight: 600, color: getTextColor("subHeading") }}>{project.name}</h3>
              <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>
                {project.startDate} - {project.endDate || "Present"}
              </span>
            </div>
            <p style={{ color: getTextColor("subHeading"), fontSize: "0.875rem", margin: "0.25rem 0" }}>{project.description}</p>
          </div>
        ))
      ) : (
        <div className="h-24 bg-gray-100 rounded animate-pulse mt-2" />
      )}
    </section>
  );
};

export default ResumeProjects;
