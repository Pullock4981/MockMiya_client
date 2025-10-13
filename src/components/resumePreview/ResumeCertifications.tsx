"use client";

import React from "react";
import { useResume } from "@/hooks/useResume";

interface ResumeCertificationsProps {
  fontSize?: string;
  lineHeight?: string;
}

const ResumeCertifications: React.FC<ResumeCertificationsProps> = ({ lineHeight = "tight" }) => {
  const { resumeData } = useResume();
  const certifications = Array.isArray(resumeData.certifications) ? resumeData.certifications : [];
  if (certifications.length === 0) return null;

  return (
    <div className={`space-y-4 ${lineHeight}`}>
      <h2 style={{ color: "#252525" }} className="text-xl font-semibold border-b border-gray-300 pb-1">
        Certifications
      </h2>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={cert.id || index} className="space-y-1">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <h3 style={{ fontWeight: 600, color: "#343434" }}>{cert.name}</h3>
              <span style={{ color: "#777", fontSize: "0.875rem" }}>{cert.dateEarned}</span>
            </div>
            <div style={{ color: "#34A853" }}>{cert.issuer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeCertifications;
