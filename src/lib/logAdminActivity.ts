// src/lib/logAdminActivity.ts
import { connectDB } from "@/lib/mongodbNative";

export type ActivityType = "user" | "auth" | "resume" | "coding" | "billing" | "settings" | "other";

export async function logAdminActivity(
  action: string,
  level: "info" | "success" | "warning" | "error" = "info",
  page: ActivityType | string = "other",
  userId?: string | null,
  meta?: Record<string, any>
) {
  try {
    const { db } = await connectDB();
    const activitiesCol = db.collection("adminActivities");

    await activitiesCol.insertOne({
      action,
      type: level,
      page,
      userId: userId ?? null,
      meta: meta ?? null,
      createdAt: new Date(),
    });
  } catch (err) {
    // don't throw — just log to server console
    console.error("❌ logAdminActivity error:", err);
  }
}
