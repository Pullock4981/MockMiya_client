"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MetaContextType, ResumeMeta, ResumeTemplate, ResumeTheme, ATSScore, AIsuggestion } from "@/types/resume";

const MetaContext = createContext<MetaContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialData?: ResumeMeta;
}

export const MetaProvider = ({ children, initialData }: Props) => {
  const [template, setTemplate] = useState<ResumeTemplate>({
    id: "default",
    name: "classic",
    layout: "classic",
    sections: [
      "summary","workExperience","education","skills","projects","certifications","socialLinks","additionalInfo",
    ],
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

  const [atsScore, setATSScore] = useState<ATSScore | undefined>(undefined);
  const [aiSuggestions, setAISuggestions] = useState<AIsuggestion[]>([]);

  // Load initialData safely
  useEffect(() => {
    if (!initialData) return;
    const meta = initialData as Partial<ResumeMeta> & Partial<MetaContextType>;
    if (meta.template) setTemplate(meta.template);
    if (meta.theme) setTheme(meta.theme);
    if (meta.atsScore) setATSScore(meta.atsScore);
    if (meta.aiSuggestions) setAISuggestions(meta.aiSuggestions);
  }, [initialData]);

  return (
    <MetaContext.Provider
      value={{
        template,
        theme,
        atsScore,
        aiSuggestions,
        updateTemplate: setTemplate,
        updateTheme: setTheme,
        setATSScore,
        setAISuggestions,
      }}
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
