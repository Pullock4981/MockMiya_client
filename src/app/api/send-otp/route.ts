// // app/api/send-otp/route.ts
// import { NextResponse } from "next/server";
// import { sendOTP } from "@/utils/sendOTP";
// import { connectDB } from "@/lib/mongodbNative";

// interface SendOtpBody {
//   email: string;
// }

// export async function POST(req: Request) {
//   try {
//     const body: SendOtpBody = await req.json();
//     const { email } = body;
//     // console.log("🔹 /api/send-otp received email:", email);

//     await connectDB();
//     // console.log("🔹 Connected to MongoDB");

//     const user = await User.findOne({ email });
//     if (!user) {
//       // console.log("🔹 User not found for email:", email);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//     // console.log(`🔹 Generated OTP for ${email}: ${otp}`);
//     // console.log(`🔹 OTP expires at: ${user.otpExpires.toISOString()}`);

//     await user.save();
//     // console.log("✅ OTP saved to MongoDB for user:", email);

//     await sendOTP(email, otp);
//     // console.log("✅ sendOTP function called for:", email);

//     return NextResponse.json({ message: "OTP sent", success: true });
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error("Unknown error");
//     console.error("❌ Send OTP Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }





// app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import { sendOTP } from "@/utils/sendOTP";
import { connectDB } from "@/lib/mongodbNative";

interface SendOtpBody {
  email: string;
}

// Basic email validation
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body: SendOtpBody = await req.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailNormalized = email.trim().toLowerCase();
    if (!isValidEmail(emailNormalized)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Connect to MongoDB
    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ email: emailNormalized });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user document with OTP
    let updatedUser;
    try {
      updatedUser = await usersCollection.findOneAndUpdate(
        { email: emailNormalized },
        { $set: { otp, otpExpires }, $currentDate: { updatedAt: true } },
        { returnDocument: "after" } // for MongoDB driver >= 4.6
      );
    } catch (dbErr) {
      console.error("❌ MongoDB update error:", dbErr);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // Fallback: if value is null, use original user
    const userToSend = updatedUser?.value || user;

    // Send OTP email safely
    let emailSent = false;
    try {
      const userName = userToSend.name || "User";
      await sendOTP(userToSend.email, otp, userName);
      console.log(`✅ OTP email sent to ${userToSend.email}`);
      emailSent = true;
    } catch (mailErr) {
      console.error(`⚠️ Failed to send OTP email to ${userToSend.email}`, mailErr);
      // Do not throw; API should not fail just because email failed
    }

    return NextResponse.json({
      message: "OTP generated",
      success: true,
      emailSent,
    });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Send OTP API error:", errMsg, error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
