import React from "react";

const values = [
  { title: "🎯 Mission", desc: "Empower job seekers with AI tools to craft resumes and ace interviews." },
  { title: "💡 Vision", desc: "Become the go-to AI platform for career readiness worldwide." },
  { title: "🤝 Values", desc: "Innovation, accessibility, and growth for everyone chasing their career goals." },
];

export default function MissionVisionValues() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
      {values.map((item, idx) => (
        <div
          key={idx}
          className="p-6 bg-[#22252B] rounded-2xl shadow-lg border border-[#00FF84]/30"
        >
          <h2 className="text-xl font-semibold text-[#00FF84] mb-3">{item.title}</h2>
          <p className="text-gray-400">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}
