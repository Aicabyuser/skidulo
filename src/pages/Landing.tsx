import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorks from '@/components/landing/HowItWorks';
import CalendarShowcase from '@/components/landing/CalendarShowcase';
import StatsSection from '@/components/landing/StatsSection';
import Testimonials from '@/components/landing/Testimonials';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CalendarShowcase />
        <StatsSection />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
} 