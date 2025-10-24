// app/api/user/profile/route.ts - FIXED VERSION
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId } from "mongodb";

// GET user profile - MATCHES SIGNUP PATTERN
export async function GET(request: Request) {
  try {
    console.log("🔍 Profile API: GET request received");
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("📧 Fetching profile for:", email);

    // Use the SAME connection pattern as register/route.ts
    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ 
      email: email.toLowerCase().trim() 
    });

    console.log("🔍 User found:", !!user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data - match your user schema from register
    const { password, otp, otpExpires, ...userData } = user;
    
    console.log("✅ Profile fetched successfully");
    return NextResponse.json(userData);
    
  } catch (error: any) {
    console.error("❌ Profile GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" }, 
      { status: 500 }
    );
  }
}

// UPDATE user profile - MATCHES SIGNUP PATTERN
export async function PUT(request: Request) {
  try {
    console.log("🔄 Profile API: PUT request received");
    
    const session = await getServerSession();
    console.log("🔐 Session:", session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, profile } = body;

    console.log("📧 Update request for:", email);

    if (email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use the SAME connection pattern as register/route.ts
    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Build update data matching your user schema
    const updateData: any = {
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

    // Use findOneAndUpdate like in your working code
    const result = await usersCollection.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: updateData },
      { 
        returnDocument: 'after',
        // Add projection to exclude sensitive fields
        projection: { password: 0, otp: 0, otpExpires: 0 }
      }
    );

    console.log("🔍 Update result:", !!result);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ Profile updated successfully");
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("❌ Profile PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" }, 
      { status: 500 }
    );
  }
}