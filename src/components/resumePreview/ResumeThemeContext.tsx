"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type TextTheme = "Default" | "Green" | "Blue" | "Orange" | "Purple";

interface ResumeThemeContextType {
  textTheme: TextTheme;
  setTextTheme: (theme: TextTheme) => void;
  getTextColor: (type?: "heading" | "subHeading" | "link") => string;
}

const ResumeThemeContext = createContext<ResumeThemeContextType | undefined>(undefined);

export const ResumeThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [textTheme, setTextTheme] = useState<TextTheme>("Default");

  const getTextColor = (type: "heading" | "subHeading" | "link" = "heading") => {
    const colors: Record<TextTheme, { heading: string; subHeading: string; link: string }> = {
      Default: { heading: "#252525", subHeading: "#343434", link: "#1A73E8" },
      Green:   { heading: "#0B8043", subHeading: "#137F49", link: "#34A853" },
      Blue:    { heading: "#1A73E8", subHeading: "#185ABC", link: "#4285F4" },
      Orange:  { heading: "#F2994A", subHeading: "#F2A74D", link: "#F2994A" },
      Purple:  { heading: "#6A1B9A", subHeading: "#7B1FA2", link: "#8E24AA" },
    };
    return colors[textTheme][type];
  };

  return (
    <ResumeThemeContext.Provider value={{ textTheme, setTextTheme, getTextColor }}>
      {children}
    </ResumeThemeContext.Provider>
  );
};

export const useResumeTheme = () => {
  const context = useContext(ResumeThemeContext);
  if (!context) throw new Error("useResumeTheme must be used within ResumeThemeProvider");
  return context;
};
