"use client";

import React, { createContext, useContext, useState } from "react";
import { WorkExperience } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface WorkExperienceContextType {
  workExperience: WorkExperience[];
  addWork: (exp: Omit<WorkExperience, "id">) => void;
  updateWork: (id: string, data: Partial<WorkExperience>) => void;
  removeWork: (id: string) => void;
}

const WorkExperienceContext = createContext<WorkExperienceContextType | undefined>(undefined);

export const WorkExperienceProvider = ({ children }: { children: React.ReactNode }) => {
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

  const addWork = (exp: Omit<WorkExperience, "id">) => {
    setWorkExperience((prev) => [...prev, { id: uuidv4(), ...exp }]);
  };

  const updateWork = (id: string, data: Partial<WorkExperience>) => {
    setWorkExperience((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...data } : exp))
    );
  };

  const removeWork = (id: string) => {
    setWorkExperience((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <WorkExperienceContext.Provider value={{ workExperience, addWork, updateWork, removeWork }}>
      {children}
    </WorkExperienceContext.Provider>
  );
};

export const useWorkExperience = () => {
  const context = useContext(WorkExperienceContext);
  if (!context) throw new Error("useWorkExperience must be used within WorkExperienceProvider");
  return context;
};
