import { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import LiveTestSection from './components/LiveTestSection';
import DownloadSection from './components/DownloadSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';


const HOME_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://speachflow.app/#website',
      url: 'https://speachflow.app/',
      name: 'SpeachFlow',
      description: 'KI-Sprach-Coach für bessere Präsentationen – Echtzeit-Feedback zu Sprechtempo, Tonfall und Körpersprache.',
      inLanguage: 'de-DE',
      publisher: {
        '@type': 'Organization',
        name: 'SpeachFlow GmbH',
        url: 'https://speachflow.app/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://static.readdy.ai/image/c22c690b3fad44e0f4e8b70799dbf390/8efff0df91d4bff17be966e52d6bcb60.png',
        },
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://speachflow.app/#app',
      name: 'SpeachFlow',
      description: 'KI-gestützte App zur Verbesserung von Präsentations- und Sprechfähigkeiten mit Echtzeit-Feedback.',
      applicationCategory: 'EducationApplication',
      operatingSystem: 'iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      url: 'https://speachflow.app/',
      image: 'https://static.readdy.ai/image/c22c690b3fad44e0f4e8b70799dbf390/8efff0df91d4bff17be966e52d6bcb60.png',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://speachflow.app/#webpage',
      url: 'https://speachflow.app/',
      name: 'SpeachFlow – KI-Sprach-Coach für bessere Präsentationen',
      description: 'Verbessere deine Präsentationsfähigkeiten mit KI-gestütztem Echtzeit-Feedback. Sprechtempo, Tonfall, Körpersprache – alles auf einen Blick.',
      inLanguage: 'de-DE',
      isPartOf: { '@id': 'https://speachflow.app/#website' },
    },
  ],
};

export default function HomePage() {
  useEffect(() => {
    const id = 'jsonld-home';
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(HOME_JSONLD);
      document.head.appendChild(script);
    }
    document.title = 'SpeachFlow – KI-Sprach-Coach für bessere Präsentationen';
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

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
