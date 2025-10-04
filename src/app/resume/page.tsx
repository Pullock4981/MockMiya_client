"use client";

import React, { useState } from "react";
import { ResumeProvider } from "@/components/resumePreview/ResumeProvider";
import PrivateRoute from "@/app/Routes/PrivateRoute";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit3, Menu, X, Download } from "lucide-react";
import { ResumeForm } from "@/components/forms/ResumeForms/ResumeForm";
import ResumePreview from "@/components/resumePreview/ResumePreview";

import { exportResumeHandler } from "@/utils/exportResume";

const ResumePage = () => {
  const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <PrivateRoute>
      <ResumeProvider>
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
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
                  <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
                </div>
                <div className="p-6">
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

export default ResumePage;
