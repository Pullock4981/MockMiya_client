import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import confidentManImage from "@/assets/confident-man-hero.jpg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground-secondary">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                AI-Powered Interview Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Master Your
                <span className="text-gradient block">
                  Tech Interviews
                </span>
                with AI
              </h1>
              
              <p className="text-xl text-foreground-secondary max-w-lg leading-relaxed">
                Revolutionary AI tool for developers. Build perfect resumes, practice interviews, and ace your next tech job with MockMiya's comprehensive suite.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-xl glow-effect group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-border-light hover:bg-card-secondary px-8 py-4 rounded-xl group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-foreground-muted">Developers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-foreground-muted">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-foreground-muted">AI Support</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden glow-effect">
              <Image
                src={confidentManImage} 
                alt="Confident developer ready for tech interviews with MockMiya AI platform" 
                className="w-full h-auto animate-float"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 rounded-xl blur-sm animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/30 rounded-full blur-sm animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;