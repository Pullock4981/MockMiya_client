// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface VerifyOtpBody {
  email: string;
  otp: string;
}

export async function POST(req: Request) {
  try {
    const body: VerifyOtpBody = await req.json();
    const { email, otp } = body;

    console.log("🔹 /api/verify-otp received:", { email, otp });

    if (!email || !otp) {
      console.log("🔹 Missing email or OTP");
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    await connectDB();
    console.log("🔹 Connected to MongoDB");

    const user = await User.findOne({ email });
    if (!user) {
      console.log("🔹 User not found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.otp || !user.otpExpires) {
      console.log("🔹 No OTP request found for:", email);
      return NextResponse.json({ error: "No OTP request found" }, { status: 400 });
    }

    if (user.otp !== otp) {
      console.log(`🔹 Invalid OTP for ${email}: provided ${otp}, expected ${user.otp}`);
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (user.otpExpires < new Date()) {
      console.log("🔹 OTP expired for:", email);
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    console.log("✅ OTP verified successfully for:", email);

    return NextResponse.json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("❌ Verify OTP Error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
