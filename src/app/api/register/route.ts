
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
