// app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { sendOTP } from "@/utils/sendOTP";

interface SendOtpBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: SendOtpBody = await req.json();
    const { email } = body;
    console.log("🔹 /api/send-otp received email:", email);

    await connectDB();
    console.log("🔹 Connected to MongoDB");

    const user = await User.findOne({ email });
    if (!user) {
      console.log("🔹 User not found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`🔹 Generated OTP for ${email}: ${otp}`);
    console.log(`🔹 OTP expires at: ${user.otpExpires.toISOString()}`);

    await user.save();
    console.log("✅ OTP saved to MongoDB for user:", email);

    await sendOTP(email, otp);
    console.log("✅ sendOTP function called for:", email);

    return NextResponse.json({ message: "OTP sent", success: true });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("❌ Send OTP Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
