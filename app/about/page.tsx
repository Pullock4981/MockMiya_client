import React from "react";
import Hero from "./components/Hero";
import WhyWhatHow from "./components/WhyWhatHow";
import MissionVisionValues from "./components/MissionVisionValues";
import Features from "./components/Features";
import Story from "./components/Story";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-white"
      style={{ backgroundColor: "#181B20" }}
      >
          <div>
              <Hero></Hero>
              <WhyWhatHow></WhyWhatHow>
              <MissionVisionValues></MissionVisionValues>
              <Features></Features>
              <Story></Story>
          </div>
      <div className="max-w-4xl text-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-[#00FF84]">YourPlatform</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-300 leading-relaxed">
          At YourPlatform, we are passionate about empowering individuals to
          transform their lives through coding. Our goal is to make learning
          programming accessible, engaging, and career-focused for everyone.
        </p>

        {/* Mission / Vision / Values */}
        <section className="grid gap-6 md:grid-cols-3 mt-12">
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">🎯 Mission</h2>
            <p className="text-sm text-gray-400">
              Empower individuals to learn programming efficiently and turn their
              skills into successful careers.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">💡 Vision</h2>
            <p className="text-sm text-gray-400">
              Become the leading platform for interactive coding education and
              personal growth worldwide.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#00FF84]/30 shadow-lg hover:shadow-[#00FF84]/40 transition">
            <h2 className="font-semibold text-xl mb-2 text-[#00FF84]">🤝 Values</h2>
            <p className="text-sm text-gray-400">
              Accessibility, innovation, community support, and career-oriented
              learning for all.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
