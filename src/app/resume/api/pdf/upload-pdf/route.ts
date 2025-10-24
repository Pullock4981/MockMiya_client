// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import clientPromise from "@/context/MongoDB/mongodb";
import {
  ResumeData,
  Skill,
  SkillLevel,
  SkillCategory,
  Project,
  Certification,
  AdditionalInfo,
  Language,
  VolunteerExperience,
  Award,
} from "@/types/resume";

export const runtime = "nodejs";

/**
 * Local helper types that match the shapes we produce.
 * These keep us from using `any`.
 */
interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
  honors: string;
  relevantCoursework: string[];
}

interface WorkExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  description: string;
}

/**
 * pdf2json doesn't export exact TS types in many projects.
 * Create a small local constructor signature so we can avoid `any`.
 */
type PdfParserInstance = {
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  loadPDF: (filePath: string) => void;
  getRawTextContent: () => string;
};
type PdfParserConstructor = {
  new (config?: unknown, scale?: number): PdfParserInstance;
};

/** --- Smart header extractor --- */
function extractHeaderInfo(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "";

  if (firstLine && firstLine.length > 20) {
    const parts = firstLine.split(/\s{2,}|\t+| {5,}/).filter(Boolean);
    return {
      name: parts[0] || "",
      jobTitle: parts[1] || "",
      location: parts[2] || "",
    };
  }

  return {
    name: lines[0] || "",
    jobTitle: lines[1] || "",
    location: lines.find((l) => /,/.test(l)) || "",
  };
}

/** --- Tagline extractor --- */
function extractTagline(text: string) {
  const match = text.match(/(Tagline|Headline)[:\s]+(.{10,100})/i);
  return match ? match[2].trim() : "";
}

/** --- Utility: parse dates to YYYY-MM where possible --- */
function monthNameToNumber(monthName: string) {
  const map: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
  };
  const key = (monthName || "").toLowerCase().slice(0, 3);
  return map[key] || 0;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function parseDateString(raw: string | undefined, preferEnd = false) {
  if (!raw) return "";
  const s = raw.trim();
  if (/present|current|now/i.test(s)) return "Present";

  const ymd = s.match(/(19|20)\d{2}[-\/.]\d{1,2}/);
  if (ymd) {
    const [year, month] = ymd[0].split(/[-\/.]/);
    return `${year}-${pad2(Number(month))}`;
  }

  const mmm = s.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+((19|20)\d{2})/i);
  if (mmm) {
    const monthNum = monthNameToNumber(mmm[1]);
    const year = mmm[2];
    if (monthNum) return `${year}-${pad2(monthNum)}`;
    return `${year}-01`;
  }

  const yearOnly = s.match(/\b((19|20)\d{2})\b/);
  if (yearOnly) {
    const year = yearOnly[1];
    return `${year}-${preferEnd ? "12" : "01"}`;
  }

  return "";
}

/** --- Education extractor --- */
function extractEducationBlock(text: string): EducationEntry[] {
  const startMatch = text.match(/(^|\n)\s*(Education|EDUCATION|Qualifications|Academic)[:\s]*/i);
  if (!startMatch) return [];

  const startIndex = startMatch.index ?? 0;
  const tail = text.slice(startIndex);
  const stopRe = new RegExp(
    `(^|\\n)\\s*(Experience|PROJECTS|Projects|Skills|LANGUAGES|Languages|Certifications|Volunteer|Awards|Summary|Objective|Career|PROFILE)[:\\s]`,
    "i"
  );
  const stopIdx = tail.search(stopRe);
  const block = stopIdx === -1 ? tail : tail.slice(0, stopIdx);

  const lines = block
    .replace(/(^|\n)\s*(Education|EDUCATION|Qualifications|Academic)[:\s]*/i, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const results: EducationEntry[] = [];
  let i = 0;

  const normalizeYearToMonth = (maybeLine: string) => {
    const yearMatch = maybeLine?.match(/(19|20)\d{2}/);
    return yearMatch ? `${yearMatch[0]}-12` : "";
  };

  while (i < lines.length) {
    const degreeLine = lines[i] || "";
    const instLine = lines[i + 1] || "";
    const maybeYearLine = lines[i + 2] || "";

    if (!degreeLine) {
      i += 1;
      continue;
    }

    let degree = degreeLine;
    let institutionLine = instLine;
    let consumed = 1;

    if (!/(College|University|Institute|School|Academy|Engineering|Degree)/i.test(instLine) && (degreeLine.includes("-") || degreeLine.includes("–"))) {
      const parts = degreeLine.split(/[-–]/).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        degree = parts[0];
        institutionLine = parts.slice(1).join(" - ");
        consumed = 1;
      } else {
        degree = degreeLine;
        institutionLine = instLine;
        consumed = 2;
      }
    } else {
      consumed = 2;
    }

    let graduationDate = normalizeYearToMonth(maybeYearLine) || normalizeYearToMonth(institutionLine) || normalizeYearToMonth(degreeLine);

    if (/Passing Year|PassingYear|Year\s*:/i.test(maybeYearLine) || /\b(19|20)\d{2}\b/.test(maybeYearLine)) {
      const y = normalizeYearToMonth(maybeYearLine);
      if (y) graduationDate = y;
      consumed = Math.max(consumed, 3);
    }

    let gpa = "";
    const gpaMatch = (maybeYearLine || "").match(/GPA[:\s]*([0-9.\/]+)/i) || (institutionLine || "").match(/GPA[:\s]*([0-9.\/]+)/i);
    if (gpaMatch) gpa = gpaMatch[1].trim();

    if (!gpa) {
      const numMatch = (maybeYearLine || "").match(/\b([0-4]\.\d{1,2})\b/) || (institutionLine || "").match(/\b([0-4]\.\d{1,2})\b/);
      if (numMatch) gpa = numMatch[1];
    }

    let honors = "";
    const honorsMatch = (maybeYearLine || "").match(/Honors[:\s]*(.+)/i) || (maybeYearLine || "").match(/(Magna Cum Laude|Cum Laude|First Class|Second Class)/i);
    if (honorsMatch) honors = (honorsMatch[1] || honorsMatch[0]).trim();

    let institution = "";
    let location = "";
    if (institutionLine) {
      if (institutionLine.includes(",")) {
        const parts = institutionLine.split(",").map((p) => p.trim()).filter(Boolean);
        institution = parts[0] || "";
        location = parts.slice(1).join(", ") || "";
      } else if (institutionLine.includes("-") || institutionLine.includes("–")) {
        const parts = institutionLine.split(/[-–]/).map((p) => p.trim()).filter(Boolean);
        institution = parts[0] || "";
        location = parts.slice(1).join(", ") || "";
      } else {
        institution = institutionLine;
      }
    }

    let degreeShort = degree;
    if (/Higher Secondary Certificate|Higher Secondary|HSC/i.test(degree)) degreeShort = "HSC";
    else if (/Diploma/i.test(degree)) degreeShort = degree.match(/Diploma/i) ? "Diploma" : degree;

    const entry: EducationEntry = {
      id: uuidv4(),
      degree: (degreeShort || "").trim(),
      institution: (institution || "").trim(),
      location: (location || "").trim(),
      graduationDate: graduationDate || "",
      gpa: gpa || "",
      honors: honors || "",
      relevantCoursework: [],
    };

    if (entry.degree || entry.institution || entry.graduationDate) {
      results.push(entry);
    }

    i += consumed;
  }

  return results;
}

