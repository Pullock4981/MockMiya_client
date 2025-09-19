import React from "react";

export default function Hero() {
  return (
    <section className="py-8 px-6 text-center bg-gradient-to-b from-[#132c13] to-[#0e1b0e]">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">
        About <span className="text-[#00FF84]">MockMiya</span>
      </h1>
      <p className="text-lg max-w-2xl mx-auto text-gray-300">
        Your AI-powered companion for resume building and mock interviews.
        Helping job seekers gain confidence and land their dream jobs.....
      </p>
    </section>
  );
}
