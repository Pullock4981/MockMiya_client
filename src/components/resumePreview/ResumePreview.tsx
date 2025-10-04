"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useATS } from "@/hooks/useATS";
import { useResume } from "@/hooks/useResume";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ResumeData, Skill } from "@/types/resume";

const ResumePreview = () => {
  const { resumeData, buildResumeData } = useResume();
  const { atsScore, calculateATSScore, getATSScoreColor, getATSScoreLabel } = useATS();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data: ResumeData = await buildResumeData();
        if (data) {
          await calculateATSScore();
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [buildResumeData, calculateATSScore]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500 mb-2" />
        <p className="text-gray-500">Loading resume data...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        No resume data found.
      </div>
    );
  }

  // ✅ firstName + lastName থেকে fullName তৈরি
  const fullName = [resumeData.personalInfo?.firstName, resumeData.personalInfo?.lastName]
    .filter(Boolean)
    .join(" ") || "Unnamed User";

  return (
    <div className="w-full p-4">
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Resume Preview</h1>

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">{fullName}</h2>
            <p className="text-gray-600">{resumeData.personalInfo?.email}</p>
            <p className="text-gray-600">{resumeData.personalInfo?.phone}</p>
          </div>

          {/* Summary */}
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700">Summary</h3>
            <p className="text-gray-600">{resumeData.summary || "No summary provided."}</p>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.length ? (
                resumeData.skills.map((skill: Skill, index: number) => (
                  <Badge key={index} variant="secondary">
                    {typeof skill === "string" ? skill : skill.name}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">No skills added.</p>
              )}
            </div>
          </div>

          {/* ATS Score */}
          <div className="border-t mt-6 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ATS Score</h3>
            {!atsScore ? (
              <p className="text-gray-500">Analyzing resume...</p>
            ) : (
              <div>
                <p className="text-lg font-bold">
                  <span className={`text-${getATSScoreColor(atsScore.overall)}-600`}>
                    {atsScore.overall}%
                  </span>{" "}
                  - {getATSScoreLabel(atsScore.overall)}
                </p>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>Keywords: {atsScore.breakdown.keywords}%</p>
                  <p>Formatting: {atsScore.breakdown.formatting}%</p>
                  <p>Sections: {atsScore.breakdown.sections}%</p>
                  <p>Length: {atsScore.breakdown.length}%</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold text-gray-700">Suggestions:</h4>
                  <ul className="list-disc ml-5 text-gray-600">
                    {atsScore.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
