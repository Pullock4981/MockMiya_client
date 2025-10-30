import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId } from "mongodb";

// Define interface for MongoDB user
interface MongoDBUser {
  _id: ObjectId;
  name: string;
  email: string;
  role?: string;
  status?: string;
  isVerified?: boolean;
  membershipType?: string;
  profile?: Record<string, unknown>;
  stats?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  password?: string;
  otp?: string;
  otpExpires?: Date;
}

interface UpdateFields {
  status?: string;
  role?: string;
  membershipType?: string;
  updatedAt: Date;
}

interface UserUpdateResponseData {
  user: {
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
  };
  message: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UserUpdateResponseData | { error: string }>> {
  try {
    console.log("🟡 [ADMIN API] Starting user update process...");
    
    // Get parameters
    const { id: userId } = await params;
    console.log(`🟡 [ADMIN API] Target user ID: ${userId}`);
    
    // Check session
    const session = await getServerSession();
    console.log(`🟡 [ADMIN API] Session check:`, session ? "Session exists" : "No session");
    
    if (!session?.user?.email) {
      console.log("🔴 [ADMIN API] Unauthorized: No session or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    console.log("🟡 [ADMIN API] Connecting to database...");
    const { db } = await connectDB();
    const usersCollection = db.collection<MongoDBUser>("users");

    // Verify requesting user is admin
    console.log(`🟡 [ADMIN API] Checking admin privileges for: ${session.user.email}`);
    const adminUser = await usersCollection.findOne({
      email: session.user.email.toLowerCase().trim(),
    });

    if (!adminUser) {
      console.log("🔴 [ADMIN API] Admin user not found in database");
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const userRole = adminUser.role || 'user';
    const isAdmin = ['admin', 'Admin', 'System Admin'].includes(userRole);
    console.log(`🟡 [ADMIN API] User role: ${userRole}, Is admin: ${isAdmin}`);

    if (!isAdmin) {
      console.log(`🔴 [ADMIN API] Access denied: User role ${userRole} is not admin`);
      return NextResponse.json(
        { error: `Admin access required. Your role: ${userRole}` },
        { status: 403 }
      );
    }

    // Parse request body
    console.log("🟡 [ADMIN API] Parsing request body...");
    const body = await request.json();
    const { action } = body;
    console.log(`🟡 [ADMIN API] Action requested: ${action}`);

    // Validate action
    const validActions = ['suspend', 'activate', 'upgrade', 'downgrade', 'delete'];
    if (!action || !validActions.includes(action)) {
      console.log(`🔴 [ADMIN API] Invalid action: ${action}`);
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${validActions.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Validate user ID
    if (!ObjectId.isValid(userId)) {
      console.log(`🔴 [ADMIN API] Invalid user ID format: ${userId}`);
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    console.log(`🟡 [ADMIN API] Performing action '${action}' on user ${userId}`);

    // Prepare update fields
    const updateFields: UpdateFields = { updatedAt: new Date() };

    switch (action) {
      case 'suspend':
        updateFields.status = 'suspended';
        break;
      case 'activate':
        updateFields.status = 'active';
        break;
      case 'upgrade':
        updateFields.role = 'premium';
        updateFields.membershipType = 'premium';
        break;
      case 'downgrade':
        updateFields.role = 'user';
        updateFields.membershipType = 'free';
        break;
      case 'delete':
        updateFields.status = 'banned';
        break;
    }

    console.log(`🟡 [ADMIN API] Update fields:`, updateFields);

    // Execute update
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      { 
        returnDocument: 'after', 
        projection: { 
          password: 0, 
          otp: 0, 
          otpExpires: 0 
        } 
      }
    );

    console.log(`🟡 [ADMIN API] Database result:`, result ? "User found and updated" : "User not found");

    if (!result) {
      console.log(`🔴 [ADMIN API] User not found with ID: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format response
    const updatedUser = result;
    console.log(`🟡 [ADMIN API] Updated user data:`, {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    });

    const formattedUser: UserUpdateResponseData['user'] = {
      _id: updatedUser._id.toString(),
      name: updatedUser.name || 'Unknown',
      email: updatedUser.email || 'No email',
      role: updatedUser.role || 'user',
      status: updatedUser.status || 'active',
      isVerified: updatedUser.isVerified || false,
      membershipType: updatedUser.membershipType || 'free',
      profile: updatedUser.profile || {},
      stats: updatedUser.stats || {
        interviews: 0,
        resumes: 0,
        practiceTime: 0
      },
      createdAt: updatedUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString() || new Date().toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString() || null
    };

    console.log(`✅ [ADMIN API] Successfully completed action '${action}' on user ${userId}`);
    
    return NextResponse.json({
      user: formattedUser,
      message: `User ${action} successfully`
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("🔴 [ADMIN API] Critical error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { error: `Failed to update user: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}