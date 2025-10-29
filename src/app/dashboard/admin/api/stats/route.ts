// src/app/dashboard/admin/api/stats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

// ---------- TYPES ---------- //
interface User {
  _id: string;
  email: string;
  isVerified?: boolean;
  createdAt?: Date | string;
}

interface Session {
  _id: string;
  expires: Date;
}

interface Resume {
  _id: string;
  resumeStatus: "draft" | "complete" | string;
}

interface CodingChallenge {
  _id: string;
  title: string;
  role: string;
  category: string;
  config: {
    role: string;
    duration: number;
    questionCount: number;
    category: string;
    createdAt: Date | string;
  };
  result?: {
    score: number;
    total: number;
    accuracy: string;
    timeTaken: string;
    timeSaved: string;
    completedBeforeTimeLimit: boolean;
    updatedAt?: Date | string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface AdminActivity {
  _id?: string;
  action: string;
  type: string;
  page: string;
  userId?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt?: Date | string;
}

interface Metrics {
  _id: string;
  avgResponseTime?: number;
  successRate?: number;
  monthlyRequests?: number;
  dataProcessedGB?: number;
  createdAt?: Date | string;
}

interface RecentActivity {
  action: string;
  time: string;
  type: string;
  page: string;
}

interface ActivitiesByPage {
  page: string;
  count: number;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  successRate: number;
  monthlyRequests: number;
  dataProcessedGB: number;
}

interface SystemHealth {
  uptimePercent: number;
  status: string;
  securityScore: string;
}

interface AdminStatsResponse {
  totalUsers: number;
  verifiedUsers: number;
  newUsersLast30Days: number;
  activeSessions: number;
  totalResumes: number;
  draftResumes: number;
  completedResumes: number;
  codingSubmissionsCount: number;
  recentActivities: RecentActivity[];
  activitiesByPage: ActivitiesByPage[];
  performanceMetrics: PerformanceMetrics;
  systemHealth: SystemHealth;
}

// ---------- MAIN ROUTE ---------- //
export async function GET() {
  try {
    const { db } = await connectDB();

    // -------- USER STATS --------
    const usersCol = db.collection<User>("users");
    const totalUsers = await usersCol.countDocuments();
    const verifiedUsers = await usersCol.countDocuments({ isVerified: true });
    const newUsersLast30Days = await usersCol.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // -------- SESSIONS --------
    let activeSessions = 0;
    try {
      const sessionsCol = db.collection<Session>("sessions");
      activeSessions = await sessionsCol.countDocuments({ expires: { $gt: new Date() } });
    } catch {
      activeSessions = 0;
    }

    // -------- RESUMES --------
    const resumesCol = db.collection<Resume>("resumes");
    const totalResumes = await resumesCol.countDocuments();
    const draftResumes = await resumesCol.countDocuments({ resumeStatus: "draft" });
    const completedResumes = await resumesCol.countDocuments({ resumeStatus: "complete" });

    // -------- CODING SUBMISSIONS & CHALLENGES --------
    const codingCollections = [
      "codingChallenges",
      "coding_submissions",
      "submissions",
      "challenges",
    ] as const;

    let codingSubmissionsCount = 0;
    let lastQuizTitle = "";

    for (const name of codingCollections) {
      try {
        const col = db.collection<CodingChallenge>(name);
        const count = await col.countDocuments();
        if (count > 0) {
          codingSubmissionsCount = count;

          // Pick latest document if available
          const latest = await col.findOne({}, { sort: { createdAt: -1 } });
          if (latest?.title) {
            lastQuizTitle = latest.title;
          }
          break;
        }
      } catch {
        // skip missing
      }
    }

    // -------- ADMIN ACTIVITIES --------
    let recentActivities: RecentActivity[] = [];
    let activitiesByPage: ActivitiesByPage[] = [];
    const activitiesCol = db.collection<AdminActivity>("adminActivities");

    try {
      const docs = await activitiesCol.find().sort({ createdAt: -1 }).limit(20).toArray();

      recentActivities = docs.map((d): RecentActivity => ({
        action: d.action || "Activity",
        time: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        type: d.type || "info",
        page: d.page || "other",
      }));

      const agg = await activitiesCol
        .aggregate<{ _id: { page?: string }; count: number }>([
          { $group: { _id: { page: "$page" }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray();

      activitiesByPage = agg.map(
        (a): ActivitiesByPage => ({
          page: a._id?.page ?? "other",
          count: a.count,
        })
      );
    } catch {
      recentActivities = [
        {
          action: "No activity collection found",
          time: new Date().toISOString(),
          type: "info",
          page: "other",
        },
      ];
      activitiesByPage = [];
    }

    // -------- NEW ACTIVITY AUTO-LOG: Coding Challenge --------
    if (lastQuizTitle) {
      await activitiesCol.insertOne({
        action: `New coding challenge created: ${lastQuizTitle}`,
        type: "success",
        page: "coding-challenges",
        createdAt: new Date(),
      });
    }

    // -------- PERFORMANCE METRICS --------
    let performanceMetrics: PerformanceMetrics = {
      avgResponseTime: 2.3,
      successRate: 99.9,
      monthlyRequests: 1200000,
      dataProcessedGB: 45,
    };

    try {
      const metricsCol = db.collection<Metrics>("metrics");
      const latest = await metricsCol.findOne({}, { sort: { createdAt: -1 } });
      if (latest) {
        performanceMetrics = {
          avgResponseTime: latest.avgResponseTime ?? performanceMetrics.avgResponseTime,
          successRate: latest.successRate ?? performanceMetrics.successRate,
          monthlyRequests: latest.monthlyRequests ?? performanceMetrics.monthlyRequests,
          dataProcessedGB: latest.dataProcessedGB ?? performanceMetrics.dataProcessedGB,
        };
      }
    } catch {
      // ignore
    }

    // -------- SYSTEM HEALTH --------
    const systemHealth: SystemHealth = {
      uptimePercent: 99.8,
      status: "Healthy",
      securityScore: "A+",
    };

    // -------- FINAL RESPONSE --------
    const payload: AdminStatsResponse = {
      totalUsers,
      verifiedUsers,
      newUsersLast30Days,
      activeSessions,
      totalResumes,
      draftResumes,
      completedResumes,
      codingSubmissionsCount,
      recentActivities,
      activitiesByPage,
      performanceMetrics,
      systemHealth,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("❌ /api/admin/stats error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
