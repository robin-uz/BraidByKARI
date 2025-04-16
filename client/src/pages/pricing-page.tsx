import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Info, 
  Scissors, 
  Clock, 
  Star, 
  ArrowRight, 
  ChevronRight, 
  ShoppingBag, 
  X, 
  Eye,
  Heart,
  Camera
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import ALL client's uploaded assets for the pricing page
import IMG_12 from "@assets/IMG-20250416-WA0012.jpg";
import IMG_14 from "@assets/IMG-20250416-WA0014.jpg";
import IMG_15 from "@assets/IMG-20250416-WA0015.jpg";
import IMG_17 from "@assets/IMG-20250416-WA0017.jpg";
import IMG_19 from "@assets/IMG-20250416-WA0019.jpg";
import IMG_21 from "@assets/IMG-20250416-WA0021.jpg";
import ORIGINAL_1 from "@assets/original-4615b5c15dcc315f9da6b52662293325.png";
import ORIGINAL_2 from "@assets/original-c34a69dc079e0dcad53963957bca37c2.jpg";
import ORIGINAL_3 from "@assets/original-d67a3486b1058ea1029c2096e9c77e05.png";

// Premium hairstyles with ALL client's uploaded images
const PREMIUM_STYLES = [
  {
    id: "premium-1",
    name: "Signature Box Braids",
    description: "Stunning long box braids for a rich, elegant look",
    duration: "4-5 hours",
    price: 220,
    image: IMG_21,
    popular: true,
    features: ["Premium colored extensions", "Heat-sealed ends", "Styling cream", "Aftercare kit"],
    tags: ["box-braids", "signature"]
  },
  {
    id: "premium-2",
    name: "Knotless Side Part",
    description: "Beautiful knotless braids with expert side parting and sleek finish",
    duration: "3-4 hours",
    price: 190,
    image: IMG_17,
    popular: false,
    features: ["Premium hair", "Natural hairline", "Edge control", "Scalp treatment"],
    tags: ["knotless", "side-part"]
  },
  {
    id: "premium-3",
    name: "Luxury Pattern Braids",
    description: "Exquisite braided styles with intricate patterns for special occasions",
    duration: "3-4 hours",
    price: 200,
    image: IMG_19,
    popular: false,
    features: ["Professional styling", "Long-lasting hold", "Special occasion styling", "Decorative elements"],
    tags: ["patterns", "luxury"]
  },
  {
    id: "premium-4",
    name: "Accent Braids",
    description: "Stunning braided style with subtle accent colors for a unique look",
    duration: "4-5 hours",
    price: 230,
    image: ORIGINAL_2,
    popular: false,
    features: ["Premium colored accents", "Custom styling", "Edge finishing", "Care instructions"],
    tags: ["accent", "color"]
  },
  {
    id: "premium-5",
    name: "Modern Cornrows",
    description: "Contemporary cornrow designs with artistic flair and precision",
    duration: "3-4 hours",
    price: 210,
    image: ORIGINAL_1,
    popular: false,
    features: ["Custom pattern design", "Scalp treatment", "Edge control", "Style consultation"],
    tags: ["cornrows", "modern"]
  }
];

