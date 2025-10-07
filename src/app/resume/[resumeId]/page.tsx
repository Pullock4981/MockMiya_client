"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import EmptyState from "@/components/resumePreview/EmptyState";;
import { ResumeData } from "@/types/resume";

const ResumePage: React.FC = () => {
  const params = useParams();
  const { resumeId } = params; // URL থেকে ID
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);


  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`/app/api/saveResume/${resumeId}`);
        if (!res.ok) throw new Error("Failed to fetch resume");
        const data: ResumeData = await res.json();
        setResumeData(data);

        // Context update

      } catch (err) {
        console.error(err);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (!resumeData) return <div>Loading...</div>;

  const isEmpty =
    !resumeData.personalInfo?.firstName &&
    !resumeData.personalInfo?.lastName &&
    resumeData.skills.length === 0;

  if (isEmpty) return <EmptyState />;

  return (
    <div id="resume-preview" className="bg-white p-5">
      {resumeData.template.name === "Modern" ? (
        <ModernTemplate />
      ) : (
        <ClassicTemplate />
      )}
    </div>
  );
};

export default ResumePage;
