"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import ATSTemplate from "@/components/templates/ATSTemplate";
import { ResumeData, Template } from "@/types/resume";

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Senior Software Engineer",
    role: "Software Engineer",
    summary:
      "Experienced software engineer with 8+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers.",
    experience:
      "Lead Developer at Tech Corp (2020-Present)\n- Led a team of 5 developers\n- Improved application performance by 40%\n- Implemented CI/CD pipelines\n\nSenior Developer at Startup Inc (2016-2020)\n- Developed customer-facing web applications\n- Collaborated with product and design teams",
    education:
      "Bachelor of Science in Computer Science\nUniversity of Technology, 2016",
    skills:
      "JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL",
  });

  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template1");
  const [mode, setMode] = useState<"ats" | "non-ats">("non-ats");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log("🔧 ResumeBuilder Component - Initialized with state:", {
    resumeData: {
      ...resumeData,
      profileImage: resumeData.profileImage ? "Image exists" : "No image",
    },
    selectedTemplate,
    mode,
    loading,
    downloadLoading,
  });

  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Marketing Specialist",
    "SEO Specialist",
    "Content Writer",
    "Business Analyst",
    "HR Manager",
    "Teacher",
    "Doctor",
    "Lawyer",
    "Civil Engineer",
    "Mechanical Engineer",
    "Architect",
  ];

  const atsTemplates: Template[] = [
    {
      id: "ats-template",
      name: "ATS Friendly",
      description: "Simple, clean format for applicant tracking systems",
      category: "ats",
      component: ATSTemplate,
    },
  ];

  const nonAtsTemplates: Template[] = [
    {
      id: "template1",
      name: "Modern Sidebar",
      description: "Clean sidebar with profile focus",
      category: "non-ats",
      component: Template1,
    },
    {
      id: "template2",
      name: "Creative Split",
      description: "Colorful split layout with cards",
      category: "non-ats",
      component: Template2,
    },
    {
      id: "template3",
      name: "Professional Header",
      description: "Bold header with gradient design",
      category: "non-ats",
      component: Template3,
    },
    {
      id: "template4",
      name: "Minimalist Card",
      description: "Clean and minimal card layout",
      category: "non-ats",
      component: Template4,
    },
    {
      id: "template5",
      name: "Bold Asymmetric",
      description: "Asymmetric layout with bold colors",
      category: "non-ats",
      component: Template5,
    },
  ];

  const allTemplates = [...atsTemplates, ...nonAtsTemplates];
  const currentTemplates = mode === "ats" ? atsTemplates : nonAtsTemplates;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("📝 ResumeBuilder - Input change:", { name, value });
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("🖼️ ResumeBuilder - Image upload attempt:", {
      fileExists: !!file,
      fileName: file?.name,
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("🖼️ ResumeBuilder - Image loaded successfully");
        setResumeData((prev) => ({
          ...prev,
          profileImage: event.target?.result as string,
        }));
      };
      reader.onerror = (error) => {
        console.error("❌ ResumeBuilder - Image loading error:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("🚀 ResumeBuilder - AI Generate button clicked");
    setLoading(true);

    try {
      console.log("📤 ResumeBuilder - Sending AI generate request to API...");
      const res = await fetch("/api/generate/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resumeData,
          template: selectedTemplate,
          mode: mode,
        }),
      });

      const data = await res.json();
      console.log("📥 ResumeBuilder - AI Generate API response:", data);

      if (!res.ok) {
        console.error("❌ ResumeBuilder - AI Generate API error:", data.error);
        throw new Error(data.error || "Failed to generate resume");
      }

      console.log("✅ ResumeBuilder - AI Generation successful");
      toast.success("✅ Resume generated successfully with AI!");
    } catch (err) {
      console.error("❌ ResumeBuilder - AI Generation error:", err);
      toast.error("❌ Resume generation failed. Check API logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
  console.log("💾 ResumeBuilder - Save to Database button clicked");
  setDownloadLoading(true);

  // Validation check
  if (!resumeData.fullName || !resumeData.email || !resumeData.jobTitle) {
    console.warn(
      "⚠️ ResumeBuilder - Validation failed: Missing required fields"
    );
    toast.error(
      "❌ Please fill in all required fields (Name, Email, Job Title)"
    );
    setDownloadLoading(false);
    return;
  }

  try {
    const formattedData = {
      resumeData: {
        ...resumeData,
        // Keep as strings - MongoDB expects strings, not arrays
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
      },
      template: selectedTemplate,
      mode: mode,
      design: {
        layout: getCurrentTemplate()?.name || "Modern Sidebar",
        colors: mode === "ats" ? "professional" : "creative",
        includeProfileImage: !!resumeData.profileImage,
      },
    };

    console.log("📤 ResumeBuilder - Sending data to save-resume API:", {
      experienceType: typeof formattedData.resumeData.experience,
      educationType: typeof formattedData.resumeData.education,
      skillsType: typeof formattedData.resumeData.skills,
    });

    // Show loading toast
    const toastId = toast.loading("🔄 Saving your resume to database...");

    const res = await fetch("/api/save-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    const data = await res.json();
    console.log("📥 ResumeBuilder - Save resume API response:", data);

    if (res.ok && data.id) {
      console.log(
        "✅ ResumeBuilder - Resume saved successfully with ID:",
        data.id
      );
      
      // Show success message
      toast.update(toastId, {
        render: `✅ Resume saved successfully! Redirecting...`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Wait for 2 seconds then redirect
      setTimeout(() => {
        router.push(`/resumepdf/${data.id}`);
      }, 2000);
      
    } else {
      console.error("❌ ResumeBuilder - Save resume API error:", data.error);
      throw new Error(data.error || "Failed to save resume");
    }
  } catch (error) {
    console.error("❌ ResumeBuilder - Save resume error:", error);
    toast.error(
      `❌ Error saving resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    setDownloadLoading(false);
  }
};
  const handleDownloadText = () => {
    console.log("📄 ResumeBuilder - Download ATS Text button clicked");

    // Validation check
    if (!resumeData.fullName || !resumeData.email || !resumeData.jobTitle) {
      console.warn(
        "⚠️ ResumeBuilder - ATS Text validation failed: Missing required fields"
      );
      toast.error(
        "❌ Please fill in all required fields (Name, Email, Job Title)"
      );
      return;
    }

    const atsText = `
${resumeData.fullName.toUpperCase()}
${resumeData.email} | ${resumeData.phone}
${resumeData.jobTitle}

PROFESSIONAL SUMMARY
${resumeData.summary}

WORK EXPERIENCE
${resumeData.experience}

EDUCATION
${resumeData.education}

SKILLS
${resumeData.skills}
    `.trim();

    const blob = new Blob([atsText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${resumeData.fullName.replace(
      /\s+/g,
      "_"
    )}_ats_resume.txt`;
    link.click();

    console.log("✅ ResumeBuilder - ATS Text downloaded successfully");
    toast.success("📄 ATS Text resume downloaded successfully!");
  };

  const getCurrentTemplate = () => {
    const template = allTemplates.find((t) => t.id === selectedTemplate);
    console.log("🎨 ResumeBuilder - Current template:", template?.name);
    return template;
  };

  const renderPreviewContent = () => {
    const template = getCurrentTemplate();
    if (!template) {
      console.warn(
        "⚠️ ResumeBuilder - No template found for:",
        selectedTemplate
      );
      return null;
    }

    const TemplateComponent = template.component;
    console.log("👁️ ResumeBuilder - Rendering template:", template.name);

    return (
      <div ref={resumeRef} className="h-full">
        <TemplateComponent resumeData={resumeData} />
      </div>
    );
  };

  console.log("🔄 ResumeBuilder - Component re-rendering with state:", {
    selectedTemplate,
    mode,
    resumeDataLength: Object.keys(resumeData).length,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-gray-200">
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Fixed Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AI Resume Builder 📝
            </h1>
            <p className="text-gray-600">
              Create professional resumes with AI-powered templates
            </p>
          </div>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Fixed Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Submit Button - Fixed */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6  top-28">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-semibold shadow-lg transition-all ${
                    mode === "ats"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                  } disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Generating Resume...
                    </>
                  ) : (
                    `Generate ${
                      mode === "ats" ? "ATS" : "Creative"
                    } Resume with AI`
                  )}
                </button>
              </div>

              {/* Template Selection - Fixed */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6  top-48">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Choose Template
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {currentTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        console.log(
                          "🎨 ResumeBuilder - Template selected:",
                          template.name
                        );
                        setSelectedTemplate(template.id);
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTemplate === template.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-800 text-sm mb-1">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection - Fixed */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6  top-96">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Resume Mode
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      console.log("🎯 ResumeBuilder - ATS mode selected");
                      setMode("ats");
                      setSelectedTemplate("ats-template");
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      mode === "ats"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm mb-1">
                      🎯 ATS-Friendly Mode
                    </div>
                    <div className="text-xs text-gray-600">
                      Simple, clean format for applicant tracking systems
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      console.log("🎨 ResumeBuilder - Creative mode selected");
                      setMode("non-ats");
                      setSelectedTemplate("template1");
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      mode === "non-ats"
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm mb-1">
                      🎨 Creative Mode
                    </div>
                    <div className="text-xs text-gray-600">
                      Beautiful, designed templates with images
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Input Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Resume Information
                </h2>

                <div className="space-y-6">
                  {/* Profile Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        name="fullName"
                        value={resumeData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={resumeData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={resumeData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        name="jobTitle"
                        value={resumeData.jobTitle}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your job title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        name="role"
                        value={resumeData.role}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Role
                      </label>
                      <input
                        name="role"
                        placeholder="Or type custom role"
                        value={resumeData.role}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      value={resumeData.summary}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your professional background and skills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Experience
                    </label>
                    <textarea
                      name="experience"
                      value={resumeData.experience}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List your work experience with company names, dates, and responsibilities"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education
                    </label>
                    <textarea
                      name="education"
                      value={resumeData.education}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List your educational qualifications"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      name="skills"
                      value={resumeData.skills}
                      onChange={handleChange}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getCurrentTemplate()?.name} Preview
                    </h2>
                    <p className="text-gray-600">
                      Real-time preview - Changes update instantly
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={downloadLoading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {downloadLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          Save to Database
                        </>
                      )}
                    </button>
                    {mode === "ats" && (
                      <button
                        onClick={handleDownloadText}
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold shadow-lg flex items-center gap-2"
                      >
                        <span>📝</span>
                        Download ATS Text
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[800px]">
                  {renderPreviewContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
