import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Lightbulb, Sparkles, Star, Timer, X } from "lucide-react";
import { BookingFormData } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StylingTipsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingFormData | null;
}

// Specific tip with image and description
interface TipItem {
  title: string;
  description: string;
  imageUrl: string;
  category: "care" | "maintenance" | "styling"; 
}

// Related product/tool recommendation
interface ProductRecommendation {
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export default function StylingTipsPopup({ isOpen, onClose, bookingData }: StylingTipsPopupProps) {
  const [tipItems, setTipItems] = useState<TipItem[]>([]);
  const [quickTips, setQuickTips] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [serviceType, setServiceType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<"overview" | "detailed" | "products">("overview");
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<string>("care");

  useEffect(() => {
    if (isOpen && bookingData) {
      setLoading(true);
      setCurrentPage("overview");
      
      // Extract the service type
      const selectedService = bookingData.serviceType || "";
      setServiceType(selectedService);
      
      // Generate personalized tips based on the service
      const generatedQuickTips = getQuickTips(selectedService);
      setQuickTips(generatedQuickTips);
      
      // Get detailed tips with images
      const detailedTips = getDetailedTips(selectedService);
      setTipItems(detailedTips);
      
      // Get product recommendations
      const recommendedProducts = getProductRecommendations(selectedService);
      setProducts(recommendedProducts);
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    }
  }, [isOpen, bookingData]);

  // Function to return quick tips based on service type
  const getQuickTips = (service: string): string[] => {
    // Default tips for all services
    const defaultTips = [
      "Avoid washing your hair for at least 48 hours after installation.",
      "Sleep with a satin bonnet or pillowcase to prevent frizz.",
      "Moisturize your scalp regularly with lightweight oils."
    ];

    // Service-specific tips
    if (service.toLowerCase().includes("box")) {
      return [
        "Moisturize your scalp 2-3 times a week with lightweight oil.",
        "Avoid excessive pulling or tension on your braids.",
        "Apply mousse to reduce frizz and maintain neatness.",
        "Use a silk scarf at night to preserve style.",
        "Dilute shampoo with water when washing."
      ];
    } 
    else if (service.toLowerCase().includes("knotless")) {
      return [
        "Oil your scalp 2-3 times weekly for moisture.",
        "Clean parts with alcohol-free witch hazel.",
        "Avoid heavy products that cause build-up.",
        "Refresh edges with light control product.",
        "Focus washing on scalp rather than braid length."
      ];
    }
    else if (service.toLowerCase().includes("feed-in")) {
      return [
        "Use light hold edge control for flyaways.",
        "Minimize braid manipulation to prevent loosening.",
        "Apply leave-in conditioner spray for moisture.",
        "Touch up edges with gel for a neat look.",
        "Sleep with a silk scarf to maintain pattern."
      ];
    }
    else {
      // Return default tips for other services
      return defaultTips;
    }
  };

  // Function to return detailed tips with images based on service type
  const getDetailedTips = (service: string): TipItem[] => {
    const isFeedIn = service.toLowerCase().includes("feed-in");
    const isKnotless = service.toLowerCase().includes("knotless");
    const isBox = service.toLowerCase().includes("box");
    
    const tipItems: TipItem[] = [
      // Care tips (common for most styles)
      {
        title: "Nighttime Protection",
        description: "Always wrap your hair with a silk or satin scarf before bed to preserve your style and reduce frizz. This also helps extend the life of your braids by weeks.",
        imageUrl: "https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?q=80&w=500&auto=format&fit=crop",
        category: "care"
      },
      {
        title: "Hydration Is Key",
        description: "Spritz your braids with a mixture of water, leave-in conditioner, and lightweight oil 2-3 times per week to maintain moisture balance.",
        imageUrl: "https://images.unsplash.com/photo-1643057752896-b6fb3a85e9ba?q=80&w=500&auto=format&fit=crop",
        category: "care"
      },
      {
        title: "Scalp Health",
        description: "Use a applicator bottle with diluted tea tree or peppermint oil to soothe and cleanse your scalp without disturbing your braids.",
        imageUrl: "https://images.unsplash.com/photo-1581392327984-f86339c9c66f?q=80&w=500&auto=format&fit=crop",
        category: "care"
      },
      
      // Maintenance tips
      {
        title: "Edge Control",
        description: "To maintain your edges between appointments, use a small amount of edge control and a soft brush. Apply in the direction of your style for a natural look.",
        imageUrl: "https://images.unsplash.com/photo-1557387966-a3a715c56e13?q=80&w=500&auto=format&fit=crop",
        category: "maintenance"
      },
      {
        title: "Washing Technique",
        description: isBox ? 
          "For box braids, focus on cleaning your scalp rather than the braids themselves. Use a diluted shampoo in an applicator bottle and rinse thoroughly." :
          "Gently massage your scalp with diluted shampoo, being careful not to disturb your braids. Rinse thoroughly and allow to air dry completely.",
        imageUrl: "https://images.unsplash.com/photo-1579803815615-1e3e4a7a8076?q=80&w=500&auto=format&fit=crop",
        category: "maintenance"
      },
      {
        title: "Frizz Management",
        description: isKnotless ? 
          "For knotless braids, smooth any frizz with a light mousse applied with your palms rather than directly to prevent product buildup." :
          "Control frizz by applying a small amount of mousse to your hands and gently smoothing over your braids. Focus on the ends and hairline.",
        imageUrl: "https://images.unsplash.com/photo-1602651956220-3d118736b4b2?q=80&w=500&auto=format&fit=crop",
        category: "maintenance"
      },
      
      // Styling tips
      {
        title: "Half-Up Styles",
        description: "Create a stylish half-up look by gathering the top section of your braids into a high ponytail or bun. Secure with a satin scrunchie to prevent damage.",
        imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=500&auto=format&fit=crop",
        category: "styling"
      },
      {
        title: "Accessorize",
        description: "Elevate your braids with hair cuffs, beads, or colorful thread wraps. These accessories not only add style but can help secure ends and reduce frizz.",
        imageUrl: "https://images.unsplash.com/photo-1526743087790-e3bcf657372e?q=80&w=500&auto=format&fit=crop",
        category: "styling"
      },
      {
        title: "Special Occasion Updo",
        description: isFeedIn ? 
          "For feed-in braids, create a beautiful halo or crown effect by wrapping longer braids around your head and securing with bobby pins." :
          "Gather your braids into a loose, high bun with a few face-framing pieces left out for a soft, elegant look perfect for special occasions.",
        imageUrl: "https://images.unsplash.com/photo-1604074131665-7a5a1f501be4?q=80&w=500&auto=format&fit=crop",
        category: "styling"
      }
    ];
    
    return tipItems;
  };

  // Function to return product recommendations based on service type
  const getProductRecommendations = (service: string): ProductRecommendation[] => {
    const isBox = service.toLowerCase().includes("box");
    const isKnotless = service.toLowerCase().includes("knotless");
    
    return [
      {
        name: "Moisture Sealing Oil",
        description: "Lightweight oil blend with jojoba, argan, and vitamin E to seal in moisture without causing buildup.",
        imageUrl: "https://images.unsplash.com/photo-1608571423901-ecd71c026b86?q=80&w=500&auto=format&fit=crop",
        rating: 4.8
      },
      {
        name: "Silk Lined Bonnet",
        description: "Reversible satin bonnet with silk lining to preserve your style overnight and prevent friction damage.",
        imageUrl: "https://images.unsplash.com/photo-1583309218688-391c98ae5b42?q=80&w=500&auto=format&fit=crop",
        rating: 4.9
      },
      {
        name: isBox ? "Scalp Relief Spray" : "Edge Control Gel",
        description: isBox ? 
          "Cooling peppermint and tea tree spray to soothe and refresh your scalp without disturbing your box braids." :
          "Alcohol-free edge control for smooth, long-lasting hold without flaking or buildup.",
        imageUrl: isBox ? 
          "https://images.unsplash.com/photo-1608571424266-0cedee88204e?q=80&w=500&auto=format&fit=crop" :
          "https://images.unsplash.com/photo-1609975103271-8ac62e7e3060?q=80&w=500&auto=format&fit=crop",
        rating: isBox ? 4.7 : 4.6
      },
      {
        name: isKnotless ? "Braid Sheen Spray" : "Mousse Defining Foam",
        description: isKnotless ? 
          "Lightweight spray with UV protection to add shine and protect knotless braids from environmental damage." :
          "Alcohol-free mousse that adds definition and reduces frizz without making your braids stiff or sticky.",
        imageUrl: isKnotless ? 
          "https://images.unsplash.com/photo-1606202650963-30cbc33576d1?q=80&w=500&auto=format&fit=crop" :
          "https://images.unsplash.com/photo-1631730486572-471386684cea?q=80&w=500&auto=format&fit=crop",
        rating: isKnotless ? 4.5 : 4.8
      }
    ];
  };

  // Get filtered tips based on current tab
  const filteredTips = tipItems.filter(tip => tip.category === currentTab);

  // Navigation handlers
  const handleNextTip = () => {
    setCurrentTipIndex(prev => 
      prev < filteredTips.length - 1 ? prev + 1 : prev
    );
  };
  
  const handlePrevTip = () => {
    setCurrentTipIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05, 
        staggerDirection: -1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { y: -20, opacity: 0 }
  };
  
  const pageTransition = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-xl md:max-w-2xl p-0 overflow-hidden bg-white dark:bg-neutral-900 rounded-lg border-0 shadow-2xl">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
              className="w-24 h-24 relative mb-8"
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-200 dark:bg-purple-900/30"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-3 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold text-purple-700 dark:text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              Creating Your Personal Style Guide
            </motion.h3>
            <motion.p 
              className="text-neutral-600 dark:text-neutral-400 text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              Our experts are personalizing care tips for your new {serviceType}...
            </motion.p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Top Navbar */}
            <div className="sticky top-0 z-10 flex justify-between items-center bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3">
              <div className="flex items-center">
                <Lightbulb className="w-5 h-5 text-white mr-2" />
                <h2 className="text-lg font-medium text-white">Style Guide: {serviceType}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex justify-between px-4 py-2 bg-purple-50 dark:bg-purple-900/10">
              <div className="flex space-x-1 overflow-x-auto">
                <Button
                  variant={currentPage === "overview" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage("overview")}
                  className={
                    currentPage === "overview" 
                      ? "bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200" 
                      : "text-purple-700 dark:text-purple-300"
                  }
                >
                  Quick Tips
                </Button>
                <Button
                  variant={currentPage === "detailed" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentPage("detailed");
                    setCurrentTipIndex(0);
                  }}
                  className={
                    currentPage === "detailed" 
                      ? "bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200" 
                      : "text-purple-700 dark:text-purple-300"
                  }
                >
                  Styling Guide
                </Button>
                <Button
                  variant={currentPage === "products" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage("products")}
                  className={
                    currentPage === "products" 
                      ? "bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200" 
                      : "text-purple-700 dark:text-purple-300"
                  }
                >
                  Recommended Products
                </Button>
              </div>
            </div>
            
