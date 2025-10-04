import { ArrowRight, UserPlus, FileText, MessageSquare, Download, Send } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account in seconds"
  },
  {
    icon: FileText,
    title: "Build Resume",
    description: "AI-powered resume generation"
  },
  {
    icon: MessageSquare,
    title: "Mock Interview",
    description: "Practice with realistic scenarios"
  },
  {
    icon: Download,
    title: "Download",
    description: "Export polished documents"
  },
  {
    icon: Send,
    title: "Apply",
    description: "Land your dream job"
  }
];

const ProcessSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/50 to-background"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Your Path to 
            <span className="text-gradient">Success</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Simple, streamlined process to transform your career in just 5 steps
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Step Circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-card-gradient border-2 border-border group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 group-hover:shadow-glow">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 ml-4">
                      <ArrowRight className="h-6 w-6 text-border group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-foreground-secondary text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden mt-6 mb-2">
                    <ArrowRight className="h-6 w-6 text-border mx-auto rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-card-gradient border border-border">
            <div className="text-3xl font-bold text-primary mb-2">&lt; 5 min</div>
            <div className="text-foreground-secondary">Average setup time</div>
          </div>
          <div className="p-6 rounded-2xl bg-card-gradient border border-border">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-foreground-secondary">AI availability</div>
          </div>
          <div className="p-6 rounded-2xl bg-card-gradient border border-border">
            <div className="text-3xl font-bold text-primary mb-2">∞</div>
            <div className="text-foreground-secondary">Practice attempts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;