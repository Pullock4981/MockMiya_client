import React from "react";
import Hero from "./components/Hero";
import WhyWhatHow from "./components/WhyWhatHow";
import MissionVisionValues from "./components/MissionVisionValues";
import Features from "./components/Features";
import Story from "./components/Story";
import Team from "./components/Team";

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
              <Team></Team>
          </div>
      
    </main>
  );
}