/** --- Skill extractor helpers --- */
function mapCategoryStringToEnum(cat: string): SkillCategory {
  if (!cat) return SkillCategory.Other;
  const normalized = cat.trim().toLowerCase();

  if (/(frontend|front[-\s]?end)/i.test(normalized)) return SkillCategory.Frontend;
  if (/(backend|back[-\s]?end)/i.test(normalized)) return SkillCategory.Backend;
  if (/(database|db|databases)/i.test(normalized)) return SkillCategory.Database;
  if (/(tool|tools|tooling)/i.test(normalized)) return SkillCategory.Tools;
  if (/(platform|platforms)/i.test(normalized)) return SkillCategory.Platforms;
  if (/(technical|tech)/i.test(normalized)) return SkillCategory.Technical;
  if (/(soft|soft[-\s]?skill|softs)/i.test(normalized)) return SkillCategory.Soft;
  if (/(language|languages)/i.test(normalized)) return SkillCategory.Language;

  return SkillCategory.Other;
}

function extractSkillsFromText(text: string): Skill[] {
  const skillsSectionRe = /(Skills|Technical Skills|Key Skills|Abilities)[:\-\s]*([\s\S]{0,1200}?)(?=(\n[A-Z][a-z]+|Experience|Education|Projects|OBJECTIVE|CARRER|SUMMARY|$))/i;
  const match = text.match(skillsSectionRe);
  if (!match) return [];

  const skillsText = match[2] || "";
  const lines = skillsText.split("\n").map((l) => l.trim()).filter(Boolean);

  const result: Skill[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const categoryRaw = line.slice(0, colonIndex).trim();
      const skillListPart = line.slice(colonIndex + 1).trim();
      const skillNames = skillListPart.split(/[,•\/|]/).map((s) => s.trim()).filter(Boolean);
      const categoryEnum = mapCategoryStringToEnum(categoryRaw);

      for (const name of skillNames) {
        const cleanName = name.replace(/^[\-\u2022\s]+|[\-\u2022\s]+$/g, "").trim();
        if (!cleanName) continue;
        result.push({
          id: uuidv4(),
          name: cleanName,
          level: SkillLevel.Intermediate,
          category: categoryEnum,
        });
      }
    } else {
      const skillNames = line.split(/[,•\/|]/).map((s) => s.trim()).filter(Boolean);
      if (skillNames.length > 1) {
        for (const name of skillNames) {
          const cleanName = name.replace(/^[\-\u2022\s]+|[\-\u2022\s]+$/g, "").trim();
          if (!cleanName) continue;
          result.push({
            id: uuidv4(),
            name: cleanName,
            level: SkillLevel.Intermediate,
            category: SkillCategory.Technical,
          });
        }
      } else {
        const wordsSplit = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
        if (wordsSplit.length > 1) {
          for (const name of wordsSplit) {
            const cleanName = name.replace(/^[\-\u2022\s]+|[\-\u2022\s]+$/g, "").trim();
            if (!cleanName) continue;
            result.push({
              id: uuidv4(),
              name: cleanName,
              level: SkillLevel.Intermediate,
              category: SkillCategory.Technical,
            });
          }
        } else {
          const clean = line.replace(/^[\-\u2022\s]+|[\-\u2022\s]+$/g, "").trim();
          if (clean) {
            result.push({
              id: uuidv4(),
              name: clean,
              level: SkillLevel.Intermediate,
              category: SkillCategory.Technical,
            });
          }
        }
      }
    }
  }

  const seen = new Set<string>();
  const deduped: Skill[] = [];
  for (const s of result) {
    const key = s.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(s);
    }
  }

  return deduped;
}

