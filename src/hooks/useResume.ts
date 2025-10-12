// "use client";

// import { useState, useMemo, useCallback, useEffect } from "react";
// import { usePersonalInfo } from "@/context/ResumeContext/PersonalInfo";
// import { useSummary } from "@/context/ResumeContext/Summary";
// import { useWorkExperience } from "@/context/ResumeContext/WorkExperience";
// import { useEducation } from "@/context/ResumeContext/Education";
// import { useSkills } from "@/context/ResumeContext/Skills";
// import { useProjects } from "@/context/ResumeContext/Projects";
// import { useCertifications } from "@/context/ResumeContext/Certifications";
// import { useProfessionalLinks } from "@/context/ResumeContext/ProfessionalLinks";
// import { useAdditionalInfo } from "@/context/ResumeContext/AdditionalInfo";
// import { useMeta } from "@/context/ResumeContext/MetaContext";
// import { ResumeData, FormStep } from "@/types/resume";
// import { useATS } from "./useATS";
// import { useAuth } from "@/context/AuthContext";
// import { saveResumeStep } from "@/utils/resumeActions";

// import { v4 as uuidv4 } from "uuid";

// export const useResume = (initialData?: ResumeData) => {
//   const { user } = useAuth();

//   const [currentStep, setCurrentStep] = useState<number>(() => {
//     if (typeof window !== "undefined") {
//       const savedStep = localStorage.getItem("resumeCurrentStep");
//       return savedStep
//         ? Number(savedStep)
//         : initialData?.meta?.currentStep ?? 0;
//     }
//     return initialData?.meta?.currentStep ?? 0;
//   });

//   const [resumeId] = useState<string>(() => initialData?.id || uuidv4());

//   // -----------------------
//   // Context hooks
//   // -----------------------
//   const { personalInfo, updatePersonalInfo } = usePersonalInfo();
//   const { summary, updateSummary } = useSummary();
//   const { workExperience, addWork, updateWork, removeWork } =
//     useWorkExperience();
//   const { education, addEducation, updateEducation, removeEducation } =
//     useEducation();
//   const { skills, addSkill, updateSkill, removeSkill } = useSkills();
//   const { projects, addProject, updateProject, removeProject } = useProjects();
//   const {
//     certifications,
//     addCertification,
//     updateCertification,
//     removeCertification,
//   } = useCertifications();
//   const { socialLinks, addLink, updateLink, removeLink } =
//     useProfessionalLinks();
//   const { additionalInfo, addLanguage, removeLanguage, updateAdditionalInfo } =
//     useAdditionalInfo();
//   const { template, theme, aiSuggestions, updateTemplate, updateTheme } =
//     useMeta();
//   const { atsScore, calculateATSScore } = useATS();

//   // -----------------------
//   // Form Steps
//   // -----------------------
//   const formSteps: FormStep[] = useMemo(
//     () => [
//       {
//         id: "personalInfo",
//         title: "Personal Info",
//         description: "",
//         component: "PersonalInfoForm",
//         isCompleted: false,
//         isRequired: true,
//       },
//       {
//         id: "summary",
//         title: "Summary",
//         description: "",
//         component: "SummaryForm",
//         isCompleted: false,
//         isRequired: true,
//       },
//       {
//         id: "workExperience",
//         title: "Work Experience",
//         description: "",
//         component: "WorkExperienceForm",
//         isCompleted: false,
//         isRequired: true,
//       },
//       {
//         id: "education",
//         title: "Education",
//         description: "",
//         component: "EducationForm",
//         isCompleted: false,
//         isRequired: true,
//       },
//       {
//         id: "skills",
//         title: "Skills",
//         description: "",
//         component: "SkillsForm",
//         isCompleted: false,
//         isRequired: true,
//       },
//       {
//         id: "projects",
//         title: "Projects",
//         description: "",
//         component: "ProjectsForm",
//         isCompleted: false,
//         isRequired: false,
//       },
//       {
//         id: "certifications",
//         title: "Certifications",
//         description: "",
//         component: "CertificationsForm",
//         isCompleted: false,
//         isRequired: false,
//       },
//       {
//         id: "professionalLinks",
//         title: "Professional Links",
//         description: "",
//         component: "ProfessionalLinksForm",
//         isCompleted: false,
//         isRequired: false,
//       },
//       {
//         id: "additionalInfo",
//         title: "Additional Info",
//         description: "",
//         component: "AdditionalInfoForm",
//         isCompleted: false,
//         isRequired: false,
//       },
//       {
//         id: "aiRetouch",
//         title: "AI ReTouch",
//         description: "",
//         component: "AIReTouchForm",
//         isCompleted: false,
//         isRequired: false,
//       },
//     ],
//     []
//   );

