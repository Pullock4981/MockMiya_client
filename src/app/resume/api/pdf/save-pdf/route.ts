// // src/app/resume/api/pdf/save-pdf/route.ts
// import puppeteer from "puppeteer";
// import clientPromise from "@/context/MongoDB/mongodb"; // তোমার mongodb connection

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const { html, resumeId } = await req.json();
//     if (!html) return new Response("HTML content is required", { status: 400 });

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
//     });

//     await browser.close();

//     // ✅ MongoDB তে save করা
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date() } },
//       { upsert: true }
//     );

//     const arrayBuffer = pdfBuffer.buffer.slice(
//       pdfBuffer.byteOffset,
//       pdfBuffer.byteOffset + pdfBuffer.byteLength
//     );

//     return new Response(arrayBuffer as ArrayBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="resume.pdf"',
//       },
//     });
//   } catch (error) {
//     // console.error("PDF Generation Error:", error);
//     return new Response("Failed to generate PDF", { status: 500 });
//   }
// }






// src/app/resume/api/pdf/save-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import clientPromise from "@/context/MongoDB/mongodb";
import { existsSync } from "fs";

export const runtime = "nodejs";

async function getChromiumConfig() {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    // Production: Use @sparticuz/chromium-min
    const executablePath = await chromium.executablePath();
    return {
      executablePath,
      args: chromium.args,
      headless: chromium.headless === "new" ? true : Boolean(chromium.headless),
      defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
    };
  } else {
    // Development: Try multiple fallback options
    let executablePath = process.env.CHROME_PATH;

    if (!executablePath) {
      // Try to find Chrome in common installation paths
      const platform = process.platform;
      
      if (platform === "darwin") {
        executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      } else if (platform === "win32") {
        executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        // Also check alternative Windows paths
        if (!existsSync(executablePath)) {
          executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
        }
      } else {
        executablePath = "/usr/bin/google-chrome";
        // Also check other common Linux paths
        if (!existsSync(executablePath)) {
          executablePath = "/usr/bin/chromium-browser";
        }
      }
    }

    return {
      executablePath: executablePath!,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      headless: true,
      defaultViewport: { width: 1280, height: 800 },
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const html = body?.html as string | undefined;
    const resumeId = body?.resumeId as string | undefined;

    if (!html || !resumeId) {
      return NextResponse.json(
        { success: false, message: "HTML and resumeId are required" },
        { status: 400 }
      );
    }

    const config = await getChromiumConfig();

    // Check if executable exists in development
    if (!config.executablePath) {
      return NextResponse.json(
        { success: false, message: "Chrome executable not found" },
        { status: 500 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      if (!existsSync(config.executablePath)) {
        console.warn(`Chrome not found at: ${config.executablePath}`);
        return NextResponse.json(
          { 
            success: false, 
            message: "Chrome not found. Please install Chrome or set CHROME_PATH environment variable.",
            details: `Expected path: ${config.executablePath}`
          },
          { status: 500 }
        );
      }
    }

    console.log(`Launching Chrome from: ${config.executablePath}`);

    const browser = await puppeteerCore.launch(config);
    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: ["domcontentloaded", "networkidle0"] 
    });

    // Wait for fonts and resources
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
    });

    await browser.close();

    const nodeBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    await collection.updateOne(
      { id: resumeId },
      { 
        $set: { 
          pdf: nodeBuffer, 
          pdfGeneratedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return new NextResponse(nodeBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate PDF",
        detail: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

