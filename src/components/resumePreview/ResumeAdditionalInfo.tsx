"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";

interface ResumeAdditionalInfoProps {
  fontSize?: string; // e.g., "0.875rem"
  lineHeight?: string; // e.g., "1.5"
}

const ResumeAdditionalInfo: React.FC<ResumeAdditionalInfoProps> = ({
  fontSize = "0.875rem",
  lineHeight = "1.5",
}) => {
  const { resumeData } = useResume();
  const additionalInfo = resumeData.additionalInfo || {};

  const hasLanguages = Array.isArray(additionalInfo.languages) && additionalInfo.languages.length > 0;
  const hasHobbies = Array.isArray(additionalInfo.hobbies) && additionalInfo.hobbies.length > 0;

  if (!hasLanguages && !hasHobbies) return null;

  return (
    <div style={{ lineHeight }} className="space-y-3">
      <h2 style={{ color: "#252525", fontWeight: 600, fontSize: "1.25rem", borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Additional Information
      </h2>

      <div style={{ display: "flex", gap: "5rem", flexWrap: "wrap" }}>
        {/* Languages */}
        {hasLanguages && (
          <div>
            <h3 style={{ fontWeight: 500, color: "#343434" }}>Languages</h3>
            <ul style={{ paddingLeft: "1rem", fontSize, color: "#252525", listStyleType: "disc" }}>
              {additionalInfo.languages.map((lang, idx) => (
                <li key={lang.id || idx}>
                  {lang.name} - {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hobbies */}
        {hasHobbies && (
          <div>
            <h3 style={{ fontWeight: 500, color: "#343434" }}>Hobbies & Interests</h3>
            <ul style={{ paddingLeft: "1rem", fontSize, color: "#252525", listStyleType: "disc" }}>
              {additionalInfo.hobbies.map((hobby, idx) => (
                <li key={idx}>{hobby}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAdditionalInfo;
