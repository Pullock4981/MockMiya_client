// app/dashboard/api/overview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

interface UserProfile {
  name?: string;
  phone?: string;
  title?: string;
  location?: string;
  skills?: string[];
  [key: string]: unknown;
}

interface UserDoc {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  role?: string;
  profile?: UserProfile;
}

interface ResumeDoc {
  _id: string;
  id?: string;
  title?: string;
  template?: { name?: string };
  userEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  pdfGeneratedAt?: Date;
}

interface CodingChallengeDoc {
  _id: string;
  title?: string;
  description?: string;
  userEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  result?: {
    accuracy?: number;
    score?: number;
    total?: number;
    [key: string]: unknown;
  };
}

interface JobAnalysisDoc {
  _id: string;
  company?: string;
  role?: string;
  userEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  match?: number | string;
  result?: {
    matchScore?: number | string;
    match?: number | string;
    [key: string]: unknown;
  };
}

function parsePercentString(s: string | number | undefined | null): number {
  if (s === undefined || s === null) return 0;
  if (typeof s === "number") return s;
  const m = String(s).match(/([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email query param required" }, { status: 400 });
    }

    const { db } = await connectDB();

    // fetch user (if exists)
    const user = (await db.collection<UserDoc>("users").findOne({ email })) as UserDoc | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // fetch optional collections (if collection empty/absent results => [])
    const resumes = (await db.collection<ResumeDoc>("resumes").find({ userEmail: email }).toArray().catch(() => [])) as ResumeDoc[];
    const codingChallenges = (await db.collection<CodingChallengeDoc>("codingChallenges").find({ userEmail: email }).toArray().catch(() => [])) as CodingChallengeDoc[];
    const jobAnalyses = (await db.collection<JobAnalysisDoc>("job_analyses").find({ userEmail: email }).toArray().catch(() => [])) as JobAnalysisDoc[];

    // counts
    const resumesCount = resumes.length;
    const codingCount = codingChallenges.length;
    const jobAnalysesCount = jobAnalyses.length;

    // compute coding challenges average accuracy
    let codingAccSum = 0;
    let codingAccCount = 0;
    for (const c of codingChallenges) {
      const r = c.result;
      if (r) {
        if (r.accuracy !== undefined) {
          codingAccSum += r.accuracy;
          codingAccCount++;
        } else if (typeof r.score === "number" && typeof r.total === "number" && r.total > 0) {
          codingAccSum += (r.score / r.total) * 100;
          codingAccCount++;
        }
      }
    }
    const codingAvgPercent = codingAccCount > 0 ? Math.round(codingAccSum / codingAccCount) : 0;

    // compute job analysis average match percent
    let jobMatchSum = 0;
    let jobMatchCount = 0;
    for (const j of jobAnalyses) {
      const maybeMatch = j.result?.matchScore ?? j.match ?? j.result?.match ?? null;
      if (maybeMatch != null) {
        jobMatchSum += parsePercentString(maybeMatch);
        jobMatchCount++;
      }
    }
    const jobAvgMatch = jobMatchCount > 0 ? Math.round(jobMatchSum / jobMatchCount) : 0;

    // simple successScore: weighted avg
    const successScore = Math.round(codingAvgPercent * 0.6 + jobAvgMatch * 0.4);

    // profile completion heuristic
    let profileCompletion = 0;
    if (resumesCount > 0) profileCompletion += 30;
    const profileObj = user.profile ?? {};
    const profileHas = Object.keys(profileObj).some(k => {
      const v = profileObj[k];
      if (!v) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return String(v).trim().length > 0;
    });
    if (profileHas) profileCompletion += 25;
    if (codingCount > 0) profileCompletion += 25;
    if (jobAnalysesCount > 0) profileCompletion += 20;
    if (profileCompletion > 100) profileCompletion = 100;

    // Build recent activities
    const recentRaw: Array<{ type: "resume" | "coding" | "analysis"; ts: string | Date; source: unknown }> = [];

    for (const r of resumes) {
      recentRaw.push({
        type: "resume",
        ts: r.updatedAt ?? r.createdAt ?? r.pdfGeneratedAt ?? new Date(),
        source: { id: r.id ?? r._id, title: r.title ?? r.template?.name ?? r.userEmail ?? "Resume" },
      });
    }
    for (const c of codingChallenges) {
      recentRaw.push({
        type: "coding",
        ts: c.updatedAt ?? c.createdAt ?? new Date(),
        source: { id: c._id, title: c.title ?? c.description ?? "Coding Challenge", result: c.result ?? null },
      });
    }
    for (const j of jobAnalyses) {
      recentRaw.push({
        type: "analysis",
        ts: j.updatedAt ?? j.createdAt ?? new Date(),
        source: { id: j._id, title: j.company ?? j.role ?? "Job Analysis", result: j.result ?? null },
      });
    }

    recentRaw.sort((a, b) => new Date(String(b.ts)).getTime() - new Date(String(a.ts)).getTime());
    const recentActivities = recentRaw.slice(0, 10).map(r => ({
      type: r.type,
      title:
        r.type === "resume"
          ? `Resume: ${(r.source as { title: string }).title}`
          : r.type === "coding"
          ? `Quiz: ${(r.source as { title: string }).title}`
          : `Job Analysis: ${(r.source as { title: string }).title}`,
      timestamp: r.ts,
      meta: (r.source as { result: unknown }).result ?? null,
    }));

    const payload = {
      user: {
        name: user.name ?? user.profile?.name ?? null,
        email: user.email,
        role: user.role ?? "user",
        profile: user.profile ?? null,
      },
      stats: {
        resumesCreated: resumesCount,
        interviewsPracticed: jobAnalysesCount,
        codingChallengesAttempted: codingCount,
        profileCompletion,
        successScore,
        codingAvgPercent,
        jobAvgMatch,
      },
      recentActivities,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    console.error("overview api error:", err);
    return NextResponse.json({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
