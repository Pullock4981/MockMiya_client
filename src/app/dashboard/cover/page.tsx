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
      timer: 5000
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
      timer: 3000
    });
  };

  const showWarningAlert = (title: string, message: string) => {
    console.warn(`⚠️ ${title}:`, message);
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonColor: '#d97706',
      background: '#1f2937',
      color: '#f9fafb'
    });
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: 'Generating Cover Letter...',
      text: 'Please wait while we create your professional cover letter',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
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

    console.log("🔄 Starting cover letter generation with data:", formData);

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
        `Please fill in the following fields: ${missingFields.join(', ')}`
      );
      setLoading(false);
      return;
    }

    showLoadingAlert();

    try {
      console.log("📤 Making API request to /api/generate/cover");
      
      const response = await fetch("/api/generate/cover", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("📥 API Response status:", response.status);

      const data = await response.json();
      console.log("📥 API Response data:", data);

      if (!response.ok) {
        // Enhanced error message extraction
        const errorDetails = data.details || data.error || `Server responded with status: ${response.status}`;
        console.error("❌ API Error Response:", errorDetails);
        throw new Error(errorDetails);
      }

      if (data.text && data.text.trim().length > 0) {
        setCoverLetter(data.text);
        console.log("✅ Cover letter generated successfully, length:", data.text.length);
        closeLoadingAlert();
        showSuccessAlert(
          "Success!", 
          "Your professional cover letter has been generated successfully."
        );
      } else {
        throw new Error("The AI returned an empty response. Please try again.");
      }

    } catch (error: any) {
      console.error("❌ Cover letter generation failed:", {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });

      closeLoadingAlert();

      // Enhanced error handling with specific messages
      const errorMessage = error.message || "Failed to generate cover letter";
      
      if (errorMessage.includes("Model Not Available")) {
        showErrorAlert(
          "Service Temporarily Unavailable",
          "The AI service is currently undergoing maintenance. Please try again in a few minutes."
        );
      } else if (errorMessage.includes("API Access Denied") || errorMessage.includes("403")) {
        showErrorAlert(
          "Service Configuration Issue",
          "There's a temporary issue with our AI service. Our team has been notified. Please try again later."
        );
      } else if (errorMessage.includes("Service Limit Reached") || errorMessage.includes("429")) {
        showErrorAlert(
          "Service Limit Reached",
          "We've reached our daily service limit. Please try again tomorrow or contact support."
        );
      } else if (errorMessage.includes("Network Error") || errorMessage.includes("Failed to fetch")) {
        showErrorAlert(
          "Connection Issue",
          "Unable to connect to our servers. Please check your internet connection and try again."
        );
      } else if (errorMessage.includes("Empty response")) {
        showErrorAlert(
          "Empty Response",
          "The AI service didn't return any content. Please try generating again."
        );
      } else if (errorMessage.includes("Missing required fields")) {
        showErrorAlert(
          "Incomplete Form",
          "Please fill in all the required fields before generating the cover letter."
        );
      } else {
        showErrorAlert(
          "Generation Failed",
          errorMessage
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetter) {
      showWarningAlert("No Content", "Please generate a cover letter first before downloading.");
      return;
    }

    try {
      console.log("📄 Starting PDF generation");
      
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      
      const lines = doc.splitTextToSize(coverLetter, maxWidth);
      doc.text(lines, margin, margin);
      
      const fileName = `${formData.companyName || 'Cover'}_Letter.pdf`;
      doc.save(fileName);
      
      console.log("✅ PDF downloaded successfully:", fileName);
      showSuccessAlert("PDF Downloaded", "Your cover letter has been saved as PDF.");
      
    } catch (error) {
      console.error("❌ PDF download failed:", error);
      showErrorAlert(
        "Download Failed", 
        "Failed to download PDF. Please try again or use the text download option."
      );
    }
  };

  const handleDownloadText = () => {
    if (!coverLetter) {
      showWarningAlert("No Content", "Please generate a cover letter first before downloading.");
      return;
    }

    try {
      console.log("📝 Starting text download");
      
      const blob = new Blob([coverLetter], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${formData.companyName || 'Cover'}_Letter.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
      console.log("✅ Text file downloaded successfully");
      showSuccessAlert("Text File Downloaded", "Your cover letter has been saved as text file.");
      
    } catch (error) {
      console.error("❌ Text download failed:", error);
      showErrorAlert(
        "Download Failed", 
        "Failed to download text file. Please try again."
      );
    }
  };

  return (
    <PrivateRoute>
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
              placeholder="Your Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title You're Applying For *"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <textarea
              name="skills"
              placeholder="Your Key Skills (e.g., JavaScript, Project Management, Team Leadership) *"
              value={formData.skills}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all"
            />
            <textarea
              name="experience"
              placeholder="Briefly describe your relevant experience and achievements *"
              value={formData.experience}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all"
            />

            <Button
              type="submit"
              disabled={loading}
              className="font-semibold py-3 rounded-lg transition disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </span>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
          </form>

          {/* Generated Cover Letter */}
          {coverLetter && (
            <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📄</span>
                Your Generated Cover Letter
              </h2>
              <div className="whitespace-pre-wrap bg-white dark:bg-gray-900 p-4 rounded border max-h-96 overflow-y-auto text-sm leading-relaxed">
                {coverLetter}
              </div>

              {/* Download Buttons */}
              <div className="flex gap-4 mt-6 flex-wrap">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition flex items-center gap-2"
                >
                  <span>📥</span>
                  Download PDF
                </Button>
                <Button
                  onClick={handleDownloadText}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition flex items-center gap-2"
                >
                  <span>📝</span>
                  Download TXT
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}