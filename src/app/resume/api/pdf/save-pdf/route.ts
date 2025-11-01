// // // // src/app/resume/api/pdf/save-pdf/route.ts
// // // import puppeteer from "puppeteer";
// // // import clientPromise from "@/context/MongoDB/mongodb"; // তোমার mongodb connection

// // // export const runtime = "nodejs";

// // // export async function POST(req: Request) {
// // //   try {
// // //     const { html, resumeId } = await req.json();
// // //     if (!html) return new Response("HTML content is required", { status: 400 });

// // //     const browser = await puppeteer.launch({
// // //       headless: true,
// // //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
// // //     });

// // //     const page = await browser.newPage();
// // //     await page.setContent(html, { waitUntil: "networkidle0" });

// // //     const pdfBuffer = await page.pdf({
// // //       format: "A4",
// // //       printBackground: true,
// // //       margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
// // //     });

// // //     await browser.close();

// // //     // ✅ MongoDB তে save করা
// // //     const client = await clientPromise;
// // //     const db = client.db("MockMiya");
// // //     const collection = db.collection("resumes");

// // //     await collection.updateOne(
// // //       { id: resumeId },
// // //       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date() } },
// // //       { upsert: true }
// // //     );

// // //     const arrayBuffer = pdfBuffer.buffer.slice(
// // //       pdfBuffer.byteOffset,
// // //       pdfBuffer.byteOffset + pdfBuffer.byteLength
// // //     );

// // //     return new Response(arrayBuffer as ArrayBuffer, {
// // //       headers: {
// // //         "Content-Type": "application/pdf",
// // //         "Content-Disposition": 'attachment; filename="resume.pdf"',
// // //       },
// // //     });
// // //   } catch (error) {
// // //     // console.error("PDF Generation Error:", error);
// // //     return new Response("Failed to generate PDF", { status: 500 });
// // //   }
// // // }






// // // // src/app/resume/api/pdf/save-pdf/route.ts
// // // import { NextRequest, NextResponse } from "next/server";
// // // import puppeteerCore from "puppeteer-core";
// // // import chromium from "@sparticuz/chromium-min";
// // // import clientPromise from "@/context/MongoDB/mongodb";
// // // import { existsSync } from "fs";

// // // export const runtime = "nodejs";

// // // async function getChromiumConfig() {
// // //   const isProd = process.env.NODE_ENV === "production";

// // //   if (isProd) {
// // //     // Production: Use @sparticuz/chromium-min
// // //     const executablePath = await chromium.executablePath();
// // //     return {
// // //       executablePath,
// // //       args: chromium.args,
// // //       headless: chromium.headless === "new" ? true : Boolean(chromium.headless),
// // //       defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
// // //     };
// // //   } else {
// // //     // Development: Try multiple fallback options
// // //     let executablePath = process.env.CHROME_PATH;

// // //     if (!executablePath) {
// // //       // Try to find Chrome in common installation paths
// // //       const platform = process.platform;
      
// // //       if (platform === "darwin") {
// // //         executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// // //       } else if (platform === "win32") {
// // //         executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
// // //         // Also check alternative Windows paths
// // //         if (!existsSync(executablePath)) {
// // //           executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
// // //         }
// // //       } else {
// // //         executablePath = "/usr/bin/google-chrome";
// // //         // Also check other common Linux paths
// // //         if (!existsSync(executablePath)) {
// // //           executablePath = "/usr/bin/chromium-browser";
// // //         }
// // //       }
// // //     }

// // //     return {
// // //       executablePath: executablePath!,
// // //       args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
// // //       headless: true,
// // //       defaultViewport: { width: 1280, height: 800 },
// // //     };
// // //   }
// // // }

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     const body = await req.json();
// // //     const html = body?.html as string | undefined;
// // //     const resumeId = body?.resumeId as string | undefined;

// // //     if (!html || !resumeId) {
// // //       return NextResponse.json(
// // //         { success: false, message: "HTML and resumeId are required" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const config = await getChromiumConfig();

// // //     // Check if executable exists in development
// // //     if (!config.executablePath) {
// // //       return NextResponse.json(
// // //         { success: false, message: "Chrome executable not found" },
// // //         { status: 500 }
// // //       );
// // //     }

// // //     if (process.env.NODE_ENV === "development") {
// // //       if (!existsSync(config.executablePath)) {
// // //         console.warn(`Chrome not found at: ${config.executablePath}`);
// // //         return NextResponse.json(
// // //           { 
// // //             success: false, 
// // //             message: "Chrome not found. Please install Chrome or set CHROME_PATH environment variable.",
// // //             details: `Expected path: ${config.executablePath}`
// // //           },
// // //           { status: 500 }
// // //         );
// // //       }
// // //     }

// // //     console.log(`Launching Chrome from: ${config.executablePath}`);

// // //     const browser = await puppeteerCore.launch(config);
// // //     const page = await browser.newPage();
    
// // //     await page.setContent(html, { 
// // //       waitUntil: ["domcontentloaded", "networkidle0"] 
// // //     });

// // //     // Wait for fonts and resources
// // //     await page.evaluateHandle("document.fonts.ready");
// // //     await new Promise((resolve) => setTimeout(resolve, 500));

// // //     const pdfBuffer = await page.pdf({
// // //       format: "A4",
// // //       printBackground: true,
// // //       preferCSSPageSize: true,
// // //       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
// // //     });

