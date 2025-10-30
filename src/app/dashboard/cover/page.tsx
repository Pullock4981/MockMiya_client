"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";
import PrivateRoute from "@/app/Routes/PrivateRoute";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';

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
  const [wordCount, setWordCount] = useState<number>(0);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showErrorAlert = (title: string, message: string) => {
    console.error(`❌ ${title}:`, message);
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#dc2626',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonText: 'OK',
      timer: 6000
    });
  };

  const showSuccessAlert = (title: string, message?: string) => {
    console.log(`✅ ${title}`, message || '');
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#059669',
      background: '#1f2937',
      color: '#f9fafb',
      timer: 4000
    });
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Generating Cover Letter...',
      html: `
        <div style="text-align: center;">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-300">AI is crafting your professional cover letter</p>
          <p class="text-sm text-gray-400 mt-2">This usually takes 10-20 seconds</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#1f2937',
      color: '#f9fafb'
    });
  };

  const closeLoadingAlert = () => {
    Swal.close();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setCoverLetter("");

    console.log("🔄 Starting cover letter generation:", formData);

    // Validate form before submission
    const missingFields = [];
    if (!formData.name.trim()) missingFields.push("Name");
    if (!formData.jobTitle.trim()) missingFields.push("Job Title");
    if (!formData.companyName.trim()) missingFields.push("Company Name");
    if (!formData.skills.trim()) missingFields.push("Skills");
    if (!formData.experience.trim()) missingFields.push("Experience");

    if (missingFields.length > 0) {
      showErrorAlert(
        "Missing Information", 
        `Please fill in all required fields: ${missingFields.join(', ')}`
      );
      setLoading(false);
      return;
    }

    // Additional validation
    if (formData.skills.trim().length < 10) {
      showErrorAlert(
        "Skills Too Short",
        "Please provide more details about your skills (at least 10 characters)."
      );
      setLoading(false);
      return;
    }

    if (formData.experience.trim().length < 20) {
      showErrorAlert(
        "Experience Too Brief",
        "Please provide more details about your experience (at least 20 characters)."
      );
      setLoading(false);
      return;
    }

    showLoadingAlert();

    try {
      console.log("📤 Making API request to /api/generate/cover");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch("/api/generate/cover", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📥 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}`,
          details: response.statusText
        }));
        
        console.error("❌ API Error Response:", errorData);
        throw new Error(errorData.details || errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 API Response data received");

      if (!data.text || data.text.trim().length === 0) {
        throw new Error("The AI service returned an empty response.");
      }

      setCoverLetter(data.text);
      const words = data.text.split(/\s+/).filter((word: string) => word.length > 0).length;
      setWordCount(words);
      
      console.log("✅ Cover letter generated successfully:", {
        length: data.text.length,
        words: words
      });
      
      closeLoadingAlert();
      showSuccessAlert(
        "Success! 🎉", 
        `Your ${words}-word professional cover letter is ready.`
      );

    } catch (error: any) {
      console.error("❌ Cover letter generation failed:", {
        name: error?.name,
        message: error?.message
      });

      closeLoadingAlert();

      let userMessage = "Failed to generate cover letter. Please try again.";
      
      if (error.name === 'AbortError') {
        userMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message.includes("Model unavailable")) {
        userMessage = "AI service is temporarily unavailable. Please try again in a few minutes.";
      } else if (error.message.includes("Service limit reached")) {
        userMessage = "We've reached our service limit for now. Please try again later.";
      } else if (error.message.includes("Access denied")) {
        userMessage = "Service configuration issue. Please contact support if this continues.";
      } else if (error.message.includes("Network error") || error.message.includes("Failed to fetch")) {
        userMessage = "Network connection issue. Please check your internet and try again.";
      } else if (error.message.includes("Empty response")) {
        userMessage = "The AI didn't generate any content. Please try again with different details.";
      }

      showErrorAlert("Generation Failed", userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetter) {
      showErrorAlert("No Content", "Please generate a cover letter first.");
      return;
    }

    try {
      console.log("📄 Starting PDF generation");
      
      const doc = new jsPDF();
      
      // Add professional styling
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      
      // Header
      doc.text("COVER LETTER", 105, 30, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Content
      doc.setFontSize(11);
      doc.setTextColor(33, 37, 41);
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      
      const lines = doc.splitTextToSize(coverLetter, maxWidth);
      let yPosition = 50;
      
      for (let i = 0; i < lines.length; i++) {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(lines[i], margin, yPosition);
        yPosition += 6;
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated by CoverAI - ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });
      
      const fileName = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Cover_Letter.pdf`;
      doc.save(fileName);
      
      console.log("✅ PDF downloaded successfully:", fileName);
      showSuccessAlert("PDF Downloaded", "Your cover letter has been saved as PDF.");

    } catch (error) {
      console.error("❌ PDF download failed:", error);
      showErrorAlert(
        "Download Failed", 
        "Failed to create PDF. Please try the text download option."
      );
    }
  };

  const handleDownloadText = () => {
    if (!coverLetter) {
      showErrorAlert("No Content", "Please generate a cover letter first.");
      return;
    }

    try {
      console.log("📝 Starting text download");
      
      const textContent = `COVER LETTER\n\n${coverLetter}\n\n---\nGenerated by CoverAI - ${new Date().toLocaleDateString()}`;
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Cover_Letter.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("✅ Text file downloaded successfully");
      showSuccessAlert("Text File Saved", "Your cover letter has been downloaded.");

    } catch (error) {
      console.error("❌ Text download failed:", error);
      showErrorAlert(
        "Download Failed", 
        "Failed to download text file. Please check your browser permissions."
      );
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cover Letter Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create a professional cover letter tailored to your dream job
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Senior Developer"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Tech Company Inc."
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Skills *
                </label>
                <textarea
                  name="skills"
                  placeholder="JavaScript, React, Node.js, Team Leadership, Project Management..."
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Experience *
                </label>
                <textarea
                  name="experience"
                  placeholder="5+ years in software development, led a team of 5 developers, delivered multiple successful projects..."
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating Cover Letter...
                  </div>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </form>

            {/* Results Section */}
            {coverLetter && (
              <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>📄</span>
                    Your Cover Letter
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {wordCount} words
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                    {coverLetter}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={handleDownloadPDF}
                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    📥 Download PDF
                  </Button>
                  <Button
                    onClick={handleDownloadText}
                    variant="outline"
                    className="flex-1 h-11 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    📝 Download Text
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}