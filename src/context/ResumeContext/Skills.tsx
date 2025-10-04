"use client";

import React, { createContext, useContext, useState } from "react";
import { Skill } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface SkillsContextType {
  skills: Skill[];
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider = ({ children }: { children: React.ReactNode }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const addSkill = (skill: Omit<Skill, "id">) => {
    setSkills((prev) => [...prev, { id: uuidv4(), ...skill }]);
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...skill } : s))
    );
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SkillsContext.Provider value={{ skills, addSkill, updateSkill, removeSkill }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) throw new Error("useSkills must be used within SkillsProvider");
  return context;
};
