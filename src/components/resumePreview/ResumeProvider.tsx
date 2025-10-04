"use client";

import { ResumeThemeProvider } from "./ResumeThemeContext";
import { AdditionalInfoProvider } from "@/context/ResumeContext/AdditionalInfo";
import { CertificationsProvider } from "@/context/ResumeContext/Certifications";
import { EducationProvider } from "@/context/ResumeContext/Education";
import { MetaProvider } from "@/context/ResumeContext/MetaContext";
import { PersonalInfoProvider } from "@/context/ResumeContext/PersonalInfo";
import { ProfessionalLinksProvider } from "@/context/ResumeContext/ProfessionalLinks";
import { ProjectsProvider } from "@/context/ResumeContext/Projects";
import { SkillsProvider } from "@/context/ResumeContext/Skills";
import { SummaryProvider } from "@/context/ResumeContext/Summary";
import { WorkExperienceProvider } from "@/context/ResumeContext/WorkExperience";
import React from "react";

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MetaProvider>
      <PersonalInfoProvider>
        <SummaryProvider>
          <WorkExperienceProvider>
            <EducationProvider>
              <SkillsProvider>
                <ProjectsProvider>
                  <CertificationsProvider>
                    <ProfessionalLinksProvider>
                      <AdditionalInfoProvider>
                        <ResumeThemeProvider>
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
};
