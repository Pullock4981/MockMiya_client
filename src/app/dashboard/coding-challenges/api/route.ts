// src/app/dashboard/coding-challenges/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodbNative";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "codingChallenges";

// ✅ GET: সব চ্যালেঞ্জ ফেচ করা
export async function GET(req: NextRequest) {
  try {
    const { db } = await connectDB();
    const challenges = await db.collection(COLLECTION_NAME).find({}).toArray();
    return NextResponse.json({ success: true, data: challenges });
  } catch (error: unknown) {
  let message = "Failed to fetch challenges";
  if (error instanceof Error) message = error.message;
  return NextResponse.json({ success: false, message }, { status: 500 });
}

}

// ✅ POST: নতুন চ্যালেঞ্জ সেভ বা আপডেট (upsert)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 🔹 Validation
    if (!data || !data.title || !data.description || !data.role || !data.questions) {
      return NextResponse.json(
        { success: false, message: "title, description, role, and questions are required" },
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    // 🔹 Prepare document with timestamps
    const challengeDocument = {
      ...data,
      updatedAt: new Date(),
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };

    // 🔹 Upsert by title + role (avoid duplicates)
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { title: data.title, role: data.role },
      { $set: challengeDocument },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: result.upsertedCount
        ? "Challenge created successfully"
        : "Challenge updated successfully",
      data: result,
    });
  } catch (error: unknown) {
  let message = "Failed to save challenge";
  if (error instanceof Error) message = error.message;
  return NextResponse.json({ success: false, message }, { status: 500 });
}

}

// ✅ DELETE: চ্যালেঞ্জ ডিলিট
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const { db } = await connectDB();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: unknown) {
  let message = "Failed to save challenge";
  if (error instanceof Error) message = error.message;
  return NextResponse.json({ success: false, message }, { status: 500 });
}

}
