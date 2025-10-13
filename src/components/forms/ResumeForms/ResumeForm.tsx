// src/components/forms/ResumeForms/ResumeForm.tsx
"use client";

import React, { useRef, useEffect, useState, FC } from "react";
import { useResume } from "@/hooks/useResume";
import { useResumeThumbnail } from "@/hooks/useResumeThumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, FileDown, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { exportResumeHandler } from "@/utils/exportResume";
import { exportSaveResumeHandler } from "@/utils/saveResumePDF";

import { PersonalInfoForm } from "./PersonalInfoForm";
import { SummaryForm } from "./SummaryForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ProjectsForm } from "./ProjectsForm";
import { ProfessionalLinksForm } from "./ProfessionalLinksForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import { AIReTouchForm } from "./AIReTouchForm";
import { CertificationsForm } from "./CertificationsForm";

// ---------------- PDF Overlay Component ----------------
const ResumePrintOverlay = ({
  pdfUrl,
  onClose,
}: {
  pdfUrl: string;
  onClose: () => void;
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    const timer = setTimeout(() => {
      const iframe = document.getElementById("resume-iframe") as HTMLIFrameElement;
      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    }, 500);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <iframe
        id="resume-iframe"
        src={pdfUrl}
        style={{ width: "90%", height: "95%", border: "none", backgroundColor: "#fff" }}
      />
      <button
        onClick={onClose}
        className="fixed top-25 right-25 bg-muted/30 px-3 py-2 rounded-md cursor-pointer z-[10000] shadow-md hover:bg-muted/50 transition"
      >
        Close
      </button>
    </div>
  );
};

// -------------------------------------------------------

const MySwal = withReactContent(Swal);

type FormStepType = { id: string; title: string; component: FC };

export const ResumeForm: React.FC = () => {
  const router = useRouter();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // PDF Overlay

  const { generateThumbnail, generating: thumbnailGenerating, error: thumbnailError } = useResumeThumbnail();
  const { currentStep, nextStep, previousStep, goToStep, getAISuggestions, resumeData, resumeId } = useResume();

  const formSteps: FormStepType[] = [
    { id: "personalInfo", title: "Personal Info", component: PersonalInfoForm },
    { id: "professionalLinks", title: "Professional Links", component: ProfessionalLinksForm },
    { id: "skills", title: "Skills", component: SkillsForm },
    { id: "certifications", title: "Certifications", component: CertificationsForm },
    { id: "summary", title: "Summary", component: SummaryForm },
    { id: "education", title: "Education", component: EducationForm },
    { id: "projects", title: "Projects", component: ProjectsForm },
    { id: "workExperience", title: "Work Experience", component: WorkExperienceForm },
    { id: "additionalInfo", title: "Additional Info", component: AdditionalInfoForm },
    { id: "aiRetouch", title: "AI Retouch", component: AIReTouchForm },
  ];

  const currentFormStep = formSteps[currentStep];
  const FormComponent = currentFormStep.component;
  const progress = Math.round(((currentStep + 1) / formSteps.length) * 100);

  const handleNextStep = async () => {
    if (!resumeId || !resumeData.userEmail) return;
    try {
      setIsSaving(true);
      await axios.post("/resume/api/saveResume", { ...resumeData, id: resumeId, userEmail: resumeData.userEmail, resumeStatus: "draft" });
      await generateThumbnail({ elementId: "resume-preview", resumeId, userEmail: resumeData.userEmail });
      nextStep();
      localStorage.setItem("resumeCurrentStep", String(currentStep + 1));
      localStorage.setItem("resume_draft_id", resumeId);
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const handlePreviousStep = () => previousStep();

  const handleComplete = async () => {
    if (!resumeId || !resumeData.userEmail) return;
    try {
      setIsSaving(true);
      await axios.post("/resume/api/saveResume", { ...resumeData, id: resumeId, userEmail: resumeData.userEmail, resumeStatus: "complete" });
      await generateThumbnail({ elementId: "resume-preview", resumeId, userEmail: resumeData.userEmail });
      await exportSaveResumeHandler(resumeId);
      localStorage.removeItem("resume_draft_id");

      const result = await MySwal.fire({
        icon: "success",
        title: "🎉 Resume Completed!",
        text: "Your resume has been marked as complete and saved successfully.",
        showCancelButton: true,
        confirmButtonText: "View Resume",
        cancelButtonText: "Close",
      });

      if (result.isConfirmed) {
        // Open PDF in fullscreen overlay
        const response = await fetch(`/resume/api/pdf/view-pdf?resumeId=${resumeId}`);
        if (!response.ok) throw new Error("Failed to fetch PDF");
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      }

      router.push(`/resume/${resumeId}`);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Something went wrong while marking complete.", "error");
    } finally { setIsSaving(false); }
  };

  const handleAISuggestion = async () => {
    try { await getAISuggestions(currentFormStep.id); }
    catch (error) { console.error(error); }
  };

  const handleExport = async () => {
    if (!resumeId) return;
    try {
      // Fetch PDF and show overlay
      const response = await fetch(`/resume/api/pdf/view-pdf?resumeId=${resumeId}`);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      console.error("❌ PDF export failed:", err);
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
      tabsRef.current.scrollTo({ left: tabOffsetLeft - parentWidth / 2 + tabWidth / 2, behavior: "smooth" });
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none sticky top-0 z-20 p-4 shadow-sm bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Step {currentStep + 1} of {formSteps.length}
            </h2>
            <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
            {thumbnailError && <p className="text-xs text-red-500">Thumbnail Error: {thumbnailError}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAISuggestion}
            className="flex items-center gap-2 bg-gradient-ai text-white border-0 hover:shadow-ai"
          >
            <Sparkles className="h-4 w-4" /> AI Suggest
          </Button>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </div>

      {/* Tabs */}
      <div ref={tabsRef} className="flex gap-2 overflow-x-auto sticky top-[72px] z-10 bg-card p-4 border-b border-border shadow-sm">
        {formSteps.map((step, index) => (
          <Button
            key={step.id}
            variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "ghost"}
            size="sm"
            onClick={() => goToStep(index)}
            className={`flex-shrink-0 text-xs px-3 py-2 ${index === currentStep ? "bg-primary text-primary-foreground" : index < currentStep ? "bg-primary-dark/60 text-black border-green-600" : ""}`}
          >
            <span className="truncate max-w-24">{step.title}</span>
            {index < currentStep && <span className="ml-1 text-green-200">✓</span>}
          </Button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="overflow-visible p-6 shadow-md border-border/50">
          {FormComponent ? <FormComponent /> : <div className="text-center py-8 text-muted-foreground">Form not found</div>}
        </Card>
      </div>

      {/* Footer */}
      <div className="flex-none sticky bottom-0 z-10 p-4 bg-card text-card-foreground shadow-sm flex items-center justify-between">
        <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 0 || isSaving} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        <span>{isSaving || thumbnailGenerating ? "Saving..." : ""}</span>

        <div className="flex items-center gap-2">
          {currentStep < formSteps.length - 1 ? (
            <Button onClick={handleNextStep} disabled={isSaving || thumbnailGenerating} className="flex items-center gap-2">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button onClick={handleExport} disabled={isSaving || thumbnailGenerating} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Printer className="h-4 w-4" /> Print Resume
              </Button>
              <Button onClick={handleComplete} disabled={isSaving || thumbnailGenerating} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="h-4 w-4" /> Complete Resume
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Overlay */}
      {pdfUrl && <ResumePrintOverlay pdfUrl={pdfUrl} onClose={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }} />}
    </div>
  );
};
