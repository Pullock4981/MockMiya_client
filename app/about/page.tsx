import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-indigo-600">About MockMiya</h1>
        <p className="text-lg leading-relaxed">
          MockMiya is your AI-powered assistant for building professional resumes
          and practicing mock interviews. Our goal is to help students,
          professionals, and job seekers gain confidence and land their dream
          jobs.
        </p>

        <section className="grid gap-6 md:grid-cols-3 mt-10">
          <div className="p-6 rounded-2xl bg-white shadow">
            <h2 className="font-semibold text-xl mb-2">🎯 Mission</h2>
            <p className="text-sm text-gray-600">
              Empower job seekers with AI tools to craft resumes and practice
              real-world interview questions.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow">
            <h2 className="font-semibold text-xl mb-2">💡 Vision</h2>
            <p className="text-sm text-gray-600">
              Become the go-to AI platform for career readiness and skill
              development worldwide.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow">
            <h2 className="font-semibold text-xl mb-2">🤝 Values</h2>
            <p className="text-sm text-gray-600">
              Innovation, accessibility, and growth for everyone chasing their
              career goals.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