//   // -----------------------
//   // Build ResumeData
//   // -----------------------
//   const buildResumeData = useCallback(
//     (): ResumeData => ({
//       id: resumeId,
//       userEmail: user?.email || "",
//       personalInfo: personalInfo ?? {},
//       summary: summary ?? "",
//       workExperience: workExperience ?? [],
//       education: education ?? [],
//       skills: skills ?? [],
//       projects: projects ?? [],
//       certifications: certifications ?? [],
//       socialLinks: socialLinks ?? [],
//       additionalInfo: additionalInfo ?? {},
//       template: template ?? {
//         id: "default",
//         name: "Classic",
//         layout: "classic",
//         sections: [],
//       },
//       theme: theme ?? {
//         id: "default",
//         name: "Default",
//         primaryColor: "#2563eb",
//         accentColor: "#9333ea",
//         textColor: "#111827",
//         backgroundColor: "#ffffff",
//         fontFamily: "Inter",
//       },
//       meta: { currentStep, completed: currentStep === formSteps.length - 1 },
//       createdAt: initialData?.createdAt || new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }),
//     [
//       resumeId,
//       user?.email,
//       personalInfo,
//       summary,
//       workExperience,
//       education,
//       skills,
//       projects,
//       certifications,
//       socialLinks,
//       additionalInfo,
//       template,
//       theme,
//       currentStep,
//       formSteps.length,
//       initialData?.createdAt,
//     ]
//   );

//   const resumeData = useMemo(() => buildResumeData(), [buildResumeData]);

//   // -----------------------
//   // LocalStorage Sync
//   // -----------------------
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("resumeCurrentStep", String(currentStep));
//     }
//   }, [currentStep]);

//   // -----------------------
//   // Step Navigation
//   // -----------------------
//   const nextStep = useCallback(async () => {
//     try {
//       await saveResumeStep(resumeId, user?.email || "", resumeData);
//       setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
//     } catch (err) {
//       console.error("Failed to save resume step:", err);
//     }
//   }, [resumeData, resumeId, user?.email, formSteps.length]);

//   const previousStep = useCallback(() => {
//     setCurrentStep((prev) => Math.max(prev - 1, 0));
//   }, []);

//   const goToStep = useCallback(
//     (step: number) => {
//       if (step >= 0 && step < formSteps.length) setCurrentStep(step);
//     },
//     [formSteps.length]
//   );

//   // -----------------------
//   // AI & Export Handlers
//   // -----------------------
//   const getAISuggestions = useCallback(
//     (section: string) => {
//       return aiSuggestions?.filter((s) => s.section === section) ?? [];
//     },
//     [aiSuggestions]
//   );

//   const exportResumeHandler = useCallback(async () => {
//     try {
//       const html = document.getElementById("resume-preview")?.outerHTML;
//       if (html) {
//         await fetch("/resume/api/export-pdf", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             htmlContent: html,
//             fileName: `${resumeData.id}.pdf`,
//             email: user?.email || "",
//           }),
//         });
//       }
//     } catch (err) {
//       console.error("Export failed:", err);
//     }
//   }, [resumeData.id, user?.email]);

//   return {
//     currentStep,
//     formSteps,
//     nextStep,
//     previousStep,
//     goToStep,
//     getAISuggestions,
//     resumeData,
//     personalInfo,
//     updatePersonalInfo,
//     summary,
//     updateSummary,
//     workExperience,
//     addWork,
//     updateWork,
//     removeWork,
//     education,
//     addEducation,
//     updateEducation,
//     removeEducation,
//     skills,
//     addSkill,
//     updateSkill,
//     removeSkill,
//     projects,
//     addProject,
//     updateProject,
//     removeProject,
//     certifications,
//     addCertification,
//     updateCertification,
//     removeCertification,
//     socialLinks,
//     addLink,
//     updateLink,
//     removeLink,
//     additionalInfo,
//     addLanguage,
//     removeLanguage,
//     updateAdditionalInfo,
//     template,
//     updateTemplate,
//     theme,
//     updateTheme,
//     exportResumeHandler,
//     atsScore,
//     calculateATSScore,
//     aiSuggestions,
//     buildResumeData,
//   };
// };