// Standard service data with ALL client's uploaded images
const STANDARD_SERVICES = [
  {
    id: 1,
    style: "Box Braids (Small)",
    description: "Thin box braids with detailed parting",
    duration: "5-6 hours",
    price: 200,
    image: IMG_21,
    icon: "📦",
    category: "box"
  },
  {
    id: 2,
    style: "Box Braids (Medium)",
    description: "Standard size box braids",
    duration: "4-5 hours",
    price: 180,
    image: IMG_19,
    icon: "📦",
    category: "box"
  },
  {
    id: 3,
    style: "Knotless Braids",
    description: "Tension-free braids with a natural look",
    duration: "5-6 hours",
    price: 220,
    image: IMG_17,
    icon: "🪢",
    category: "knotless"
  },
  {
    id: 4,
    style: "Sleek Bob Braids",
    description: "Modern shoulder-length braided bob for a chic, manageable style",
    duration: "3-4 hours",
    price: 175,
    image: IMG_12,
    icon: "✂️",
    category: "bob"
  },
  {
    id: 5,
    style: "Protective Bun Style",
    description: "Elegant braided bun for a professional, protective style",
    duration: "2-3 hours",
    price: 160,
    image: IMG_14,
    icon: "👑",
    category: "protective"
  },
  {
    id: 6,
    style: "Spiral Curls Updo",
    description: "Creative updo with spiral curls for special occasions",
    duration: "3-4 hours",
    price: 200,
    image: IMG_15,
    icon: "🌀",
    category: "specialty"
  },
  {
    id: 7,
    style: "Pattern Braids",
    description: "Intricate pattern designs with creative parting",
    duration: "4-5 hours",
    price: 230,
    image: ORIGINAL_3,
    icon: "🎨",
    category: "specialty"
  },
  {
    id: 8,
    style: "Accent Color Braids",
    description: "Beautiful braids with subtle color accents",
    duration: "4-5 hours",
    price: 225,
    image: ORIGINAL_2,
    icon: "🎭",
    category: "specialty"
  },
  {
    id: 9,
    style: "Modern Cornrows",
    description: "Contemporary cornrow designs with artistic precision",
    duration: "3-4 hours",
    price: 190,
    image: ORIGINAL_1,
    icon: "👑",
    category: "protective"
  }
];

