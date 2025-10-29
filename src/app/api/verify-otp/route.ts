
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";

interface VerifyOtpBody {
  email: string;
  otp: string;
}

export async function POST(req: Request) {
  try {
    const body: VerifyOtpBody = await req.json();
    let { email, otp } = body;

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();

    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // 1️⃣ Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2️⃣ Check if already verified
    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified", success: true });
    }

    // 3️⃣ Check if OTP exists
    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ error: "No OTP request found" }, { status: 400 });
    }

    const otpExpiresDate = new Date(user.otpExpires);

    // 4️⃣ Check OTP match
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 5️⃣ Check OTP expiration
    if (otpExpiresDate < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // 6️⃣ Update user as verified and remove OTP fields safely
    const updateResult = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: 1, otpExpires: 1 },
        $currentDate: { updatedAt: true },
      },
      { returnDocument: "after" }
    );

    // 7️⃣ Safety check: if updateResult null, fallback to fresh query
    const updatedUser = updateResult?.value || await usersCollection.findOne({ email });
    if (!updatedUser) {
      console.error("❌ OTP verify failed: user update returned null", { email });
      return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }

    // ✅ Success
    return NextResponse.json({
      message: "OTP verified successfully",
      success: true,
      user: {
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Verify OTP API error:", errMsg);
    return NextResponse.json({ error: "Server error", details: errMsg }, { status: 500 });
  }
}
