// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";
// import { connectDB } from "@/lib/mongodb";
// import { sendOTP } from "@/utils/sendOTP";

// interface RegisterBody {
//   name: string;
//   email: string;
//   password: string;
// }

// export async function POST(req: Request) {
//   try {
//     const body: RegisterBody = await req.json();
//     const { name, email, password } = body;

//     // 🔍 Debug: log incoming request data
//     // console.log("Register API received:", { name, email, password });

//     if (!name?.trim() || !email?.trim() || !password) {
//       return NextResponse.json(
//         { error: "Name, email and password are required" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const newUser = new User({
//       name: name.trim(),
//       email: email.trim(),
//       password: hashedPassword,
//       role: "user",
//       membershipType: "",
//       otp,
//       otpExpires: new Date(Date.now() + 10 * 60 * 1000),
//       isVerified: false,
//     });

//     await newUser.save();
//     await sendOTP(email, otp);

//     return NextResponse.json({
//       message: "User registered successfully. OTP sent to email.",
//     });
//   } catch (error) {
//     const err = error instanceof Error ? error : new Error("Unknown error");
//     // console.error("❌ Register error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }








// register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/utils/sendOTP";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId } from "mongodb";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { name, email, password } = body;

    // Input validation
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectDB();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Insert new user
    const newUser = {
      _id: new ObjectId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "user",
      membershipType: "",
      otp,
      otpExpires,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    // Send OTP email
    await sendOTP(email, otp);

    return NextResponse.json({
      message: "User registered successfully. OTP sent to email.",
    });
  } catch (error) {
    console.error("❌ Register API error (Native MongoDB):", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
