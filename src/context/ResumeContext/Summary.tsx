"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SummaryContextType {
  summary: string;
  updateSummary: (summary: string) => void;
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  initialData?: string;
}

export const SummaryProvider = ({ children, initialData }: Props) => {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (initialData) setSummary(initialData);
  }, [initialData]);

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
