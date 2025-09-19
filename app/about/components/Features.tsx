import React from "react";

const features = [
  { title: "AI Suggestions", desc: "Get smart tips to improve your resume instantly." },
  { title: "Mock Interviews", desc: "Practice real interview questions with AI." },
  { title: "Templates", desc: "Choose from professional, modern resume templates." },
  { title: "Feedback", desc: "Receive detailed, personalized feedback." },
];

export default function Features() {
  return (
    <section className="py-8 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-[#00FF84] mb-12">Features</h2>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#22252B] rounded-2xl shadow-lg border border-transparent 
                       transform transition duration-300 hover:scale-105 
                       hover:border-[#00FF84] hover:shadow-[#00FF84]/50 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00FF84]">
              {f.title}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-200">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
