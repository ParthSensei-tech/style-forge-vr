import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Set dark theme for the landing page
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <head>
        <title>FashionFOT VR - Revolutionary Virtual Try-On Technology</title>
        <meta 
          name="description" 
          content="Experience the future of fashion retail with immersive VR technology. Try on clothes virtually with FashionFOT VR's cutting-edge platform." 
        />
        <meta name="keywords" content="VR fashion, virtual try-on, fashion technology, retail VR, virtual reality clothing" />
        <meta property="og:title" content="FashionFOT VR - Revolutionary Virtual Try-On Technology" />
        <meta property="og:description" content="Transform your fashion business with immersive VR try-on experiences" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fashionfot.com" />
      </head>

      <main className="overflow-x-hidden">
        <HeroSection />
        
        <section id="features">
          <FeaturesSection />
        </section>
        
        <section id="pricing">
          <PricingSection />
        </section>
        
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}