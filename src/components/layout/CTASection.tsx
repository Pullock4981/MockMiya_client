import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            Ready to Land Your 
            <span className="text-gradient block">Dream Tech Job?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-foreground-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ developers who've accelerated their careers with MockMiya's AI-powered platform
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-12 py-4 rounded-xl glow-strong group text-lg">
              Start Free Today
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="border-border-light hover:bg-card-secondary px-12 py-4 rounded-xl text-lg">
              Book a Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-foreground-muted">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              No credit card required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              30-day money-back guarantee
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              Setup in under 5 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;