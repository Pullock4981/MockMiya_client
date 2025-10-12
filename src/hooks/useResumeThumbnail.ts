"use client";

import { useState, useCallback } from "react";

export interface GenerateThumbnailParams {
  elementId: string;
  resumeId: string;
  userEmail: string;
}

export function useResumeThumbnail() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateThumbnail = useCallback(
    async ({ elementId, resumeId, userEmail }: GenerateThumbnailParams) => {
      console.log("🖼️ generateThumbnail called:", { elementId, resumeId, userEmail });

      if (!resumeId || !userEmail) {
        setError("Resume ID or User Email missing");
        console.error("❌ Missing resumeId or userEmail");
        return null;
      }

      const element = document.getElementById(elementId);
      if (!element) {
        setError("Resume element not found in DOM");
        console.error("❌ Element not found:", elementId);
        return null;
      }

      setGenerating(true);
      setError(null);

      try {
        // Collect all CSS
        const styles = Array.from(document.styleSheets)
          .map((sheet) => {
            try {
              return Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join("");
            } catch {
              return "";
            }
          })
          .join("");

        const html = `
          <html>
            <head>
              <meta charset="utf-8"/>
              <style>${styles} body { margin:0; background:#fff; }</style>
            </head>
            <body>${element.outerHTML}</body>
          </html>
        `;

        console.log("📄 HTML length for thumbnail:", html.length);

        const response = await fetch("/resume/api/export-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ html, resumeId, userEmail }),
        });

        console.log("🌐 Thumbnail API response:", response.status);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Thumbnail API failed: ${text}`);
        }

        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("❌ generateThumbnail error:", msg);
        setError(msg);
        return null;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  return { generateThumbnail, generating, error };
}
