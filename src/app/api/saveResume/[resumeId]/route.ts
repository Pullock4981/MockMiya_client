import { NextResponse } from "next/server";
import clientPromise from "@/context/MongoDB/mongodb";

export async function GET(request: Request, { params }: { params: { resumeId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("yourDBName");
    const resume = await db.collection("resumes").findOne({ id: params.resumeId });

    if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    return NextResponse.json(resume);
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
