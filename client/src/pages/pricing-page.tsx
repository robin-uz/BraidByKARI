import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Scissors, Clock, Star, ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { Service, Gallery } from "@shared/schema";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fetch services data
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });
  
  // Fetch gallery images to show as thumbnails
  const { data: gallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });
  
  const isLoading = servicesLoading || galleryLoading;
  
  // Service categories
  const categories = [
    { id: "box", name: "Box Braids", icon: "📦" },
    { id: "feed-in", name: "Feed-In Braids", icon: "🔄" },
    { id: "knotless", name: "Knotless Braids", icon: "🪢" },
    { id: "twists", name: "Twists", icon: "🌀" },
    { id: "locs", name: "Locs", icon: "🧶" },
    { id: "all", name: "All Styles", icon: "✨" }
  ];
  
  // Handle category selection
  useEffect(() => {
    if (services && services.length > 0 && !selectedCategory) {
      setSelectedCategory("all");
    }
  }, [services, selectedCategory]);
  
  // Get filtered services based on selected category
  const getFilteredServices = () => {
    if (!services || services.length === 0) return [];
    
    if (selectedCategory === "all") return services;
    
    return services.filter(service => 
      service.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  };
  
  // Find matching gallery image for a service
  const findServiceImage = (serviceName: string) => {
    if (!gallery || gallery.length === 0) return null;
    
    // Try to find exact match first
    const exactMatch = gallery.find(img => 
      img.title.toLowerCase().includes(serviceName.toLowerCase())
    );
    
    if (exactMatch) return exactMatch;
    
    // Try to find a partial match
    const keywords = serviceName.toLowerCase().split(' ');
    for (const keyword of keywords) {
      if (keyword.length < 3) continue; // Skip short words
      
      const partialMatch = gallery.find(img => 
        img.title.toLowerCase().includes(keyword)
      );
      
      if (partialMatch) return partialMatch;
    }
    
    // Return a fallback image if available
    return gallery[0];
  };
  
  // Service packages
  const servicePackages = [
    {
      id: "basic",
      name: "Basic Package",
      description: "Essential braiding services for everyday styles",
      price: 149,
      popular: false,
      image: gallery?.find(img => img.title.toLowerCase().includes("box")) || null,
      features: [
        "Standard length braids",
        "Basic styling options",
        "45-minute consultation",
        "Aftercare instructions"
      ],
      services: ["Box Braids (Shoulder Length)", "Two-Strand Twists", "Cornrows"]
    },
    {
      id: "standard",
      name: "Premium Package",
      description: "Our most popular package with enhanced styling options",
      price: 249,
      popular: true,
      image: gallery?.find(img => img.title.toLowerCase().includes("knotless")) || null,
      features: [
        "Medium to long length braids",
        "Custom color options",
        "Styling products included",
        "1-week follow-up adjustment",
        "Digital style consultation"
      ],
      services: ["Knotless Braids", "Feed-In Braids", "Passion Twists", "Faux Locs"]
    },
    {
      id: "luxury",
      name: "Luxury Package",
      description: "The ultimate premium braiding experience with exclusive perks",
      price: 349,
      popular: false,
      image: gallery?.find(img => img.title.toLowerCase().includes("goddess")) || null,
      features: [
        "Extra-long braids available",
        "Premium haircare products",
        "Custom color blending",
        "Extended styling session",
        "2 follow-up appointments",
        "VIP booking priority",
        "Complimentary edge control"
      ],
      services: ["Goddess Braids", "Bohemian Locs", "Knotless Braids (XL)", "Custom Protective Styles"]
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Pricing & Packages | Divine Braids</title>
        <meta name="description" content="Explore our braiding packages and service pricing at Divine Braids salon. Find the perfect style and price for your hair needs." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-amber-50 to-pink-50 dark:from-neutral-900 dark:via-amber-950 dark:to-neutral-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container relative px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-sm font-medium mb-2">
                Professional Styling
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                <span className="block">Premium Braiding</span>
                <span className="block text-amber-600 dark:text-amber-400">Services & Pricing</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0">
                Discover our expertly crafted braiding packages and individual services 
                designed for your unique style at affordable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/booking">
                  <Button size="lg" className="rounded-full px-8">
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Explore Gallery
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-3">
                {!galleryLoading && gallery && gallery.slice(0, 6).map((image, idx) => (
                  <div key={idx} className={cn(
                    "overflow-hidden rounded-lg shadow-md transform transition-transform hover:scale-105",
                    idx === 0 ? "col-span-2 row-span-2" : ""
                  )}>
                    <img 
                      src={image.imageUrl} 
                      alt={image.title || "Braid style"} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Package Section */}
      <div className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">Styled to Perfection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully crafted packages or build your own look with our individual services
          </p>
        </div>
        
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-neutral-950 px-4 text-lg font-medium text-neutral-500 dark:text-neutral-400">
              Featured Packages
            </span>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {servicePackages.map((pkg, index) => (
            <motion.div key={pkg.id} variants={itemVariants} className="flex">
              <Card className={cn(
                "flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-lg",
                pkg.popular ? "border-amber-300 dark:border-amber-700" : ""
              )}>
                {pkg.image && (
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={pkg.image.imageUrl} 
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {pkg.popular && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          Most Popular
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className="pt-6 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">${pkg.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                </CardHeader>
                
                <CardContent className="pb-4 flex-grow">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Includes:</h4>
                      <ul className="space-y-2">
                        {pkg.services.map((service, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <Scissors className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Package Features:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 pt-0 pb-6">
                  <Link href="/booking" className="w-full">
                    <Button className="w-full rounded-md" variant={pkg.popular ? "default" : "outline"}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Select Package
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Individual Services */}
        <div className="mb-10">
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-neutral-950 px-4 text-lg font-medium text-neutral-500 dark:text-neutral-400">
                Individual Services
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-10">
            {/* Categories Tabs */}
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setSelectedCategory(value);
              }}
              className="w-full max-w-3xl mx-auto"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900 dark:data-[state=active]:text-amber-100 py-2 px-3"
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="hidden md:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Services Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4 text-muted-foreground">Loading services...</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {getFilteredServices().map((service) => {
                  const serviceImage = findServiceImage(service.name);
                  
                  return (
                    <motion.div key={service.id} variants={itemVariants}>
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="flex flex-col h-full">
                          {serviceImage && (
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={serviceImage.imageUrl} 
                                alt={service.name} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pt-5 pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">${service.price}</div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2 flex-grow">
                            <p className="text-sm text-muted-foreground mb-3">
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
                          
                          <CardFooter className="pt-0">
                            <Link href={`/booking?service=${service.name}`} className="w-full">
                              <Button variant="outline" className="w-full text-sm">
                                Book This Style
                              </Button>
                            </Link>
                          </CardFooter>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Pricing Information */}
        <div className="mt-16 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Additional Pricing Information</h2>
            <p className="text-muted-foreground">Factors that may affect the final price of your service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="h-5 w-5 text-amber-800 dark:text-amber-200" />
                </div>
                <h3 className="text-lg font-medium">Hair Extensions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Extensions are not included in the base price. You can either bring your own 
                or purchase from our selection of premium quality hair.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-amber-800 dark:text-amber-200" />
                </div>
                <h3 className="text-lg font-medium">Length & Thickness</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Longer and thicker styles require more time and material, which may increase the final price.
                Consult with your stylist for a precise quote.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <Star className="h-5 w-5 text-amber-800 dark:text-amber-200" />
                </div>
                <h3 className="text-lg font-medium">Custom Designs</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Complex patterns, color treatments, and custom designs may incur additional charges
                based on complexity and time requirements.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-20 text-center max-w-4xl mx-auto">
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
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 rounded-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}