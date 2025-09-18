"use client";
import React from "react";

const faqs = [
  {
    question: "How does MockMiya's AI interview system work?",
    answer:
      "MockMiya uses advanced AI to simulate interviews, analyze responses, and give instant feedback.",
  },
  {
    question: "Can I practice both technical and behavioral interviews?",
    answer:
      "Yes! You can practice technical coding interviews and behavioral questions tailored to real scenarios.",
  },
  {
    question: "Is the resume builder suitable for all developer roles?",
    answer:
      "Our resume builder is designed for multiple developer roles and ensures ATS compatibility.",
  },
  {
    question: "How accurate is the AI feedback compared to human reviewers?",
    answer:
      "The AI feedback is benchmarked against expert reviewers to maintain high accuracy and relevance.",
  },
  {
    question: "Can I export my resumes and interview reports?",
    answer:
      "Yes, you can export resumes and interview reports in multiple formats for easy sharing.",
  },
];

const FAQ = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto text-center">

      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Frequently Asked{" "}
          <span className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
            Questions
          </span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl">
          Everything you need to know about MockMiya and how it can accelerate
          your tech career
        </p>
      </div>

      {/* FAQ Items */}
      <div className="mt-10 space-y-4 text-left">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg p-4 bg-[#161c1f] border border-gray-800 transition hover:bg-gradient-to-r hover:from-green-500 hover:to-green-500 hover:text-white"
          >
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-200 group-hover:text-black">
              {faq.question}
              <span className="ml-2 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-gray-400 font-medium group-hover:text-black">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      {/* Support Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">Still have questions?</p>
        <button className="mt-3 px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-400 rounded-lg font-semibold text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
          Contact our support team
        </button>
      </div>
    </div>
  );
};

export default FAQ;
