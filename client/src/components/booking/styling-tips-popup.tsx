import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  Sparkles, 
  Star, 
  Timer, 
  X, 
  Scissors, 
  ShowerHead, 
  Palette, 
  Heart,
  Sprout,
  ShoppingBag,
  Calendar,
  InfoIcon,
  Plus,
  ImageIcon
} from "lucide-react";
import { BookingFormData } from "@shared/schema";
import { motion, AnimatePresence, MotionValue, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

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

  // Mouse parallax effect setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) / 20;
    const offsetY = (e.clientY - rect.top - rect.height / 2) / 20;
    
    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };
  
  // Smoothed values for better animation
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  // Get icon by category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "care": return <ShowerHead className="h-5 w-5" />;
      case "maintenance": return <Scissors className="h-5 w-5" />;
      case "styling": return <Palette className="h-5 w-5" />;
      default: return <InfoIcon className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-2xl md:max-w-4xl p-0 overflow-hidden bg-white dark:bg-neutral-900 rounded-xl border-0 shadow-2xl">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
              className="w-28 h-28 relative mb-8"
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-200 dark:bg-purple-900/30"
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.7, 0.9, 0.7],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full bg-purple-100 dark:bg-purple-800/30"
                animate={{ 
                  scale: [1, 1.1, 1], 
                  opacity: [0.8, 1, 0.8],
                  rotate: [0, -5, 0, 5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <motion.h3 
              className="text-2xl font-semibold text-purple-700 dark:text-purple-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            >
              Creating Your Personal Style Guide
            </motion.h3>
            <motion.p 
              className="text-neutral-600 dark:text-neutral-400 text-center mt-2 max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            >
              Our stylists are customizing care tips and styling recommendations for your new {serviceType} style...
            </motion.p>
            
            <motion.div
              className="mt-6 flex space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { delay: 0.8 } 
              }}
            >
              {["Care", "Maintenance", "Styling"].map((item, i) => (
                <motion.div 
                  key={item} 
                  className="h-2 w-2 rounded-full bg-purple-400 dark:bg-purple-600"
                  animate={{ 
                    opacity: [0.5, 1, 0.5], 
                    scale: [0.8, 1, 0.8] 
                  }}
                  transition={{ 
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Top Navbar */}
            <div className="sticky top-0 z-10 flex justify-between items-center bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4">
              <div className="flex items-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-medium text-white">Divine Braids Style Guide</h2>
                  <p className="text-xs text-white/80">Personalized for your {serviceType}</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full p-0 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center items-center px-4 py-3 bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-950">
              <Tabs 
                defaultValue="overview" 
                value={currentPage}
                onValueChange={(val) => setCurrentPage(val as "overview" | "detailed" | "products")}
                className="w-full max-w-lg"
              >
                <TabsList className="grid grid-cols-3 bg-purple-100/50 dark:bg-purple-900/20">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200 flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 mr-1.5" /> 
                    <span>Quick Tips</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="detailed"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200 flex items-center justify-center"
                  >
                    <ImageIcon className="h-4 w-4 mr-1.5" />
                    <span>Style Guide</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200 flex items-center justify-center"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    <span>Products</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
                  className="px-6 py-6"
                  onMouseMove={handleMouseMove}
                >
                  <motion.div className="text-center max-w-lg mx-auto mb-6">
                    <motion.div 
                      variants={itemVariants}
                      className="inline-flex items-center justify-center p-1 px-3 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 text-xs font-medium text-purple-700 dark:text-purple-300 mb-3"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> 
                      <span>Your appointment is confirmed</span>
                    </motion.div>
                    
                    <motion.h3 
                      variants={itemVariants}
                      className="text-2xl font-semibold mb-2 text-purple-700 dark:text-purple-300"
                    >
                      Care Tips for Your {serviceType}
                    </motion.h3>
                    
                    <motion.p 
                      variants={itemVariants}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      Thank you for booking with Divine Braids! Here are personalized tips to help your style last longer between appointments.
                    </motion.p>
                  </motion.div>
                  
                  {/* Bento Box Grid for Quick Tips */}
                  <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto"
                  >
                    {/* Featured Tip */}
                    <motion.div 
                      variants={itemVariants}
                      className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/10 rounded-xl overflow-hidden shadow-sm border border-purple-100 dark:border-purple-800/30"
                    >
                      <div className="p-5 h-full flex flex-col">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-full bg-purple-200 dark:bg-purple-700/40 flex items-center justify-center mr-3">
                            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                          </div>
                          <h4 className="font-semibold text-lg text-purple-700 dark:text-purple-300">Essential Care Guide</h4>
                        </div>
                        
                        <div className="flex-grow space-y-4">
                          {quickTips.slice(0, 3).map((tip, idx) => (
                            <motion.div 
                              key={idx}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ 
                                opacity: 1, 
                                x: 0,
                                transition: { delay: 0.3 + (idx * 0.1) }
                              }}
                            >
                              <div className="h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                <Check className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                              </div>
                              <span className="text-neutral-700 dark:text-neutral-300">{tip}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-800/20">
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            Follow these essential tips for the first few days after your appointment.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Additional Tips in Smaller Cards */}
                    {quickTips.slice(3).map((tip, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="p-4 h-full flex flex-col">
                          <div className="flex items-center mb-3">
                            <div className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2.5">
                              {idx === 0 ? (
                                <ShowerHead className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
                              ) : idx === 1 ? (
                                <Sprout className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
                              ) : (
                                <Scissors className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Tip #{idx + 4}</p>
                          </div>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">{tip}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Duration Card */}
                    <motion.div 
                      variants={itemVariants}
                      className="md:col-span-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                            <Timer className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">Style Duration & Maintenance</h4>
                            <p className="text-white/80 text-sm">
                              With proper care, your {serviceType} should last 6-8 weeks. Schedule your next appointment 1-2 weeks before your style's expected end date.
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setCurrentPage("detailed");
                            setCurrentTipIndex(0);
                            setCurrentTab("care");
                          }}
                          variant="secondary"
                          className="bg-white text-purple-700 hover:bg-white/90 whitespace-nowrap ml-4 hidden md:flex"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          View Style Guide
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex justify-center mt-6 md:hidden">
                    <Button 
                      onClick={() => {
                        setCurrentPage("detailed");
                        setCurrentTipIndex(0);
                        setCurrentTab("care");
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
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
                  onMouseMove={handleMouseMove}
                >
                  <div className="px-6 pt-6 pb-3">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-lg mx-auto text-center mb-4"
                    >
                      <Badge 
                        className="mb-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-1 px-3 rounded-full"
                      >
                        {getCategoryIcon(currentTab)}
                        <span className="ml-1.5">{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</span>
                      </Badge>
                      <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Expert {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Guide
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Swipe through our styling tips to get the most out of your new {serviceType}.
                      </p>
                    </motion.div>
                    
                    <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab} className="w-full">
                      <TabsList className="w-full max-w-md mx-auto rounded-full p-1 bg-purple-100/50 dark:bg-purple-900/20 mb-6">
                        <TabsTrigger 
                          value="care" 
                          className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
                        >
                          <ShowerHead className="h-4 w-4 mr-1.5" />
                          Care
                        </TabsTrigger>
                        <TabsTrigger 
                          value="maintenance" 
                          className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
                        >
                          <Scissors className="h-4 w-4 mr-1.5" />
                          Maintenance
                        </TabsTrigger>
                        <TabsTrigger 
                          value="styling" 
                          className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
                        >
                          <Palette className="h-4 w-4 mr-1.5" />
                          Styling
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <AnimatePresence mode="wait">
                      {filteredTips.length > 0 && (
                        <motion.div 
                          key={`${currentTab}-${currentTipIndex}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="max-w-4xl mx-auto"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <motion.div 
                                className="rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-square relative mb-4 shadow-md"
                                style={{ perspective: 1000 }}
                              >
                                <motion.img 
                                  src={filteredTips[currentTipIndex].imageUrl} 
                                  alt={filteredTips[currentTipIndex].title} 
                                  className="w-full h-full object-cover"
                                  style={{
                                    scale: 1.1,
                                    rotateY: useTransform(smoothX, [-10, 10], [2, -2]),
                                    rotateX: useTransform(smoothY, [-10, 10], [-2, 2]),
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                
                                {/* Navigation controls - absolute positioned over image */}
                                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={handlePrevTip}
                                    disabled={currentTipIndex === 0}
                                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 disabled:opacity-40"
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                  </Button>
                                  
                                  <span className="text-sm text-white font-medium px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                                    {currentTipIndex + 1} / {filteredTips.length}
                                  </span>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={handleNextTip}
                                    disabled={currentTipIndex === filteredTips.length - 1}
                                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 disabled:opacity-40"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                              
                              {/* Mini thumbnail navigation */}
                              <div className="flex justify-center space-x-2 mb-4 md:mb-0">
                                {filteredTips.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentTipIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      currentTipIndex === idx 
                                        ? 'bg-purple-600 w-6' 
                                        : 'bg-purple-200 dark:bg-purple-800'
                                    }`}
                                    aria-label={`View tip ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 h-full">
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }} 
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-start mb-4"
                                >
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center mr-4 flex-shrink-0">
                                    {getCategoryIcon(currentTab)}
                                  </div>
                                  
                                  <div>
                                    <Badge className="mb-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                      Tip {currentTipIndex + 1}
                                    </Badge>
                                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-1">
                                      {filteredTips[currentTipIndex].title}
                                    </h3>
                                  </div>
                                </motion.div>
                                
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="space-y-4"
                                >
                                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    {filteredTips[currentTipIndex].description}
                                  </p>
                                  
                                  <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                                        <Lightbulb className="h-4 w-4 mr-1.5" />
                                        <span>Stylist Recommended</span>
                                      </div>
                                      
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setCurrentPage("products")}
                                        className="text-xs border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300"
                                      >
                                        <ShoppingBag className="h-3 w-3 mr-1.5" />
                                        View Products
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              {currentPage === "products" && (
                <motion.div 
                  key="products"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                  className="px-6 py-6"
                  onMouseMove={handleMouseMove}
                >
                  <motion.div 
                    className="mb-8 max-w-lg mx-auto text-center"
                    variants={itemVariants}
                  >
                    <Badge 
                      className="mb-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-1.5 px-3 rounded-full"
                    >
                      <Heart className="w-3.5 h-3.5 mr-1.5" /> Stylist Picks
                    </Badge>
                    
                    <h3 className="text-2xl font-semibold mb-2 text-purple-700 dark:text-purple-300">
                      Recommended Products
                    </h3>
                    
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Our stylists have hand-selected these quality products to help you maintain your {serviceType} between salon visits.
                    </p>
                  </motion.div>
                  
                  {/* Bento Box Grid for Products */}
                  <div className="max-w-4xl mx-auto">
                    <motion.div 
                      variants={containerVariants}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    >
                      {/* Featured product */}
                      <motion.div
                        variants={itemVariants}
                        style={{
                          perspective: 2000,
                        }}
                        className="md:row-span-2 relative"
                      >
                        <motion.div
                          style={{
                            rotateY: useTransform(smoothX, [-5, 5], [5, -5]),
                            rotateX: useTransform(smoothY, [-5, 5], [-5, 5]),
                          }}
                          className="bg-gradient-to-br from-purple-100 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/20 rounded-2xl overflow-hidden h-full shadow-lg border border-purple-200/50 dark:border-purple-800/30"
                        >
                          <div className="p-6 flex flex-col h-full">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden mb-5 aspect-square">
                              <motion.img 
                                src={products[0]?.imageUrl} 
                                alt={products[0]?.name} 
                                className="w-full h-full object-cover"
                                style={{
                                  scale: 1.05,
                                  translateX: useTransform(smoothX, [-5, 5], [-3, 3]),
                                  translateY: useTransform(smoothY, [-5, 5], [-3, 3]),
                                }}
                              />
                            </div>
                            
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-semibold text-purple-700 dark:text-purple-300">{products[0]?.name}</h4>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(products[0]?.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-300 dark:text-neutral-600'} mr-0.5`} />
                                  ))}
                                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 ml-1">
                                    {products[0]?.rating}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-purple-500/10 text-purple-700 dark:bg-purple-300/10 dark:text-purple-300 hover:bg-purple-500/20">
                                Best Seller
                              </Badge>
                            </div>
                            
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 flex-grow">
                              {products[0]?.description}
                            </p>
                            
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                              <ShoppingBag className="mr-2 h-4 w-4" /> Shop Now
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                      
                      {/* Other products in grid */}
                      {products.slice(1).map((product, idx) => (
                        <motion.div
                          key={idx}
                          variants={itemVariants}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          className={`overflow-hidden rounded-xl shadow-md ${idx === 0 ? 'md:col-span-2' : ''}`}
                        >
                          <div className="bg-white dark:bg-neutral-800 h-full flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm">
                                  {product.rating} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-1" />
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="p-4 flex flex-col flex-grow">
                              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{product.name}</h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 flex-grow">{product.description}</p>
                              <Button variant="outline" size="sm" className="mt-auto text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <motion.div
                      variants={itemVariants}
                      className="mt-8 text-center"
                    >
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        Available at Divine Braids Salon or from our recommended online partners
                      </p>
                      <Button variant="outline" className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        <ShoppingBag className="mr-2 h-4 w-4" /> 
                        Browse All Products
                      </Button>
                    </motion.div>
                  </div>
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