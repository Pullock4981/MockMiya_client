"use client";
import React from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeTheme } from "../../context/ResumeContext/ResumeThemeContext";

const ResumeHeader: React.FC = () => {
  const { resumeData } = useResume();
  const { getTextColor } = useResumeTheme();
  const { firstName, lastName, jobTitle, email, phone, location } = resumeData.personalInfo;
  const professionalLinks = resumeData.socialLinks || [];

  return (
    <section className="text-center">
      {/* Name */}
      <h1
        style={{ color: getTextColor("heading") }}
        className="font-bold text-5xl"
      >
        {firstName || lastName ? (
          `${firstName} ${lastName}`
        ) : (
          <span className="inline-block w-32 h-6 bg-gray-100 animate-pulse rounded" />
        )}
      </h1>

      {/* Job Title */}
      {jobTitle ? (
        <div
          style={{ color: getTextColor("subHeading"), fontWeight: 500 }}
          className="text-sm"
        >
          {jobTitle}
        </div>
      ) : (
        <div className="w-24 h-4 bg-gray-100 animate-pulse mx-auto rounded" />
      )}

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {location ? (
          location
        ) : (
          <span className="w-24 h-3 bg-gray-100 animate-pulse inline-block rounded" />
        )}
        {email ? (
          `  |  ${email}`
        ) : (
          <span className="w-32 h-3 bg-gray-100 animate-pulse inline-block rounded" />
        )}
        {phone ? (
          `  |  ${phone}`
        ) : (
          <span className="w-24 h-3 bg-gray-100 animate-pulse inline-block rounded" />
        )}
      </div>

      {/* Social Links */}
      {professionalLinks.length > 0 ? (
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
      ) : (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {/* Placeholder for links */}
          {Array.from({ length: 3 }).map((_, idx) => (
            <span
              key={idx}
              className="w-16 h-3 bg-gray-100 animate-pulse inline-block rounded"
            />
          ))}
        </div>
      )}

      <hr className="border-2 border-gray-300 border-dashed mt-2" />
    </section>
  );
};

export default ResumeHeader;
