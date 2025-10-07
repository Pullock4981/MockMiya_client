import React from "react";
import { ResumeTheme } from "@/types/resume";
import ResumeHeader from "../resumePreview/ResumeHeader";
import ResumeSummary from "../resumePreview/ResumeSummary";
import ResumeWorkExperience from "../resumePreview/ResumeWorkExperience";
import ResumeEducation from "../resumePreview/ResumeEducation";
import ResumeSkills from "../resumePreview/ResumeSkills";
import ResumeProjects from "../resumePreview/ResumeProjects";
import ResumeCertifications from "../resumePreview/ResumeCertifications";
import ResumeAdditionalInfo from "../resumePreview/ResumeAdditionalInfo";

interface ClassicTemplateProps {
  theme?: ResumeTheme; // optional, যাতে আগে compatibility থাকে
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ theme }) => {
  return (
    <div
      className="font-serif text-base py-6 px-10 space-y-3"
      style={{
        backgroundColor: theme?.backgroundColor || "#ffffff",
        color: theme?.textColor || "#111827",
        fontFamily: theme?.fontFamily || "serif",
      }}
    >
      <ResumeHeader />
      <ResumeSummary />
      <ResumeSkills />
      <ResumeEducation />
      <ResumeWorkExperience />
      <ResumeProjects />
      <ResumeCertifications />
      <ResumeAdditionalInfo />
    </div>
  );
};

export default ClassicTemplate;