// // //     await browser.close();

// // //     const nodeBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

// // //     // Save to MongoDB
// // //     const client = await clientPromise;
// // //     const db = client.db("MockMiya");
// // //     const collection = db.collection("resumes");

// // //     await collection.updateOne(
// // //       { id: resumeId },
// // //       { 
// // //         $set: { 
// // //           pdf: nodeBuffer, 
// // //           pdfGeneratedAt: new Date() 
// // //         } 
// // //       },
// // //       { upsert: true }
// // //     );

// // //     return new NextResponse(nodeBuffer as unknown as BodyInit, {
// // //       headers: {
// // //         "Content-Type": "application/pdf",
// // //         "Content-Disposition": 'attachment; filename="resume.pdf"',
// // //       },
// // //     });
// // //   } catch (err) {
// // //     console.error("PDF generation error:", err);
// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         message: "Failed to generate PDF",
// // //         detail: (err as Error).message,
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }










// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import puppeteer, { Browser, LaunchOptions, WaitForOptions } from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import clientPromise from "@/context/MongoDB/mongodb";

// export const runtime = "nodejs";

// // Safe setGraphicsMode for @sparticuz/chromium-min
// if ("setGraphicsMode" in chromium) {
//   (chromium as { setGraphicsMode: boolean }).setGraphicsMode = false;
// }

// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const body: { html?: string; resumeId?: string } = await req.json();
//     const html = body.html;
//     const resumeId = body.resumeId;

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🚀 Starting PDF generation...");

//     // Determine executablePath & args depending on environment
//     const isProd = process.env.NODE_ENV === "production";
//     const executablePath: string = isProd
//       ? await (chromium as { executablePath: () => Promise<string> }).executablePath()
//       : getLocalChromePath();

//     const args: string[] = isProd
//       ? ((chromium as { args: string[] }).args ?? [])
//       : [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-gpu",
//           "--no-first-run",
//           "--no-zygote",
//           "--single-process",
//         ];

//     console.log("🔧 Browser config:", { executablePath, env: process.env.NODE_ENV });

//     const launchOptions: LaunchOptions = {
//       args,
//       executablePath,
//       headless: true,
//       defaultViewport: { width: 1200, height: 800 },
//     };

//     browser = await puppeteer.launch(launchOptions);
//     const page = await browser.newPage();

//     page.setDefaultTimeout(60000);
//     page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     const waitUntilOptions: WaitForOptions = { waitUntil: "networkidle0" };
//     await page.setContent(html, waitUntilOptions);

//     console.log("⏳ Waiting for fonts and resources...");
//     await page.evaluate(async () => {
//       const doc = document as Document & { fonts?: FontFaceSet };
//       if (doc.fonts) await doc.fonts.ready;
//     });

//     await new Promise((r) => setTimeout(r, 750));

//     console.log("🖨️ Generating PDF...");
//     const pdfResult = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     // Always convert to Buffer (works for Buffer | Uint8Array)
//     const pdfBuffer = Buffer.from(pdfResult);
//     console.log("✅ PDF generated, size:", pdfBuffer.length);

