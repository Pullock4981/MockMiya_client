"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [resumeOutput, setResumeOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResumeOutput("");

    try {
      const res = await fetch("/api/generate/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      const data = await res.json();

      if (res.ok && data.resume) {
        setResumeOutput(data.resume);
      } else {
        throw new Error(data.error || "Failed to generate resume");
      }
    } catch (err) {
      console.error("Error:", err);
      setResumeOutput("⚠️ Resume generation failed. Check API logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!resumeOutput) return;
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(resumeOutput, 10, 20, { maxWidth: 190 });
    doc.save("resume.pdf");
  };

  const handleDownloadText = () => {
    if (!resumeOutput) return;
    const blob = new Blob([resumeOutput], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "resume.txt";
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Resume Builder 📝
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 animate-fadeIn"
        >
          <input
            name="fullName"
            placeholder="Full Name"
            value={resumeData.fullName}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={resumeData.email}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={resumeData.phone}
            onChange={handleChange}
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <input
            name="jobTitle"
            placeholder="Target Job Title"
            value={resumeData.jobTitle}
            onChange={handleChange}
            className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          {/* Role select + text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="role"
              value={resumeData.role}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              name="role"
              placeholder="Or type custom role"
              value={resumeData.role}
              onChange={handleChange}
              className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <textarea
            name="summary"
            placeholder="Professional Summary"
            value={resumeData.summary}
            onChange={handleChange}
            className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <textarea
            name="experience"
            placeholder="Work Experience"
            value={resumeData.experience}
            onChange={handleChange}
            className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <textarea
            name="education"
            placeholder="Education"
            value={resumeData.education}
            onChange={handleChange}
            className="p-3 border rounded-lg h-24 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <textarea
            name="skills"
            placeholder="Skills (comma-separated)"
            value={resumeData.skills}
            onChange={handleChange}
            className="p-3 border rounded-lg h-20 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
          >
            {loading ? "Generating..." : "Generate Resume with AI"}
          </button>
        </form>

        {/* Output */}
        {resumeOutput && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 animate-fadeIn shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              Generated Resume 📄
            </h2>
            <p className="whitespace-pre-wrap leading-relaxed">
              {resumeOutput}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={handleDownloadText}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
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
