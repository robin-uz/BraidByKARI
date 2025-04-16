import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Star, Crown, Scissors, Heart, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import model1 from "@/assets/kari-stylez/braids-model-1.png";
import model2 from "@/assets/kari-stylez/braids-model-2.png";
import model3 from "@/assets/kari-stylez/braids-model-3.png";
import model4 from "@/assets/kari-stylez/braids-model-4.jpg";
import model5 from "@/assets/kari-stylez/braids-model-5.jpg";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    }
  };
  
  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  const shimmerVariants = {
    animate: {
      background: [
        "linear-gradient(90deg, rgba(216,154,62,0) 0%, rgba(216,154,62,0.1) 50%, rgba(216,154,62,0) 100%)",
        "linear-gradient(90deg, rgba(216,154,62,0) 0%, rgba(216,154,62,0.2) 50%, rgba(216,154,62,0) 100%)",
        "linear-gradient(90deg, rgba(216,154,62,0) 0%, rgba(216,154,62,0.1) 50%, rgba(216,154,62,0) 100%)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
      }
    }
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background gradient with artistic elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-700/90 dark:from-amber-950 dark:via-amber-900 dark:to-amber-800 z-0"></div>
      
      {/* Artistic pattern background */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Artistic floating circles */}
      <motion.div 
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-amber-600/10 blur-3xl z-0"
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
        className="absolute bottom-10 right-[5%] w-80 h-80 rounded-full bg-amber-500/10 blur-3xl z-0"
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
      
      {/* Diagonal shimmer effect */}
      <motion.div 
        className="absolute -inset-full h-[500%] w-[200%] rotate-[-30deg] z-0"
        variants={shimmerVariants}
        animate="animate"
      />
      
      <div className="container mx-auto px-4 relative z-10 pt-20 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6"
        >
          {/* Left content - Headline and buttons */}
          <motion.div 
            variants={itemVariants} 
            className="w-full lg:w-1/2 max-w-2xl"
          >
            <motion.div 
              className="mb-6 inline-block py-2 px-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white/90 dark:text-white/80 font-medium text-sm flex items-center">
                <Star className="h-4 w-4 mr-2 text-amber-300" fill="currentColor" />
                Trending Styles for 2025
              </span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
            >
              <span className="relative z-10">KARI</span>{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-200">
                STYLEZ
              </span>
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="h-2 w-40 bg-gradient-to-r from-amber-400 to-amber-500 rounded mt-4 mb-8"
            />
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg text-amber-100/90 dark:text-amber-100/80 max-w-xl leading-relaxed"
            >
              Elevate your look with artistically crafted braids and styles that capture your unique essence. At Kari Stylez, we transform hair into wearable art.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/booking">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button className="kari-button">
                    Book Appointment
                  </button>
                </motion.div>
              </Link>
              <Link href="/gallery">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="text-base px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-amber-300/20 hover:border-amber-300/30 rounded-lg">
                    Explore Gallery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Trust badge */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex items-center"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-300/40 flex items-center justify-center text-xs text-white font-medium">
                    {i+1}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-amber-200/90">Trusted by 500+ happy clients</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right content - Images */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 relative min-h-[450px] sm:min-h-[550px] flex items-center"
          >
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              {/* Circular accent */}
              <motion.div 
                className="absolute w-[95%] h-[95%] rounded-full border-2 border-dashed border-amber-400/20 z-0"
                animate={{ 
                  rotate: 360,
                }}
                transition={{
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Main image */}
              <motion.div 
                className="absolute left-[5%] top-[5%] w-[70%] h-[70%] z-20 origin-bottom"
                variants={floatVariants}
                animate="animate"
              >
                <div className="relative w-full h-full">
                  <motion.div 
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-500/20 to-amber-700/20 backdrop-blur-sm p-1.5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <img 
                      src={model1} 
                      alt="Beautiful braided hairstyle by Kari Stylez" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg p-2 shadow-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <Crown className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Second image */}
              <motion.div 
                className="absolute right-[5%] bottom-[5%] w-[60%] h-[60%] z-10 origin-top"
                variants={floatVariants}
                animate="animate"
                transition={{
                  delay: 0.5,
                }}
              >
                <div className="relative w-full h-full">
                  <motion.div 
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-600/20 to-amber-800/20 backdrop-blur-sm p-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <img 
                      src={model2} 
                      alt="Professional hair braiding at Kari Stylez" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg p-2 shadow-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <Heart className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80"
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
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </div>
      
      {/* Featured styles preview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative py-10 bg-white dark:bg-neutral-900 z-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-lg font-medium text-amber-600 mb-2">Featured Styles</h3>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-white">Our Latest Creations</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] group">
              <img src={model3} alt="Kari Stylez braiding style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-medium text-sm">Feed-In Braids</h4>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] group">
              <img src={model4} alt="Kari Stylez braiding style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-medium text-sm">Creative Pattern</h4>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] group">
              <img src={model5} alt="Kari Stylez braiding style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-medium text-sm">Geometric Design</h4>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] group hidden md:block">
              <img src={model1} alt="Kari Stylez braiding style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-medium text-sm">Classic Cornrows</h4>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] group hidden md:block">
              <img src={model2} alt="Kari Stylez braiding style" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-medium text-sm">Knotless Braids</h4>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/gallery">
              <button className="text-amber-600 font-medium flex items-center gap-2 mx-auto hover:text-amber-700 transition-colors">
                View All Styles <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
