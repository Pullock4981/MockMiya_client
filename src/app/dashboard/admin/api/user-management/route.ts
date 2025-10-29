// src/app/dashboard/admin/api/user-management/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId, Filter } from "mongodb";
import bcrypt from "bcryptjs";
import { logAdminActivity } from "@/lib/logAdminActivity";
import { sendEmail } from "@/utils/sendEmail";

/**
 * TYPES
 */
interface UserDoc {
  _id?: ObjectId | string;
  name?: string;
  email?: string;
  password?: string;
  otp?: string;
  otpExpires?: Date | string;
  role?: string;
  status?: string;
  membershipType?: string;
  isVerified?: boolean;
  permissions?: unknown;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  [k: string]: unknown;
}

interface SanitizedUser {
  id: string | null;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  membershipType?: string;
  isVerified?: boolean;
  permissions?: unknown;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: unknown;
}

interface AdminActivity {
  _id?: ObjectId | string;
  action?: string;
  message?: string;
  type?: string;
  page?: string;
  userId?: string | null;
  createdAt?: Date | string;
  time?: string;
  meta?: Record<string, unknown> | null;
}

/**
 * Remove sensitive fields and normalize id as string.
 * NOTE: we explicitly remove _id so the returned object only contains `id`.
 */
function sanitizeUser(u: UserDoc | null): SanitizedUser | null {
  if (!u) return null;
  // Exclude sensitive fields explicitly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, otp, otpExpires, _id, ...rest } = u;
  const id =
    typeof _id === "string" ? _id : _id instanceof ObjectId ? _id.toString() : _id ? String(_id) : null;

  // Ensure createdAt/updatedAt are ISO strings if present
  const createdAt =
    rest.createdAt instanceof Date ? rest.createdAt.toISOString() : typeof rest.createdAt === "string" ? rest.createdAt : undefined;
  const updatedAt =
    rest.updatedAt instanceof Date ? rest.updatedAt.toISOString() : typeof rest.updatedAt === "string" ? rest.updatedAt : undefined;

  return {
    ...rest,
    id,
    createdAt,
    updatedAt,
  } as SanitizedUser;
}

