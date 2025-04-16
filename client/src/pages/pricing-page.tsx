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

// Interesting premium hairstyles for our showcase
const PREMIUM_STYLES = [
  {
    id: "premium-1",
    name: "Goddess Box Braids",
    description: "Ethereal box braids with decorative accessories and curled ends for an elegant look",
    duration: "6-8 hours",
    price: 280,
    image: "https://images.unsplash.com/photo-1602525506539-cdc38e2b3b75?q=80&w=2067&auto=format&fit=crop",
    popular: true,
    features: ["Luxury hair extensions", "Gold accessories included", "Styling cream", "Aftercare kit"],
    tags: ["luxury", "trending"]
  },
  {
    id: "premium-2",
    name: "Ombré Knotless Braids",
    description: "Stunning color gradient knotless braids with seamless transition",
    duration: "5-7 hours",
    price: 260,
    image: "https://images.unsplash.com/photo-1595211665244-119bc411fdb6?q=80&w=1887&auto=format&fit=crop",
    popular: false,
    features: ["Premium color-treated hair", "Heat styling", "Custom color matching", "Scalp treatment"],
    tags: ["colorful", "custom"]
  },
  {
    id: "premium-3",
    name: "Butterfly Locs",
    description: "Elegant distressed locs with butterfly-like texture and movement",
    duration: "4-6 hours",
    price: 230,
    image: "https://images.unsplash.com/photo-1503762687835-129cc7a277e5?q=80&w=1887&auto=format&fit=crop",
    popular: false,
    features: ["Lightweight installation", "Custom curled ends", "Natural movement", "Low maintenance"],
    tags: ["trending", "natural"]
  }
];

// Standard service data
const STANDARD_SERVICES = [
  {
    id: 1,
    style: "Box Braids (Small)",
    description: "Thin box braids with detailed parting",
    duration: "5-7 hours",
    price: 200,
    image: "https://images.unsplash.com/photo-1594076803361-fbbe24594338?q=80&w=1887&auto=format&fit=crop",
    icon: "📦",
    category: "box"
  },
  {
    id: 2,
    style: "Box Braids (Medium)",
    description: "Standard size box braids",
    duration: "4-6 hours",
    price: 180,
    image: "https://images.unsplash.com/photo-1605980625600-88c7831c17ab?q=80&w=1887&auto=format&fit=crop",
    icon: "📦",
    category: "box"
  },
  {
    id: 3,
    style: "Box Braids (Large)",
    description: "Chunky box braids with less installation time",
    duration: "3-5 hours",
    price: 150,
    image: "https://images.unsplash.com/photo-1607242792481-37f27e1901b3?q=80&w=1887&auto=format&fit=crop",
    icon: "📦",
    category: "box"
  },
  {
    id: 4,
    style: "Knotless Braids",
    description: "Tension-free braids with a natural look",
    duration: "5-8 hours",
    price: 220,
    image: "https://images.unsplash.com/photo-1599647903472-f41f344fa73b?q=80&w=1887&auto=format&fit=crop",
    icon: "🪢",
    category: "knotless"
  },
  {
    id: 5,
    style: "Feed-in Braids",
    description: "Sleek braids with a natural transition",
    duration: "4-6 hours",
    price: 180,
    image: "https://images.unsplash.com/photo-1587403335779-4ce461ea7b2e?q=80&w=1887&auto=format&fit=crop",
    icon: "🔄",
    category: "feed-in"
  },
  {
    id: 6,
    style: "Bob Boho Braids",
    description: "Stylish bob-length braids with elegant curls",
    duration: "4-6 hours",
    price: 250,
    image: "https://images.unsplash.com/photo-1627248235652-334c2b43f0a2?q=80&w=1887&auto=format&fit=crop",
    icon: "🌀",
    category: "twists"
  },
  {
    id: 7,
    style: "Curly Top Braids",
    description: "Natural curly top with beautifully styled braids",
    duration: "3-5 hours",
    price: 200,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop",
    icon: "🌀",
    category: "twists"
  },
  {
    id: 8,
    style: "Goddess Braids",
    description: "Elegant raised braids with sophisticated pattern",
    duration: "4-7 hours",
    price: 240,
    image: "https://images.unsplash.com/photo-1620122830785-a18b43585b44?q=80&w=1887&auto=format&fit=crop",
    icon: "👑",
    category: "box"
  },
  {
    id: 9,
    style: "Faux Locs",
    description: "Natural-looking temporary locs",
    duration: "5-7 hours",
    price: 230,
    image: "https://images.unsplash.com/photo-1562041343-fae9e0668516?q=80&w=1887&auto=format&fit=crop",
    icon: "🧶",
    category: "locs"
  }
];