/** --- Work Experience extractor --- */
function extractWorkExperienceBlock(text: string): WorkExperienceEntry[] {
  const startMatch = text.match(/(^|\n)\s*(Experience|Work Experience|Employment History|Professional Experience)[:\s]*/i);
  if (!startMatch) return [];

  const startIndex = startMatch.index ?? 0;
  const tail = text.slice(startIndex);
  const stopRe = new RegExp(
    `(^|\\n)\\s*(Education|Skills|Projects|Certifications|Languages|Volunteer|Awards|Summary|Objective|PROFILE)[:\\s]`,
    "i"
  );
  const stopIdx = tail.search(stopRe);
  const block = stopIdx === -1 ? tail : tail.slice(0, stopIdx);

  const lines = block
    .replace(/(^|\n)\s*(Experience|Work Experience|Employment History|Professional Experience)[:\s]*/i, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const experiences: WorkExperienceEntry[] = [];
  let currentJob: Partial<WorkExperienceEntry> | null = null;
  let bullets: string[] = [];

  const pushCurrent = () => {
    if (!currentJob) return;
    const startDateNorm = parseDateString(currentJob.startDate || "", false);
    const endDateRaw = currentJob.endDate || "";
    const endDateNorm = endDateRaw ? parseDateString(endDateRaw, true) : (currentJob.endDate ? parseDateString(currentJob.endDate, true) : "");
    const isCurrent = /present|current|now/i.test(String(currentJob.endDate)) || (!endDateRaw && /present|current|now/i.test(String(currentJob.description || "")));

    const entry: WorkExperienceEntry = {
      id: uuidv4(),
      jobTitle: (currentJob.jobTitle || "").trim(),
      company: (currentJob.company || "").trim(),
      location: (currentJob.location || "").trim(),
      startDate: startDateNorm || (currentJob.startDate || ""),
      endDate: endDateNorm || (currentJob.endDate || ""),
      current: isCurrent,
      responsibilities: bullets.map((b) => b.trim()).filter(Boolean),
      achievements: [],
      description: (currentJob.description || bullets.join(" ")).trim(),
    };

    experiences.push(entry);
    currentJob = null;
    bullets = [];
  };

  for (const line of lines) {
    if (/^(Experience|Work Experience|Employment History|Professional Experience)[:\s]*$/i.test(line)) continue;

    const jobCompanyMatch = line.match(/^(.+?)\s*(?:[-\|@]\s*|\sat\s+)(.+)$/i);
    if (jobCompanyMatch) {
      if (currentJob) pushCurrent();
      currentJob = {
        jobTitle: jobCompanyMatch[1].trim(),
        company: jobCompanyMatch[2].trim(),
      };
      continue;
    }

    const parenMatch = line.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (parenMatch) {
      if (currentJob) pushCurrent();
      currentJob = {
        jobTitle: parenMatch[1].trim(),
        company: parenMatch[2].trim(),
      };
      continue;
    }

    const dateRangeMatch = line.match(/([A-Za-z]{3,}\s*\d{4}|\d{4}(?:[-\/.]\d{1,2})?)\s*[-–]\s*(Present|present|Now|now|[A-Za-z]{3,}\s*\d{4}|\d{4}(?:[-\/.]\d{1,2})?)/i);
    if (dateRangeMatch && currentJob) {
      currentJob.startDate = dateRangeMatch[1].trim();
      currentJob.endDate = dateRangeMatch[2].trim();
      continue;
    }

    const singleDateMatch = line.match(/^(From|Start|Since)[:\s]*([A-Za-z]{3,}\s*\d{4}|\d{4}(?:[-\/.]\d{1,2})?)/i);
    if (singleDateMatch && currentJob) {
      currentJob.startDate = singleDateMatch[2].trim();
      continue;
    }
    const singleEndMatch = line.match(/^(To|Until|End)[:\s]*((Present|present|Now|now)|([A-Za-z]{3,}\s*\d{1,}\s*\d{4}|\d{4}(?:[-\/.]\d{1,2})?))/i);
    if (singleEndMatch && currentJob) {
      currentJob.endDate = singleEndMatch[2].trim();
      continue;
    }

    if (/(,|\bDhaka\b|\bNew York\b|\bLondon\b|\bSan Francisco\b|\bChittagong\b)/i.test(line) && line.split(" ").length < 6 && currentJob && !currentJob.location) {
      currentJob.location = line;
      continue;
    }

    if (/^[-•*]\s+/.test(line)) {
      bullets.push(line.replace(/^[-•*]\s+/, "").trim());
      continue;
    }

    if (/^[-=]{3,}$/.test(line) && currentJob) {
      pushCurrent();
      continue;
    }

    const commaJobCompany = line.match(/^(.{2,100}?),\s*(.{2,100}?)$/);
    if (!currentJob && commaJobCompany && /[A-Za-z]/.test(commaJobCompany[2])) {
      currentJob = { jobTitle: commaJobCompany[1].trim(), company: commaJobCompany[2].trim() };
      continue;
    }

    if (currentJob && !/^(Experience|Education|Skills|Projects|Certifications|Languages|Volunteer|Awards|Summary|Objective)[:\s]*$/i.test(line)) {
      if (!currentJob.description) currentJob.description = line;
      else currentJob.description += " " + line;
      continue;
    }
  }

  pushCurrent();

  return experiences;
}

/** --- Projects extractor --- */
function extractProjectsBlock(text: string): Project[] {
  const startMatch = text.match(/(^|\n)\s*(Projects|Project|Portfolio|Achievements)[:\s]*/i);
  if (!startMatch) return [];

  const startIndex = startMatch.index ?? 0;
  const tail = text.slice(startIndex);
  const stopRe = new RegExp(`(^|\\n)\\s*(Experience|Education|Skills|Certifications|Languages|Volunteer|Awards|Summary|Objective|PROFILE)[:\\s]`, "i");
  const endIdx = tail.search(stopRe);
  const block = endIdx === -1 ? tail : tail.slice(0, endIdx);

  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  const projects: Project[] = [];
  let current: Partial<Project> | null = null;
  let highlights: string[] = [];

  const pushCurrent = () => {
    if (!current) return;
    projects.push({
      id: uuidv4(),
      name: (current.name || "").slice(0, 120),
      description: (current.description || "").slice(0, 1000),
      technologies: (current.technologies || []).map(String),
      url: current.url || "",
      githubUrl: current.githubUrl || "",
      startDate: current.startDate || "",
      endDate: current.endDate || "",
      highlights: highlights || [],
    });
    current = null;
    highlights = [];
  };

  for (const line of lines) {
    if (/^(Projects|Project|Portfolio|Achievements)[:\s]*$/i.test(line)) continue;

    const urlMatch = line.match(/(https?:\/\/[^\s,;]+)/i);
    if (urlMatch) {
      if (!current) current = {};
      const url = urlMatch[1];
      if (/github\.com/i.test(url)) current.githubUrl = url;
      else current.url = url;
      continue;
    }

    const dateRangeMatch = line.match(/([A-Za-z]{3,}\s?\d{4}|\d{4})\s*[-–]\s*([A-Za-z]{3,}\s?\d{4}|Present|\d{4})/i);
    if (dateRangeMatch) {
      if (!current) current = {};
      current.startDate = dateRangeMatch[1];
      current.endDate = dateRangeMatch[2];
      continue;
    }

    if (/^[-•*]\s+/.test(line)) {
      highlights.push(line.replace(/^[-•*]\s+/, ""));
      continue;
    }

    const techMatch = line.match(/(Technologies Used|Technologies)[:\s]*(.+)/i);
    if (techMatch) {
      const techs = techMatch[2].split(/[,\/|•]/).map(s => s.trim()).filter(Boolean);
      if (!current) current = {};
      current.technologies = [...(current.technologies || []), ...techs];
      continue;
    }

    const projNameMatch = line.match(/^(Project Name|Name)[:\s-]+(.{1,200})$/i);
    if (projNameMatch) {
      if (current && (current.name || current.description)) pushCurrent();
      current = { name: projNameMatch[2].trim() };
      continue;
    }

    if (!current) {
      current = { name: line };
      continue;
    }

    if (current && !current.description) {
      current.description = line;
      continue;
    }

    if (current && current.description) {
      current.description = `${current.description} ${line}`;
    }
  }

  pushCurrent();

  for (const p of projects) {
    if (p.technologies && p.technologies.length > 0) {
      p.technologies = p.technologies
        .flatMap(t => (typeof t === "string" ? t.split(/[,\/|•]/) : [t]))
        .map(s => s.trim())
        .filter(Boolean);
    } else {
      p.technologies = [];
    }
    p.name = (p.name || "").trim();
    p.description = (p.description || "").trim();
  }

  return projects;
}

/** --- Certifications extractor --- */
function extractCertificationsBlock(text: string): Certification[] {
  const startMatch = text.match(/(^|\n)\s*(Certifications|CERTIFICATIONS|Certificates|CERTIFICATES)[:\s]*/i);
  if (!startMatch) return [];

  const startIndex = startMatch.index ?? 0;
  const tail = text.slice(startIndex);
  const stopRe = new RegExp(`(^|\\n)\\s*(Experience|Education|Skills|Projects|Languages|Volunteer|Awards|Summary|Objective|PROFILE)[:\\s]`, "i");
  const endIdx = tail.search(stopRe);
  const block = endIdx === -1 ? tail : tail.slice(0, endIdx);

  const lines = block
    .replace(/(^|\n)\s*(Certifications|CERTIFICATIONS|Certificates|CERTIFICATES)[:\s]*/i, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const certs: Certification[] = [];
  let i = 0;

  const isDateLine = (ln: string) => {
    if (!ln) return false;
    return /(19|20)\d{2}(-\d{2})?/.test(ln) || /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}/i.test(ln);
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/[\|—–-]/.test(line) && (line.split(/[\|—–-]/).length >= 2 || line.split(",").length >= 2)) {
      const parts = line.split(/[\|—–-]|,/).map(p => p.trim()).filter(Boolean);
      let name = "";
      let issuer = "";
      let dateEarned = "";
      let url = "";
      for (const p of parts) {
        if (/https?:\/\//i.test(p)) url = p;
        else if (isDateLine(p)) dateEarned = p;
        else if (!name) name = p;
        else issuer = issuer ? `${issuer} ${p}` : p;
      }
      certs.push({
        id: uuidv4(),
        name: name || line,
        issuer: issuer || "",
        dateEarned: dateEarned || "",
        expirationDate: "",
        credentialId: "",
        url: url || "",
      });
      i += 1;
      continue;
    }

    const next = lines[i + 1] || "";
    const next2 = lines[i + 2] || "";

    if (isDateLine(next) && next2 && !isDateLine(next2)) {
      certs.push({
        id: uuidv4(),
        name: line,
        issuer: next2,
        dateEarned: next,
        expirationDate: "",
        credentialId: "",
        url: "",
      });
      i += 3;
      continue;
    }

    if (next && !isDateLine(next) && isDateLine(next2)) {
      certs.push({
        id: uuidv4(),
        name: line,
        issuer: next,
        dateEarned: next2,
        expirationDate: "",
        credentialId: "",
        url: "",
      });
      i += 3;
      continue;
    }

    if (isDateLine(line)) {
      if (certs.length > 0 && !certs[certs.length - 1].dateEarned) {
        certs[certs.length - 1].dateEarned = line;
      }
      i += 1;
      continue;
    }

    if (/https?:\/\//i.test(line) && certs.length > 0) {
      const last = certs[certs.length - 1];
      if (!last.url) {
        const m = line.match(/(https?:\/\/[^\s,;]+)/i);
        if (m) last.url = m[1];
      }
      i += 1;
      continue;
    }

    const parenthesisMatch = line.match(/^(.+)\s+\(([^)]+)\)\s*(.*)$/);
    if (parenthesisMatch) {
      const [, nm, iss, rest] = parenthesisMatch;
      const dateMatch = (rest || "").match(/(19|20)\d{2}(-\d{2})?|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/i);
      certs.push({
        id: uuidv4(),
        name: nm.trim(),
        issuer: iss.trim(),
        dateEarned: dateMatch ? dateMatch[0] : "",
        expirationDate: "",
        credentialId: "",
        url: "",
      });
      i += 1;
      continue;
    }

    const issuerInlineMatch = line.match(/^(.*?)(?:\s*[-–|]\s*|[:])\s*(Issued by|Issuer|Issuing Organization)[:\s]*(.+)$/i);
    if (issuerInlineMatch) {
      const namePart = issuerInlineMatch[1].trim();
      const issuerPart = issuerInlineMatch[3].trim();
      certs.push({
        id: uuidv4(),
        name: namePart,
        issuer: issuerPart,
        dateEarned: "",
        expirationDate: "",
        credentialId: "",
        url: "",
      });
      i += 1;
      continue;
    }

    // fallback heuristics
    let foundIssuer = "";
    let foundDate = "";

    if (isDateLine(next)) {
      foundDate = next;
    } else if (next && /[A-Za-z]/.test(next) && !isDateLine(next)) {
      foundIssuer = next;
    }

    if (!foundDate && isDateLine(next2)) foundDate = next2;

    certs.push({
      id: uuidv4(),
      name: line,
      issuer: foundIssuer,
      dateEarned: foundDate,
      expirationDate: "",
      credentialId: "",
      url: "",
    });

    if (foundIssuer && foundDate) i += 3;
    else if (foundIssuer || foundDate) i += 2;
    else i += 1;
  }

  const seen = new Set<string>();
  const deduped: Certification[] = [];
  for (const c of certs) {
    const nameKey = (c.name || "").toLowerCase().trim();
    if (!nameKey) continue;
    if (!seen.has(nameKey)) {
      seen.add(nameKey);
      deduped.push({
        id: c.id || uuidv4(),
        name: (c.name || "").trim(),
        issuer: (c.issuer || "").trim(),
        dateEarned: (c.dateEarned || "").trim(),
        expirationDate: (c.expirationDate || "").trim(),
        credentialId: (c.credentialId || "").trim(),
        url: (c.url || "").trim(),
      });
    }
  }

  return deduped;
}

