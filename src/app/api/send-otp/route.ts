
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";
import { sendOTP } from "@/utils/sendOTP";

interface SendOtpBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: SendOtpBody = await req.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    const updatedUser = await usersCollection.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      {
        $set: { otp, otpExpires },
        $currentDate: { updatedAt: true },
      },
      { returnDocument: "after" }
    );

    if (!updatedUser?.value) {
      return NextResponse.json(
        { error: "Failed to generate OTP" },
        { status: 500 }
      );
    }

    // Send OTP via email
    await sendOTP(email, otp);

    return NextResponse.json({ message: "OTP sent", success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Send OTP API error (Native MongoDB):", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
