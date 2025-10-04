"use client";

import React, { createContext, useContext, useState } from "react";
import { ResumeTemplate, ResumeTheme, ATSScore, AIsuggestion } from "@/types/resume";

interface MetaContextType {
  template: ResumeTemplate;
  theme: ResumeTheme;
  atsScore: ATSScore | null;
  aiSuggestions: AIsuggestion[];
  updateTemplate: (template: ResumeTemplate) => void;
  updateTheme: (theme: ResumeTheme) => void;
  setATSScore: (score: ATSScore) => void;
  setAISuggestions: (suggestions: AIsuggestion[]) => void;
}

const MetaContext = createContext<MetaContextType | undefined>(undefined);

export const MetaProvider = ({ children }: { children: React.ReactNode }) => {
  const [template, setTemplate] = useState<ResumeTemplate>({
    id: "default",
    name: "Modern",
    layout: "modern",
    sections: ["summary", "workExperience", "education", "skills", "projects", "certifications", "socialLinks", "additionalInfo"],
  });

  const [theme, setTheme] = useState<ResumeTheme>({
    id: "default",
    name: "Default",
    primaryColor: "#2563eb",
    accentColor: "#9333ea",
    textColor: "#111827",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
  });

  const [atsScore, setATSScore] = useState<ATSScore | null>(null);
  const [aiSuggestions, setAISuggestions] = useState<AIsuggestion[]>([]);

  const updateTemplate = (newTemplate: ResumeTemplate) => setTemplate(newTemplate);
  const updateTheme = (newTheme: ResumeTheme) => setTheme(newTheme);

  return (
    <MetaContext.Provider
      value={{ template, theme, atsScore, aiSuggestions, updateTemplate, updateTheme, setATSScore, setAISuggestions }}
    >
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => {
  const context = useContext(MetaContext);
  if (!context) throw new Error("useMeta must be used within MetaProvider");
  return context;
};