/** --- Additional Info extractor (languages, hobbies, volunteer, awards) ---
 *  Improved to reliably extract Languages even when it's the only block.
 */
function extractAdditionalInfoBlock(text: string): AdditionalInfo {
  const result: AdditionalInfo = { languages: [], hobbies: [], volunteer: [], awards: [] };

  // stop regex to find block boundaries
  const stopHeadings = "(Experience|Education|Skills|Projects|Certifications|Languages|Volunteer|Awards|Summary|Objective|PROFILE|Contact|Contact Information)";
  const stopRe = new RegExp(`(^|\\n)\\s*(${stopHeadings})[:\\s]`, "i");

  // --- Languages ---
  // Use exec in a loop and start scanning after the matched heading to avoid matching the same heading as the stop boundary.
  const langHeadingRe = /(^|\n)\s*(Languages|LANGUAGES)[:\s]*/ig;
  let langMatchExec: RegExpExecArray | null;
  const languagesFound: Language[] = [];

  while ((langMatchExec = langHeadingRe.exec(text)) !== null) {
    // start AFTER the heading match so stopRe doesn't match the same heading immediately
    const startPos = (langMatchExec.index ?? 0) + (langMatchExec[0]?.length || 0);
    const tail = text.slice(startPos);
    const endIdx = tail.search(stopRe);
    const block = endIdx === -1 ? tail : tail.slice(0, endIdx);

    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      // handle: "Bengali - Native", "English (Fluent)", "Bengali: Native", "Bengali, English", "English Fluent"
      // comma separated w/o proficiency
      if (/[,\/|•]/.test(line) && !/[:\-()]/.test(line)) {
        const parts = line.split(/[,\/|•]/).map(p => p.trim()).filter(Boolean);
        for (const p of parts) {
          languagesFound.push({ id: uuidv4(), name: p, proficiency: "Basic" });
        }
        continue;
      }

      // "Name - Proficiency" or "Name: Proficiency" or "Name | Proficiency"
      const parts = line.split(/[-–—:|]/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const name = parts[0];
        const profCandidate = parts.slice(1).join(" ");
        const normalizedProf = (/native/i.test(profCandidate) ? "Native" :
          /fluent/i.test(profCandidate) ? "Fluent" :
          /conversational/i.test(profCandidate) ? "Conversational" :
          /basic/i.test(profCandidate) ? "Basic" : "Basic") as Language["proficiency"];
        languagesFound.push({ id: uuidv4(), name, proficiency: normalizedProf });
        continue;
      }

      // parentheses case
      const paren = line.match(/^(.+?)\s*\(([^)]+)\)$/);
      if (paren) {
        const name = paren[1].trim();
        const profRaw = paren[2].trim();
        const normalizedProf = (/native/i.test(profRaw) ? "Native" :
          /fluent/i.test(profRaw) ? "Fluent" :
          /conversational/i.test(profRaw) ? "Conversational" :
          /basic/i.test(profRaw) ? "Basic" : "Basic") as Language["proficiency"];
        languagesFound.push({ id: uuidv4(), name, proficiency: normalizedProf });
        continue;
      }

      // single-line like "English Fluent" or "Bengali Native"
      const profMatch = line.match(/\b(Native|Fluent|Conversational|Basic)\b/i);
      if (profMatch) {
        const name = line.replace(profMatch[0], "").replace(/[-:()]/g, "").trim();
        const normalizedProf = (/native/i.test(profMatch[0]) ? "Native" :
          /fluent/i.test(profMatch[0]) ? "Fluent" :
          /conversational/i.test(profMatch[0]) ? "Conversational" : "Basic") as Language["proficiency"];
        languagesFound.push({ id: uuidv4(), name: name || profMatch[0], proficiency: normalizedProf });
      } else {
        // fallback single language without proficiency
        if (line.length > 0) languagesFound.push({ id: uuidv4(), name: line, proficiency: "Basic" });
      }
    }
  }

  // dedupe languages by name (case-insensitive)
  const langSeen = new Set<string>();
  for (const l of languagesFound) {
    const key = l.name.toLowerCase();
    if (!langSeen.has(key)) {
      langSeen.add(key);
      result.languages.push(l);
    }
  }

  // --- Hobbies / Interests ---
  const hobbiesMatch = text.match(/(^|\n)\s*(Hobbies|Interests|Hobbies & Interests|Personal Interests|Interests and Hobbies)[:\s]*/i);
  if (hobbiesMatch) {
    const start = hobbiesMatch.index ?? 0;
    const tail = text.slice(start + (hobbiesMatch[0]?.length || 0));
    const endIdx = tail.search(stopRe);
    const block = endIdx === -1 ? tail : tail.slice(0, endIdx);
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const hobbies: string[] = [];
    for (const line of lines) {
      if (/^[-•*]\s+/.test(line)) {
        hobbies.push(line.replace(/^[-•*]\s+/, "").trim());
        continue;
      }
      if (/[,\/|•]/.test(line)) {
        const parts = line.split(/[,\/|•]/).map(p => p.trim()).filter(Boolean);
        hobbies.push(...parts);
        continue;
      }
      if (line.length > 0) hobbies.push(line);
    }

    const seen = new Set<string>();
    for (const h of hobbies) {
      const key = h.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.hobbies.push(h);
      }
    }
  }

  // --- Volunteer ---
  const volunteerMatch = text.match(/(^|\n)\s*(Volunteer|Volunteering|Volunteer Experience|VOLUNTEER|VOLUNTEER EXPERIENCE)[:\s]*/i);
  if (volunteerMatch) {
    const start = volunteerMatch.index ?? 0;
    const tail = text.slice(start + (volunteerMatch[0]?.length || 0));
    const endIdx = tail.search(stopRe);
    const block = endIdx === -1 ? tail : tail.slice(0, endIdx);
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const entries: string[][] = [];
    let buffer: string[] = [];
    for (const line of lines) {
      if (/^[-•*]\s+/.test(line)) {
        buffer.push(line.replace(/^[-•*]\s+/, ""));
        continue;
      }
      if (line === "") {
        if (buffer.length) {
          entries.push(buffer);
          buffer = [];
        }
        continue;
      }
      const maybeHeader = line.match(/(.+?)[\s\-–—@|]\s*(.+)/);
      if (maybeHeader && buffer.length) {
        entries.push(buffer);
        buffer = [line];
        continue;
      }
      buffer.push(line);
    }
    if (buffer.length) entries.push(buffer);

    for (const entryLines of entries) {
      let role = "";
      let organization = "";
      let startDate = "";
      let endDate = "";
      let description = "";

      const headerMatch = entryLines[0].match(/^(.+?)\s*[-@|]\s*(.+)$/);
      if (headerMatch) {
        role = headerMatch[1].trim();
        organization = headerMatch[2].trim();
      } else {
        const paren = entryLines[0].match(/^(.+?)\s*\((.+?)\)$/);
        if (paren) {
          organization = paren[1].trim();
          role = paren[2].trim();
        } else {
          organization = entryLines[0].trim();
        }
      }

      for (let i = 1; i < entryLines.length; i++) {
        const ln = entryLines[i];
        const dateRange = ln.match(/([A-Za-z]{3,}\s*\d{4}|\d{4})\s*[-–]\s*(Present|present|Now|now|[A-Za-z]{3,}\s*\d{4}|\d{4})/i);
        if (dateRange) {
          startDate = parseDateString(dateRange[1], false);
          endDate = parseDateString(dateRange[2], true);
          continue;
        }
        const yearOnly = ln.match(/\b(19|20)\d{2}\b/);
        if (yearOnly && !startDate) {
          startDate = `${yearOnly[0]}-01`;
          continue;
        }
        description += (description ? " " : "") + ln;
      }

      const vol: VolunteerExperience = {
        id: uuidv4(),
        organization: (organization || "").trim(),
        role: (role || "").trim() || "Volunteer",
        startDate: startDate || "",
        endDate: endDate || "",
        description: description.trim() || "",
      };
      result.volunteer.push(vol);
    }
  }

  // --- Awards ---
  const awardsMatch = text.match(/(^|\n)\s*(Awards|Honors|Achievements|ACHIEVEMENTS|Awards & Honors)[:\s]*/i);
  if (awardsMatch) {
    const start = awardsMatch.index ?? 0;
    const tail = text.slice(start + (awardsMatch[0]?.length || 0));
    const endIdx = tail.search(stopRe);
    const block = endIdx === -1 ? tail : tail.slice(0, endIdx);
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedAwards: Award[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      if (/^[-•*]\s+/.test(line)) {
        const raw = line.replace(/^[-•*]\s+/, "").trim();
        const dateMatch = raw.match(/(19|20)\d{2}/);
        const date = dateMatch ? `${dateMatch[0]}-01` : "";
        const parts = raw.split(/[-–—|,]/).map(p => p.trim()).filter(Boolean);
        const title = parts[0] || raw;
        const issuer = parts[1] || "";
        parsedAwards.push({ id: uuidv4(), title, issuer, date, description: "" });
        continue;
      }

      const parenthesisMatch = line.match(/^(.+)\s+\(([^)]+)\)\s*(.*)$/);
      if (parenthesisMatch) {
        const [, title, issuer, rest] = parenthesisMatch;
        const dateMatch = (rest || "").match(/(19|20)\d{2}/);
        parsedAwards.push({ id: uuidv4(), title: title.trim(), issuer: issuer.trim(), date: dateMatch ? `${dateMatch[0]}-01` : "", description: "" });
        continue;
      }

      const parts = line.split(/[-–—|]/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const title = parts[0];
        const maybeDate = parts.find(p => /(19|20)\d{2}/.test(p));
        const issuer = parts.length > 1 ? parts.slice(1).join(" ") : "";
        parsedAwards.push({ id: uuidv4(), title: title.trim(), issuer: issuer.trim(), date: maybeDate ? `${maybeDate.match(/(19|20)\d{2}/)![0]}-01` : "", description: "" });
        continue;
      }

      parsedAwards.push({ id: uuidv4(), title: line, issuer: "", date: "", description: "" });
    }

    const seen = new Set<string>();
    for (const a of parsedAwards) {
      const key = (a.title || "").toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.awards.push(a);
      }
    }
  }

  return result;
}

