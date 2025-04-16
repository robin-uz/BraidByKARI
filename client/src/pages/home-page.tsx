import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import FeatureSection from "@/components/home/feature-section";
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
        <title>KARI STYLEZ | Luxury Hair Braiding Salon</title>
        <meta name="description" content="Experience premium hair braiding at KARI STYLEZ. Our expert stylists create stunning box braids, knotless braids, feed-ins, and more. Book now!" />
      </Helmet>
      
      <PageTransition>
        <HeroSection />
        <FeatureSection />
        <ServicesSection />
        <TestimonialsSection />
      </PageTransition>
    </>
  );
}
