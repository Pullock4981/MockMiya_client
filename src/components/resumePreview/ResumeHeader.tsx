"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "./ResumeThemeContext";


const ResumeHeader: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const { firstName, lastName, jobTitle, email, phone, location } = resumeData.personalInfo;
  const professionalLinks = resumeData.socialLinks || [];

  if (!firstName && !lastName) return null;

  return (
    <div className="text-center space-y-2">
      <h1 style={{ color: getTextColor("heading") }} className="font-bold text-2xl lg:text-3xl">
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <div style={{ color: getTextColor("subHeading"), fontWeight: 500 }} className="text-sm">
          {jobTitle}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2 text-sm" style={{ color: getTextColor("subHeading") }}>
        {location && <span>{location}</span>}
        {email && <span>• {email}</span>}
        {phone && <span>• {phone}</span>}
      </div>
      {professionalLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {professionalLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: getTextColor("link") }}
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeHeader;
