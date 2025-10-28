import CTASection from "@/components/layout/CTASection";
import FAQSection from "@/components/layout/FAQSection";
import PricingSection from "@/components/layout/PricingSection";
import TestimonialsSection from "@/components/layout/TestimonialSection";
import ProcessSection from "@/components/layout/ProcessSection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import HeroSection from "@/components/layout/HeroSection";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeProvider>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
       
      </ThemeProvider>
    </div>
  );
}
