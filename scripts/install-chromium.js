// scripts/install-chromium.js
const { execSync } = require("child_process");

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

if (isProd) {
  console.log("🧩 Installing @sparticuz/chromium-min for production...");
  try {
    execSync("npx @sparticuz/chromium-min@latest install", { stdio: "inherit" });
    console.log("✅ Chromium installed successfully");
  } catch (err) {
    console.error("❌ Failed to install @sparticuz/chromium-min:", err);
  }
} else {
  console.log("ℹ️ Skipping Chromium install (local dev detected)");
}
