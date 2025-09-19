"use client";
import React from "react";
import { FaLaptopCode, FaUserShield, FaSun, FaChartLine } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlinePictureAsPdf } from "react-icons/md";
import { RiRobot2Line, RiVoiceprintLine } from "react-icons/ri";

const features = [
  {
    title: "AI Resume Builder",
    description:
      "Generate tailored resumes optimized for tech roles with our advanced AI algorithms.",
    icon: <RiRobot2Line className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Mock Interviews",
    description:
      "Practice with text, voice, and video interviews powered by realistic AI scenarios.",
    icon: <RiVoiceprintLine className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Coding Editor",
    description:
      "Interactive coding environment with real-time feedback and performance analytics.",
    icon: <FaLaptopCode className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Admin Console",
    description:
      "Comprehensive dashboard to manage users, track progress, and analyze performance.",
    icon: <FaUserShield className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Role-Based Dashboards",
    description:
      "Customized interfaces for different user types with relevant metrics and tools.",
    icon: <MdOutlineDashboard className="text-green-500 w-6 h-6" />,
  },
  {
    title: "PDF/DOCX Export",
    description:
      "Export your resumes and reports in professional formats ready for submission.",
    icon: <MdOutlinePictureAsPdf className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Dark/Light Mode",
    description:
      "Switch between themes for comfortable coding sessions at any time of day.",
    icon: <FaSun className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track your progress with detailed insights and performance metrics.",
    icon: <FaChartLine className="text-green-500 w-6 h-6" />,
  },
];

const Features = () => {
  return (
    <section className="relative py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">Succeed in Tech</span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          From resume building to interview mastery, MockMiya provides the
          complete toolkit for your developer career journey.
        </p>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#161c1f] border border-gray-800 rounded-xl p-6 text-left hover:border-green-500 transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Coming Soon Button */}
        <div className="mt-12">
          <button className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-400 rounded-lg font-semibold text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
            More features coming soon
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
