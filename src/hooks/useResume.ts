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
import { saveResumeStep } from "@/utils/resumeActions";

import { v4 as uuidv4 } from "uuid";

export const useResume = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeId] = useState(() => uuidv4());
  const { user } = useAuth();

  const { personalInfo, updatePersonalInfo } = usePersonalInfo();
  const { summary, updateSummary } = useSummary();
  const { workExperience, addWork, updateWork, removeWork } =
    useWorkExperience();
  const { education, addEducation, updateEducation, removeEducation } =
    useEducation();
  const { skills, addSkill, updateSkill, removeSkill } = useSkills();
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const {
    certifications,
    addCertification,
    updateCertification,
    removeCertification,
  } = useCertifications();
  const { socialLinks, addLink, updateLink, removeLink } =
    useProfessionalLinks();
  const { additionalInfo, addLanguage, removeLanguage, updateAdditionalInfo } =
    useAdditionalInfo();
  const { template, theme, aiSuggestions, updateTemplate, updateTheme } =
    useMeta();
  const { atsScore, calculateATSScore } = useATS();

  const formSteps: FormStep[] = useMemo(
    () => [
      {
        id: "personal",
        title: "Personal Info",
        description: "Add your personal details",
        component: "PersonalInfoForm",
        isCompleted: false,
        isRequired: true,
      },
      {
        id: "summary",
        title: "Summary",
        description: "Write a short summary",
        component: "SummaryForm",
        isCompleted: false,
        isRequired: true,
      },
      {
        id: "work",
        title: "Work Experience",
        description: "Add your work history",
        component: "WorkExperienceForm",
        isCompleted: false,
        isRequired: true,
      },
      {
        id: "education",
        title: "Education",
        description: "Add your education",
        component: "EducationForm",
        isCompleted: false,
        isRequired: true,
      },
      {
        id: "skills",
        title: "Skills",
        description: "Add your skills",
        component: "SkillsForm",
        isCompleted: false,
        isRequired: true,
      },
      {
        id: "projects",
        title: "Projects",
        description: "Showcase projects",
        component: "ProjectsForm",
        isCompleted: false,
        isRequired: false,
      },
      {
        id: "certifications",
        title: "Certifications",
        description: "List your certifications",
        component: "CertificationsForm",
        isCompleted: false,
        isRequired: false,
      },
      {
        id: "links",
        title: "Professional Links",
        description: "Add LinkedIn, GitHub etc",
        component: "ProfessionalLinksForm",
        isCompleted: false,
        isRequired: false,
      },
      {
        id: "additional",
        title: "Additional Info",
        description: "Languages, awards, etc.",
        component: "AdditionalInfoForm",
        isCompleted: false,
        isRequired: false,
      },
      {
        id: "ai",
        title: "AI ReTouch",
        description: "Get AI suggestions",
        component: "AIReTouchForm",
        isCompleted: false,
        isRequired: false,
      },
    ],
    []
  );

  // Build safe resume data with defaults
  const buildResumeData = useCallback(
    (): ResumeData => ({
      id: resumeId,
      userEmail: user?.email || "",
      personalInfo: personalInfo ?? {},
      summary: summary ?? "",
      workExperience: workExperience ?? [],
      education: education ?? [],
      skills: skills ?? [],
      projects: projects ?? [],
      certifications: certifications ?? [],
      socialLinks: socialLinks ?? [],
      additionalInfo: additionalInfo ?? {},
      template: template ?? {
        id: "default",
        name: "Classic",
        layout: "classic",
        sections: [],
      },
      theme: theme ?? {
        id: "default",
        name: "Default",
        primaryColor: "#2563eb",
        accentColor: "#9333ea",
        textColor: "#111827",
        backgroundColor: "#ffffff",
        fontFamily: "Inter",
      },
      meta: {
        currentStep,
        completed: currentStep === formSteps.length - 1,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [
      resumeId,
      user?.email,
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
      currentStep,
      formSteps.length,
    ]
  );

  const resumeData = useMemo(() => buildResumeData(), [buildResumeData]);

  // Navigation
  const nextStep = async () => {
    try {
      await saveResumeStep(resumeData.id, resumeData.userEmail, resumeData);
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    } catch (err) {
      console.error("Failed to save resume step:", err);
    }
  };

  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  // AI suggestions
  const getAISuggestions = async (section: string) =>
    aiSuggestions?.filter((s) => s.section === section) ?? [];

  // Export resume as PDF
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
    } catch (err) {
      console.error("Export failed:", err);
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
