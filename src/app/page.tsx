// import CTASection from '@/components/layout/CTASection';
// import FAQSection from '@/components/layout/FAQSection';
// import Footer from '@/components/layout/Footer';
// import PricingSection from '@/components/layout/PricingSection';
// import TestimonialsSection from '@/components/layout/TestimonialSection';
import ProcessSection from '@/components/layout/ProcessSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import HeroSection from '@/components/layout/HeroSection';
import Navbar from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeProvider>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        {/* <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer /> */}
      </ThemeProvider>
    </div>
  );
}
