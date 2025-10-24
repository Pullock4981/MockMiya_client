// // app/api/verify-otp/route.ts
// import { NextResponse } from "next/server";
// import User from "@/models/User";
// import { connectDB } from "@/lib/mongodb";

// interface VerifyOtpBody {
//   email: string;
//   otp: string;
// }

// export async function POST(req: Request) {
//   try {
//     const body: VerifyOtpBody = await req.json();
//     const { email, otp } = body;

//     // console.log("🔹 /api/verify-otp received:", { email, otp });

//     if (!email || !otp) {
//       // console.log("🔹 Missing email or OTP");
//       return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
//     }

//     await connectDB();
//     // console.log("🔹 Connected to MongoDB");

//     const user = await User.findOne({ email });
//     if (!user) {
//       // console.log("🔹 User not found for email:", email);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (!user.otp || !user.otpExpires) {
//       // console.log("🔹 No OTP request found for:", email);
//       return NextResponse.json({ error: "No OTP request found" }, { status: 400 });
//     }

//     if (user.otp !== otp) {
//       // console.log(`🔹 Invalid OTP for ${email}: provided ${otp}, expected ${user.otp}`);
//       return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
//     }

//     if (user.otpExpires < new Date()) {
//       // console.log("🔹 OTP expired for:", email);
//       return NextResponse.json({ error: "OTP expired" }, { status: 400 });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();
//     // console.log("✅ OTP verified successfully for:", email);

//     return NextResponse.json({ message: "OTP verified successfully", success: true });
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error("Unknown error");
//     // console.error("❌ Verify OTP Error:", err);
//     return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
//   }
// }





// app/api/verify-otp/route.ts
// app/api/verify-otp/route.ts
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
