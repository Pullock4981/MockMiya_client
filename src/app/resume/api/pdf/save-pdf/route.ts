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






// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import puppeteerCore from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import clientPromise from "@/context/MongoDB/mongodb";
// import { existsSync } from "fs";

// export const runtime = "nodejs";

// async function getChromiumConfig() {
//   const isProd = process.env.NODE_ENV === "production";

//   if (isProd) {
//     // Production: Use @sparticuz/chromium-min
//     const executablePath = await chromium.executablePath();
//     return {
//       executablePath,
//       args: chromium.args,
//       headless: chromium.headless === "new" ? true : Boolean(chromium.headless),
//       defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
//     };
//   } else {
//     // Development: Try multiple fallback options
//     let executablePath = process.env.CHROME_PATH;

//     if (!executablePath) {
//       // Try to find Chrome in common installation paths
//       const platform = process.platform;
      
//       if (platform === "darwin") {
//         executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//       } else if (platform === "win32") {
//         executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//         // Also check alternative Windows paths
//         if (!existsSync(executablePath)) {
//           executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//         }
//       } else {
//         executablePath = "/usr/bin/google-chrome";
//         // Also check other common Linux paths
//         if (!existsSync(executablePath)) {
//           executablePath = "/usr/bin/chromium-browser";
//         }
//       }
//     }

//     return {
//       executablePath: executablePath!,
//       args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
//       headless: true,
//       defaultViewport: { width: 1280, height: 800 },
//     };
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const html = body?.html as string | undefined;
//     const resumeId = body?.resumeId as string | undefined;

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     const config = await getChromiumConfig();

//     // Check if executable exists in development
//     if (!config.executablePath) {
//       return NextResponse.json(
//         { success: false, message: "Chrome executable not found" },
//         { status: 500 }
//       );
//     }

//     if (process.env.NODE_ENV === "development") {
//       if (!existsSync(config.executablePath)) {
//         console.warn(`Chrome not found at: ${config.executablePath}`);
//         return NextResponse.json(
//           { 
//             success: false, 
//             message: "Chrome not found. Please install Chrome or set CHROME_PATH environment variable.",
//             details: `Expected path: ${config.executablePath}`
//           },
//           { status: 500 }
//         );
//       }
//     }

//     console.log(`Launching Chrome from: ${config.executablePath}`);

//     const browser = await puppeteerCore.launch(config);
//     const page = await browser.newPage();
    
//     await page.setContent(html, { 
//       waitUntil: ["domcontentloaded", "networkidle0"] 
//     });

//     // Wait for fonts and resources
//     await page.evaluateHandle("document.fonts.ready");
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     await browser.close();

//     const nodeBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

//     // Save to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       { 
//         $set: { 
//           pdf: nodeBuffer, 
//           pdfGeneratedAt: new Date() 
//         } 
//       },
//       { upsert: true }
//     );

//     return new NextResponse(nodeBuffer as unknown as BodyInit, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="resume.pdf"',
//       },
//     });
//   } catch (err) {
//     console.error("PDF generation error:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to generate PDF",
//         detail: (err as Error).message,
//       },
//       { status: 500 }
//     );
//   }
// }










// src/app/resume/api/pdf/save-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import clientPromise from "@/context/MongoDB/mongodb";

export const runtime = "nodejs";

// Force Chromium to run in headless mode
(chromium as any).setGraphicsMode = false;

export async function POST(req: NextRequest) {
  let browser = null;
  
  try {
    const body = await req.json();
    const html = body?.html as string;
    const resumeId = body?.resumeId as string;

    if (!html || !resumeId) {
      return NextResponse.json(
        { success: false, message: "HTML and resumeId are required" },
        { status: 400 }
      );
    }

    console.log("🚀 Starting PDF generation...");

    let executablePath: string;
    let args: string[];

    if (process.env.NODE_ENV === "production") {
      // Production: Use @sparticuz/chromium-min
      executablePath = await chromium.executablePath();
      args = chromium.args;
    } else {
      // Development: Use local Chrome
      executablePath = getLocalChromePath();
      args = [
        "--no-sandbox",
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
      ];
    }

    console.log("🔧 Browser config:", {
      executablePath: executablePath?.substring(0, 50) + '...',
      environment: process.env.NODE_ENV
    });

    // Launch browser
    browser = await puppeteerCore.launch({
      args,
      executablePath,
      headless: chromium.headless === "new" ? true : Boolean(chromium.headless),
    });

    const page = await browser.newPage();

    // Set timeouts
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    console.log("📄 Setting HTML content...");
    
    // Set content and wait
    await page.setContent(html, { 
      waitUntil: "networkidle0" as any
    });

    console.log("⏳ Waiting for resources...");
    
    // Wait for fonts
    await page.evaluate(async () => {
      await (document as any).fonts?.ready;
    });

    // Additional wait
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("🖨️ Generating PDF...");
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
    });

    console.log("✅ PDF generated, size:", pdfBuffer.length);

    const nodeBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    console.log("💾 Saving to MongoDB...");
    
    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const collection = db.collection("resumes");

    await collection.updateOne(
      { id: resumeId },
      { 
        $set: { 
          pdf: nodeBuffer, 
          pdfGeneratedAt: new Date(),
          pdfSize: nodeBuffer.length
        } 
      },
      { upsert: true }
    );

    console.log("🎉 PDF saved successfully!");

    // FIX: Type assertion for Buffer to BodyInit
    return new NextResponse(nodeBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
        "Content-Length": nodeBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("❌ PDF generation error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate PDF",
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}

function getLocalChromePath(): string {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  switch (process.platform) {
    case 'win32':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'linux':
      return '/usr/bin/google-chrome';
    default:
      return '/usr/bin/chromium-browser';
  }
}
