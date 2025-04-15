import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Divine Braids | Premium Hair Braiding Salon</title>
        <meta name="description" content="Experience luxury hair braiding services at Divine Braids. Book your appointment today for box braids, knotless braids, feed-ins, and more." />
      </Helmet>
      
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
    </>
  );
}
