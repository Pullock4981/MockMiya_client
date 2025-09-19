// components/HeroSection.tsx
import { ArrowRight, Sparkles } from "lucide-react";

export default function DreamTechJob() {
  return (
    <section className="bg-gray-900 text-gray-100 py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center relative">
            <Sparkles className="w-7 h-7 text-green-400 animate-float" />
            <div className="absolute inset-0 rounded-2xl bg-green-500 blur-xl animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-snug">
          Ready to Land Your{" "} <br />
          <span className="text-green-400">Dream Tech Job?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8">
          Join 50,000+ developers who have accelerated their careers <br />
          with MockMiya’s AI-powered platform
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-green-500 text-black font-semibold shadow-md hover:bg-green-400 transition"
          >
            Start Free Today <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold shadow-md hover:bg-gray-700 transition"
          >
            Book a Demo
          </a>
        </div>

        {/* Bottom Features */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            30-day money-back guarantee
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Setup in under 5 minutes
          </div>
        </div>
      </div>
    </section>
  );
}
