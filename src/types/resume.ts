export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  profileImage?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "ats" | "non-ats";
  component: React.ComponentType<{ resumeData: ResumeData }>;
}

export interface SaveResumeResponse {
  success: boolean;
  id: string;
  message?: string;
  error?: string;
}

export interface DesignData {
  layout: string;
  colors: string;
  includeProfileImage: boolean;
}

export interface SaveResumeRequest {
  resumeData: ResumeData;
  template: string;
  mode: string;
  design: DesignData;
}