//     console.log("💾 Saving PDF to MongoDB...");
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       {
//         $set: {
//           pdf: pdfBuffer,
//           pdfGeneratedAt: new Date(),
//           pdfSize: pdfBuffer.length,
//         },
//       },
//       { upsert: true }
//     );

//     console.log("🎉 PDF saved successfully!");

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (error: unknown) {
//     console.error("❌ PDF generation error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to generate PDF",
//         detail: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) {
//       try {
//         await browser.close();
//         console.log("🔒 Browser closed");
//       } catch (closeError) {
//         console.error("Error closing browser:", closeError);
//       }
//     }
//   }
// }

// function getLocalChromePath(): string {
//   if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

//   switch (process.platform) {
//     case "win32":
//       return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//     case "darwin":
//       return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//     case "linux":
//       return "/usr/bin/google-chrome-stable";
//     default:
//       return "/usr/bin/chromium-browser";
//   }
// }








// import { NextRequest, NextResponse } from "next/server";
// import puppeteer, { Browser, WaitForOptions } from "puppeteer-core";
// import chromium from "@sparticuz/chromium-min";
// import clientPromise from "@/context/MongoDB/mongodb";
// import { existsSync } from "fs";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const { html, resumeId }: { html?: string; resumeId?: string } = await req.json();

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🚀 Starting PDF generation...");

//     let executablePath: string;
//     let args: string[];

//     if (process.env.NODE_ENV === "production") {
//       // Production on Vercel: use sparticuz chromium
//       executablePath = await chromium.executablePath();
//       args = chromium.args ?? [];
//     } else {
//       // Local development: use installed Chrome
//       const platform = process.platform;
//       if (platform === "win32") {
//         executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//         if (!existsSync(executablePath)) {
//           executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//         }
//       } else if (platform === "darwin") {
//         executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//       } else {
//         executablePath = "/usr/bin/google-chrome-stable";
//         if (!existsSync(executablePath)) executablePath = "/usr/bin/chromium-browser";
//       }

//       if (!existsSync(executablePath)) {
//         return NextResponse.json(
//           { success: false, message: "Local Chrome not found. Set CHROME_PATH env variable." },
//           { status: 500 }
//         );
//       }

//       args = [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-gpu",
//         "--single-process",
//         "--no-zygote",
//         "--no-first-run",
//       ];
//     }

//     browser = await puppeteer.launch({
//       args,
//       executablePath,
//       headless: true,
//       defaultViewport: { width: 1200, height: 800 },
//     });

//     const page = await browser.newPage();
//     page.setDefaultTimeout(60000);
//     page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

//     console.log("⏳ Waiting for fonts...");
//     await page.evaluate(async () => {
//       if (document.fonts) await document.fonts.ready;
//     });
//     await new Promise(r => setTimeout(r, 1000));

//     console.log("🖨️ Generating PDF...");
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     console.log("✅ PDF generated, size:", pdfBuffer.length);

//     // Save to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       {
//         $set: {
//           pdf: pdfBuffer,
//           pdfGeneratedAt: new Date(),
//           pdfSize: pdfBuffer.length,
//         },
//       },
//       { upsert: true }
//     );

//     return new NextResponse(new Uint8Array(pdfBuffer), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to generate PDF", detail: err instanceof Error ? err.message : String(err) },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) {
//       try {
//         await browser.close();
//         console.log("🔒 Browser closed");
//       } catch (closeError) {
//         console.error("Error closing browser:", closeError);
//       }
//     }
//   }
// }



// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/context/MongoDB/mongodb";
// import { existsSync } from "fs";
// import type { Browser, Page, LaunchOptions } from "puppeteer-core";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const { html, resumeId }: { html?: string; resumeId?: string } = await req.json();

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🚀 Starting PDF generation...");

//     let launchOptions: LaunchOptions;
//     let puppeteerModule: typeof import("puppeteer-core");

//     if (process.env.NODE_ENV === "production") {
//       // Vercel: full puppeteer
//       puppeteerModule = await import("puppeteer") as unknown as typeof import("puppeteer-core");
//       launchOptions = {
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
//         defaultViewport: { width: 1200, height: 800 },
//       };
//     } else {
//       // Local: puppeteer-core
//       puppeteerModule = await import("puppeteer-core");
//       let executablePath = "";

//       if (process.platform === "win32") {
//         executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//         if (!existsSync(executablePath)) executablePath =
//           "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//       } else if (process.platform === "darwin") {
//         executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//       } else {
//         executablePath = "/usr/bin/google-chrome-stable";
//         if (!existsSync(executablePath)) executablePath = "/usr/bin/chromium-browser";
//       }

//       if (!existsSync(executablePath)) {
//         return NextResponse.json(
//           { success: false, message: "Local Chrome not found. Set CHROME_PATH env variable." },
//           { status: 500 }
//         );
//       }

//       launchOptions = {
//         headless: true,
//         executablePath,
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-gpu",
//           "--single-process",
//         ],
//         defaultViewport: { width: 1200, height: 800 },
//       };
//     }

//     // Launch browser
//     browser = await puppeteerModule.launch(launchOptions) as Browser;
//     const page: Page = await browser.newPage();
//     page.setDefaultTimeout(60000);
//     page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

//     console.log("⏳ Waiting for fonts inside browser...");
//     await page.evaluate(async () => document.fonts?.ready);
//     await new Promise((r) => setTimeout(r, 1000));

//     console.log("🖨️ Generating PDF...");
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     console.log("✅ PDF generated, size:", pdfBuffer.length);

//     // Save PDF to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date(), pdfSize: pdfBuffer.length } },
//       { upsert: true }
//     );

//     return new NextResponse(new Uint8Array(pdfBuffer), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to generate PDF", detail: err instanceof Error ? err.message : String(err) },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) await browser.close().catch(console.error);
//   }
// }






// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/context/MongoDB/mongodb";
// import { existsSync } from "fs";
// import type { Browser, Page, LaunchOptions } from "puppeteer-core";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const { html, resumeId }: { html?: string; resumeId?: string } = await req.json();

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🚀 Starting PDF generation...");

//     let launchOptions: LaunchOptions = {
//       headless: true,
//       args: [],
//       defaultViewport: { width: 1200, height: 800 },
//     };

//     let puppeteerModule: typeof import("puppeteer-core");
//     let exePath: string | undefined;

//     if (process.env.NODE_ENV === "production") {
//       // ✅ Production: Use puppeteer-core + @sparticuz/chromium-min
//       const chromiumImport = await import("@sparticuz/chromium-min");
//       const chromium = chromiumImport.default;
//       puppeteerModule = await import("puppeteer-core");

//       exePath = await chromium.executablePath();

//       // ✅ Dynamic fallback for Vercel /tmp (in case /var/task/... doesn’t exist)
//       if (!exePath || !existsSync(exePath)) {
//         console.warn("⚠️ chromium.executablePath() not found, using /tmp/chromium fallback");
//         exePath = "/tmp/chromium";
//       }

//       const headless: boolean = chromium.headless === "new" ? true : chromium.headless;

//       launchOptions = {
//         headless,
//         executablePath: exePath,
//         args: chromium.args.concat([
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//         ]),
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧠 Using serverless Chromium path:", exePath);
//     } else {
//       // ✅ Local development (Windows, macOS, Linux)
//       puppeteerModule = await import("puppeteer-core");

//       if (process.platform === "win32") {
//         exePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//         if (!existsSync(exePath))
//           exePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//       } else if (process.platform === "darwin") {
//         exePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//       } else {
//         exePath = "/usr/bin/google-chrome-stable";
//         if (!existsSync(exePath)) exePath = "/usr/bin/chromium-browser";
//       }

//       if (!existsSync(exePath)) {
//         const envPath = process.env.CHROME_PATH;
//         if (envPath && existsSync(envPath)) exePath = envPath;
//         else {
//           return NextResponse.json(
//             { success: false, message: "Local Chrome not found. Set CHROME_PATH env variable." },
//             { status: 500 }
//           );
//         }
//       }

//       launchOptions = {
//         headless: true,
//         executablePath: exePath,
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-gpu",
//           "--single-process",
//         ],
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧩 Using local Chrome path:", exePath);
//     }

//     // 🧠 Log final path before launching
//     console.log("🧠 Final chromium executable path:", exePath);

//     // 🚀 Launch browser
//     browser = (await puppeteerModule.launch(launchOptions)) as Browser;

//     const page: Page = await browser.newPage();
//     page.setDefaultTimeout(60000);
//     page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

//     console.log("⏳ Waiting for fonts inside browser...");
//     await page.evaluate(async () => document.fonts?.ready);
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     console.log("🖨️ Generating PDF...");
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     console.log("✅ PDF generated, size:", pdfBuffer.length);

//     // 💾 Save PDF to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date(), pdfSize: pdfBuffer.length } },
//       { upsert: true }
//     );

//     return new NextResponse(new Uint8Array(pdfBuffer), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to generate PDF",
//         detail: err instanceof Error ? err.message : String(err),
//       },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) await browser.close().catch(console.error);
//   }
// }











// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/context/MongoDB/mongodb";
// import fs from "fs";
// import type { Browser, Page, LaunchOptions } from "puppeteer-core";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const { html, resumeId }: { html?: string; resumeId?: string } = await req.json();

//     if (!html || !resumeId) {
//       return NextResponse.json({ success: false, message: "HTML and resumeId are required" }, { status: 400 });
//     }

//     console.log("🚀 Starting PDF generation...");

//     let launchOptions: LaunchOptions = {
//       headless: true,
//       args: [],
//       defaultViewport: { width: 1200, height: 800 },
//     };

//     let puppeteerModule: typeof import("puppeteer-core");
//     let exePath: string | undefined;

//     if (process.env.NODE_ENV === "production") {
//       // 🟢 Vercel / Production
//       const chromiumImport = await import("@sparticuz/chromium-min");
//       const chromium = chromiumImport.default;
//       puppeteerModule = await import("puppeteer-core");

//       exePath = await chromium.executablePath();

//       if (!exePath || !fs.existsSync(exePath)) {
//         console.error("❌ Chromium binary missing at runtime. Did you run install-chromium.js at build?");
//         return NextResponse.json({ success: false, message: "Chromium binary missing" }, { status: 500 });
//       }

//       launchOptions = {
//         headless: chromium.headless === "new" ? true : chromium.headless,
//         executablePath: exePath,
//         args: chromium.args.concat([
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//         ]),
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧠 Using serverless Chromium at:", exePath);
//     } else {
//       // 🟢 Local development
//       puppeteerModule = await import("puppeteer-core");

//       if (process.platform === "win32") {
//         exePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//         if (!fs.existsSync(exePath))
//           exePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//       } else if (process.platform === "darwin") {
//         exePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//       } else {
//         exePath = "/usr/bin/google-chrome-stable";
//         if (!fs.existsSync(exePath)) exePath = "/usr/bin/chromium-browser";
//       }

//       if (!fs.existsSync(exePath)) {
//         const envPath = process.env.CHROME_PATH;
//         if (envPath && fs.existsSync(envPath)) exePath = envPath;
//         else
//           return NextResponse.json(
//             { success: false, message: "Local Chrome not found. Set CHROME_PATH env variable." },
//             { status: 500 }
//           );
//       }

//       launchOptions = {
//         headless: true,
//         executablePath: exePath,
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-gpu",
//           "--single-process",
//         ],
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧩 Using local Chrome at:", exePath);
//     }

//     console.log("🧠 Final Chromium executable path:", exePath);

//     // Launch Puppeteer
//     browser = (await puppeteerModule.launch(launchOptions)) as Browser;
//     const page: Page = await browser.newPage();
//     page.setDefaultTimeout(60000);
//     page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

//     console.log("⏳ Waiting for fonts...");
//     await page.evaluate(async () => document.fonts?.ready);
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     console.log("🖨️ Generating PDF...");
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     console.log("✅ PDF generated, size:", pdfBuffer.length);

//     // Save PDF to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const collection = db.collection("resumes");

//     await collection.updateOne(
//       { id: resumeId },
//       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date(), pdfSize: pdfBuffer.length } },
//       { upsert: true }
//     );

//     return new NextResponse(new Uint8Array(pdfBuffer), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to generate PDF", detail: err instanceof Error ? err.message : String(err) },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) await browser.close().catch(console.error);
//   }
// }














// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/context/MongoDB/mongodb";
// import fs from "fs";
// import path from "path";
// import type { Browser } from "puppeteer-core";

// export const runtime = "nodejs";

// /** Minimal typed shape for sparticuz exports we use */
// interface SparticuzChromiumShape {
//   executablePath?: string | (() => Promise<string>);
//   args?: string[];
//   headless?: boolean | "new";
//   defaultViewport?: { width: number; height: number };
//   setGraphicsMode?: (v: boolean) => void;
// }

// // Global type declarations - moved outside the function
// declare global {
//   var __puppeteerBrowserToClose__: Browser[] | undefined;
// }

// /** Utility: find likely chrome binary filenames under a directory */
// function findChromeBinary(startDir: string, depth = 3): string | null {
//   const candidates = ["chrome", "chrome-linux", "headless_shell", "chrome.exe", "chromium", "chromium-browser"];
//   let found: string | null = null;

//   function _walk(dir: string, currentDepth: number) {
//     if (found || currentDepth > depth) return;
//     let entries: string[] = [];
//     try {
//       entries = fs.readdirSync(dir);
//     } catch {
//       return;
//     }
//     for (const e of entries) {
//       if (found) return;
//       const full = path.join(dir, e);
//       let stat: fs.Stats;
//       try {
//         stat = fs.statSync(full);
//       } catch {
//         continue;
//       }
//       if (stat.isFile() || stat.isSymbolicLink()) {
//         const lower = e.toLowerCase();
//         if (candidates.some((c) => lower.includes(c))) {
//           found = full;
//           return;
//         }
//       } else if (stat.isDirectory()) {
//         _walk(full, currentDepth + 1);
//       }
//     }
//   }

//   _walk(startDir, 0);
//   return found;
// }

// /** Copy directory into /tmp once; return dest path */
// function copyToTmp(srcDir: string, destName = "chromium-runtime"): string {
//   const dest = path.join("/tmp", destName);
//   if (!fs.existsSync(dest)) {
//     fs.cpSync(srcDir, dest, { recursive: true });
//   }
//   return dest;
// }

// /** Cached exec path for cold-start reuse */
// let CACHED_SERVERLESS_EXEC_PATH: string | null = null;

// async function getServerlessExecPath(): Promise<string | null> {
//   if (CACHED_SERVERLESS_EXEC_PATH) return CACHED_SERVERLESS_EXEC_PATH;

//   // import module as unknown to avoid structural typing conflicts
//   const chromiumModuleUnknown = (await import("@sparticuz/chromium-min")) as unknown;
//   const maybeModule = ((chromiumModuleUnknown as { default?: unknown }).default ?? chromiumModuleUnknown) as unknown;
//   const chromium = maybeModule as SparticuzChromiumShape;

//   let possiblePath: string | undefined;
//   try {
//     if (typeof chromium.executablePath === "function") {
//       possiblePath = await chromium.executablePath();
//     } else if (typeof chromium.executablePath === "string") {
//       possiblePath = chromium.executablePath;
//     }
//   } catch {
//     possiblePath = undefined;
//   }

//   if (possiblePath && fs.existsSync(possiblePath)) {
//     const st = fs.statSync(possiblePath);
//     if (st.isFile()) {
//       CACHED_SERVERLESS_EXEC_PATH = possiblePath;
//       return CACHED_SERVERLESS_EXEC_PATH;
//     }
//     if (st.isDirectory()) {
//       const tmpCopied = copyToTmp(possiblePath, "sparticuz-chromium");
//       const bin = findChromeBinary(tmpCopied, 5);
//       if (bin && fs.existsSync(bin)) {
//         CACHED_SERVERLESS_EXEC_PATH = bin;
//         return CACHED_SERVERLESS_EXEC_PATH;
//       }
//     }
//   }

//   // fallback: copy package dir if present
//   const pkgDirCandidate = path.join(process.cwd(), "node_modules", "@sparticuz", "chromium-min");
//   if (fs.existsSync(pkgDirCandidate)) {
//     const tmpCopied = copyToTmp(pkgDirCandidate, "sparticuz-chromium-fallback");
//     const bin = findChromeBinary(tmpCopied, 5);
//     if (bin && fs.existsSync(bin)) {
//       CACHED_SERVERLESS_EXEC_PATH = bin;
//       return CACHED_SERVERLESS_EXEC_PATH;
//     }
//   }

//   return null;
// }

// /** Returns typical local Chrome path depending on OS (used for dev) */
// function getLocalChromePath(): string | null {
//   const envPath = process.env.CHROME_PATH;
//   if (envPath && fs.existsSync(envPath)) return envPath;

//   const platform = process.platform;
//   if (platform === "win32") {
//     let p = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//     if (fs.existsSync(p)) return p;
//     p = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
//     if (fs.existsSync(p)) return p;
//     return null;
//   }
//   if (platform === "darwin") {
//     const p = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
//     return fs.existsSync(p) ? p : null;
//   }
//   // linux candidates
//   const linuxCandidates = [
//     "/usr/bin/google-chrome-stable",
//     "/usr/bin/google-chrome",
//     "/usr/bin/chromium-browser",
//     "/usr/bin/chromium",
//   ];
//   for (const c of linuxCandidates) {
//     if (fs.existsSync(c)) return c;
//   }
//   return null;
// }

// /** POST handler: generate PDF from HTML using puppeteer-core and save to MongoDB */
// export async function POST(req: NextRequest) {
//   let browser: Browser | null = null;

//   try {
//     const body = (await req.json()) as { html?: string; resumeId?: string };
//     const html = body?.html;
//     const resumeId = body?.resumeId;

//     if (!html || !resumeId) {
//       return NextResponse.json({ success: false, message: "HTML and resumeId are required" }, { status: 400 });
//     }

//     console.log("🚀 Starting PDF generation...");

//     const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

//     // statically import puppeteer-core (must be in dependencies)
//     const puppeteerModule = await import("puppeteer-core");
//     const puppeteer = puppeteerModule.default || puppeteerModule;

//     let launchOptions: Parameters<typeof puppeteer.launch>[0] = {
//       headless: true,
//       args: [],
//       defaultViewport: { width: 1200, height: 800 },
//     };

//     if (isProd) {
//       console.log("🟢 Production detected — locating serverless chromium runtime");
//       const execPath = await getServerlessExecPath();
//       if (!execPath) {
//         console.error("❌ Chromium binary not found for serverless runtime.");
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Chromium binary missing in serverless function. Ensure @sparticuz/chromium-min was installed at build time and included in the deployed artifact.",
//           },
//           { status: 500 }
//         );
//       }

//       launchOptions = {
//         headless: true,
//         executablePath: execPath,
//         args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧠 Using serverless Chromium at:", execPath);
//     } else {
//       console.log("🟢 Development detected — locating local Chrome");
//       const localPath = getLocalChromePath();
//       if (!localPath) {
//         return NextResponse.json(
//           { success: false, message: "Local Chrome not found. Set CHROME_PATH or install Chrome." },
//           { status: 500 }
//         );
//       }

//       launchOptions = {
//         headless: true,
//         executablePath: localPath,
//         args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
//         defaultViewport: { width: 1200, height: 800 },
//       };

//       console.log("🧩 Using local Chrome at:", localPath);
//     }

//     console.log("🧠 Launching browser...");
//     browser = await puppeteer.launch(launchOptions);

//     // Initialize global browser tracking array if it doesn't exist
//     if (!global.__puppeteerBrowserToClose__) {
//       global.__puppeteerBrowserToClose__ = [];
//     }
//     global.__puppeteerBrowserToClose__.push(browser);

//     const page = await browser.newPage();
//     await page.setDefaultTimeout(60000);
//     await page.setDefaultNavigationTimeout(60000);

//     console.log("📄 Setting HTML content...");
//     await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

//     console.log("⏳ Waiting for fonts and web resources...");
//     await page.evaluate(async () => {
//       const doc = document as unknown as { fonts?: FontFaceSet };
//       if (doc.fonts) await doc.fonts.ready;
//     });
//     await new Promise((r) => setTimeout(r, 800));

//     console.log("🖨️ Generating PDF...");
//     const pdfResult = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//     });

//     const pdfBuffer = Buffer.from(pdfResult);
//     console.log("✅ PDF generated, bytes:", pdfBuffer.length);

//     // Save to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const resumes = db.collection("resumes");
//     await resumes.updateOne(
//       { id: resumeId },
//       { $set: { pdf: pdfBuffer, pdfGeneratedAt: new Date(), pdfSize: pdfBuffer.length } },
//       { upsert: true }
//     );

//     // Remove this browser from the global close queue
//     if (global.__puppeteerBrowserToClose__ && browser) {
//       global.__puppeteerBrowserToClose__ = global.__puppeteerBrowserToClose__.filter((b) => b !== browser);
//     }

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfBuffer.length),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to generate PDF",
//         detail: err instanceof Error ? err.message : String(err),
//       },
//       { status: 500 }
//     );
//   } finally {
//     try {
//       // Close tracked browsers
//       if (global.__puppeteerBrowserToClose__ && Array.isArray(global.__puppeteerBrowserToClose__)) {
//         for (const b of global.__puppeteerBrowserToClose__) {
//           try {
//             await b.close();
//           } catch {
//             // ignore close errors
//           }
//         }
//         global.__puppeteerBrowserToClose__ = [];
//       }
//     } catch {
//       /* swallow finalizer errors */
//     }
//   }
// }




// // src/app/resume/api/pdf/save-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/context/MongoDB/mongodb";

// export const runtime = "nodejs";

// interface PDFRequest {
//   html?: string;
//   resumeId?: string;
// }

// interface PDFServiceResponse {
//   success: boolean;
//   message?: string;
//   detail?: string;
// }

// /** PDF styling helper */
// function getPDFStyles(): string {
//   return `
//     body { 
//       margin: 0; 
//       padding: 0; 
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//       line-height: 1.4;
//       -webkit-print-color-adjust: exact !important;
//       print-color-adjust: exact !important;
//     }
//     .flex { display: flex !important; }
//     .flex-col { flex-direction: column !important; }
//     .flex-row { flex-direction: row !important; }
//     .justify-between { justify-content: space-between !important; }
//     .items-center { align-items: center !important; }
//     .flex-wrap { flex-wrap: wrap !important; }
//     .gap-1 { gap: 4px !important; }
//     .gap-2 { gap: 8px !important; }
//     .gap-4 { gap: 16px !important; }
//     .space-y-1 > * + * { margin-top: 4px !important; }
//     .space-y-2 > * + * { margin-top: 8px !important; }
//     .space-y-4 > * + * { margin-top: 16px !important; }
//     .space-y-6 > * + * { margin-top: 24px !important; }
    
//     /* Print optimizations */
//     @media print {
//       * { 
//         -webkit-print-color-adjust: exact !important; 
//         print-color-adjust: exact !important; 
//       }
//     }
//   `;
// }

// /** Fallback to puppeteer for development */
// async function generatePDFWithPuppeteerFallback(html: string, resumeId: string): Promise<NextResponse> {
//   console.log("🔧 Using puppeteer fallback for development...");
  
//   const puppeteer = await import("puppeteer");
//   const browser = await puppeteer.default.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });

//   // puppeteer.page.pdf() returns Uint8Array, not Buffer
//   const pdfUint8Array = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
//   });

//   await browser.close();

//   // Convert to Buffer for MongoDB storage
//   const pdfBuffer = Buffer.from(pdfUint8Array);

//   // Save to MongoDB
//   const client = await clientPromise;
//   const db = client.db("MockMiya");
//   const resumes = db.collection("resumes");
//   await resumes.updateOne(
//     { id: resumeId },
//     { 
//       $set: { 
//         pdf: pdfBuffer, 
//         pdfGeneratedAt: new Date(), 
//         pdfSize: pdfBuffer.length,
//         pdfGeneratedBy: "puppeteer-fallback"
//       } 
//     },
//     { upsert: true }
//   );

//   // ✅ FIXED: Create a new ArrayBuffer from Uint8Array to avoid SharedArrayBuffer issues
//   const pdfArrayBuffer = new ArrayBuffer(pdfUint8Array.length);
//   const view = new Uint8Array(pdfArrayBuffer);
//   view.set(pdfUint8Array);
  
//   return new NextResponse(pdfArrayBuffer, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//       "Content-Length": String(pdfArrayBuffer.byteLength),
//     },
//   });
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   let requestBody: PDFRequest;

//   try {
//     requestBody = await req.json() as PDFRequest;
//     const { html, resumeId } = requestBody;

//     if (!html || !resumeId) {
//       return NextResponse.json(
//         { success: false, message: "HTML and resumeId are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🚀 Starting PDF generation via external service...");

//     // Use environment variables for PDF service
//     const pdfServiceUrl = process.env.PDF_SERVICE_URL || "https://api.pdfshift.io/v3/convert/pdf";
//     const apiKey = process.env.PDF_SERVICE_API_KEY || "sk_c11c6459be4c94a7fdaa95956df3649fee67fd17";

//     if (!apiKey) {
//       // Fallback to simple puppeteer in development
//       if (process.env.NODE_ENV === "development") {
//         return await generatePDFWithPuppeteerFallback(html, resumeId);
//       }
      
//       return NextResponse.json(
//         { success: false, message: "PDF service API key not configured" },
//         { status: 500 }
//       );
//     }

//     // Prepare HTML with proper styling
//     const styledHtml = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//           <style>
//             ${getPDFStyles()}
//             @media print {
//               body { margin: 0; padding: 0; }
//               * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//             }
//           </style>
//         </head>
//         <body>
//           ${html}
//         </body>
//       </html>
//     `;

//     // PDFShift parameters
//     const pdfShiftPayload = {
//       source: styledHtml,
//       format: "A4",
//       margin: "10px",
//       css: getPDFStyles(),
//       sandbox: false,
//       landscape: false,
//       use_print_media: true,
//       media_type: "print",
//     };

//     console.log("📤 Calling PDFShift API...");

//     // Call external PDF service
//     const response = await fetch(pdfServiceUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-API-Key": apiKey,
//       },
//       body: JSON.stringify(pdfShiftPayload),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ PDF service error:", errorText);
      
//       // Fallback to puppeteer in development
//       if (process.env.NODE_ENV === "development") {
//         console.log("🔄 Falling back to puppeteer for development...");
//         return await generatePDFWithPuppeteerFallback(html, resumeId);
//       }
      
//       throw new Error(`PDF service returned ${response.status}: ${errorText}`);
//     }

//     // Get the PDF as ArrayBuffer
//     const pdfArrayBuffer = await response.arrayBuffer();
    
//     console.log("✅ PDF generated via external service, bytes:", pdfArrayBuffer.byteLength);

//     // Convert to Buffer for MongoDB storage
//     const pdfBuffer = Buffer.from(pdfArrayBuffer);
    
//     // Save to MongoDB
//     const client = await clientPromise;
//     const db = client.db("MockMiya");
//     const resumes = db.collection("resumes");
//     await resumes.updateOne(
//       { id: resumeId },
//       { 
//         $set: { 
//           pdf: pdfBuffer, 
//           pdfGeneratedAt: new Date(), 
//           pdfSize: pdfBuffer.length,
//           pdfGeneratedBy: "pdfshift-service"
//         } 
//       },
//       { upsert: true }
//     );

//     // Return the PDF as regular ArrayBuffer (not ArrayBufferLike)
//     return new NextResponse(pdfArrayBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
//         "Content-Length": String(pdfArrayBuffer.byteLength),
//       },
//     });
//   } catch (err: unknown) {
//     console.error("❌ PDF generation error:", err);
    
//     // Final fallback for development
//     if (process.env.NODE_ENV === "development" && requestBody!) {
//       try {
//         return await generatePDFWithPuppeteerFallback(requestBody.html!, requestBody.resumeId!);
//       } catch (fallbackError) {
//         console.error("❌ Fallback also failed:", fallbackError);
//       }
//     }
    
//     const errorResponse: PDFServiceResponse = {
//       success: false,
//       message: "Failed to generate PDF",
//       detail: err instanceof Error ? err.message : String(err),
//     };

//     return NextResponse.json(errorResponse, { status: 500 });
//   }
// }






// src/app/resume/api/pdf/save-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/context/MongoDB/mongodb";

export const runtime = "nodejs";

interface PDFRequest {
  html?: string;
  resumeId?: string;
}

interface PDFServiceResponse {
  success: boolean;
  message?: string;
  detail?: string;
}

/** PDF styling helper */
function getPDFStyles(): string {
  return `
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.4;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .flex { display: flex !important; }
    .flex-col { flex-direction: column !important; }
    .flex-row { flex-direction: row !important; }
    .justify-between { justify-content: space-between !important; }
    .items-center { align-items: center !important; }
    .flex-wrap { flex-wrap: wrap !important; }
    .gap-1 { gap: 4px !important; }
    .gap-2 { gap: 8px !important; }
    .gap-4 { gap: 16px !important; }
    .space-y-1 > * + * { margin-top: 4px !important; }
    .space-y-2 > * + * { margin-top: 8px !important; }
    .space-y-4 > * + * { margin-top: 16px !important; }
    .space-y-6 > * + * { margin-top: 24px !important; }
    
    /* Print optimizations */
    @media print {
      * { 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
      }
    }
  `;
}

/** Fallback to puppeteer for development */
async function generatePDFWithPuppeteerFallback(html: string, resumeId: string): Promise<NextResponse> {
  console.log("🔧 Using puppeteer fallback for development...");
  
  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfUint8Array = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
  });

  await browser.close();

  // Convert to Buffer for MongoDB storage
  const pdfBuffer = Buffer.from(pdfUint8Array);

  // Save to MongoDB
  const client = await clientPromise;
  const db = client.db("MockMiya");
  const resumes = db.collection("resumes");
  await resumes.updateOne(
    { id: resumeId },
    { 
      $set: { 
        pdf: pdfBuffer, 
        pdfGeneratedAt: new Date(), 
        pdfSize: pdfBuffer.length,
        pdfGeneratedBy: "puppeteer-fallback"
      } 
    },
    { upsert: true }
  );

  // Create a new ArrayBuffer from Uint8Array
  const pdfArrayBuffer = new ArrayBuffer(pdfUint8Array.length);
  const view = new Uint8Array(pdfArrayBuffer);
  view.set(pdfUint8Array);
  
  return new NextResponse(pdfArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
      "Content-Length": String(pdfArrayBuffer.byteLength),
    },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let requestBody: PDFRequest;

  try {
    requestBody = await req.json() as PDFRequest;
    const { html, resumeId } = requestBody;

    if (!html || !resumeId) {
      return NextResponse.json(
        { success: false, message: "HTML and resumeId are required" },
        { status: 400 }
      );
    }

    console.log("🚀 Starting PDF generation via external service...");

    // Use environment variables for PDF service
    const pdfServiceUrl = process.env.PDF_SERVICE_URL || "https://api.pdfshift.io/v3/convert/pdf";
    const apiKey = process.env.PDF_SERVICE_API_KEY || "sk_c11c6459be4c94a7fdaa95956df3649fee67fd17";

    if (!apiKey) {
      // Fallback to simple puppeteer in development
      if (process.env.NODE_ENV === "development") {
        return await generatePDFWithPuppeteerFallback(html, resumeId);
      }
      
      return NextResponse.json(
        { success: false, message: "PDF service API key not configured" },
        { status: 500 }
      );
    }

    // Prepare HTML with proper styling
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            ${getPDFStyles()}
            @media print {
              body { margin: 0; padding: 0; }
              * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // ✅ FIXED: Use only valid PDFShift parameters
    // According to PDFShift documentation, these are the valid parameters:
    const pdfShiftPayload = {
      source: styledHtml,
      format: "A4",
      margin: "10px",
      css: getPDFStyles(),
      sandbox: false,
      landscape: false,
      // Remove invalid parameters: use_print_media, media_type
    };

    console.log("📤 Calling PDFShift API with valid parameters...");

    // Call external PDF service
    const response = await fetch(pdfServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(pdfShiftPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ PDF service error:", errorText);
      
      // Fallback to puppeteer in development
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Falling back to puppeteer for development...");
        return await generatePDFWithPuppeteerFallback(html, resumeId);
      }
      
      throw new Error(`PDF service returned ${response.status}: ${errorText}`);
    }

    // Get the PDF as ArrayBuffer
    const pdfArrayBuffer = await response.arrayBuffer();
    
    console.log("✅ PDF generated via external service, bytes:", pdfArrayBuffer.byteLength);

    // Convert to Buffer for MongoDB storage
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    
    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("MockMiya");
    const resumes = db.collection("resumes");
    await resumes.updateOne(
      { id: resumeId },
      { 
        $set: { 
          pdf: pdfBuffer, 
          pdfGeneratedAt: new Date(), 
          pdfSize: pdfBuffer.length,
          pdfGeneratedBy: "pdfshift-service"
        } 
      },
      { upsert: true }
    );

    // Return the PDF as regular ArrayBuffer
    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
        "Content-Length": String(pdfArrayBuffer.byteLength),
      },
    });
  } catch (err: unknown) {
    console.error("❌ PDF generation error:", err);
    
    // Final fallback for development
    if (process.env.NODE_ENV === "development" && requestBody!) {
      try {
        return await generatePDFWithPuppeteerFallback(requestBody.html!, requestBody.resumeId!);
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
      }
    }
    
    const errorResponse: PDFServiceResponse = {
      success: false,
      message: "Failed to generate PDF",
      detail: err instanceof Error ? err.message : String(err),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}