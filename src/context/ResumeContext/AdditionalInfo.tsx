"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdditionalInfo, Language } from "@/types/resume";

interface AdditionalInfoContextType {
  additionalInfo: AdditionalInfo;
  updateAdditionalInfo: (info: Partial<AdditionalInfo>) => void;
  addLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;
}

const AdditionalInfoContext = createContext<AdditionalInfoContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  initialData?: AdditionalInfo;
}

export const AdditionalInfoProvider = ({ children, initialData }: Props) => {
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    languages: [],
    hobbies: [],
    volunteer: [],
    awards: [],
  });

  // ✅ Load initial data from resume
  useEffect(() => {
    if (initialData) setAdditionalInfo(initialData);
  }, [initialData]);

  const updateAdditionalInfo = (info: Partial<AdditionalInfo>) => {
    setAdditionalInfo((prev) => ({ ...prev, ...info }));
  };

  const addLanguage = (language: Language) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));
  };

  const removeLanguage = (id: string) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  };

  return (
    <AdditionalInfoContext.Provider
      value={{
        additionalInfo,
        updateAdditionalInfo,
        addLanguage,
        removeLanguage,
      }}
    >
      {children}
    </AdditionalInfoContext.Provider>
  );
};

export const useAdditionalInfo = () => {
  const context = useContext(AdditionalInfoContext);
  if (!context)
    throw new Error("useAdditionalInfo must be used within AdditionalInfoProvider");
  return context;
};
