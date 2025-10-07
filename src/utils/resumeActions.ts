"use client";

import { ResumeData } from "@/types/resume";

/**
 * Save or update a resume step for a specific user.
 * Uses /api/saveResume endpoint.
 *
 * @param resumeId - Unique resume identifier
 * @param userEmail - User's email
 * @param stepData - Partial resume data to save
 * @returns Response from API
 */
export async function saveResumeStep(
  resumeId: string,
  userEmail: string,
  stepData: Partial<ResumeData>
) {
  if (!resumeId || !userEmail) {
    throw new Error("resumeId and userEmail are required");
  }

  // Merge step data and add timestamps
  const payload: Partial<ResumeData> = {
    id: resumeId,
    userEmail,
    ...stepData,
    updatedAt: new Date().toISOString(),
    createdAt: stepData.createdAt || new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/saveResume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to save resume step");
    }

    console.log("✅ Resume step saved successfully:", payload);
    return data;
  } catch (error) {
    console.error("❌ Error saving resume step:", error);
    throw error;
  }
}