export default function PricingPage() {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "bento">("bento");
  const prefersReducedMotion = useReducedMotion();
  
  // Filter services based on the selected category
  const filteredServices = activeCategory === "all" 
    ? STANDARD_SERVICES 
    : STANDARD_SERVICES.filter(service => service.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Pricing & Packages | Divine Braids</title>
        <meta name="description" content="Explore our braiding packages and service pricing at Divine Braids salon. Find the perfect style and price for your hair needs." />
      </Helmet>
      
      {/* Hero Section with new purple theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container relative px-4 py-20 md:py-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center lg:text-left space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                <span className="block text-purple-600 dark:text-purple-400">Hair by Design:</span>
                <span className="block text-neutral-800 dark:text-white">Where Imagination Takes Shape</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0">
                Discover our artfully crafted braiding services designed to elevate your style with premium care and expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/booking">
                  <Button size="lg" className="rounded-full px-8 bg-purple-600 hover:bg-purple-700">
                    Book Now
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                    View Gallery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="hidden lg:block"
            >
              {/* Image Collage */}
              <div className="grid grid-cols-5 grid-rows-5 gap-3 h-[500px]">
                {PREMIUM_STYLES.map((style, idx) => (
                  <motion.div 
                    key={style.id}
                    className={cn(
                      "overflow-hidden rounded-xl shadow-lg",
                      idx === 0 ? "col-span-3 row-span-3" : "col-span-2 row-span-2"
                    )}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={style.image} 
                      alt={style.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  </motion.div>
                ))}
                
                <motion.div 
                  className="col-span-3 row-span-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl p-6 flex flex-col justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-2">Premium Packages</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                    Experience luxury with our exclusive styling packages starting at $160
                  </p>
                  <div className="flex space-x-2">
                    {PREMIUM_STYLES.map(style => (
                      <Badge key={style.id} variant="outline" className="border-purple-200 dark:border-purple-700">
                        {style.name.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="col-span-2 row-span-3 bg-gradient-to-b from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800/50 rounded-xl p-6 flex flex-col justify-center text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Star className="h-10 w-10 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-bold mb-2">Client Favorite</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Signature Box Braids with premium extensions
                  </p>
                  <span className="mt-3 text-xl font-bold text-purple-600 dark:text-purple-400">$220</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Pricing Section */}
      <div className="container px-4 py-16">
        {/* Premium Feature Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">Premium Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience luxury with our exclusive styling packages designed for special occasions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PREMIUM_STYLES.map((style, index) => (
              <motion.div 
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-neutral-200 dark:border-neutral-800">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    {style.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-100 border-0">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pt-6 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{style.name}</CardTitle>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">${style.price}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {style.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {style.description}
                    </p>
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      <Clock className="h-4 w-4 mr-1.5" />
                      <span>{style.duration}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Package Includes:</h4>
                      <ul className="space-y-2">
                        {style.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 pb-6">
                    <Link href={`/booking?package=${style.name}`} className="w-full">
                      <Button className="w-full"
                        variant={style.popular ? "default" : "outline"}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Book This Package
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Individual Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">Individual Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our selection of professional braiding styles to find your perfect look
            </p>
          </div>
          
          {/* View Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeCategory === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setActiveCategory("all")}
                className="rounded-full"
              >
                All Styles
              </Button>
              
              {["box", "knotless", "protective", "bob", "specialty"].map((category) => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <Eye className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("bento")}
                className={viewMode === "bento" ? "bg-muted" : ""}
              >
                <Camera className="h-4 w-4 mr-1" />
                Bento
              </Button>
            </div>
          </div>
          
          {/* Individual Services Cards */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <>
                  {filteredServices.map((service, index) => (
                    <motion.div 
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        ease: "easeOut"  
                      }}
                      className="group"
                    >
                      <Card 
                        className="h-full transition-all border-neutral-200 dark:border-neutral-800 hover:shadow-md overflow-hidden"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.style}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div className="flex justify-end space-x-2 mb-4">
                              <a href="/booking">
                                <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md">
                                  Book Now
                                </button>
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-medium">
                              {service.style}
                            </CardTitle>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              ${service.price}
                            </span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.duration}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="pt-0">
                          <Link href={`/booking?service=${service.id}`} className="w-full">
                            <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </>
              ) : (
                // Bento View
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-12 gap-4 auto-rows-auto"
                >
                  {filteredServices.map((service, idx) => {
                    // Determine the layout for each card
                    let cols = idx % 5 === 0 ? "col-span-12 sm:col-span-8" : 
                              idx % 3 === 0 ? "col-span-12 sm:col-span-6" : 
                              "col-span-12 sm:col-span-4";
                    let rows = idx % 5 === 0 ? "row-span-1 sm:row-span-2" : "row-span-1";
                    
                    return (
                      <motion.div 
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className={`${cols} ${rows} group`}
                      >
                        <Card className="h-full border-neutral-200 dark:border-neutral-800 overflow-hidden">
                          <div className="relative h-full w-full overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 z-10 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                            <img 
                              src={service.image} 
                              alt={service.style}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{service.style}</h3>
                              <p className="text-sm text-neutral-200 mb-2 max-w-2xl">{service.description}</p>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-4">
                                  <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                                    <span className="font-semibold">${service.price}</span>
                                  </div>
                                  <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{service.duration}</span>
                                  </div>
                                </div>
                                
                                <Link href={`/booking?service=${service.id}`}>
                                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Book Now
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our braiding services
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How long do braids typically last?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With proper care, our professional braids can last between 6-8 weeks depending on the style and your natural hair growth rate. We recommend a touch-up appointment after 4 weeks for the most polished look.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in the price?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All our prices include the consultation, installation, styling, and basic hair extensions. Premium hair options and accessories may have additional costs. We'll always discuss any potential add-ons before proceeding.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How should I prepare for my appointment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Come with freshly washed and thoroughly dried hair. Avoid heavy oils or products before your appointment. Wear comfortable clothing as some styles may take several hours to complete.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I bring my own hair extensions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you're welcome to bring your own extensions. Please ensure they are high-quality and prepared properly for installation. We also offer premium extension options if you prefer to use ours.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What is your cancellation policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We require 24 hours notice for cancellations or rescheduling. Late cancellations may incur a 25% fee of the service cost, and no-shows will be charged 50% of the service.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer aftercare products?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we offer a range of professional-grade aftercare products specifically formulated for braided styles. Our stylists will recommend the best products for your specific style and hair type.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
        
        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="py-12 px-4 sm:px-8 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your look?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Book your appointment today and experience the artistry and expertise of our styling professionals.
            </p>
            <Link href="/booking">
              <Button size="lg" className="rounded-full px-8">
                Schedule Your Appointment
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}