export default function PricingPage() {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table" | "bento">("bento");
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
                    Get Started
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
                    Experience luxury with our exclusive styling packages starting at $230
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
                    Goddess Box Braids with premium accessories
                  </p>
                  <span className="mt-3 text-xl font-bold text-purple-600 dark:text-purple-400">$280</span>
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
            <div className="flex overflow-x-auto p-1 space-x-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              {[
                { id: "all", name: "All Styles", icon: "✨" },
                { id: "box", name: "Box Braids", icon: "📦" },
                { id: "feed-in", name: "Feed-In Braids", icon: "🔄" },
                { id: "knotless", name: "Knotless Braids", icon: "🪢" },
                { id: "twists", name: "Twists", icon: "🌀" },
                { id: "locs", name: "Locs", icon: "🧶" }
              ].map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* View Mode Toggles */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "bento" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("bento")}
                className="flex items-center"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" />
                  <rect x="13" y="2" width="9" height="5" rx="2" fill="currentColor" />
                  <rect x="13" y="9" width="9" height="13" rx="2" fill="currentColor" />
                  <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" />
                </svg>
                Bento
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
                </svg>
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="2" />
                </svg>
                Table
              </Button>
            </div>
          </div>
          
          {/* View Modes: Bento, Grid, or Table */}
          <AnimatePresence mode="wait">
            {viewMode === "bento" && (
              <motion.div 
                key="bento"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[800px]">
                  {filteredServices.slice(0, 5).map((service, idx) => {
                    // Create a dynamic layout for the bento grid
                    const getGridClass = (idx: number) => {
                      const layouts = [
                        "col-span-6 row-span-1 md:col-span-4 md:row-span-2", // First item
                        "col-span-6 row-span-1 md:col-span-3 md:row-span-1", // Second item
                        "col-span-6 row-span-1 md:col-span-5 md:row-span-1", // Third item
                        "col-span-6 row-span-1 md:col-span-4 md:row-span-1", // Fourth item
                        "col-span-6 row-span-1 md:col-span-4 md:row-span-1", // Fifth item
                      ];
                      return layouts[idx % layouts.length];
                    };
                    
                    return (
                      <motion.div
                        key={service.id}
                        className={cn(
                          "relative overflow-hidden rounded-xl group cursor-pointer",
                          getGridClass(idx)
                        )}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                        <img 
                          src={service.image} 
                          alt={service.style} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                          <div className="flex justify-between items-end">
                            <div>
                              <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">
                                {service.style}
                              </h3>
                              <p className="text-sm text-white/80 mb-2 line-clamp-1">
                                {service.description}
                              </p>
                              <div className="flex items-center text-xs text-white/70">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration}
                                <span className="mx-2">•</span>
                                <span className="font-semibold text-purple-300">${service.price}</span>
                              </div>
                            </div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                            >
                              <Eye className="h-5 w-5 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {/* Service collection card */}
                  <motion.div 
                    className="col-span-12 md:col-span-4 row-span-1 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 rounded-xl p-6 flex flex-col justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-3">All Services</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                      Browse our full catalog of {STANDARD_SERVICES.length} premium braiding services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Box Braids', 'Knotless', 'Feed-in', 'Locs', 'Twists'].map(category => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                {/* Remaining services in a grid */}
                {filteredServices.length > 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    {filteredServices.slice(5).map((service) => (
                      <motion.div
                        key={service.id}
                        className="relative overflow-hidden rounded-xl group cursor-pointer h-48"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                        <img 
                          src={service.image} 
                          alt={service.style} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                          <h3 className="text-lg font-bold mb-1 group-hover:text-amber-300 transition-colors">
                            {service.style}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-white/70">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <span className="font-semibold text-amber-300">${service.price}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {viewMode === "grid" && (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {filteredServices.map((service, idx) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.style}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <div className="bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                            {service.category}
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pt-5 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{service.style}</CardTitle>
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">${service.price}</div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>{service.duration}</span>
                          
                          {service.icon && (
                            <div className="ml-auto bg-amber-100 dark:bg-amber-900 h-8 w-8 rounded-full flex items-center justify-center">
                              <span className="text-lg">{service.icon}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          Details
                        </Button>
                        <Link href={`/booking?service=${service.style}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            Book Now
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {viewMode === "table" && (
              <motion.div 
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full table-auto text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                      <tr>
                        <th scope="col" className="px-6 py-4">Style</th>
                        <th scope="col" className="px-6 py-4">Description</th>
                        <th scope="col" className="px-6 py-4">Duration</th>
                        <th scope="col" className="px-6 py-4">Price</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {filteredServices.map((service, idx) => (
                        <motion.tr 
                          key={service.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.03 }}
                          className="bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-3">
                              {service.icon && (
                                <div className="bg-amber-100 dark:bg-amber-900/70 h-8 w-8 rounded-full flex items-center justify-center">
                                  <span className="text-lg">{service.icon}</span>
                                </div>
                              )}
                              {service.style}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">
                            {service.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                            {service.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600 dark:text-purple-400">
                            ${service.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => setSelectedService(service)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Details
                              </Button>
                              <Link href={`/booking?service=${service.style}`}>
                                <Button
                                  size="sm"
                                  className="h-8"
                                >
                                  Book Now
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Pricing Information Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl p-8 shadow-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Additional Pricing Information</h2>
            <p className="text-muted-foreground">Factors that may affect the final price of your service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="h-5 w-5 text-purple-800 dark:text-purple-200" />
                </div>
                <h3 className="text-lg font-medium">Hair Extensions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Extensions are not included in the base price. You can either bring your own 
                or purchase from our selection of premium quality hair.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-purple-800 dark:text-purple-200" />
                </div>
                <h3 className="text-lg font-medium">Length & Thickness</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Longer and thicker styles require more time and material, which may increase the final price.
                Consult with your stylist for a precise quote.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <Star className="h-5 w-5 text-purple-800 dark:text-purple-200" />
                </div>
                <h3 className="text-lg font-medium">Custom Designs</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Complex patterns, color treatments, and custom designs may incur additional charges
                based on complexity and time requirements.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Look?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Book your appointment today and experience our premium braiding services.
            We're committed to helping you achieve the perfect style that suits your personality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="px-8 rounded-full">
                Book Your Appointment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="px-8 rounded-full">
                Explore Our Gallery
                <Camera className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: prefersReducedMotion ? "tween" : "spring",
                duration: prefersReducedMotion ? 0.2 : 0.5
              }}
              className="relative w-full max-w-3xl mx-4 md:mx-auto"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl overflow-hidden">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  {/* Service Image */}
                  <div className="h-56 md:h-72 relative">
                    <img
                      src={selectedService.image}
                      alt={selectedService.style}
                      className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="inline-block px-2 py-1 bg-black/30 backdrop-blur-sm rounded-md text-xs font-medium mb-2">
                        {selectedService.category}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">{selectedService.style}</h2>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="space-y-2">
                      <p className="text-neutral-600 dark:text-neutral-300">{selectedService.description}</p>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>{selectedService.duration}</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      ${selectedService.price}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">What's Included</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>Professional consultation</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>Styling and finishing</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>Aftercare instructions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>Edge control application</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Additional Notes</h4>
                        <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                          <li className="flex items-start">
                            <Info className="h-4 w-4 text-purple-500 mr-2 shrink-0 mt-0.5" />
                            <span>Hair extensions not included in price</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 text-purple-500 mr-2 shrink-0 mt-0.5" />
                            <span>Pricing may vary with hair length and thickness</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-4 w-4 text-purple-500 mr-2 shrink-0 mt-0.5" />
                            <span>Additional fee for complex patterns or color work</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium mb-2">Special Care Instructions</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        For this style, we recommend washing every 2-3 weeks and using our specially formulated braid spray for moisture. Sleep with a satin bonnet to protect your style and extend its life.
                      </p>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                      <Button
                        onClick={() => setSelectedService(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Link href={`/booking?service=${selectedService.style}`} className="flex-1">
                        <Button className="w-full">
                          Book Appointment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}