            {/* Content Pages */}
            <AnimatePresence mode="wait">
              {currentPage === "overview" && (
                <motion.div 
                  key="overview"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                  className="px-4 py-6"
                >
                  <div className="mb-6">
                    <motion.h3 
                      variants={itemVariants}
                      className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300"
                    >
                      Care Tips for Your {serviceType}
                    </motion.h3>
                    <motion.p 
                      variants={itemVariants}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      Thank you for booking with Divine Braids! Here are personalized tips to help your style last longer between appointments.
                    </motion.p>
                  </div>
                  
                  <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                  >
                    {quickTips.map((tip, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 flex items-start"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Check className="mr-3 h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">{tip}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-xl p-4 mb-4"
                  >
                    <div className="flex items-center mb-2">
                      <Timer className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300">Style Duration</h4>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      With proper care, your {serviceType} should last 6-8 weeks. Schedule your next appointment 1-2 weeks before your style's expected end date.
                    </p>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex justify-center mt-6">
                    <Button 
                      onClick={() => {
                        setCurrentPage("detailed");
                        setCurrentTipIndex(0);
                        setCurrentTab("care");
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      View Detailed Styling Guide
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              
              {currentPage === "detailed" && (
                <motion.div 
                  key="detailed"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  className="flex flex-col h-full"
                >
                  <Tabs defaultValue="care" value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <div className="px-4 pt-4">
                      <TabsList className="w-full bg-purple-100 dark:bg-purple-900/20">
                        <TabsTrigger value="care" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                          Care
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                          Maintenance
                        </TabsTrigger>
                        <TabsTrigger value="styling" className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                          Styling
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value={currentTab} className="m-0 outline-none">
                      <AnimatePresence mode="wait">
                        {filteredTips.length > 0 && (
                          <motion.div 
                            key={`${currentTab}-${currentTipIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-6 pt-4"
                          >
                            <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 bg-neutral-100 dark:bg-neutral-800 relative">
                              <img 
                                src={filteredTips[currentTipIndex].imageUrl} 
                                alt={filteredTips[currentTipIndex].title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <Badge className="mb-2 bg-purple-500 hover:bg-purple-600">
                                  {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                                </Badge>
                                <h3 className="text-xl font-semibold text-white">{filteredTips[currentTipIndex].title}</h3>
                              </div>
                            </div>
                            
                            <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                              {filteredTips[currentTipIndex].description}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={handlePrevTip}
                                disabled={currentTipIndex === 0}
                                className="border-purple-300 text-purple-700 hover:bg-purple-100 
                                           dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/40"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                {currentTipIndex + 1} / {filteredTips.length}
                              </span>
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={handleNextTip}
                                disabled={currentTipIndex === filteredTips.length - 1}
                                className="border-purple-300 text-purple-700 hover:bg-purple-100 
                                           dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/40"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
              
              {currentPage === "products" && (
                <motion.div 
                  key="products"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                  className="px-4 py-6"
                >
                  <motion.h3 
                    variants={itemVariants}
                    className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300"
                  >
                    Recommended Products
                  </motion.h3>
                  <motion.p 
                    variants={itemVariants}
                    className="text-neutral-600 dark:text-neutral-400 mb-6"
                  >
                    These specially selected products will help you maintain your {serviceType} between salon visits.
                  </motion.p>
                  
                  <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {products.map((product, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-purple-700 dark:text-purple-300">{product.name}</h4>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
                              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{product.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{product.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bottom action bar */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 mt-auto">
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
              >
                Got It, Thanks!
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}