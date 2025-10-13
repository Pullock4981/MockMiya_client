import { ResumeData, ValidationResult, ValidationError } from "@/types/resume";

/**
 * Validate resume fields before export or submission
 */
export const validateResume = (resumeData: ResumeData): ValidationResult => {
  const errors: ValidationError[] = [];

  const { personalInfo, workExperience, education, skills, summary } = resumeData;

  // Required fields check
  if (!personalInfo.firstName) errors.push({ field: "personalInfo.firstName", message: "First name is required." });
  if (!personalInfo.lastName) errors.push({ field: "personalInfo.lastName", message: "Last name is required." });
  if (!personalInfo.email) errors.push({ field: "personalInfo.email", message: "Email is required." });
  if (!personalInfo.phone) errors.push({ field: "personalInfo.phone", message: "Phone number is required." });
  if (!summary) errors.push({ field: "summary", message: "Summary is required." });

  // Work experience validation
  workExperience.forEach((exp, idx) => {
    if (!exp.jobTitle) errors.push({ field: `workExperience[${idx}].jobTitle`, message: "Job title is required." });
    if (!exp.company) errors.push({ field: `workExperience[${idx}].company`, message: "Company name is required." });
    if (!exp.startDate) errors.push({ field: `workExperience[${idx}].startDate`, message: "Start date is required." });
  });

  // Education validation
  education.forEach((edu, idx) => {
    if (!edu.degree) errors.push({ field: `education[${idx}].degree`, message: "Degree is required." });
    if (!edu.institution) errors.push({ field: `education[${idx}].institution`, message: "Institution is required." });
    if (!edu.graduationDate) errors.push({ field: `education[${idx}].graduationDate`, message: "Graduation date is required." });
  });

  // Skills validation
  if (skills.length === 0) errors.push({ field: "skills", message: "Add at least one skill." });

  return { isValid: errors.length === 0, errors };
};
