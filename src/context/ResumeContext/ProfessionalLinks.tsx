"use client";

import React, { createContext, useContext, useState } from "react";
import { SocialLink } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface ProfessionalLinksContextType {
  socialLinks: SocialLink[];
  addLink: (link: Omit<SocialLink, "id">) => void;
  updateLink: (id: string, updated: Partial<SocialLink>) => void;
  removeLink: (id: string) => void;
}

const ProfessionalLinksContext = createContext<ProfessionalLinksContextType | undefined>(undefined);

export const ProfessionalLinksProvider = ({ children }: { children: React.ReactNode }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const addLink = (link: Omit<SocialLink, "id">) => {
    setSocialLinks((prev) => [...prev, { id: uuidv4(), ...link }]);
  };

  const updateLink = (id: string, updated: Partial<SocialLink>) => {
    setSocialLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  const removeLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <ProfessionalLinksContext.Provider value={{ socialLinks, addLink, updateLink, removeLink }}>
      {children}
    </ProfessionalLinksContext.Provider>
  );
};

export const useProfessionalLinks = () => {
  const context = useContext(ProfessionalLinksContext);
  if (!context) throw new Error("useProfessionalLinks must be used within ProfessionalLinksProvider");
  return context;
};