// ----------------- GET -----------------
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") ?? "").trim();
    const role = (url.searchParams.get("role") ?? "").trim();
    const status = (url.searchParams.get("status") ?? "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const perPage = Math.max(1, Math.min(200, Number(url.searchParams.get("perPage") || "20")));

    const { db } = await connectDB();
    const usersCol = db.collection<UserDoc>("users");
    const activitiesCol = db.collection<AdminActivity>("adminActivities");

    // Build query (typed)
    const q: Filter<UserDoc> = {};

    if (search) {
      // escape user input for regex
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      q.$or = [{ name: regex } as unknown as Filter<UserDoc>, { email: regex } as unknown as Filter<UserDoc>, { role: regex } as unknown as Filter<UserDoc>];
    }
    if (role) q.role = role;
    if (status) q.status = status;

    const total = await usersCol.countDocuments(q);

    const docs = await usersCol
      .find(q, { projection: { password: 0, otp: 0, otpExpires: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    const users = docs.map((d) => sanitizeUser(d)).filter((x): x is SanitizedUser => x !== null);

    // ----------------- Stats -----------------
    const totalUsers = await usersCol.countDocuments();
    const activeUsers = await usersCol.countDocuments({ status: "Active" });
    const premiumUsers = await usersCol.countDocuments({ membershipType: { $in: ["Premium", "Enterprise"] } });
    const verifiedUsers = await usersCol.countDocuments({ isVerified: true });
    const newUsersLast30Days = await usersCol.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    const usersByRoleAgg = await usersCol
      .aggregate<{ _id?: string | null; count: number }>([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const usersByRole = usersByRoleAgg.map((r) => ({ role: r._id ?? "unknown", count: r.count }));

    // ----------------- Recent Activities -----------------
    const recentActivitiesDocs = await activitiesCol.find().sort({ createdAt: -1 }).limit(20).toArray();
    const recentActivities = recentActivitiesDocs.map((d) => ({
      action: d.action || d.message || "Activity",
      time: d.createdAt ? new Date(d.createdAt).toISOString() : d.time || "",
      type: d.type || "info",
      page: d.page || "other",
    }));

    await logAdminActivity("Admin fetched user list", "success", "admin-users", null);

    // Return stats using keys the frontend expects:
    return NextResponse.json({
      meta: { page, perPage, total, fetchedAt: new Date().toISOString() },
      users,
      stats: {
        total: totalUsers,
        activeUsers,
        premiumUsers,
        verifiedUsers,
        newLast30Days: newUsersLast30Days,
        usersByRole,
      },
      recentActivities,
    });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    try {
      await logAdminActivity(`GET /api/admin/users failed: ${String(err)}`, "error", "admin-users", null);
    } catch {
      /* swallow logging errors */
    }
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = "user", membershipType = "Free" } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { db } = await connectDB();
    const usersCol = db.collection<UserDoc>("users");

    const existing = await usersCol.findOne({ email: normalizedEmail });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date();
    const newUser: UserDoc = {
      _id: new ObjectId(),
      name,
      email: normalizedEmail,
      password: hashed,
      role,
      status: "Active",
      membershipType,
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    };

    await usersCol.insertOne(newUser);
    await logAdminActivity(`Admin created new user: ${normalizedEmail}`, "success", "admin-users", (newUser._id as ObjectId).toString());

    return NextResponse.json({ message: "User created", user: sanitizeUser(newUser) }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    try {
      await logAdminActivity(`POST /api/admin/users failed: ${String(err)}`, "error", "admin-users", null);
    } catch {
      /* swallow */
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// ----------------- PATCH -----------------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, updates, ids, payload } = body;

    const { db } = await connectDB();
    const usersCol = db.collection<UserDoc>("users");
    const activitiesCol = db.collection<AdminActivity>("adminActivities");

    switch (action) {
      case "update":
        if (!id || !updates) return NextResponse.json({ error: "id and updates required" }, { status: 400 });
        await usersCol.updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } });
        await logAdminActivity(`Admin updated user ${id}`, "success", "admin-users", id);
        return NextResponse.json({ message: "User updated" });

      case "ban":
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        await usersCol.updateOne({ _id: new ObjectId(id) }, { $set: { status: "Not-Active", updatedAt: new Date() } });
        await activitiesCol.insertOne({ action: `User banned: ${id}`, type: "warning", createdAt: new Date(), page: "user-management" });
        await logAdminActivity(`Admin banned user ${id}`, "warning", "admin-users", id);
        return NextResponse.json({ message: "User banned" });

      case "unban":
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        await usersCol.updateOne({ _id: new ObjectId(id) }, { $set: { status: "Active", updatedAt: new Date() } });
        await logAdminActivity(`Admin unbanned user ${id}`, "success", "admin-users", id);
        return NextResponse.json({ message: "User unbanned" });

      case "changeMembership":
        if (!id || !payload?.membershipType) return NextResponse.json({ error: "id and membershipType required" }, { status: 400 });
        await usersCol.updateOne({ _id: new ObjectId(id) }, { $set: { membershipType: payload.membershipType, updatedAt: new Date() } });
        await logAdminActivity(`Admin changed membership for ${id} -> ${payload.membershipType}`, "success", "admin-users", id);
        return NextResponse.json({ message: "Membership updated" });

      case "updatePermissions":
        if (!id || !payload) return NextResponse.json({ error: "id and payload required" }, { status: 400 });
        {
          const updateObj: Partial<UserDoc> = {
            ...(payload.role ? { role: payload.role } : {}),
            ...(payload.permissions ? { permissions: payload.permissions } : {}),
            updatedAt: new Date(),
          };
          await usersCol.updateOne({ _id: new ObjectId(id) }, { $set: updateObj });
          await logAdminActivity(`Admin updated permissions for ${id}`, "success", "admin-users", id);
          return NextResponse.json({ message: "Permissions updated" });
        }

      case "bulkRoleUpdate":
        if (!Array.isArray(ids) || !payload?.role) return NextResponse.json({ error: "ids array and role required" }, { status: 400 });
        {
          const objectIds = ids.map((s: string) => new ObjectId(s));
          await usersCol.updateMany({ _id: { $in: objectIds } }, { $set: { role: payload.role, updatedAt: new Date() } });
          await logAdminActivity(`Admin bulk role update to ${payload.role} for ${ids.length} users`, "success", "admin-users", null);
          return NextResponse.json({ message: "Bulk role update done" });
        }

      case "sendEmailBulk":
        if (!Array.isArray(ids) || !payload?.subject || !payload?.body) return NextResponse.json({ error: "ids array, subject and body required" }, { status: 400 });
        {
          const objectIds = ids.map((s: string) => new ObjectId(s));
          const foundUsers = await usersCol.find({ _id: { $in: objectIds } }).toArray();
          const emails = foundUsers.map((u) => (typeof u.email === "string" ? u.email : undefined)).filter(Boolean) as string[];
          const results: { to: string; ok: boolean; reason?: string }[] = [];
          for (const to of emails) {
            try {
              await sendEmail({ to, subject: payload.subject, html: payload.body });
              results.push({ to, ok: true });
            } catch (e) {
              results.push({ to, ok: false, reason: (e as Error).message });
            }
          }
          await logAdminActivity(`Admin sent bulk email to ${emails.length} users`, "success", "admin-users", null);
          return NextResponse.json({ message: "Bulk email attempted", results });
        }

      case "exportCsv":
        {
          const query: Filter<UserDoc> =
            Array.isArray(payload?.ids) ? { _id: { $in: payload.ids.map((s: string) => new ObjectId(s)) } } : (payload?.query as Filter<UserDoc>) || {};
          const docs = await usersCol.find(query, { projection: { password: 0, otp: 0, otpExpires: 0 } }).toArray();

          const headers = ["id", "name", "email", "role", "status", "membershipType", "isVerified", "createdAt", "updatedAt"];
          const csvRows = [headers.join(",")];

          for (const u of docs) {
            const id = u._id instanceof ObjectId ? u._id.toString() : typeof u._id === "string" ? u._id : "";
            const row = [
              id,
              `"${(String(u.name ?? "")).replace(/"/g, '""')}"`,
              `"${(String(u.email ?? "")).replace(/"/g, '""')}"`,
              `"${(String(u.role ?? "")).replace(/"/g, '""')}"`,
              `"${(String(u.status ?? "")).replace(/"/g, '""')}"`,
              `"${(String(u.membershipType ?? "")).replace(/"/g, '""')}"`,
              u.isVerified ? "true" : "false",
              u.createdAt ? new Date(u.createdAt as Date | string).toISOString() : "",
              u.updatedAt ? new Date(u.updatedAt as Date | string).toISOString() : "",
            ];
            csvRows.push(row.join(","));
          }

          await logAdminActivity(`Admin exported ${docs.length} users to CSV`, "success", "admin-users", null);
          return new NextResponse(csvRows.join("\n"), {
            status: 200,
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="users-export-${Date.now()}.csv"`,
            },
          });
        }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    try {
      await logAdminActivity(`PATCH /api/admin/users failed: ${String(err)}`, "error", "admin-users", null);
    } catch {
      /* swallow */
    }
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}

// ----------------- DELETE -----------------
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { db } = await connectDB();
    await db.collection<UserDoc>("users").deleteOne({ _id: new ObjectId(id) });
    await logAdminActivity(`Admin deleted user ${id}`, "warning", "admin-users", id);
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    try {
      await logAdminActivity(`DELETE /api/admin/users failed: ${String(err)}`, "error", "admin-users", null);
    } catch {
      /* swallow */
    }
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
