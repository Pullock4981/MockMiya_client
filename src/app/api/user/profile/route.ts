import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodbNative";

// Define proper interfaces
interface UserProfile {
  phone?: string;
  location?: string;
  title?: string;
  company?: string;
  education?: string;
  experience?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
}

interface UpdateRequestBody {
  email: string;
  name: string;
  profile: UserProfile;
}

// GET user profile
export async function GET(request: Request) {
  try {
    console.log("🔍 Profile API: GET request received");
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("📧 Fetching profile for:", email);

    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ 
      email: email.toLowerCase().trim() 
    });

    console.log("🔍 User found:", !!user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data - prefix unused variables with underscore
    const { password: _password, otp: _otp, otpExpires: _otpExpires, ...userData } = user;
    
    console.log("✅ Profile fetched successfully");
    return NextResponse.json(userData);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
    console.error("❌ Profile GET error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: Request) {
  try {
    console.log("🔄 Profile API: PUT request received");
    
    const session = await getServerSession();
    console.log("🔐 Session:", session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateRequestBody = await request.json();
    const { email, name, profile } = body;

    console.log("📧 Update request for:", email);

    if (email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Build update data with proper typing
    const updateData: Record<string, unknown> = {
      name: name.trim(),
      updatedAt: new Date(),
    };

    // Initialize profile object if it doesn't exist
    if (profile) {
      updateData.profile = {
        phone: profile.phone?.trim() || "",
        location: profile.location?.trim() || "",
        title: profile.title?.trim() || "",
        company: profile.company?.trim() || "",
        education: profile.education?.trim() || "",
        experience: profile.experience?.trim() || "",
        bio: profile.bio?.trim() || "",
        skills: profile.skills || [],
      };
    }

    console.log("📝 Update data:", updateData);

    const result = await usersCollection.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: updateData },
      { 
        returnDocument: 'after',
        projection: { password: 0, otp: 0, otpExpires: 0 }
      }
    );

    console.log("🔍 Update result:", !!result);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ Profile updated successfully");
    return NextResponse.json(result);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    console.error("❌ Profile PUT error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}