"use client";
import React from "react";
import heroImage from "../../public/hero.jpg";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { BsCaretRight } from "react-icons/bs";

// Dot icon
const DotIcon = () => (
  <svg className="text-green-500" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

// Card with image
const CoderProfileCard = () => (
  <div className="w-full mx-auto shadow-lg rounded-2xl overflow-hidden">
    <Image className="rounded-2xl w-full h-auto object-cover" src={heroImage} alt="Coder" />

    {/* Top gradient border */}
    <div className="flex flex-row">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-green-500 to-green-700"></div>
      <div className="h-[2px] w-full bg-gradient-to-r from-green-700 to-transparent"></div>
    </div>
  </div>
);

// Hero Component
const Hero = () => (
  <div className="relative min-h-screen w-full flex items-center justify-center font-sans px-4 sm:px-6 lg:px-8 py-8">

    {/* Content */}
    <div className="container mx-auto max-w-7xl relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 sm:gap-12 xl:gap-16 items-center">

        {/* Text Column */}
        <div className="flex flex-col gap-4 sm:gap-6 items-start text-left order-1 lg:order-1 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900/80 dark:bg-white/10 border border-gray-700 dark:border-gray-600 rounded-full text-xs sm:text-sm text-gray-200 dark:text-gray-300 backdrop-blur-sm hover:bg-gray-800 dark:hover:bg-white/20 transition-all duration-300">
            <DotIcon />
            AI-Powered Interview Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
            Master Your <br />
            <span className="bg-gradient-to-r from-green-300 to-green-600 dark:from-green-300 dark:to-green-600 bg-clip-text text-transparent">
              Tech Interviews
            </span>
            <br />
            with AI
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed">
            Revolutionary AI tool for developers. Build perfect resumes, practice interviews, and ace your next tech job with MockMiya's comprehensive suite.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
            <button className="flex gap-3 justify-center items-center px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-400 rounded-lg font-semibold text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Get Started Free <FaArrowRight />
            </button>
            <button className="flex gap-3 justify-center items-center px-6 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95">
              <BsCaretRight className="w-5 h-5" />  Watch Demo
            </button>
          </div>

          {/* stat */}
          <div className="stats stats-horizontal gap-10 shadow text-white">
            <div className="">
              <div className="stat-value">50K+</div>
              <div className="stat-desc text-lg">Developers</div>
            </div>

            <div className="">
              <div className="stat-value">95%</div>
              <div className="stat-desc text-lg">Success Rate</div>
            </div>

            <div className="">
              <div className="stat-value">24/7</div>
              <div className="stat-desc text-lg">AI Support</div>
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="order-2 lg:order-2 animate-fade-in-up mt-6 lg:mt-0">
          <CoderProfileCard />
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