// src/hooks/useResume.ts

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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

export const useResume = (initialData?: ResumeData) => {
  const { user } = useAuth();

  // -----------------------
  // Resume ID (prevent duplicate)
  // -----------------------
  const [resumeId] = useState<string>(() => {
    if (initialData?.id) return initialData.id;
    if (typeof window !== "undefined") {
      const draftId = localStorage.getItem("resume_draft_id");
      if (draftId) return draftId;
    }
    return uuidv4();
  });

  // -----------------------
  // Current step (restore from localStorage or initialData)
  // -----------------------
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("resumeCurrentStep");
      if (savedStep) return Number(savedStep);
    }
    return initialData?.meta?.currentStep ?? 0;
  });

  // -----------------------
  // Context hooks
  // -----------------------
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

  // -----------------------
  // Form Steps
  // -----------------------
  const formSteps: FormStep[] = useMemo(
    () => [
      { id: "personalInfo", title: "Personal Info", component: "PersonalInfoForm", isCompleted: false, isRequired: true, description: "" },
      { id: "summary", title: "Summary", component: "SummaryForm", isCompleted: false, isRequired: true, description: "" },
      { id: "workExperience", title: "Work Experience", component: "WorkExperienceForm", isCompleted: false, isRequired: true, description: "" },
      { id: "education", title: "Education", component: "EducationForm", isCompleted: false, isRequired: true, description: "" },
      { id: "skills", title: "Skills", component: "SkillsForm", isCompleted: false, isRequired: true, description: "" },
      { id: "projects", title: "Projects", component: "ProjectsForm", isCompleted: false, isRequired: false, description: "" },
      { id: "certifications", title: "Certifications", component: "CertificationsForm", isCompleted: false, isRequired: false, description: "" },
      { id: "professionalLinks", title: "Professional Links", component: "ProfessionalLinksForm", isCompleted: false, isRequired: false, description: "" },
      { id: "additionalInfo", title: "Additional Info", component: "AdditionalInfoForm", isCompleted: false, isRequired: false, description: "" },
      { id: "aiRetouch", title: "AI ReTouch", component: "AIReTouchForm", isCompleted: false, isRequired: false, description: "" },
    ],
    []
  );

  // -----------------------
  // Build ResumeData
  // -----------------------
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
      template: template ?? { id: "default", name: "Classic", layout: "classic", sections: [] },
      theme: theme ?? {
        id: "default",
        name: "Default",
        primaryColor: "#2563eb",
        accentColor: "#9333ea",
        textColor: "#111827",
        backgroundColor: "#ffffff",
        fontFamily: "Inter",
      },
      meta: { currentStep, completed: currentStep === formSteps.length - 1 },
      createdAt: initialData?.createdAt || new Date().toISOString(),
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
      initialData?.createdAt,
    ]
  );

  const resumeData = useMemo(() => buildResumeData(), [buildResumeData]);

  // -----------------------
  // LocalStorage Sync
  // -----------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeCurrentStep", String(currentStep));
      localStorage.setItem("resume_draft_id", resumeId);
    }
  }, [currentStep, resumeId]);

  // -----------------------
  // Step Navigation
  // -----------------------
  const nextStep = async () => {
    try {
      await saveResumeStep(resumeId, user?.email || "", resumeData);
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    } catch (err) {
      console.error("Failed to save resume step:", err);
    }
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < formSteps.length) setCurrentStep(step);
  };

  // -----------------------
  // Return Hook API
  // -----------------------
  return {
    currentStep,
    formSteps,
    setCurrentStep,
    resumeData,
    buildResumeData,
    resumeId,
    nextStep,
    previousStep,
    goToStep,
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
    atsScore,
    calculateATSScore,
    aiSuggestions: aiSuggestions ?? [],
    getAISuggestions: (section: string) => aiSuggestions?.filter((s) => s.section === section) ?? [],
  };
};
