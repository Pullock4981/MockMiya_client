// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User";
// import { connectDB } from "@/lib/mongodb";
// import bcrypt from "bcryptjs";

// interface LoginBody {
//   email: string;
//   password: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body: LoginBody = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password required" },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ hashed password check
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { error: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     // Check verified
//     if (!user.isVerified) {
//       return NextResponse.json({ error: "Email not verified", requireOTP: true });
//     }

//     return NextResponse.json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login error:", (error as Error).message);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }






// // app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/mongodbNative";

// interface LoginBody {
//   email: string;
//   password: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body: LoginBody = await req.json();
//     const { email, password } = body;

//     // Input validation
//     if (!email?.trim() || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Connect to MongoDB (Native)
//     const { db } = await connectDB();
//     const usersCollection = db.collection("users");

//     // Find user by email
//     const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Check password (hashed)
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
//     }

//     // Check email verification
//     if (!user.isVerified) {
//       return NextResponse.json({ error: "Email not verified", requireOTP: true }, { status: 403 });
//     }

//     // Login successful
//     return NextResponse.json({ message: "Login successful", user: {
//       id: user._id.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role || "user",
//     }});
//   } catch (error) {
//     console.error("❌ Login API error (Native MongoDB):", error);
//     const errMsg = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ error: errMsg }, { status: 500 });
//   }
// }








// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodbNative";
import { logAdminActivity } from "@/lib/logAdminActivity";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginBody = await req.json();
    const { email, password } = body;

    // Input validation
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB (Native)
    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      await logAdminActivity(`Login failed - user not found: ${email}`, "warning", "auth", null);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check password (hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAdminActivity(`Login failed - incorrect password: ${email}`, "warning", "auth", user._id?.toString?.() ?? null);
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Check email verification
    if (!user.isVerified) {
      await logAdminActivity(`Login failed - email not verified: ${email}`, "warning", "auth", user._id?.toString?.() ?? null);
      return NextResponse.json({ error: "Email not verified", requireOTP: true }, { status: 403 });
    }

    // Login successful
    await logAdminActivity(`User logged in: ${email}`, "success", "auth", user._id?.toString?.() ?? null);

    return NextResponse.json({ message: "Login successful", user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
    }});
  } catch (error) {
    console.error("❌ Login API error (Native MongoDB):", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    await logAdminActivity(`Login API error: ${errMsg}`, "error", "auth", null);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
