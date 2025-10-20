"use client";

import React, { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Target, Zap, CheckCircle, Clock } from "lucide-react";

export const AIReTouchForm: React.FC = () => {
  const { resumeData, getAISuggestions, calculateATSScore, atsScore } = useResume();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  // Section definitions
  const sections = [
    { id: "summary", name: "Professional Summary", hasContent: !!resumeData.summary },
    { id: "experience", name: "Work Experience", hasContent: resumeData.workExperience.length > 0 },
    { id: "skills", name: "Skills", hasContent: resumeData.skills.length > 0 },
    { id: "projects", name: "Projects", hasContent: resumeData.projects.length > 0 },
    { id: "education", name: "Education", hasContent: resumeData.education.length > 0 },
  ];

  // ✅ Improve Writing (AI Enhancement)
  const handleImproveWriting = async (section: string) => {
    setIsProcessing(`improve-${section}`);
    try {
      await getAISuggestions(section);
      setCompletedActions((prev) => [...prev, `improve-${section}`]);
    } catch (error) {
      // console.error("Error improving section:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  // ✅ ATS Optimization
  const handleATSOptimize = async () => {
    setIsProcessing("ats-optimize");
    try {
      // FIXED: Removed argument — matches correct hook definition
      await calculateATSScore();
      setCompletedActions((prev) => [...prev, "ats-optimize"]);
    } catch (error) {
      // console.error("Error calculating ATS score:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  // ✅ Summarize or Expand Section
  const handleSummarize = async (section: string) => {
    setIsProcessing(`summarize-${section}`);
    try {
      await getAISuggestions(section);
      setCompletedActions((prev) => [...prev, `summarize-${section}`]);
    } catch (error) {
      // console.error("Error summarizing section:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ATS Optimization */}
      <Card className="p-6 bg-gradient-subtle border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">ATS Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Optimize your resume for Applicant Tracking Systems
            </p>
          </div>

          {atsScore && (
            <Badge
              variant={
                atsScore.overall >= 80
                  ? "default"
                  : atsScore.overall >= 60
                  ? "secondary"
                  : "destructive"
              }
              className="text-lg px-3 py-1"
            >
              {atsScore.overall}%
            </Badge>
          )}
        </div>

        <Button
          onClick={handleATSOptimize}
          disabled={isProcessing === "ats-optimize"}
          className="w-full text-white hover:shadow-ai transition-all duration-300"
        >
          {isProcessing === "ats-optimize" ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Analyzing ATS Score...
            </>
          ) : completedActions.includes("ats-optimize") ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              ATS Score Updated
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              ATS Optimize
            </>
          )}
        </Button>
      </Card>

      {/* Section Improvements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Section Improvements</h3>

        {sections.map((section) => (
          <Card key={section.id} className="p-4 border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{section.name}</h4>
                {section.hasContent ? (
                  <Badge variant="default" className="bg-success/20 text-success">
                    Content Added
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    No Content
                  </Badge>
                )}
              </div>
            </div>

            {section.hasContent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Improve Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImproveWriting(section.id)}
                  disabled={isProcessing === `improve-${section.id}` || !section.hasContent}
                  className="justify-start"
                >
                  {isProcessing === `improve-${section.id}` ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Improving...
                    </>
                  ) : completedActions.includes(`improve-${section.id}`) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Improved
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Improve Writing
                    </>
                  )}
                </Button>

                {/* Summarize Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSummarize(section.id)}
                  disabled={isProcessing === `summarize-${section.id}` || !section.hasContent}
                  className="justify-start"
                >
                  {isProcessing === `summarize-${section.id}` ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : completedActions.includes(`summarize-${section.id}`) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Processed
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Summarize / Expand
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Global Enhance */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-foreground mb-3">🚀 Complete Resume Enhancement</h4>
        <Button
          variant="default"
          className="w-full bg-gradient-primary hover:shadow-paper transition-all duration-300"
          onClick={() =>
            sections.forEach((section) => section.hasContent && handleImproveWriting(section.id))
          }
          disabled={!!isProcessing}
        >
          <Zap className="h-4 w-4 mr-2" />
          Enhance All Sections
        </Button>
      </Card>

      {/* AI Tips */}
      <Card className="p-4 bg-muted/30 border-border/30">
        <h4 className="text-sm font-semibold text-foreground mb-2">💡 AI Enhancement Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Improve Writing enhances grammar, clarity, and impact</li>
          <li>• ATS Optimize ensures compatibility with tracking systems</li>
          <li>• Summarize/Expand adjusts content length for better fit</li>
          <li>• Review AI suggestions before accepting them</li>
          <li>• Higher ATS scores increase interview chances</li>
        </ul>
      </Card>
    </div>
  );
};
