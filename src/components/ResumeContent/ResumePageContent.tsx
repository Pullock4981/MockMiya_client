"use client";

import React from "react";
import { PersonalInfoForm } from "../forms/ResumeForms/PersonalInfoForm";

// import other sections later: SkillsForm, WorkExperienceForm, etc.

const ResumePageContent = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Edit Resume</h1>
      <PersonalInfoForm />
      {/* অন্যান্য ফর্ম সেকশনগুলো এখানে add করবে */}
    </div>
  );
};

export default ResumePageContent;
