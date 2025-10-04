import { 
  Brain, 
  Mic, 
  Code, 
  Shield, 
  BarChart3, 
  FileText,
  Palette,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Builder",
    description: "Generate tailored resumes optimized for tech roles with our advanced AI algorithms."
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description: "Practice with text, voice, and video interviews powered by realistic AI scenarios."
  },
  {
    icon: Code,
    title: "Coding Editor",
    description: "Interactive coding environment with real-time feedback and performance analytics."
  },
  {
    icon: Shield,
    title: "Admin Console", 
    description: "Comprehensive dashboard to manage users, track progress, and analyze performance."
  },
  {
    icon: BarChart3,
    title: "Role-Based Dashboards",
    description: "Customized interfaces for different user types with relevant metrics and tools."
  },
  {
    icon: FileText,
    title: "PDF/DOCX Export",
    description: "Export your resumes and reports in professional formats ready for submission."
  },
  {
    icon: Palette,
    title: "Dark/Light Mode",
    description: "Switch between themes for comfortable coding sessions at any time of day."
  },
  {
    icon: Zap,
    title: "Real-time Analytics",
    description: "Track your progress with detailed insights and performance metrics."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to 
            <span className="text-gradient block">Succeed in Tech</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-3xl mx-auto">
            From resume building to interview mastery, MockMiya provides the complete toolkit 
            for your developer career journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card-gradient border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-foreground-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
            <Zap className="h-4 w-4 mr-2" />
            More features coming soon
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;