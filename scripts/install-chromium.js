// scripts/install-chromium.js
import fs from "fs";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

if (isProd) {
  console.log("🧩 Production environment detected — verifying @sparticuz/chromium-min files...");

  const chromiumPath = "/var/task/node_modules/@sparticuz/chromium-min/bin";

  if (fs.existsSync(chromiumPath)) {
    console.log("✅ Chromium-min binary found:", chromiumPath);
  } else {
    console.warn("⚠️ Chromium-min binary not found, but it will be auto-loaded at runtime.");
  }
} else {
  console.log("ℹ️ Skipping Chromium install (local dev detected)");
}