/** --- Main parser --- */
function parseResumeData(text: string, userEmail: string) {
  const safe = (s?: string) => (s || "").trim();
  const normalized = (text || "").replace(/\r/g, " ").replace(/\n+/g, "\n").trim();

  const header = extractHeaderInfo(normalized);
  const emailMatch = normalized.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = normalized.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){1,3}\d{2,4}/);

  const summaryBlockRe = new RegExp(
    `(?:CARRER OBJECTIVE|Career Objective|OBJECTIVE|Professional Summary|Summary|Profile)[:\\-\\s]*([\\s\\S]*?)(?=\\n(?:SKILLS|Skills|PROJECTS|Projects|Experience|EXPERIENCE|Education|EDUCATION|LANGUAGES|Languages|Certifications|Volunteer|Awards|Projects|$))`,
    "i"
  );
  const rawSummaryMatch = normalized.match(summaryBlockRe);

  let summaryText = "";
  if (rawSummaryMatch && rawSummaryMatch[1]) {
    const rawBlock = rawSummaryMatch[1];
    const lines = rawBlock.split("\n").map((l) => l.trim()).filter(Boolean);
    let joined = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!joined) {
        joined = line;
        continue;
      }
      if (joined.endsWith("-")) joined = joined.slice(0, -1) + line;
      else joined = joined + " " + line;
    }
    summaryText = joined.replace(/\s{2,}/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
  }

  const skillsArray = extractSkillsFromText(normalized);
  const projectsArray = extractProjectsBlock(normalized);
  const certificationsArray = extractCertificationsBlock(normalized);
  const workExperienceArray = extractWorkExperienceBlock(normalized);
  const educationArray = extractEducationBlock(normalized);
  const additionalInfo = extractAdditionalInfoBlock(normalized);

  const preview = {
    name: safe(header.name),
    email: emailMatch ? emailMatch[0] : userEmail,
    phone: phoneMatch ? phoneMatch[0] : "",
    skills: skillsArray.map((s) => s.name).slice(0, 12),
  };

  return {
    preview,
    parsed: {
      personalInfo: {
        firstName: safe(header.name.split(" ")[0]),
        lastName: safe(header.name.split(" ").slice(1).join(" ")),
        jobTitle: safe(header.jobTitle),
        email: emailMatch ? safe(emailMatch[0]) : userEmail,
        phone: phoneMatch ? safe(phoneMatch[0]) : "",
        location: safe(header.location),
        tagline: extractTagline(normalized),
        profileImage: "",
      },
      summary: summaryText,
      skills: skillsArray,
      education: educationArray,
      workExperience: workExperienceArray,
      projects: projectsArray,
      certifications: certificationsArray,
      additionalInfo,
    },
  };
}

