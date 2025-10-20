
// src/app/resume/[resumeId]/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ResumeProvider } from "@/context/ResumeContext/ResumeProvider";
import { ResumeData } from "@/types/resume";
import PrivateRoute from "@/app/Routes/PrivateRoute";

import { LoadingSpinner } from "@/app/dashboard/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit3, Menu, X, Download } from "lucide-react";
import ResumePreview from "@/components/resumePreview/ResumePreview";
import { exportResumeHandler } from "@/utils/exportResume";
import { ResumeNavbar } from "@/components/resumePreview/ResumeNavbar";
import { ResumeForm } from "@/components/forms/ResumeForms/ResumeForm";
import { useAuth } from "@/context/AuthContext";
import { useResumeThumbnail } from "@/hooks/useResumeThumbnail";

const ResumePageById = () => {
  const params = useParams();
  const resumeId = Array.isArray(params?.resumeId)
    ? params.resumeId[0]
    : (params?.resumeId as string);

  const { user } = useAuth();
  const userEmail = user?.email ?? null;

  const { generateThumbnail, generating: thumbnailGenerating } = useResumeThumbnail();

  const [initialData, setInitialData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 🧩 Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;
      setLoading(true);

      try {
        const res = await fetch(`/resume/api/getResume?id=${resumeId}`);
        const json: { success: boolean; resume?: ResumeData; message?: string } = await res.json();

        if (json.success && json.resume) {
          setInitialData(json.resume);

          const savedStep = localStorage.getItem("resumeCurrentStep");
          const stepToRestore =
            savedStep !== null
              ? Number(savedStep)
              : json.resume.meta?.currentStep ?? 0;

          localStorage.setItem("resumeCurrentStep", String(stepToRestore));
          localStorage.setItem("resume_draft_id", json.resume.id);

          // Auto thumbnail after slight delay
          if (userEmail) {
            setTimeout(() => {
              generateThumbnail({ elementId: "resume-preview", resumeId, userEmail }).catch(console.error);
            }, 1500);
          }
        } else {
          setError(json.message || "Resume not found");
        }
      } catch (err) {
        // console.error("❌ Failed to fetch resume:", err);
        setError("Failed to fetch resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, userEmail, generateThumbnail]);

  // 🖼️ Manual thumbnail save
  const handleSaveThumbnail = useCallback(async () => {
    if (resumeId && userEmail) {
      await generateThumbnail({ elementId: "resume-preview", resumeId, userEmail });
    }
  }, [resumeId, userEmail, generateThumbnail]);

  // 📝 Export PDF
  const handleExportPDF = useCallback(async () => {
    if (!resumeId) return;
    try {
      await exportResumeHandler(resumeId);
    } catch (err) {
      // console.error("Failed to export PDF:", err);
      alert("Failed to export PDF");
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <span className="ml-2 text-muted-foreground">Loading Resume...</span>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        {error || "Resume not found"}
      </div>
    );
  }

  return (
    <PrivateRoute>
      <ResumeProvider initialData={initialData}>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">

          {/* 🌐 Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              >
                {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Resume Builder</h1>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isMobilePreviewMode ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsMobilePreviewMode(!isMobilePreviewMode)}
                className="flex items-center gap-2"
              >
                {isMobilePreviewMode ? (
                  <>
                    <Edit3 className="h-4 w-4" /> Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Preview
                  </>
                )}
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Export PDF
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleSaveThumbnail}
                disabled={thumbnailGenerating}
              >
                {thumbnailGenerating ? "Generating Thumbnail..." : "Save Thumbnail"}
              </Button>
            </div>
          </div>

          {/* 🧭 Main Layout */}
          <div className="flex flex-col lg:flex-row h-screen">
            {/* 📝 Form Panel */}
            <div
              className={`
                flex-1 lg:flex-none lg:w-2/5 border-r border-border flex flex-col
                ${isMobilePreviewMode ? "hidden" : "flex"} lg:flex
              `}
            >
              <ResumeForm />
            </div>

            {/* 👁️ Preview Panel */}
            <div
              className={`
                flex-1 lg:flex-none lg:w-3/5 flex flex-col
                ${isMobilePreviewMode ? "flex" : "hidden"} lg:flex
              `}
            >
              <Card className="h-full overflow-y-auto border-0 shadow-none lg:rounded-none">
                <div className="sticky -top-8 bg-card/95 backdrop-blur-sm p-4 z-10">
                  <ResumeNavbar />
                </div>
                <div className="p-6 border m-4 rounded-lg" id="resume-preview">
                  <ResumePreview />
                </div>
              </Card>
            </div>
          </div>

          {/* 🕶️ Mobile Backdrop */}
          {isMobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </div>
      </ResumeProvider>
    </PrivateRoute>
  );
};

export default ResumePageById;
