import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: Zap,
    features: [
      "1 Resume template",
      "Basic mock interviews",
      "5 AI feedback sessions",
      "PDF export",
      "Community support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month", 
    description: "Everything you need to succeed",
    icon: Crown,
    features: [
      "Unlimited resume templates",
      "Advanced mock interviews (text, voice, video)",
      "Unlimited AI feedback",
      "Priority support",
      "Advanced analytics",
      "Custom coding challenges",
      "PDF & DOCX export",
      "Role-based dashboards"
    ],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and organizations",
    icon: Rocket,
    features: [
      "Everything in Pro",
      "Team management",
      "Admin console",
      "Custom integrations",
      "White-label options",
      "Advanced security",
      "Dedicated support",
      "Custom training data"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-background-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your 
            <span className="text-gradient">Success Plan</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Flexible pricing designed to grow with your career. Start free, upgrade when ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-card-gradient border-primary/50 shadow-glow scale-105' 
                  : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-foreground-secondary mb-4">
                  {plan.description}
                </p>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-foreground-secondary ml-2">
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground-secondary">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-dark text-primary-foreground glow-effect'
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-card border border-border text-foreground-secondary">
            <Check className="h-4 w-4 mr-2 text-primary" />
            30-day money-back guarantee • No questions asked
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;