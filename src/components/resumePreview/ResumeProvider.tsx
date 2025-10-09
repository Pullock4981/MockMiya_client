"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import { MetaProvider } from "@/context/ResumeContext/MetaContext";
import { PersonalInfoProvider } from "@/context/ResumeContext/PersonalInfo";
import { SummaryProvider } from "@/context/ResumeContext/Summary";
import { WorkExperienceProvider } from "@/context/ResumeContext/WorkExperience";
import { EducationProvider } from "@/context/ResumeContext/Education";
import { SkillsProvider } from "@/context/ResumeContext/Skills";
import { ProjectsProvider } from "@/context/ResumeContext/Projects";
import { CertificationsProvider } from "@/context/ResumeContext/Certifications";
import { ProfessionalLinksProvider } from "@/context/ResumeContext/ProfessionalLinks";
import { AdditionalInfoProvider } from "@/context/ResumeContext/AdditionalInfo";
import { ResumeThemeProvider } from "@/context/ResumeContext/ResumeThemeContext";


interface Props {
  children: React.ReactNode;
  initialData?: ResumeData;
}

export const ResumeProvider = ({ children, initialData }: Props) => (
  <MetaProvider initialData={initialData?.meta}>
    <PersonalInfoProvider initialData={initialData?.personalInfo}>
      <SummaryProvider initialData={initialData?.summary}>
        <WorkExperienceProvider initialData={initialData?.workExperience}>
          <EducationProvider initialData={initialData?.education}>
            <SkillsProvider initialData={initialData?.skills}>
              <ProjectsProvider initialData={initialData?.projects}>
                <CertificationsProvider initialData={initialData?.certifications}>
                  <ProfessionalLinksProvider initialData={initialData?.socialLinks}>
                    <AdditionalInfoProvider initialData={initialData?.additionalInfo}>
                      <ResumeThemeProvider initialData={initialData?.theme}>
                        {children}
                      </ResumeThemeProvider>
                    </AdditionalInfoProvider>
                  </ProfessionalLinksProvider>
                </CertificationsProvider>
              </ProjectsProvider>
            </SkillsProvider>
          </EducationProvider>
        </WorkExperienceProvider>
      </SummaryProvider>
    </PersonalInfoProvider>
  </MetaProvider>
);
