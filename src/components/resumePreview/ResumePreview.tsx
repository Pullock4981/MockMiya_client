"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useResume } from "@/hooks/useResume";
import { useATS } from "@/hooks/useATS";

import ATSDetails from "./ATSDetails";
import ResumeControls from "./ResumeControls";
import ResumeHeader from "./ResumeHeader";
import ResumeSummary from "./ResumeSummary";
import ResumeWorkExperience from "./ResumeWorkExperience";
import ResumeEducation from "./ResumeEducation";
import ResumeSkills from "./ResumeSkills";
import ResumeProjects from "./ResumeProjects";
import ResumeCertifications from "./ResumeCertifications";
import ResumeAdditionalInfo from "./ResumeAdditionalInfo";
import EmptyState from "./EmptyState";

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  const { atsScore, calculateATSScore } = useATS();

  const [showATSDetails, setShowATSDetails] = useState(false);
  const [template, setTemplate] = useState<"Single Column" | "Two Columns">("Single Column");
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const userId = "user_12345"; // Replace with dynamic userId if available

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

      <Card
        id="resume-preview"
        className={`overflow-hidden shadow-paper border-resume-border ${
          theme === "Dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div
          style={{ padding: "2rem", maxWidth: "794px", margin: "0 auto", fontFamily: "serif" }}
        >
          <ResumeHeader />
          {resumeData.summary && <ResumeSummary />}
          {resumeData.skills.length > 0 && <ResumeSkills />}
          {resumeData.projects.length > 0 && <ResumeProjects />}
          {resumeData.workExperience.length > 0 && <ResumeWorkExperience />}
          {resumeData.education.length > 0 && <ResumeEducation />}
          {resumeData.additionalInfo?.languages?.length > 0 && <ResumeAdditionalInfo />}
          {resumeData.certifications.length > 0 && <ResumeCertifications />}
          {isEmpty && <EmptyState />}
        </div>
      </Card>
    </div>
  );
};

export default ResumePreview;
