// app/dashboard/api/overview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

<<<<<<< HEAD
function parsePercentString(s: any): number {
  if (!s && s !== 0) return 0;
=======
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
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
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
<<<<<<< HEAD
    const user = await db.collection("users").findOne({ email });
=======
    const user = (await db.collection<UserDoc>("users").findOne({ email })) as UserDoc | null;
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // fetch optional collections (if collection empty/absent results => [])
<<<<<<< HEAD
    const resumes = await db.collection("resumes").find({ userEmail: email }).toArray().catch(() => []);
    const codingChallenges = await db.collection("codingChallenges").find({ userEmail: email }).toArray().catch(() => []);
    const jobAnalyses = await db.collection("job_analyses").find({ userEmail: email }).toArray().catch(() => []);

    // counts
    const resumesCount = Array.isArray(resumes) ? resumes.length : 0;
    const codingCount = Array.isArray(codingChallenges) ? codingChallenges.length : 0;
    const jobAnalysesCount = Array.isArray(jobAnalyses) ? jobAnalyses.length : 0;

    // compute coding challenges average accuracy (try result.accuracy, fallback to score/total)
    let codingAccSum = 0;
    let codingAccCount = 0;
    if (Array.isArray(codingChallenges)) {
      for (const c of codingChallenges) {
        if (c?.result) {
          const r = c.result;
          if (r.accuracy) {
            codingAccSum += parseFloat(String(r.accuracy)) || 0;
            codingAccCount++;
            continue;
          }
          if (typeof r.score === "number" && typeof r.total === "number" && r.total > 0) {
            codingAccSum += (r.score / r.total) * 100;
            codingAccCount++;
            continue;
          }
=======
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
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
        }
      }
    }
    const codingAvgPercent = codingAccCount > 0 ? Math.round(codingAccSum / codingAccCount) : 0;

<<<<<<< HEAD
    // compute job analysis average match percent (try result.matchScore or match field)
    let jobMatchSum = 0;
    let jobMatchCount = 0;
    if (Array.isArray(jobAnalyses)) {
      for (const j of jobAnalyses) {
        const maybeMatch =
          j?.result?.matchScore ?? j?.match ?? j?.result?.match ?? null;
        if (maybeMatch != null) {
          jobMatchSum += parsePercentString(maybeMatch);
          jobMatchCount++;
        }
=======
    // compute job analysis average match percent
    let jobMatchSum = 0;
    let jobMatchCount = 0;
    for (const j of jobAnalyses) {
      const maybeMatch = j.result?.matchScore ?? j.match ?? j.result?.match ?? null;
      if (maybeMatch != null) {
        jobMatchSum += parsePercentString(maybeMatch);
        jobMatchCount++;
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
      }
    }
    const jobAvgMatch = jobMatchCount > 0 ? Math.round(jobMatchSum / jobMatchCount) : 0;

<<<<<<< HEAD
    // simple successScore: weighted avg of codingAvgPercent and jobAvgMatch
    const successScore = Math.round((codingAvgPercent * 0.6) + (jobAvgMatch * 0.4));

    // profile completion heuristic:
    // +30 if has at least one complete resume
    // +25 if user.profile has any non-empty field (phone/title/location/skills)
    // +25 if codingChallenges attempted
    // +20 if jobAnalyses present
    let profileCompletion = 0;
    if (resumesCount > 0) profileCompletion += 30;
    const profileObj = user?.profile ?? {};
    const profileHas = (
      (profileObj && Object.keys(profileObj).some(k => {
        const v = profileObj[k];
        if (!v) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return String(v).trim().length > 0;
      }))
    );
=======
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
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
    if (profileHas) profileCompletion += 25;
    if (codingCount > 0) profileCompletion += 25;
    if (jobAnalysesCount > 0) profileCompletion += 20;
    if (profileCompletion > 100) profileCompletion = 100;

<<<<<<< HEAD
    // Build recent activities (combine resumes, codingChallenges, jobAnalyses)
    const recentRaw: Array<{ type: string; ts: string | Date; source: any }> = [];

    if (Array.isArray(resumes)) {
      for (const r of resumes) {
        recentRaw.push({
          type: "resume",
          ts: r.updatedAt ?? r.createdAt ?? r.pdfGeneratedAt ?? new Date(),
          source: { id: r.id ?? r._id, title: r.title ?? r.template?.name ?? r.userEmail ?? "Resume" },
        });
      }
    }

    if (Array.isArray(codingChallenges)) {
      for (const c of codingChallenges) {
        recentRaw.push({
          type: "coding",
          ts: c.updatedAt ?? c.createdAt ?? new Date(),
          source: { id: c._id, title: c.title ?? c.description ?? "Coding Challenge", result: c.result ?? null },
        });
      }
    }

    if (Array.isArray(jobAnalyses)) {
      for (const j of jobAnalyses) {
        recentRaw.push({
          type: "analysis",
          ts: j.updatedAt ?? j.createdAt ?? new Date(),
          source: { id: j._id, title: j.company ?? j.role ?? "Job Analysis", result: j.result ?? null },
        });
      }
    }

    // sort desc by timestamp and keep up to 10
    recentRaw.sort((a, b) => new Date(String(b.ts)).getTime() - new Date(String(a.ts)).getTime());
    const recentActivities = recentRaw.slice(0, 10).map((r) => ({
      type: r.type,
      title:
        r.type === "resume"
          ? `Resume: ${r.source.title}`
          : r.type === "coding"
          ? `Quiz: ${r.source.title}`
          : `Job Analysis: ${r.source.title}`,
      timestamp: r.ts,
      meta: r.source.result ?? null,
=======
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
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
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
<<<<<<< HEAD
  } catch (err: any) {
    console.error("overview api error:", err);
    return NextResponse.json({ error: "Internal server error", details: err?.message ?? String(err) }, { status: 500 });
=======
  } catch (err: unknown) {
    console.error("overview api error:", err);
    return NextResponse.json({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
  }
}
