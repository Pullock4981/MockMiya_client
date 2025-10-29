// // app/api/reset-password/route.ts
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import User, { IUser } from "@/models/User";
// import { connectDB } from "@/lib/mongodb";

// interface ResetPasswordBody {
//   email: string;
//   otp?: string;
//   newPassword: string;
// }

// export async function PUT(req: Request) {
//   try {
//     const body: ResetPasswordBody = await req.json();
//     // console.log("🔹 /api/reset-password received body:", body);

//     const { email, otp, newPassword } = body;

//     if (!email || !newPassword) {
//       // console.log("🔹 Missing email or newPassword");
//       return NextResponse.json(
//         { error: "email and newPassword are required" },
//         { status: 400 }
//       );
//     }

//     // Connect to MongoDB
//     // console.log("⏳ Connecting to MongoDB...");
//     await connectDB();
//     // console.log("✅ MongoDB connected successfully");

//     const now = new Date();

//     // ----------------- OTP reset flow -----------------
//     if (otp) {
//       // console.log("🔹 Attempting OTP reset for:", email, "with OTP:", otp);

//       const hashed = await bcrypt.hash(newPassword.trim(), 10);
//       // console.log("🔹 Hashed new password:", hashed);

//       const updated = await User.findOneAndUpdate(
//         { email, otp: otp.toString(), otpExpires: { $gt: now } },
//         { $set: { password: hashed }, $unset: { otp: "", otpExpires: "" } },
//         { new: true }
//       ).lean<IUser | null>();

//       if (!updated) {
//         // console.log("🔹 Invalid or expired OTP for email:", email);
//         return NextResponse.json(
//           { error: "Invalid or expired OTP" },
//           { status: 400 }
//         );
//       }

//       // console.log("✅ OTP reset successful for email:", email);
//       // console.log("🔹 Updated user password hash:", updated.password);
//       return NextResponse.json({
//         message: "Password reset successful",
//         success: true,
//       });
//     }

//     // ----------------- Verified user reset (no OTP) -----------------
//     const user = await User.findOne({ email }).lean<IUser | null>();
//     // console.log("🔹 Found user for no-OTP reset:", user?.email);

//     if (!user)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     if (!user.isVerified) {
//       // console.log("🔹 User not verified:", user.email);
//       return NextResponse.json(
//         { error: "User not verified. Please verify your OTP first." },
//         { status: 403 }
//       );
//     }

//     // Hash new password
//     const hashed = await bcrypt.hash(newPassword.trim(), 10);
//     // console.log("🔹 Hashed new password (no OTP):", hashed);

//     const updatedNoOtp = await User.findOneAndUpdate(
//       { email },
//       { $set: { password: hashed } },
//       { new: true }
//     ).lean<IUser | null>();

//     if (!updatedNoOtp) {
//       // console.log("🔹 Failed to update password for verified user:", email);
//       return NextResponse.json(
//         { error: "Failed to update password" },
//         { status: 500 }
//       );
//     }

//     // console.log("✅ Reset password successful (no OTP) for:", email);
//     // console.log("🔹 Updated password hash:", updatedNoOtp.password);

//     return NextResponse.json({
//       message: "Password reset successful",
//       success: true,
//     });
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error("Unknown error");
//     // console.error("❌ Reset Password Error:", err);
//     return NextResponse.json(
//       { error: err.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }








// // app/api/reset-password/route.ts
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/mongodbNative";

// interface ResetPasswordBody {
//   email: string;
//   otp?: string;
//   newPassword: string;
// }

// export async function PUT(req: Request) {
//   try {
//     const body: ResetPasswordBody = await req.json();
//     const { email, otp, newPassword } = body;

//     if (!email?.trim() || !newPassword) {
//       return NextResponse.json(
//         { error: "email and newPassword are required" },
//         { status: 400 }
//       );
//     }

//     const { db } = await connectDB();
//     const usersCollection = db.collection("users");
//     const now = new Date();

//     // ----------------- OTP reset flow -----------------
//     if (otp) {
//       const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

//       const result = await usersCollection.findOneAndUpdate(
//         { email: email.trim().toLowerCase(), otp: otp.toString(), otpExpires: { $gt: now } },
//         {
//           $set: { password: hashedPassword },
//           $unset: { otp: "", otpExpires: "" },
//           $currentDate: { updatedAt: true },
//         },
//         { returnDocument: "after" }
//       );

//       if (!result?.value) {
//         return NextResponse.json(
//           { error: "Invalid or expired OTP" },
//           { status: 400 }
//         );
//       }

//       return NextResponse.json({
//         message: "Password reset successful",
//         success: true,
//       });
//     }

//     // ----------------- Verified user reset (no OTP) -----------------
//     const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (!user.isVerified) {
//       return NextResponse.json(
//         { error: "User not verified. Please verify your OTP first." },
//         { status: 403 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

//     const updatedNoOtp = await usersCollection.findOneAndUpdate(
//       { email: email.trim().toLowerCase() },
//       {
//         $set: { password: hashedPassword },
//         $currentDate: { updatedAt: true },
//       },
//       { returnDocument: "after" }
//     );

//     if (!updatedNoOtp?.value) {
//       return NextResponse.json(
//         { error: "Failed to update password" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       message: "Password reset successful",
//       success: true,
//     });
//   } catch (error) {
//     console.error("❌ Reset Password API error (Native MongoDB):", error);
//     const errMsg = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ error: errMsg }, { status: 500 });
//   }
// }










// src/app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodbNative";
import { logAdminActivity } from "@/lib/logAdminActivity";

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
        await logAdminActivity(`Password reset failed - invalid/expired OTP: ${email}`, "warning", "auth", null);
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      await logAdminActivity(`Password reset via OTP: ${email}`, "success", "auth", result.value._id?.toString?.() ?? null);

      return NextResponse.json({
        message: "Password reset successful",
        success: true,
      });
    }

    // ----------------- Verified user reset (no OTP) -----------------
    const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      await logAdminActivity(`Password reset failed - user not found: ${email}`, "warning", "auth", null);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isVerified) {
      await logAdminActivity(`Password reset failed - user not verified: ${email}`, "warning", "auth", user._id?.toString?.() ?? null);
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
      await logAdminActivity(`Password reset failed - DB update error: ${email}`, "error", "auth", user._id?.toString?.() ?? null);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    await logAdminActivity(`Password reset (no OTP) successful: ${email}`, "success", "auth", updatedNoOtp.value._id?.toString?.() ?? null);

    return NextResponse.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("❌ Reset Password API error (Native MongoDB):", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await logAdminActivity(`Reset Password API error: ${errMsg}`, "error", "auth", null);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