/** --- Helper --- */
function safeString(s?: unknown) {
  return typeof s === "string" ? s : "";
}

// helper to clean pdf-extracted text (typed to avoid implicit any)
function cleanPDFText(extractedText: string): string {
  if (!extractedText) return "";

  // Remove lines that look like page-break/footer markers.
  // Matches lines that contain "Page (N) Break" with optional leading bullets/dashes/etc.
  const pageBreakLineRe = /^.*Page\s*\(\d+\)\s*Break.*$/gim;
  let cleaned = extractedText.replace(pageBreakLineRe, "");

  // Also remove lines made only of long dashes or repeated "Page Break" variants
  const dashedLineRe = /^[\s\-\u2022•_.]{3,}$/gim;
  cleaned = cleaned.replace(dashedLineRe, "");

  // Normalize CRLF, collapse multiple blank lines to max two, and trim edges
  cleaned = cleaned.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
}

/** --- Main POST handler --- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;
    const userEmail = (formData.get("userEmail") as string)?.trim();

    // Validation
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, message: "No file uploaded or invalid file" },
        { status: 400 }
      );
    }
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "userEmail is required" },
        { status: 400 }
      );
    }

    // Temporary storage
    const tmpDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tmpDir, { recursive: true });
    const filename = `${uuidv4()}.pdf`;
    const tmpPath = path.join(tmpDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tmpPath, buffer);

    // Instantiate pdf2json
    const PDFParserCtor = PDFParser as unknown as PdfParserConstructor;
    const pdfParserInstance = new PDFParserCtor(null, 1);
    let rawText = "";

    const dataReadyPromise = new Promise<void>((resolve, reject) => {
      pdfParserInstance.on("pdfParser_dataError", (errData) => {
        console.warn("pdf2json error:", errData);
        reject(new Error("pdf2json parse error"));
      });

      pdfParserInstance.on("pdfParser_dataReady", () => {
        try {
          const extracted = pdfParserInstance.getRawTextContent();
          rawText = typeof extracted === "string" ? extracted : "";
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      try {
        pdfParserInstance.loadPDF(tmpPath);
      } catch (err) {
        reject(err);
      }
    });

    await dataReadyPromise.catch((err) => {
      console.warn("PDF parsing failed:", err);
      rawText = "";
    });

    // Clean up temporary file
    try {
      await fs.unlink(tmpPath);
    } catch {
      // ignore deletion errors
    }

    // Clean extracted text to remove page-break markers / footers before further processing
    rawText = cleanPDFText(rawText);

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not extract text from PDF. It might be scanned or unsupported.",
          resumeId: null,
          extracted: null,
        },
        { status: 200 }
      );
    }

    // Parse resume content
    const { preview, parsed } = parseResumeData(rawText, userEmail);
    const resumeId = uuidv4();

    const resumeData: ResumeData = {
      id: resumeId,
      userEmail,
      personalInfo: parsed.personalInfo,
      summary: safeString(parsed.summary),
      workExperience: parsed.workExperience as unknown as ResumeData["workExperience"],
      education: parsed.education as unknown as ResumeData["education"],
      skills: parsed.skills as unknown as ResumeData["skills"],
      projects: parsed.projects as unknown as ResumeData["projects"],
      certifications: (parsed.certifications as unknown as ResumeData["certifications"]) || [],
      socialLinks: [],
      additionalInfo: parsed.additionalInfo || { languages: [], hobbies: [], volunteer: [], awards: [] },
      template: {
        id: "default",
        name: "Classic",
        layout: "classic",
        sections: [
          "summary",
          "workExperience",
          "education",
          "skills",
          "projects",
          "certifications",
          "socialLinks",
          "additionalInfo",
        ],
      },
      theme: {
        id: "default",
        name: "Default",
        primaryColor: "#2563eb",
        accentColor: "#9333ea",
        textColor: "#111827",
        backgroundColor: "#ffffff",
        fontFamily: "Inter",
      },
      meta: { currentStep: 0, completed: false },
      resumeStatus: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert into MongoDB
    const client = await clientPromise;
    const db = client.db("MockMiya");
    await db.collection<ResumeData>("resumes").insertOne(resumeData);

    return NextResponse.json(
      {
        success: true,
        resumeId,
        extracted: { preview, personalInfo: parsed.personalInfo },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload route error:", error);
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { success: false, message: "Server error", error: message },
      { status: 500 }
    );
  }
}
