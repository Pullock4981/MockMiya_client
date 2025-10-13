"use client";

import React, { createContext, useContext, useState } from "react";
import { AdditionalInfo, Language } from "@/types/resume";

interface AdditionalInfoContextType {
  additionalInfo: AdditionalInfo;
  updateAdditionalInfo: (info: Partial<AdditionalInfo>) => void;
  addLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;
}

const AdditionalInfoContext = createContext<AdditionalInfoContextType | undefined>(undefined);

export const AdditionalInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    languages: [],
    hobbies: [],
    volunteer: [],
    awards: [],
  });

  const updateAdditionalInfo = (info: Partial<AdditionalInfo>) => {
    setAdditionalInfo((prev) => ({ ...prev, ...info }));
  };

  const addLanguage = (language: Language) => {
    setAdditionalInfo((prev) => ({ ...prev, languages: [...prev.languages, language] }));
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
  if (!context) throw new Error("useAdditionalInfo must be used within AdditionalInfoProvider");
  return context;
};
