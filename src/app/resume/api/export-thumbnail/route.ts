// src/app/resume/api/export-thumbnail.route.ts
import puppeteer from "puppeteer";
import clientPromise from "@/context/MongoDB/mongodb";
import { NextRequest } from "next/server";
import { Binary } from "mongodb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { html, resumeId, userEmail } = await req.json();

    // console.log("🚀 Thumbnail API called:", { resumeId, userEmail, htmlLength: html?.length });

    if (!html || !resumeId || !userEmail) {
      console.error("❌ Missing html, resumeId, or userEmail");
      return new Response("HTML, resumeId, and userEmail are required", { status: 400 });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({ type: "png", fullPage: true });
    // console.log("📸 Screenshot length:", buffer.length);

    await browser.close();

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    const result = await collection.updateOne(
      { id: resumeId, userEmail },
      { $set: { thumbnail: new Binary(buffer) } }
    );

    // console.log("🗄️ MongoDB update result:", result);

    if (result.matchedCount === 0) {
      // console.warn("⚠️ No document matched. Check resumeId and userEmail");
      return new Response("No matching resume found", { status: 404 });
    }

    return new Response("Thumbnail saved successfully", { status: 200 });
  } catch (error) {
    // console.error("❌ Thumbnail Generation Error:", error);
    return new Response("Failed to generate thumbnail", { status: 500 });
  }
}
