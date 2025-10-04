"use client";

import React, { createContext, useContext, useState } from "react";
import { PersonalInfo } from "@/types/resume";

interface PersonalInfoContextType {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
}

const PersonalInfoContext = createContext<PersonalInfoContextType | undefined>(undefined);

export const PersonalInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    tagline: "",
    openToRelocate: false,
    profileImage: "",
  });

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setPersonalInfo((prev) => ({ ...prev, ...info }));
  };

  return (
    <PersonalInfoContext.Provider value={{ personalInfo, updatePersonalInfo }}>
      {children}
    </PersonalInfoContext.Provider>
  );
};

export const usePersonalInfo = () => {
  const context = useContext(PersonalInfoContext);
  if (!context) throw new Error("usePersonalInfo must be used within PersonalInfoProvider");
  return context;
};
