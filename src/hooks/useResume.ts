"use client";

import { useState, useMemo, useCallback } from "react";
import { usePersonalInfo } from "@/context/ResumeContext/PersonalInfo";
import { useSummary } from "@/context/ResumeContext/Summary";
import { useWorkExperience } from "@/context/ResumeContext/WorkExperience";
import { useEducation } from "@/context/ResumeContext/Education";
import { useSkills } from "@/context/ResumeContext/Skills";
import { useProjects } from "@/context/ResumeContext/Projects";
import { useCertifications } from "@/context/ResumeContext/Certifications";
import { useProfessionalLinks } from "@/context/ResumeContext/ProfessionalLinks";
import { useAdditionalInfo } from "@/context/ResumeContext/AdditionalInfo";
import { useMeta } from "@/context/ResumeContext/MetaContext";
import { ResumeData, FormStep } from "@/types/resume";
import { useATS } from "./useATS";
import { useAuth } from "@/context/AuthContext";

export const useResume = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  // --- Form steps setup ---
  const formSteps: FormStep[] = [
    { id: "personal", title: "Personal Info", description: "Add your personal details", component: "PersonalInfoForm", isCompleted: false, isRequired: true },
    { id: "summary", title: "Summary", description: "Write a short summary", component: "SummaryForm", isCompleted: false, isRequired: true },
    { id: "work", title: "Work Experience", description: "Add your work history", component: "WorkExperienceForm", isCompleted: false, isRequired: true },
    { id: "education", title: "Education", description: "Add your education", component: "EducationForm", isCompleted: false, isRequired: true },
    { id: "skills", title: "Skills", description: "Add your skills", component: "SkillsForm", isCompleted: false, isRequired: true },
    { id: "projects", title: "Projects", description: "Showcase projects", component: "ProjectsForm", isCompleted: false, isRequired: false },
    { id: "certifications", title: "Certifications", description: "List your certifications", component: "CertificationsForm", isCompleted: false, isRequired: false },
    { id: "links", title: "Professional Links", description: "Add LinkedIn, GitHub etc", component: "ProfessionalLinksForm", isCompleted: false, isRequired: false },
    { id: "additional", title: "Additional Info", description: "Languages, awards, etc.", component: "AdditionalInfoForm", isCompleted: false, isRequired: false },
    { id: "ai", title: "AI ReTouch", description: "Get AI suggestions", component: "AIReTouchForm", isCompleted: false, isRequired: false },
  ];

  // --- Navigation handlers ---
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
  const previousStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  // --- Context hooks ---
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();
  const { summary, updateSummary } = useSummary();
  const { workExperience, addWork, updateWork, removeWork } = useWorkExperience();
  const { education, addEducation, updateEducation, removeEducation } = useEducation();
  const { skills, addSkill, updateSkill, removeSkill } = useSkills();
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const { certifications, addCertification, updateCertification, removeCertification } = useCertifications();
  const { socialLinks, addLink, updateLink, removeLink } = useProfessionalLinks();
  const { additionalInfo, addLanguage, removeLanguage, updateAdditionalInfo } = useAdditionalInfo();
  const { template, theme, aiSuggestions, updateTemplate, updateTheme } = useMeta();
  const { atsScore, calculateATSScore } = useATS();

  // --- Resume ID Generator ---
  const generateResumeId = useCallback(() => {
    const firstNamePart = personalInfo?.firstName?.slice(0, 3).toUpperCase() || "USR";
    const templatePart = template?.name?.slice(0, 3).toUpperCase() || "TMP";
    const userPart = user?.uid?.slice(-4)?.toUpperCase() || Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${firstNamePart}-${templatePart}-${userPart}`;
  }, [personalInfo?.firstName, template?.name, user?.uid]);

  // --- Build Resume Data (now includes email) ---
  const buildResumeData = useCallback((): ResumeData => ({
    id: generateResumeId(),
    userEmail: user?.email || "", 
    personalInfo,
    summary,
    workExperience,
    education,
    skills,
    projects,
    certifications,
    socialLinks,
    additionalInfo,
    template,
    theme,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), [
    personalInfo,
    summary,
    workExperience,
    education,
    skills,
    projects,
    certifications,
    socialLinks,
    additionalInfo,
    template,
    theme,
    generateResumeId,
    user?.email
  ]);

  const resumeData = useMemo(() => buildResumeData(), [buildResumeData]);

  // --- AI Suggestions ---
  const getAISuggestions = async (section: string) => {
    console.log("AI suggestions requested for:", section);
    return aiSuggestions.filter(s => s.section === section);
  };

  // --- Export Resume ---
  const exportResumeHandler = async () => {
    try {
      const html = document.getElementById("resume-preview")?.outerHTML;
      if (html) {
        await fetch("/resume/api/export-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            htmlContent: html,
            fileName: `${resumeData.id}.pdf`,
            email: user?.email || "",
          }),
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return {
    currentStep,
    formSteps,
    nextStep,
    previousStep,
    goToStep,
    getAISuggestions,
    resumeData,
    personalInfo,
    updatePersonalInfo,
    summary,
    updateSummary,
    workExperience,
    addWork,
    updateWork,
    removeWork,
    education,
    addEducation,
    updateEducation,
    removeEducation,
    skills,
    addSkill,
    updateSkill,
    removeSkill,
    projects,
    addProject,
    updateProject,
    removeProject,
    certifications,
    addCertification,
    updateCertification,
    removeCertification,
    socialLinks,
    addLink,
    updateLink,
    removeLink,
    additionalInfo,
    addLanguage,
    removeLanguage,
    updateAdditionalInfo,
    template,
    updateTemplate,
    theme,
    updateTheme,
    exportResumeHandler,
    atsScore,
    calculateATSScore,
    aiSuggestions,
    buildResumeData,
  };
};
