// src/types/resume.ts

// ------------------------- Resume Builder TypeScript Definitions -------------------------

// ---------- Personal Info ----------
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  tagline?: string;
  email: string;
  phone: string;
  location: string;
  openToRelocate?: boolean;
  profileImage?: string;
}

// ---------- Work Experience ----------
export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  description?: string;
}

// ---------- Education ----------
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string[];
}

// ---------- Skills ----------
export enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}

export enum SkillCategory {
  Technical = "Technical",
  Soft = "Soft",
  Language = "Language",
  Other = "Other",
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

// ---------- Projects ----------
export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

// ---------- Social Links ----------
export interface SocialLink {
  id: string;
  platform: "LinkedIn" | "GitHub" | "Twitter" | "Portfolio" | "Other";
  url: string;
  username?: string;
}

// ---------- Certifications ----------
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateEarned: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

// ---------- Languages ----------
export interface Language {
  id: string;
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

// ---------- Volunteer ----------
export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

// ---------- Awards ----------
export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

// ---------- Additional Info ----------
export interface AdditionalInfo {
  languages: Language[];
  hobbies: string[];
  volunteer: VolunteerExperience[];
  awards: Award[];
}

// ---------- Template ----------
export interface ResumeTemplate {
  id: string;
  name: string;
  layout: "classic" | "modern" | "creative" | "minimalist" | "professional";
  sections: SectionOrder[];
}

// ---------- Theme ----------
export interface ResumeTheme {
  id: string | number;
  name: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface ResumeMeta {
  currentStep: number;
  completed: boolean;
}

export type SectionOrder =
  | "summary"
  | "workExperience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "socialLinks"
  | "additionalInfo";

// ---------- Resume Data ----------
export interface ResumeData {
  id: string;
  userEmail: string;
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  certifications: Certification[];
  additionalInfo: AdditionalInfo;
  template: ResumeTemplate;
  theme: ResumeTheme;
  createdAt: string;
  updatedAt: string;
  meta?: ResumeMeta;

  // ✅ NEW FIELD
  resumeStatus?: "draft" | "complete";
}


// ---------- ATS Score ----------
export interface ATSScore {
  overall: number;
  breakdown: {
    keywords: number;
    formatting: number;
    sections: number;
    length: number;
  };
  suggestions: string[];
  passedChecks: string[];
  failedChecks: string[];
}

// ---------- AI Suggestions ----------
export interface AIsuggestion {
  section: string;
  field: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  confidence: number;
}

// ---------- Form Steps ----------
export interface FormStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isRequired: boolean;
}

// ------------------------- Resume Context -------------------------
export interface ResumeContextType {
  resumeData: ResumeData;
  currentStep: number;
  formSteps: FormStep[];
  atsScore: ATSScore | null;
  aiSuggestions: AIsuggestion[];
  isLoading: boolean;
  error: string | null;

  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addWorkExperience: (experience: Omit<WorkExperience, "id">) => void;
  updateWorkExperience: (
    id: string,
    experience: Partial<WorkExperience>
  ) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: (cert: Omit<Certification, "id">) => void;
  removeCertification: (id: string) => void;
  updateTemplate: (template: ResumeTemplate) => void;
  updateTheme: (theme: ResumeTheme) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  calculateATSScore: () => Promise<void>;
  getAISuggestions: (section: string) => Promise<void>;
  exportResume: (format: "pdf" | "docx") => Promise<void>;
  saveResume: () => Promise<void>;
  autoSave: () => void;
}

// ------------------------- Meta Context -------------------------
export interface MetaContextType {
  template?: ResumeTemplate;
  theme?: ResumeTheme;
  atsScore?: ATSScore;
  aiSuggestions?: AIsuggestion[];


  updateTemplate: (template: ResumeTemplate) => void;
  updateTheme: (theme: ResumeTheme) => void;
  setATSScore: (score: ATSScore) => void;
  setAISuggestions: (suggestions: AIsuggestion[]) => void;
}

export type ExportFormat = "pdf" | "docx";

// ------------------------- Provider Props -------------------------
export interface ResumeContextProviderProps {
  children: React.ReactNode;
}

// ------------------------- Validation Types -------------------------
export interface ValidationError {
  field: keyof ResumeData | string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
