import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { logAdminActivity } from "@/lib/logAdminActivity";

// --- Resume Type Definitions ---
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  summary?: string;
}

interface Skill {
  name?: string;
  level?: string;
}

interface WorkExperience {
  position?: string;
  title?: string;
  company?: string;
  description?: string;
}

interface Education {
  degree?: string;
  institution?: string;
}

interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
}

interface Certification {
  name?: string;
}

export interface Resume {
  id?: string;
  userEmail?: string;
  resumeStatus?: string;
  updatedAt?: Date;
  personalInfo?: PersonalInfo;
  skills?: Skill[];
  workExperience?: WorkExperience[];
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];
  [key: string]: unknown; // fallback for other fields in DB
}

// --- Extract text function ---
function extractResumeText(resume: Resume): string {
  if (!resume) return "";

  let resumeText = "";

  // Personal Info
  if (resume.personalInfo) {
    const { firstName, lastName, jobTitle, email, summary } = resume.personalInfo;
    resumeText += `Name: ${firstName || ""} ${lastName || ""}\n`;
    resumeText += `Title: ${jobTitle || ""}\n`;
    resumeText += `Email: ${email || ""}\n`;
    resumeText += `Summary: ${summary || ""}\n\n`;
  }

  // Skills
  if (Array.isArray(resume.skills)) {
    resumeText += "SKILLS:\n";
    resume.skills.forEach((skill: Skill) => {
      resumeText += `- ${skill.name || ""} (${skill.level || "Proficient"})\n`;
    });
    resumeText += "\n";
  }

  // Work Experience
  if (Array.isArray(resume.workExperience)) {
    resumeText += "WORK EXPERIENCE:\n";
    resume.workExperience.forEach((exp: WorkExperience) => {
      resumeText += `- ${exp.position || exp.title || ""} at ${exp.company || ""}\n`;
      resumeText += `  ${exp.description || ""}\n`;
    });
    resumeText += "\n";
  }

  // Education
  if (Array.isArray(resume.education)) {
    resumeText += "EDUCATION:\n";
    resume.education.forEach((edu: Education) => {
      resumeText += `- ${edu.degree || ""} from ${edu.institution || ""}\n`;
    });
    resumeText += "\n";
  }

  // Projects
  if (Array.isArray(resume.projects)) {
    resumeText += "PROJECTS:\n";
    resume.projects.forEach((project: Project) => {
      resumeText += `- ${project.name || ""}: ${project.description || ""}\n`;
      if (Array.isArray(project.technologies)) {
        resumeText += `  Technologies: ${project.technologies.join(", ")}\n`;
      }
    });
    resumeText += "\n";
  }

  // Certifications
  if (Array.isArray(resume.certifications)) {
    resumeText += "CERTIFICATIONS:\n";
    resume.certifications.forEach((cert: Certification) => {
      resumeText += `- ${cert.name || ""}\n`;
    });
    resumeText += "\n";
  }

  return resumeText;
}

// --- Main Route ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");
    const userEmail = searchParams.get("userEmail");
    const fetchLatestDraft = searchParams.get("latestDraft");

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection<Resume>("resumes");

    let resume: Resume | null = null;

    if (resumeId) {
      resume = await resumes.findOne({ id: resumeId });
    } else if (fetchLatestDraft === "true" && userEmail) {
      resume = await resumes.findOne(
        { userEmail, resumeStatus: "draft" },
        { sort: { updatedAt: -1 } }
      );
    } else if (userEmail) {
      resume = await resumes.findOne(
        { userEmail },
        { sort: { updatedAt: -1 } }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Provide either id or userEmail to fetch resume" },
        { status: 400 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    // Extract text safely
    const resumeText = extractResumeText(resume);
    const resumeWithText = { ...resume, resumeText };

    await logAdminActivity(
      `Fetched resume: ${resumeId ?? "latest draft"}`,
      "info",
      "resume",
      userEmail ?? null,
      { resumeId, resumeTextLength: resumeText.length }
    );

    return NextResponse.json({
      success: true,
      resume: resumeWithText,
      resumeText,
    });
  } catch (err) {
    await logAdminActivity(
      `Error fetching resume: ${(err as Error).message}`,
      "error",
      "resume",
      null
    );

    return NextResponse.json(
      { success: false, message: "Server error while fetching resume" },
      { status: 500 }
    );
  }
}
