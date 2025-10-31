
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
      console.error("Missing fields:", { html: !!html, resumeId, userEmail });
      return new Response("Missing required fields", { status: 400 });
    }

    const isProd = process.env.NODE_ENV === "production";
    console.log("Thumbnail API called — isProd:", isProd);

    let executablePath: string | undefined = undefined;
    if (isProd) {
      try {
        executablePath = await chromium.executablePath();
        console.log("chromium.executablePath() =>", executablePath);
      } catch (err) {
        console.warn("chromium.executablePath() failed:", (err as Error).message);
      }
    }

    if (!executablePath) {
      try {
        const puppeteerLocal = await import("puppeteer");
        executablePath = puppeteerLocal.executablePath();
        console.log("Fallback puppeteer.executablePath() =>", executablePath);
      } catch (e) {
        console.warn("Local puppeteer not present:", (e as Error).message);
      }
    }

    if (!executablePath) {
      console.error("No valid Chrome executable path found. Aborting.");
      return new Response(
        JSON.stringify({ success: false, message: "No Chrome executable found on server" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Fix: Always provide a string[] for args so TS knows it's not undefined
    const rawArgs = (chromium as unknown as { args?: string[] }).args;
    const launchArgs: string[] = Array.isArray(rawArgs) ? rawArgs : [];

    // Add safe serverless flags
    if (!launchArgs.includes("--no-sandbox")) launchArgs.push("--no-sandbox");
    if (!launchArgs.includes("--disable-setuid-sandbox")) launchArgs.push("--disable-setuid-sandbox");

    const defaultViewport: Viewport = { width: 1280, height: 800 };

    console.log("Launching puppeteer with args length:", launchArgs.length);

    const browser = await puppeteer.launch({
      args: launchArgs,
      defaultViewport,
      executablePath,
      headless: true,
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
      return new Response(
        JSON.stringify({ success: false, message: "No matching resume found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Thumbnail saved successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Thumbnail Generation Error:", (error as Error).message, (error as Error).stack);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to generate thumbnail", detail: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
