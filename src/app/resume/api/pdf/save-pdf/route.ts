// src/app/resume/api/pdf/save-pdf/route.ts
import puppeteer from "puppeteer";
import clientPromise from "@/context/MongoDB/mongodb"; // তোমার mongodb connection

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { html, resumeId } = await req.json();
    if (!html) return new Response("HTML content is required", { status: 400 });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    await browser.close();

    // ✅ MongoDB তে save করা
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    await collection.updateOne(
      { id: resumeId },
      { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date() } },
      { upsert: true }
    );

    const arrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    );

    return new Response(arrayBuffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    // console.error("PDF Generation Error:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
