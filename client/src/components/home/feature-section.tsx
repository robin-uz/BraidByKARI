import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Import the huge image from assets
import hugeImage from "@assets/IMG-20250416-WA0014.jpg";

export default function FeatureSection() {
  return (
    <section className="py-20 overflow-hidden">
      {/* Full-width large image container */}
      <div className="relative w-full">
        {/* Massive image that spans the full width */}
        <div className="relative h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
          
          <img 
            src={hugeImage} 
            alt="KARI STYLEZ Salon Experience"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
          {/* Text overlay - positioned on the left side */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">LUXURY HAIR EXPERIENCE</span>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                    YOUR CROWN <br/>
                    <span className="text-amber-400">DESERVES THE BEST</span>
                  </h2>
                  
                  <p className="text-white/90 text-xl mb-8 max-w-xl">
                    At KARI STYLEZ, we don't just braid hair – we create wearable art that celebrates your unique beauty. 
                    Our skilled stylists transform ordinary into extraordinary with every twist and pattern.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link href="/booking">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-lg font-semibold shadow-xl shadow-amber-900/20 transition-all"
                      >
                        BOOK YOUR TRANSFORMATION
                      </motion.button>
                    </Link>
                    
                    <Link href="/gallery">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white/10 border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm text-white rounded-full text-lg font-semibold transition-all flex items-center"
                      >
                        VIEW OUR WORK
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats bar with dramatic numbers */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-amber-200 font-medium">Years of Excellence</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-amber-200 font-medium">Happy Clients</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-amber-200 font-medium">Exclusive Styles</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-amber-200 font-medium">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}