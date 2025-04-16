import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, ChevronDown, Crown } from "lucide-react";
import { motion } from "framer-motion";

// Import the HUGE image from assets for the BOLD hero section
import HUGE_IMAGE from "@assets/IMG-20250416-WA0019.jpg";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center">
      {/* HUGE full-screen image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HUGE_IMAGE} 
          alt="KARI STYLEZ Luxury Braiding Experience" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-10"></div>
      </div>
      
      {/* Artistic floating elements */}
      <motion.div 
        className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-amber-600/10 blur-3xl z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }} 
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-amber-500/10 blur-3xl z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }} 
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      {/* Content positioned over the image */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          {/* Crown icon and badge */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center mb-8"
          >
            <div className="bg-amber-500 p-4 rounded-full mr-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-amber-300 font-medium">PREMIUM SALON EXPERIENCE</span>
            </div>
          </motion.div>
          
          {/* HUGE text heading */}
          <motion.h1
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-none mb-6"
          >
            YOUR<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
              CROWN
            </span>
          </motion.h1>
          
          {/* Subheading with large bold text */}
          <motion.h2
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8"
          >
            DESERVES THE <span className="text-amber-400">BEST</span>
          </motion.h2>
          
          {/* Eye-catching description */}
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mb-10 leading-relaxed"
          >
            At KARI STYLEZ, we don't just create braids – 
            we craft masterpieces that celebrate your unique beauty 
            and transform your look into wearable art.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-6"
          >
            <Link href="/booking">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-full shadow-lg shadow-amber-800/30 transition-all"
              >
                BOOK NOW
              </motion.button>
            </Link>
            <Link href="/gallery">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/10 border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm text-white text-xl font-bold rounded-full transition-all flex items-center"
              >
                EXPLORE STYLES
                <ArrowRight className="ml-2 h-6 w-6" />
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex items-center"
          >
            <div className="flex -space-x-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-sm text-white font-bold">
                  {i+1}
                </div>
              ))}
            </div>
            <div className="ml-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-amber-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-lg text-amber-200 font-semibold">TRUSTED BY 5,000+ CLIENTS</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80 z-20"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-base font-medium mb-2">DISCOVER MORE</span>
        <ChevronDown className="h-8 w-8" />
      </motion.div>
    </section>
  );
}
