// import clientPromise from "@/context/MongoDB/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const resumeId = searchParams.get("id");
//     const userEmail = searchParams.get("userEmail");
//     const fetchLatestDraft = searchParams.get("latestDraft");

//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const resumes = db.collection("resumes");

//     let resume;

//     // 🎯 Case 1: Fetch by resume ID
//     if (resumeId) {
//       resume = await resumes.findOne({ id: resumeId });
//     }
//     // 🎯 Case 2: Fetch latest draft by user
//     else if (fetchLatestDraft === "true" && userEmail) {
//       resume = await resumes.findOne(
//         { userEmail, resumeStatus: "draft" },
//         { sort: { updatedAt: -1 } }
//       );
//     } else {
//       return NextResponse.json(
//         { success: false, message: "Provide either id or userEmail to fetch resume" },
//         { status: 400 }
//       );
//     }

//     if (!resume) {
//       return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, resume });
//   } catch (err) {
//     // console.error("❌ Error fetching resume:", err);
//     return NextResponse.json(
//       { success: false, message: "Server error while fetching resume" },
//       { status: 500 }
//     );
//   }
// }




import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { logAdminActivity } from "@/lib/logAdminActivity";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");
    const userEmail = searchParams.get("userEmail");
    const fetchLatestDraft = searchParams.get("latestDraft");

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection("resumes");

    let resume;

    if (resumeId) {
      resume = await resumes.findOne({ id: resumeId });
    } else if (fetchLatestDraft === "true" && userEmail) {
      resume = await resumes.findOne(
        { userEmail, resumeStatus: "draft" },
        { sort: { updatedAt: -1 } }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Provide either id or userEmail to fetch resume" },
        { status: 400 }
      );
    }

    if (!resume) {
      return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
    }

    await logAdminActivity(
      `Fetched resume: ${resumeId ?? "latest draft"}`,
      "info",
      "resume",
      userEmail ?? null,
      { resumeId }
    );

    return NextResponse.json({ success: true, resume });
  } catch (err) {
    await logAdminActivity(`Error fetching resume: ${(err as Error).message}`, "error", "resume", null);
    return NextResponse.json(
      { success: false, message: "Server error while fetching resume" },
      { status: 500 }
    );
  }
}
