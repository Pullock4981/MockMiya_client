"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";

interface FormData {
  name: string;
  jobTitle: string;
  companyName: string;
  skills: string;
  experience: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    jobTitle: "",
    companyName: "",
    skills: "",
    experience: "",
  });
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setCoverLetter("");

    try {
      const response = await fetch("/api/generate/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: { text?: string; error?: string } = await response.json();

      if (response.ok && data.text) {
        setCoverLetter(data.text);
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to generate cover letter:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetter) return;
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(coverLetter, 10, 20, { maxWidth: 190 });
    doc.save("cover_letter.pdf");
  };

  const handleDownloadText = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "cover_letter.txt";
    link.click();
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 rounded-2xl shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Cover Letter Generator 🤖
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title You're Applying For"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <textarea
            name="skills"
            placeholder="Your Key Skills (e.g., JavaScript, Project Management)"
            value={formData.skills}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          <textarea
            name="experience"
            placeholder="Briefly describe your relevant experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>

        {/* Generated Cover Letter */}
        {coverLetter && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">
              Your Generated Cover Letter 📄
            </h2>
            <p className="whitespace-pre-wrap">{coverLetter}</p>

            {/* Download Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
              >
                Download PDF
              </button>
              <button
                onClick={handleDownloadText}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Download TXT
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
