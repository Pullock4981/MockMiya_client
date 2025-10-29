// /src/app/api/admin/users/route.ts

import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId } from "mongodb";

// Interface for fetching users
interface UserDocument {
    _id: ObjectId;
    name: string;
    email: string;
    role?: string; // Made optional with string type for flexibility
    status?: string; // Made optional with string type
    isVerified?: boolean;
    membershipType?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    profile?: Record<string, unknown>;
    stats?: Record<string, unknown>;
    password?: string;
    otp?: string;
    otpExpires?: Date;
}

interface FormattedUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    isVerified: boolean;
    membershipType: string;
    profile: Record<string, unknown>;
    stats: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
}

// Ensure this function is correctly named and exported
export async function GET(request: NextRequest) {
  console.log("🟡 [USERS API] Starting to fetch users list...");
  
  try {
    const session = await getServerSession();
    console.log("🟡 [USERS API] Session check:", session ? "Session exists" : "No session");

    if (!session?.user?.email) {
      console.log("🔴 [USERS API] Unauthorized: No session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🟡 [USERS API] Connecting to database...");
    const { db } = await connectDB();
    const usersCollection = db.collection<UserDocument>("users");

    // Verify requesting user is admin
    console.log(`🟡 [USERS API] Checking admin privileges for: ${session.user.email}`);
    const adminUser = await usersCollection.findOne({
      email: session.user.email.toLowerCase().trim(),
    });

    if (!adminUser) {
      console.log("🔴 [USERS API] Admin user not found in database");
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const userRole = adminUser.role || 'user';
    const isAdmin = ['admin', 'Admin', 'System Admin'].includes(userRole);
    console.log(`🟡 [USERS API] User role: ${userRole}, Is admin: ${isAdmin}`);

    if (!isAdmin) {
      console.log(`🔴 [USERS API] Access denied: User role ${userRole} is not admin`);
      return NextResponse.json({ 
        error: `Admin access required. Your role: ${userRole}` 
      }, { status: 403 });
    }

    // Fetch all users, excluding sensitive data
    console.log("🟡 [USERS API] Fetching users from database...");
    const users = await usersCollection.find(
      {},
      { 
        projection: { 
          password: 0, 
          otp: 0, 
          otpExpires: 0 
        } 
      }
    ).toArray();

    console.log(`🟡 [USERS API] Raw users found: ${users.length}`);

    // Format users for client-side consumption
    const formattedUsers: FormattedUser[] = users.map(user => {
        const formattedUser: FormattedUser = {
            _id: user._id.toString(),
            name: user.name || "Unknown",
            email: user.email || "No email",
            role: user.role || "user",
            status: user.status || "active",
            isVerified: user.isVerified ?? false,
            membershipType: user.membershipType || "free",
            profile: user.profile || {},
            stats: user.stats || { 
                interviews: 0, 
                resumes: 0, 
                practiceTime: 0 
            },
            createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
            lastLogin: user.lastLogin?.toISOString() || null,
        };
        
        console.log(`🟡 [USERS API] Formatted user: ${formattedUser.name} (${formattedUser.role})`);
        return formattedUser;
    });

    console.log(`✅ [USERS API] Successfully formatted ${formattedUsers.length} users`);
    
    return NextResponse.json({
        users: formattedUsers,
        message: `Successfully fetched ${formattedUsers.length} users`,
        total: formattedUsers.length
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("🔴 [USERS API] Critical error fetching users:", {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        error: "Failed to fetch users",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}