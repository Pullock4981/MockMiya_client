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

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  const { atsScore, calculateATSScore } = useATS();

  const [showATSDetails, setShowATSDetails] = useState(false);
  const [template, setTemplate] = useState<string>("Classic");
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const userId = "user_12345";

  useEffect(() => {
    const timer = setTimeout(() => calculateATSScore(resumeData), 500);
    return () => clearTimeout(timer);
  }, [resumeData, calculateATSScore]);

  const isEmpty =
    !resumeData.personalInfo.firstName &&
    !resumeData.personalInfo.lastName &&
    !resumeData.summary &&
    resumeData.skills.length === 0 &&
    resumeData.projects.length === 0 &&
    resumeData.workExperience.length === 0 &&
    resumeData.education.length === 0 &&
    resumeData.certifications.length === 0;

  // Render template based on selection
  const renderTemplate = () => {
    if (isEmpty) return <EmptyState />;

    switch (template) {
      case "Modern":
        return <ModernTemplate />;
      case "Creative":
        return (
          <div className="font-mono text-sm tracking-tight">
            <ClassicTemplate />
          </div>
        );
      default:
        // Default view is ClassicTemplate
        return <ClassicTemplate />;
    }
  };

  return (
    <div className="space-y-6">
      <ResumeControls
        atsScore={atsScore?.overall}
        showATSDetails={showATSDetails}
        setShowATSDetails={setShowATSDetails}
        template={template}
        setTemplate={setTemplate}
        theme={theme}
        setTheme={setTheme}
        userId={userId}
      />

      {showATSDetails && atsScore && <ATSDetails atsScore={atsScore} />}

      <div
        id="resume-preview"
        className="overflow-hidden bg-white"
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
