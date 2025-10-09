"use client";

import React from "react";
import { ResumeData } from "@/types/resume";

interface ResumeCardProps {
  resumeData: ResumeData;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resumeData }) => {
  const { personalInfo, summary, workExperience, education, skills, projects } = resumeData;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
      {/* Personal Info */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-lg text-gray-600">{personalInfo.jobTitle}</p>
        <p className="text-sm text-gray-500">{personalInfo.email} | {personalInfo.phone} | {personalInfo.location}</p>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Work Experience</h2>
          <ul className="space-y-3">
            {workExperience.map((exp) => (
              <li key={exp.id}>
                <h3 className="font-bold">{exp.jobTitle} - {exp.company}</h3>
                <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                <ul className="list-disc ml-6 text-sm">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
          <ul className="space-y-2">
            {education.map((edu) => (
              <li key={edu.id}>
                <h3 className="font-bold">{edu.degree} - {edu.institution}</h3>
                <p className="text-sm text-gray-500">{edu.graduationDate}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill.id} className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
                {skill.name} ({skill.level})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h2>
          <ul className="space-y-3">
            {projects.map((proj) => (
              <li key={proj.id}>
                <h3 className="font-bold">{proj.name}</h3>
                <p className="text-sm">{proj.description}</p>
                {proj.url && <a href={proj.url} target="_blank" className="text-blue-600">View Project</a>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
