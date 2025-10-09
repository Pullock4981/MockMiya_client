"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeProfessionalLinks: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const links = Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks : [];

  return (
    <section className="space-y-3">
      <h2 style={{ color: getTextColor("heading"), fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
        Find Me Online
      </h2>

      {links.length > 0 ? (
        <ul className="space-y-1">
          {links.map((link, index) => (
            <li key={link.id || index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: getTextColor("link"), fontSize: "0.875rem" }}
              >
                {link.platform}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-16 bg-gray-100 rounded animate-pulse mt-2" />
      )}
    </section>
  );
};

export default ResumeProfessionalLinks;
