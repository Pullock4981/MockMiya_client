"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";


const ResumeProfessionalLinks: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const links = Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks : [];
  if (!links.length) return null;

  return (
    <div className="space-y-3">
      <h2 style={{ color: getTextColor("heading") }} className="text-xl font-semibold border-b border-gray-300 pb-1">
        Professional Links
      </h2>
      <ul className="space-y-1">
        {links.map((link, index) => (
          <li key={link.id || index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: getTextColor("link"), fontSize: "0.875rem" }}
            >
              {link.platform}: {link.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeProfessionalLinks;
