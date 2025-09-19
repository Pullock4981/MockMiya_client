// components/UserGuideline.tsx
import { UserPlus, FileText, MessageSquare, Download, Send, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <UserPlus className="w-6 h-6" />,
    title: "Complete Profile",
    description: "Fill in personal and career details accurately",
  },
  {
    id: 2,
    icon: <FileText className="w-6 h-6" />,
    title: "Add Experience",
    description: "Highlight key achievements and skills",
  },
  {
    id: 3,
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Practice Interview",
    description: "Prepare with common and role-specific questions",
  },
  {
    id: 4,
    icon: <Download className="w-6 h-6" />,
    title: "Save Progress",
    description: "Export or review your updated documents",
  },
  {
    id: 5,
    icon: <Send className="w-6 h-6" />,
    title: "Apply Confidently",
    description: "Use your resume and skills to land the job",
  },
];

const highlights = [
  { label: "< 5 min", text: "Average setup time" },
  { label: "24/7", text: "AI availability" },
  { label: "∞", text: "Practice attempts" },
];

export default function UserGuideline() {
  return (
    <section className="py-16 bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Your Path to <span className="text-green-400">Success</span>
        </h2>
        <p className="text-gray-400 mb-12">
          Follow these 5 simple steps to make the most of our platform
        </p>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-6 space-y-10 md:space-y-0">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center  text-center relative group">
              <div className="flex items-center">
                {/* Circle with icon */}
                <div className="w-20 h-20 rounded-full border-2 border-gray-500 
                  group-hover:border-green-400 flex items-center justify-center 
                  text-green-400 relative transition-colors">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 bg-green-500 text-black 
                     text-xs font-bold rounded-full px-1.5 py-0.5">
                    {step.id}
                  </span>
                </div>

                {/* Right Arrow (except last step) */}
                {step.id !== steps.length && (
                  <ArrowRight className="w-6 h-6 text-gray-500 ml-2  transition-colors duration-300 group-hover:text-green-400" />
                )}
              </div>


              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="border border-gray-500 hover:border-green-400 p-6 rounded-xl shadow-md"
            >
              <h4 className="text-green-400 text-xl font-bold">{item.label}</h4>
              <p className="text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
