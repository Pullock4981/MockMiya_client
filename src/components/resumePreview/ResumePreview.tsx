// src/components/resumePreview/ResumePreview.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useResume } from "@/hooks/useResume";
import { useATS } from "@/hooks/useATS";

import ATSDetails from "./ATSDetails";
import ResumeControls from "./ResumeControls";
import EmptyState from "./EmptyState";

// Templates
import ModernTemplate from "../templates/ModernTemplate";
import ClassicTemplate from "../templates/ClassicTemplate";

import { useMeta } from "@/context/ResumeContext/MetaContext";
import { useAuth } from "@/context/AuthContext";

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  const { calculateATSScore } = useATS();
  const { template, theme, setATSScore, atsScore } = useMeta();
  const [showATSDetails, setShowATSDetails] = useState(false);
  const { user } = useAuth();
  const userId = user?.email || "";

  // Default template & theme fallback
  const currentTemplate = template ?? {
    id: "default",
    name: "Classic",
    layout: "classic",
    sections: [],
  };

  const currentTheme = theme ?? {
    id: "default",
    name: "Default",
    primaryColor: "#2563eb",
    accentColor: "#9333ea",
    textColor: "#111827",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
  };

  // ATS score calculate & save
  useEffect(() => {
    const timer = setTimeout(() => {
      const calculateScore = async () => {
        try {
          const score = await calculateATSScore(resumeData);
          setATSScore(score);
        } catch (error) {
          console.error("ATS calculation failed:", error);
        }
      };
      calculateScore();
    }, 500);

    return () => clearTimeout(timer);
  }, [resumeData, calculateATSScore, setATSScore]);

  // Check if resume is empty safely
  const isEmpty =
    !resumeData.personalInfo?.firstName &&
    !resumeData.personalInfo?.lastName &&
    !resumeData.summary &&
    !(resumeData.skills?.length > 0) &&
    !(resumeData.projects?.length > 0) &&
    !(resumeData.workExperience?.length > 0) &&
    !(resumeData.education?.length > 0) &&
    !(resumeData.certifications?.length > 0);

  // Render template dynamically
  const renderTemplate = () => {
    if (isEmpty) return <EmptyState />;

    switch (currentTemplate.name) {
      case "Modern":
        return <ModernTemplate theme={currentTheme} />;
      case "Creative":
        return <ClassicTemplate theme={currentTheme} />;
      default:
        return <ClassicTemplate theme={currentTheme} />;
    }
  };

  return (
    <div className="space-y-6">
      <ResumeControls
        showATSDetails={showATSDetails}
        setShowATSDetails={setShowATSDetails}
        resumeId={resumeData.id || ""}
      />



      {showATSDetails && atsScore && <ATSDetails atsScore={atsScore} />}

      <div
        id="resume-preview"
        className="overflow-hidden"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.textColor,
          fontFamily: currentTheme.fontFamily,
        }}
      >
        {/* এই div শুধু wrapper */}
        <div id="resume-template">
          {renderTemplate()}
        </div>
      </div>

    </div>
  );
};

export default ResumePreview;
