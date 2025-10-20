// src/utils/saveResumePDF.ts


export const exportSaveResumeHandler = async (resumeId: string) => {
  const templateElement = document.getElementById("resume-template");
  if (!templateElement) return alert("Resume template not found");

  // Get all computed styles
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
        <meta charset="utf-8" />
        <style>
          ${styles}

          /* Force flex/grid layout for PDF */
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
        </style>
      </head>
      <body>
        ${templateElement.outerHTML}
      </body>
    </html>
  `;

  // ✅ Send HTML + resumeId to backend for PDF generation & DB save
  const response = await fetch("/resume/api/pdf/save-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, resumeId }),
  });

  if (!response.ok) throw new Error("PDF export failed");

  // console.log("✅ PDF generated and saved in MongoDB!");
};



