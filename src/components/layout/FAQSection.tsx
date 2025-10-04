import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does MockMiya's AI interview system work?",
    answer: "Our AI uses advanced natural language processing and machine learning models trained on thousands of real technical interviews. It analyzes your responses, coding solutions, and communication style to provide personalized feedback and realistic interview scenarios."
  },
  {
    question: "Can I practice both technical and behavioral interviews?",
    answer: "Absolutely! MockMiya offers comprehensive interview preparation including technical coding challenges, system design questions, behavioral interviews, and company-specific scenarios. You can practice in text, voice, or video format."
  },
  {
    question: "Is the resume builder suitable for all developer roles?",
    answer: "Yes, our AI resume builder is trained on successful resumes across all tech roles - frontend, backend, full-stack, mobile, DevOps, data science, and more. It adapts content and formatting based on your target role and experience level."
  },
  {
    question: "How accurate is the AI feedback compared to human reviewers?",
    answer: "Our AI feedback has a 95% accuracy rate when compared to senior technical interviewers. It's trained on feedback patterns from thousands of successful candidates and continuously improves based on real interview outcomes."
  },
  {
    question: "Can I export my resumes and interview reports?",
    answer: "Yes, you can export your resumes in PDF and DOCX formats, fully formatted and ATS-friendly. Interview reports with detailed feedback and improvement suggestions are also exportable for your records."
  }
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-background-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked 
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Everything you need to know about MockMiya and how it can accelerate your tech career
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-2xl bg-card-gradient px-6 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground-secondary leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact support */}
        <div className="text-center mt-12">
          <p className="text-foreground-secondary mb-4">
            Still have questions?
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-card border border-border text-primary hover:border-primary/50 transition-colors cursor-pointer">
            Contact our support team
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;