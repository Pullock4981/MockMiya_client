"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeAdditionalInfo: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const additionalInfo = resumeData.additionalInfo || {};
  const hasLanguages = Array.isArray(additionalInfo.languages) && additionalInfo.languages.length > 0;
  const hasHobbies = Array.isArray(additionalInfo.hobbies) && additionalInfo.hobbies.length > 0;

  return (
    <section className="space-y-3">
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Additional Information
      </h2>

      {hasLanguages || hasHobbies ? (
        <div className="flex flex-wrap gap-8">
          {hasLanguages && (
            <div>
              <h3 style={{ fontWeight: 500, color: getTextColor("subHeading") }}>Languages</h3>
              <ul style={{ paddingLeft: "1rem", listStyleType: "disc" }}>
                {additionalInfo.languages.map((lang, idx) => (
                  <li key={lang.id || idx} style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>
                    {lang.name} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasHobbies && (
            <div>
              <h3 style={{ fontWeight: 500, color: getTextColor("subHeading") }}>Hobbies & Interests</h3>
              <ul style={{ paddingLeft: "1rem", listStyleType: "disc" }}>
                {additionalInfo.hobbies.map((hobby, idx) => (
                  <li key={idx} style={{ color: getTextColor("subHeading"), fontSize: "0.875rem" }}>{hobby}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="h-16 bg-gray-100 rounded animate-pulse mt-2" />
      )}
    </section>
  );
};

export default ResumeAdditionalInfo;
