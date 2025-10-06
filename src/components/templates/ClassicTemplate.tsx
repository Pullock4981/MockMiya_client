"use client";

import React from "react";
import ResumeHeader from "../resumePreview/ResumeHeader";
import ResumeSummary from "../resumePreview/ResumeSummary";
import ResumeWorkExperience from "../resumePreview/ResumeWorkExperience";
import ResumeEducation from "../resumePreview/ResumeEducation";
import ResumeSkills from "../resumePreview/ResumeSkills";
import ResumeProjects from "../resumePreview/ResumeProjects";
import ResumeCertifications from "../resumePreview/ResumeCertifications";
import ResumeAdditionalInfo from "../resumePreview/ResumeAdditionalInfo";

const ClassicTemplate: React.FC = () => {
  return (
    <div className="font-serif text-base py-6 px-10 space-y-6">

      {/* Header */}
      <ResumeHeader />

      {/* Summary */}
      <ResumeSummary />

      {/* Skills */}
      <ResumeSkills/>

      {/* Education */}
      <ResumeEducation />

      {/* Work Experience */}
      <ResumeWorkExperience />

      {/* Projects */}
      <ResumeProjects />

      {/* Certifications */}
      <ResumeCertifications />

      {/* Additional Info */}
      <ResumeAdditionalInfo />

    </div>
  );
};

export default ClassicTemplate;
