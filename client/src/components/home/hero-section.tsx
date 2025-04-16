import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Star, Crown, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import braidsModel1 from "@/assets/braids-model-1.png";
import braidsModel2 from "@/assets/braids-model-2.png";

export default function HeroSection() {
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
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-24 md:min-h-screen flex flex-col justify-center">
      {/* Background gradient with artistic elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-fuchsia-900 dark:from-purple-950 dark:via-purple-900 dark:to-fuchsia-950 z-0"></div>
      
      {/* Artistic floating circles */}
      <motion.div 
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-purple-600/10 blur-3xl z-0"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }} 
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 right-[5%] w-80 h-80 rounded-full bg-fuchsia-600/10 blur-3xl z-0"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
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
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4"
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
                <Star className="h-4 w-4 mr-2 text-yellow-300" fill="currentColor" />
                Trending Styles for 2025
              </span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
            >
              <span className="inline-block relative">
                <span className="relative z-10">Artistry</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full z-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-200">
                in Every Braid
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg text-purple-100/90 dark:text-purple-100/80 max-w-xl leading-relaxed"
            >
              Experience hair transformation through expert craftsmanship. Our braiding salon combines tradition with modern artistry to create styles as unique as you are.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/booking">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white border-0 shadow-lg shadow-purple-900/30 rounded-xl">
                    Book Appointment
                  </Button>
                </motion.div>
              </Link>
              <Link href="/gallery">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="text-base px-8 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-purple-300/20 hover:border-purple-300/30 rounded-xl">
                    Explore Gallery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Trust badge */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex items-center"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-purple-400/20 border-2 border-purple-300/40 flex items-center justify-center text-xs text-white font-medium">
                    {i+1}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-300" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-purple-200/80">Trusted by 500+ clients</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right content - Images */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 relative min-h-[400px] sm:min-h-[500px] flex items-center"
          >
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              {/* Circular accent */}
              <motion.div 
                className="absolute w-[90%] h-[90%] rounded-full border-2 border-dashed border-purple-400/30 z-0"
                animate={{ 
                  rotate: 360,
                }}
                transition={{
                  duration: 100,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Main image */}
              <motion.div 
                className="absolute left-[10%] top-[5%] w-[70%] h-[70%] z-20 origin-bottom"
                variants={floatVariants}
                animate="animate"
              >
                <div className="relative w-full h-full">
                  <motion.div 
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-purple-500/20 to-fuchsia-500/20 backdrop-blur-sm p-1.5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <img 
                      src={braidsModel1} 
                      alt="Beautiful braided hairstyle" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg p-2 shadow-lg"
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
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-fuchsia-500/20 to-purple-500/20 backdrop-blur-sm p-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <img 
                      src={braidsModel2} 
                      alt="Natural curly hairstyle" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-lg p-2 shadow-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Services Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative mt-16 md:mt-20 py-6 bg-white/10 dark:bg-white/5 backdrop-blur-md z-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center">
              <Scissors className="mr-2 h-5 w-5 text-fuchsia-300" />
              <span>Our Signature Services</span>
            </h3>
            
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "Box Braids", icon: "box" },
                { name: "Knotless", icon: "knot" },
                { name: "Feed-in Braids", icon: "feed" },
                { name: "Artistic Updos", icon: "art" }
              ].map((service, index) => (
                <motion.div 
                  key={service.name}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <div className="bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300">
                    <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-purple-500/80 to-fuchsia-500/80 flex items-center justify-center">
                      {service.icon === "box" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                        </svg>
                      )}
                      {service.icon === "knot" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                          <path d="M4 22h16"></path>
                          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                        </svg>
                      )}
                      {service.icon === "feed" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                          <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                          <path d="M17 21h-1a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h1"></path>
                          <path d="M8 4a2 2 0 1 1 4 0v12a2 2 0 1 1-4 0V4Z"></path>
                          <path d="M16 4a2 2 0 1 0-4 0v12a2 2 0 1 0 4 0V4Z"></path>
                        </svg>
                      )}
                      {service.icon === "art" && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                        </svg>
                      )}
                    </div>
                    <h4 className="font-medium text-base md:text-lg text-white">{service.name}</h4>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        background: [
                          "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(217, 70, 239, 0.2))",
                          "linear-gradient(to right, rgba(147, 51, 234, 0.3), rgba(217, 70, 239, 0.3))",
                          "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(217, 70, 239, 0.2))"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
