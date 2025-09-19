import React from "react";

const team = [
  { name: "Alice Johnson", role: "Founder & CEO" },
  { name: "Brian Lee", role: "CTO" },
  { name: "Sophia Kim", role: "Product Designer" },
  { name: "Alice Johnson", role: "Founder & CEO" },
  { name: "Brian Lee", role: "CTO" },
  { name: "Sophia Kim", role: "Product Designer" },
];

export default function Team() {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto text-center overflow-hidden">
      <h2 className="text-3xl font-bold text-[#00FF84] mb-12">Meet the Team</h2>

      {/* Scrolling container */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex animate-scroll group-hover:[animation-play-state:paused] space-x-6">
          {[...team, ...team].map((member, idx) => (
            <div
              key={idx}
              className="min-w-[250px] p-6 bg-[#22252B] rounded-2xl shadow-lg border border-[#00FF84]/30 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4" />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
