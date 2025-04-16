import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import { Helmet } from "react-helmet";
import PageTransition from "@/components/ui/page-transition";
import { useEffect, useContext } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function HomePage() {
  const loadingContext = useContext(LoadingContext);
  
  useEffect(() => {
    // Set loading to false when component mounts
    if (loadingContext) {
      const timer = setTimeout(() => {
        loadingContext.setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loadingContext]);
  
  return (
    <>
      <Helmet>
        <title>Divine Braids | Premium Hair Braiding Salon</title>
        <meta name="description" content="Experience luxury hair braiding services at Divine Braids. Book your appointment today for box braids, knotless braids, feed-ins, and more." />
      </Helmet>
      
      <PageTransition>
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />
      </PageTransition>
    </>
  );
}
