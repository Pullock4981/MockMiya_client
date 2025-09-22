import CTASection from '@/components/layout/CTASection';
import FAQSection from '@/components/layout/FAQSection';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeProvider>
        <FAQSection />
        <CTASection />
        <Footer />
      </ThemeProvider>
    </div>
  );
}
