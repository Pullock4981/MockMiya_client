




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
  const { template, theme, setATSScore, atsScore } = useMeta(); // Context থেকে template, theme এবং atsScore

  const [showATSDetails, setShowATSDetails] = useState(false);

  const { user } = useAuth();
  const userId = user?.email || "";
  console.log(resumeData)

  // ATS score calculate করে context এ save করা (async handled)
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

  // Check if resume is empty
  const isEmpty =
    !resumeData.personalInfo?.firstName &&
    !resumeData.personalInfo?.lastName &&
    !resumeData.summary &&
    resumeData.skills.length === 0 &&
    resumeData.projects.length === 0 &&
    resumeData.workExperience.length === 0 &&
    resumeData.education.length === 0 &&
    resumeData.certifications.length === 0;

  // Render template dynamically
  const renderTemplate = () => {
    if (isEmpty) return <EmptyState />;

    switch (template.name) {
      case "Modern":
        return <ModernTemplate theme={theme} />;
      case "Creative":
        return <ClassicTemplate theme={theme} />;
      default:
        return <ClassicTemplate theme={theme} />;
    }
  };

  return (
    <div className="space-y-6">
      <ResumeControls
        showATSDetails={showATSDetails}
        setShowATSDetails={setShowATSDetails}
        userId={userId}
      />

      {showATSDetails && atsScore && <ATSDetails atsScore={atsScore} />}

      <div
        id="resume-preview"
        className="overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;
