"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf"; // 📄 For PDF export

// Define a type for our form data
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

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setCoverLetter("");

    try {
      const response = await fetch("/api/generate/cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 📄 Export to PDF
  const handleDownloadPDF = () => {
    if (!coverLetter) return;
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(coverLetter, 10, 20, { maxWidth: 190 });
    doc.save("cover_letter.pdf");
  };

  // 📝 Export to Text File
  const handleDownloadText = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "cover_letter.txt";
    link.click();
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Cover Letter Generator 🤖
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-black"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title You're Applying For"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg"
          />
          <textarea
            name="skills"
            placeholder="Your Key Skills (e.g., JavaScript, Project Management)"
            value={formData.skills}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg h-24"
          />
          <textarea
            name="experience"
            placeholder="Briefly describe your relevant experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg h-24"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition"
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>

        {/* Generated Cover Letter */}
        {coverLetter && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">
              Your Generated Cover Letter 📄
            </h2>
            <p className="whitespace-pre-wrap">{coverLetter}</p>

            {/* Download Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                Download PDF
              </button>
              <button
                onClick={handleDownloadText}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
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
