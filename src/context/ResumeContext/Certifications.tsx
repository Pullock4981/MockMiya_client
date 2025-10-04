"use client";

import React, { createContext, useContext, useState } from "react";
import { Certification } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface CertificationsContextType {
  certifications: Certification[];
  addCertification: (cert: Omit<Certification, "id">) => void;
  updateCertification: (id: string, updatedCert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
}

const CertificationsContext = createContext<CertificationsContextType | undefined>(undefined);

export const CertificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addCertification = (cert: Omit<Certification, "id">) => {
    setCertifications((prev) => [...prev, { id: uuidv4(), ...cert }]);
  };

  const updateCertification = (id: string, updatedCert: Partial<Certification>) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedCert } : c))
    );
  };

  const removeCertification = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CertificationsContext.Provider
      value={{ certifications, addCertification, updateCertification, removeCertification }}
    >
      {children}
    </CertificationsContext.Provider>
  );
};

export const useCertifications = () => {
  const context = useContext(CertificationsContext);
  if (!context) throw new Error("useCertifications must be used within CertificationsProvider");
  return context;
};
