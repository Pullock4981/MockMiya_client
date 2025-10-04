"use client";

import React, { createContext, useContext, useState } from "react";
import { Education } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface EducationContextType {
  education: Education[];
  addEducation: (edu: Omit<Education, "id">) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export const EducationProvider = ({ children }: { children: React.ReactNode }) => {
  const [education, setEducation] = useState<Education[]>([]);

  const addEducation = (edu: Omit<Education, "id">) => {
    setEducation((prev) => [...prev, { id: uuidv4(), ...edu }]);
  };

  const updateEducation = (id: string, edu: Partial<Education>) => {
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, ...edu } : e)));
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EducationContext.Provider value={{ education, addEducation, updateEducation, removeEducation }}>
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) throw new Error("useEducation must be used within EducationProvider");
  return context;
};
