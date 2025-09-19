import React from "react";

const items = [
  { title: "Why", desc: "We exist to bridge the gap between talent and opportunity." },
  { title: "What", desc: "An AI platform for resumes, mock interviews, and feedback." },
  { title: "How", desc: "By combining AI, smart templates, and interactive sessions." },
];

export default function WhyWhatHow() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-6 bg-[#22252B] rounded-2xl shadow-lg border border-[#00FF84]/30"
        >
          <h2 className="text-2xl font-semibold text-[#00FF84] mb-4">
            {item.title}
          </h2>
          <p className="text-gray-400">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}
