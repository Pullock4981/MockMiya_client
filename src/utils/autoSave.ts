import { ResumeData } from "@/types/resume";

const AUTO_SAVE_KEY = "resume_builder_autosave";

/**
 * Save resume to localStorage
 */
export const autoSave = (resumeData: ResumeData) => {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resumeData));
    console.log("Resume auto-saved ✅");
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
};

/**
 * Load auto-saved resume from localStorage
 */
export const loadAutoSavedResume = (): ResumeData | null => {
  try {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as ResumeData;
  } catch (error) {
    console.error("Failed to load auto-saved resume:", error);
    return null;
  }
};
