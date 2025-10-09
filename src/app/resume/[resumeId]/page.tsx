"use client";

import React, { useEffect, useState } from "react";
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
import { ResumeNavbar } from "@/components/layout/ResumeNavbar";
import { ResumeForm } from "@/components/forms/ResumeForms/ResumeForm";

const ResumePageById = () => {
  const { resumeId } = useParams();
  const [initialData, setInitialData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;
      setLoading(true);

      try {
        const res = await fetch(`/resume/api/getResume?id=${resumeId}`);
        const json: { success: boolean; resume?: ResumeData; message?: string } = await res.json();

        console.log("📄 Resume Fetch Response:", json);

        if (json.success && json.resume) {
          setInitialData(json.resume);

          // ✅ রিডাইরেক্ট করে কারেন্ট স্টেপে রাখো (রিফ্রেশ বা নতুন লোডেও)
          if (json.resume.meta?.currentStep) {
            localStorage.setItem("resumeCurrentStep", String(json.resume.meta.currentStep));
          }
        } else {
          setError("Resume not found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch resume:", err);
        setError("Failed to fetch resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // ✅ রিফ্রেশ করলে ইউজারকে তার কারেন্ট স্টেপে রাখার জন্য
  useEffect(() => {
    if (initialData) {
      const savedStep = localStorage.getItem("resumeCurrentStep");
      if (savedStep && Number(savedStep) !== initialData.meta?.currentStep) {
        // এখানে চাইলে context-এর setStep হ্যান্ডলার ইউজ করে আপডেট করা যায়
        console.log("🔄 Restored step from localStorage:", savedStep);
      }
    }
  }, [initialData]);

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
          {/* Mobile Header */}
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
                onClick={exportResumeHandler}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row h-screen">
            {/* Form Panel */}
            <div
              className={`
                flex-1 lg:flex-none lg:w-2/5 border-r border-border flex flex-col
                ${isMobilePreviewMode ? "hidden" : "flex"}
                ${isMobileSidebarOpen ? "flex" : "hidden lg:flex"}
              `}
            >
              <ResumeForm />
            </div>

            {/* Preview Panel */}
            <div
              className={`
                flex-1 lg:flex-none lg:w-3/5 flex flex-col
                ${isMobilePreviewMode ? "flex" : "hidden lg:flex"}
              `}
            >
              <Card className="h-full overflow-y-auto border-0 shadow-none lg:rounded-none">
                <div className="sticky -top-8 bg-card/95 backdrop-blur-sm p-4 z-10">
                  <ResumeNavbar />
                </div>
                <div className="p-6 border m-4 rounded-lg">
                  <ResumePreview />
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile Backdrop */}
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
