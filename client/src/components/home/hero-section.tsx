import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroContainer, ResponsiveText } from '@/components/ui/container';

interface HeroImage {
  url: string;
  alt: string;
  heading: string;
  subheading: string;
}

// Define hero images
const HERO_IMAGES: HeroImage[] = [
  {
    url: '/images/hero-braids-1.jpg',
    alt: 'Woman with elegant box braids',
    heading: 'LUXURY BRAIDING EXPERIENCE',
    subheading: 'Where skill meets artistry in every strand',
  },
  {
    // Temp placeholders - these will be replaced with the real images
    url: '/images/hero-braids-1.jpg',
    alt: 'Woman with stylish knotless braids',
    heading: 'ELEVATE YOUR NATURAL BEAUTY',
    subheading: 'Premium styles that celebrate your unique essence',
  },
  {
    // Temp placeholders - these will be replaced with the real images
    url: '/images/hero-braids-1.jpg',
    alt: 'Woman with detailed hair braiding',
    heading: 'MASTER CRAFTED STYLES',
    subheading: 'Detail-oriented artistry for unforgettable looks',
  },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, navigate] = useLocation();
  
  // Image rotation every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleBookClick = () => {
    navigate('/booking');
  };
  
  const handleExploreClick = () => {
    navigate('/services');
  };
  
  return (
    <HeroContainer className="relative overflow-hidden">
      {/* Background rotating images with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentImageIndex].url})` }}
          />
          {/* Gradient overlay for readability - follows spec */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[var(--gutter-mobile)] sm:px-[var(--gutter-tablet)] lg:px-[var(--gutter)]">
        <div className="max-w-5xl">
          {/* Animated text content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Gold gradient styling for main heading */}
              <div className="mb-4">
                <ResponsiveText 
                  as="h1" 
                  variant="display"
                  className="font-bold text-white drop-shadow-lg tracking-wider font-serif"
                >
                  <span className="bg-gradient-to-r from-amber-300 to-amber-600 text-transparent bg-clip-text">
                    {HERO_IMAGES[currentImageIndex].heading}
                  </span>
                </ResponsiveText>
              </div>
              
              <ResponsiveText 
                variant="h3"
                className="text-neutral-200 mb-10 max-w-2xl drop-shadow-md font-light"
              >
                {HERO_IMAGES[currentImageIndex].subheading}
              </ResponsiveText>
            </motion.div>
          </AnimatePresence>
          
          {/* CTA Buttons - size follows spec */}
          <div className="flex flex-col sm:flex-row gap-[var(--hero-button-gap-mobile)] sm:gap-[var(--hero-button-gap)]">
            <Button 
              onClick={handleBookClick}
              size="lg"
              className={cn(
                "bg-amber-600 hover:bg-amber-700 text-white",
                "w-full sm:w-[var(--hero-button-width)]",
                "h-[var(--hero-button-height-mobile)] sm:h-[var(--hero-button-height)]",
                "shadow-lg text-base"
              )}
            >
              Book Appointment
            </Button>
            
            <Button 
              onClick={handleExploreClick}
              variant="outline"
              size="lg"
              className={cn(
                "bg-transparent border-2 border-amber-500 text-amber-300 hover:bg-amber-500/10",
                "w-full sm:w-[var(--hero-button-width)]",
                "h-[var(--hero-button-height-mobile)] sm:h-[var(--hero-button-height)]",
                "text-base"
              )}
            >
              Explore Services
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all focus:outline-none",
              index === currentImageIndex 
                ? "bg-amber-500 scale-110" 
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </HeroContainer>
  );
}