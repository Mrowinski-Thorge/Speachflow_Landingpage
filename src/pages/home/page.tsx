import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveTestSection from './components/LiveTestSection';
import DownloadSection from './components/DownloadSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <LiveTestSection />
        <DownloadSection />
        <TestimonialsSection />
        <PricingSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
