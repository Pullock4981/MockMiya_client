"use client";

import React, { createContext, useContext, useState } from "react";

interface SummaryContextType {
  summary: string;
  updateSummary: (summary: string) => void;
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const SummaryProvider = ({ children }: { children: React.ReactNode }) => {
  const [summary, setSummary] = useState("");

  const updateSummary = (newSummary: string) => {
    setSummary(newSummary);
  };

  return (
    <SummaryContext.Provider value={{ summary, updateSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) throw new Error("useSummary must be used within SummaryProvider");
  return context;
};
