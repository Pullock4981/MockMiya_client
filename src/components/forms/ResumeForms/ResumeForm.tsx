
"use client";

import React, { useRef, useEffect, FC } from "react";
import { useResume } from "@/hooks/useResume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Import all form components
import { PersonalInfoForm } from "@/components/forms/ResumeForms/PersonalInfoForm";
import { SummaryForm } from "@/components/forms/ResumeForms/SummaryForm";
import { WorkExperienceForm } from "@/components/forms/ResumeForms/WorkExperienceForm";
import { EducationForm } from "@/components/forms/ResumeForms/EducationForm";
import { SkillsForm } from "@/components/forms/ResumeForms/SkillsForm";
import { ProjectsForm } from "@/components/forms/ResumeForms/ProjectsForm";
// import { CertificationsForm } from "@/components/forms/ResumeForms/CertificationsForm";
import { ProfessionalLinksForm } from "@/components/forms/ResumeForms/ProfessionalLinksForm";
import { AdditionalInfoForm } from "@/components/forms/ResumeForms/AdditionalInfoForm";
import { AIReTouchForm } from "@/components/forms/ResumeForms/AIReTouchForm";
import { exportResumeHandler } from "@/utils/exportResume";
import { CertificationsForm } from "./CertificationsForm";

// Define typed step
type FormStepType = {
  id: string;
  title: string;
  component: FC;
  isCompleted: boolean;
};

export const ResumeForm: React.FC = () => {
  const { currentStep, nextStep, previousStep, goToStep, getAISuggestions } = useResume();
  const tabsRef = useRef<HTMLDivElement>(null);

  // Form steps
  const formSteps: FormStepType[] = [
    { id: "personalInfo", title: "Personal Info", component: PersonalInfoForm, isCompleted: false },
    { id: "professionalLinks", title: "Professional Links", component: ProfessionalLinksForm, isCompleted: false },
    { id: "summary", title: "Summary", component: SummaryForm, isCompleted: false },
    { id: "skills", title: "Skills", component: SkillsForm, isCompleted: false },
    { id: "education", title: "Education", component: EducationForm, isCompleted: false },
    { id: "workExperience", title: "Work Experience", component: WorkExperienceForm, isCompleted: false },
    { id: "projects", title: "Projects", component: ProjectsForm, isCompleted: false },
     { id: "certifications", title: "Certifications", component: CertificationsForm, isCompleted: false },
    { id: "additionalInfo", title: "Additional Info", component: AdditionalInfoForm, isCompleted: false },
    { id: "aiRetouch", title: "AI Retouch", component: AIReTouchForm, isCompleted: false },
  ];

  const currentFormStep = formSteps[currentStep];
  const FormComponent = currentFormStep.component;

  const completedSteps = formSteps.filter(step => step.isCompleted).length;
  const progress = Math.round(((currentStep + 1) / formSteps.length) * 100);

  const handleAISuggestion = async () => {
    try {
      await getAISuggestions(currentFormStep.id);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
    }
  };

  // Scroll active tab into view
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector<HTMLButtonElement>("button.bg-primary");
    if (activeTab) {
      const parentWidth = tabsRef.current.offsetWidth;
      const tabOffsetLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      tabsRef.current.scrollTo({
        left: tabOffsetLeft - parentWidth / 2 + tabWidth / 2,
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  // Download PDF
const handleExport = async () => {
    try {
      await exportResumeHandler();
    } catch (error) {
      console.error("PDF Export failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="flex-none sticky top-0 z-20 p-4 shadow-sm bg-card text-card-foreground">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Step {currentStep + 1} of {formSteps.length}
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedSteps} of {formSteps.length} steps completed
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAISuggestion}
            className="flex items-center gap-2 bg-gradient-ai text-white border-0 hover:shadow-ai transition-all duration-300"
          >
            <Sparkles className="h-4 w-4" />
            AI Suggest
          </Button>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      {/* Tabs */}
      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto sticky top-[72px] z-10 bg-card text-card-foreground p-4 border-b border-border shadow-sm"
      >
        {formSteps.map((step, index) => (
          <Button
            key={step.id}
            variant={
              index === currentStep
                ? "default"
                : step.isCompleted
                ? "secondary"
                : "ghost"
            }
            size="sm"
            onClick={() => goToStep(index)}
            className={`flex-shrink-0 text-xs px-3 py-2 transition-all duration-200 ${
              index === currentStep ? "bg-primary text-primary-foreground" : ""
            } ${
              step.isCompleted ? "bg-success/10 text-success border-success/20" : ""
            }`}
            aria-current={index === currentStep ? "step" : undefined}
          >
            <span className="truncate max-w-24">{step.title}</span>
            {step.isCompleted && <span className="ml-1 text-success">✓</span>}
          </Button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="overflow-visible p-6 shadow-md border-border/50">
          {FormComponent ? 
          <FormComponent /> : 
          <div className="text-center py-8 text-muted-foreground">Form component not found</div>}
        </Card>
      </div>

      {/* Footer */}
      <div className="flex-none sticky bottom-0 z-10 p-4 bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {currentStep < formSteps.length - 1 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 hover:shadow-paper transition-all duration-300"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleExport}
                  className="flex items-center gap-2 transition-all duration-300"
                >
                  Download PDF
                </Button>
                <Button className="flex items-center gap-2 transition-all duration-300">
                  Complete Resume <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
