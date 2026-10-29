import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import LoadingScreen from '@/components/ui/LoadingScreen';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import BackToTop from '@/components/ui/BackToTop';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import GallerySection from '@/components/sections/GallerySection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ProcessSection from '@/components/sections/ProcessSection';
import InstagramSection from '@/components/sections/InstagramSection';
import ContactSection from '@/components/sections/ContactSection';
import { getVideos, getGallery, getTestimonials } from '@/lib/supabase';

// Revalidate every 60 seconds or on-demand
export const revalidate = 60;

export default async function HomePage() {
  const [videos, gallery, testimonials] = await Promise.all([
    getVideos(),
    getGallery(),
    getTestimonials(),
  ]);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-black text-white selection:bg-purpo-purple selection:text-white">
        {/* Splash Loader */}
        <LoadingScreen />

        {/* Global Floating Elements */}
        <Navbar />
        <WhatsAppButton />
        <BackToTop />

        {/* Main Landing Sections */}
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <PortfolioSection videos={videos} />
          <GallerySection items={gallery} />
          <TestimonialsSection testimonials={testimonials} />
          <ProcessSection />
          <InstagramSection />
          <ContactSection />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
