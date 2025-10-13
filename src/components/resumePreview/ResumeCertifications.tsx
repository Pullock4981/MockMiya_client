"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeCertifications: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const hasCerts = Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0;

  return (
    <section className="space-y-3">
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Certifications
      </h2>

      {hasCerts ? (
        resumeData.certifications.map((cert, index) => (
          <div key={cert.id || index} className="space-y-1">
            <div className="flex justify-between">
              <h3 style={{ fontWeight: 600, color: getTextColor("subHeading") }}>{cert.name}</h3>
              <span style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>{cert.dateEarned}</span>
            </div>
            <div style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>{cert.issuer}</div>
          </div>
        ))
      ) : (
        <div className="h-16 bg-gray-100 rounded animate-pulse mt-2" />
      )}
    </section>
  );
};

export default ResumeCertifications;
