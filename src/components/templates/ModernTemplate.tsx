import React from "react";
import { ResumeTheme } from "@/types/resume";
import { useResume } from "@/hooks/useResume";
import ResumeSkills from "../resumePreview/ResumeSkills";
import ResumeCertifications from "../resumePreview/ResumeCertifications";
import ResumeProfessionalLinks from "../resumePreview/ResumeProfessionalLinks";
import ResumeAdditionalInfo from "../resumePreview/ResumeAdditionalInfo";
import ResumeSummary from "../resumePreview/ResumeSummary";
import ResumeWorkExperience from "../resumePreview/ResumeWorkExperience";
import ResumeEducation from "../resumePreview/ResumeEducation";
import ResumeProjects from "../resumePreview/ResumeProjects";
import Image from "next/image";

interface ModernTemplateProps {
  theme?: ResumeTheme;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ theme }) => {
  const { resumeData } = useResume();
  const personal = resumeData.personalInfo;

  const headerColor = theme?.primaryColor || "#1e40af"; 
  const placeholderBg = theme?.accentColor || "#2563eb";
  const initials = `${personal.firstName?.[0] || ""}${personal.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      className="p-5 font-sans grid grid-cols-1 md:grid-cols-2 gap-6"
      style={{ backgroundColor: theme?.backgroundColor || "#ffffff", color: theme?.textColor || "#111827", fontFamily: theme?.fontFamily || "Inter" }}
    >
      {/* ===== HEADER ===== */}
      <header className="col-span-2 flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gray-200 pb-4 mb-6">
        <div className="flex items-center gap-4">
          {personal.profileImage ? (
            <Image
              src={personal.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: placeholderBg }}
            >
              {initials}
            </div>
          )}

          <div className="space-y-3">
            <h1 className="text-2xl font-bold" style={{ color: headerColor }}>
              {personal.firstName} {personal.lastName}
            </h1>
            <p className="text-base" style={{ color: headerColor }}>
              {personal.jobTitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-0 text-sm">
              {personal.phone && <span>📞 {personal.phone}</span>}
              {personal.email && <span>📧 {personal.email}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
        <div className="space-y-6 p-4">
          <ResumeSummary />
          <ResumeEducation />
          <ResumeWorkExperience />
          <ResumeProjects />
        </div>

        <div className="space-y-6 p-4">
          <ResumeSkills />
          <ResumeCertifications />
          <ResumeProfessionalLinks />
          <ResumeAdditionalInfo />
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
