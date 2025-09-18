import React from "react";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-white"
      style={{ backgroundColor: "#181B20" }}
    >
      <div className="max-w-4xl text-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-[#00FF84]">MockMiya</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-300 leading-relaxed">
          MockMiya is your AI-powered assistant for building professional resumes
          and practicing mock interviews. Our mission is to help students,
          professionals, and job seekers gain confidence and land their dream jobs.
        </p>

        {/* Mission / Vision / Values */}
        <section className="grid gap-6 md:grid-cols-3 mt-12">
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">🎯 Mission</h2>
            <p className="text-sm text-gray-400">
              Empower job seekers with AI tools to craft resumes and practice
              real-world interview questions.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">💡 Vision</h2>
            <p className="text-sm text-gray-400">
              Become the go-to AI platform for career readiness and skill
              development worldwide.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">🤝 Values</h2>
            <p className="text-sm text-gray-400">
              Innovation, accessibility, and growth for everyone chasing their
              career goals.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
