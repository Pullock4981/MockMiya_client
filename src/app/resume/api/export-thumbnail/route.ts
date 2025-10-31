// // src/app/resume/api/export-thumbnail.route.ts
// import puppeteer from "puppeteer";
// import clientPromise from "@/context/MongoDB/mongodb";
// import { NextRequest } from "next/server";
// import { Binary } from "mongodb";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   try {
//     const { html, resumeId, userEmail } = await req.json();

//     // console.log("🚀 Thumbnail API called:", { resumeId, userEmail, htmlLength: html?.length });

//     if (!html || !resumeId || !userEmail) {
//       console.error("❌ Missing html, resumeId, or userEmail");
//       return new Response("HTML, resumeId, and userEmail are required", { status: 400 });
//     }

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const buffer = await page.screenshot({ type: "png", fullPage: true });
//     // console.log("📸 Screenshot length:", buffer.length);

//     await browser.close();

//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     const result = await collection.updateOne(
//       { id: resumeId, userEmail },
//       { $set: { thumbnail: new Binary(buffer) } }
//     );

//     // console.log("🗄️ MongoDB update result:", result);

//     if (result.matchedCount === 0) {
//       // console.warn("⚠️ No document matched. Check resumeId and userEmail");
//       return new Response("No matching resume found", { status: 404 });
//     }

//     return new Response("Thumbnail saved successfully", { status: 200 });
//   } catch (error) {
//     // console.error("❌ Thumbnail Generation Error:", error);
//     return new Response("Failed to generate thumbnail", { status: 500 });
//   }
// }






// src/app/resume/api/export-thumbnail/route.ts
// src/app/resume/api/export-thumbnail/route.ts
import { NextRequest } from "next/server";
import { Binary } from "mongodb";
import clientPromise from "@/context/MongoDB/mongodb";
import chromium from "@sparticuz/chromium";
import puppeteer, { Viewport } from "puppeteer-core";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { html, resumeId, userEmail } = await req.json();

    if (!html || !resumeId || !userEmail) {
      return new Response("Missing required fields", { status: 400 });
    }

    const isProd = process.env.NODE_ENV === "production";
    let executablePath = isProd ? await chromium.executablePath() : undefined;

    if (!executablePath) {
      try {
        const puppeteerLocal = await import("puppeteer");
        executablePath = puppeteerLocal.executablePath();
      } catch (e) {
        console.error("⚠️ Local puppeteer not found:", e);
      }
    }

    if (!executablePath) {
      throw new Error("No valid Chrome executable path found");
    }

    // ✅ Strongly typed version
    const chromiumConfig: {
      args: string[];
      defaultViewport?: Viewport | null;
      headless?: boolean;
    } = {
      args: chromium.args,
      defaultViewport:
        (chromium as unknown as { defaultViewport?: Viewport | null }).defaultViewport ?? null,
      headless: (chromium as unknown as { headless?: boolean }).headless,
    };

    const browser = await puppeteer.launch({
      args: chromiumConfig.args,
      defaultViewport: chromiumConfig.defaultViewport,
      executablePath,
      headless: chromiumConfig.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.screenshot({ type: "png", fullPage: true });
    await browser.close();

    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    const result = await collection.updateOne(
      { id: resumeId, userEmail },
      { $set: { thumbnail: new Binary(buffer) } }
    );

    if (result.matchedCount === 0) {
      return new Response("No matching resume found", { status: 404 });
    }

    return new Response("Thumbnail saved successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Thumbnail Generation Error:", error);
    return new Response("Failed to generate thumbnail", { status: 500 });
  }
}
