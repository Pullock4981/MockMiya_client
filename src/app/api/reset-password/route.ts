import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodbNative";

interface ResetPasswordBody {
  email: string;
  otp?: string;
  newPassword: string;
}

export async function PUT(req: Request) {
  try {
    const body: ResetPasswordBody = await req.json();
    const { email, otp, newPassword } = body;

    if (!email?.trim() || !newPassword) {
      return NextResponse.json(
        { error: "email and newPassword are required" },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const usersCollection = db.collection("users");
    const now = new Date();

    // ----------------- OTP reset flow -----------------
    if (otp) {
      const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

      const result = await usersCollection.findOneAndUpdate(
        { email: email.trim().toLowerCase(), otp: otp.toString(), otpExpires: { $gt: now } },
        {
          $set: { password: hashedPassword },
          $unset: { otp: "", otpExpires: "" },
          $currentDate: { updatedAt: true },
        },
        { returnDocument: "after" }
      );

      if (!result?.value) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: "Password reset successful",
        success: true,
      });
    }

    // ----------------- Verified user reset (no OTP) -----------------
    const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "User not verified. Please verify your OTP first." },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    const updatedNoOtp = await usersCollection.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      {
        $set: { password: hashedPassword },
        $currentDate: { updatedAt: true },
      },
      { returnDocument: "after" }
    );

    if (!updatedNoOtp?.value) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("❌ Reset Password API error (Native MongoDB):", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
