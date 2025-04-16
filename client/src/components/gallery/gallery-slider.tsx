import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gallery } from "@shared/schema";
import { 
  ChevronLeft, ChevronRight, Loader2, Sparkles, 
  Search, Heart, Share2, ZoomIn, Scissors, Hash,
  Clock, X, LayoutList, LayoutGrid
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Import braids images from assets
import braidsAuburn from "@/assets/gallery/braids-auburn.png";
import braidsSide from "@/assets/gallery/braids-side.png";
import braidsBun from "@/assets/gallery/braids-bun.png";
import braidsCurls from "@/assets/gallery/braids-curls.png";
import braidsBob from "@/assets/gallery/braids-bob.png";

export default function GallerySlider() {
  const { data: galleryItems, isLoading, error } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });
  
  // State for the gallery
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isGridView, setIsGridView] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Our new gallery images with real examples
  const enhancedGalleryItems = [
    {
      id: 1,
      title: "Auburn Box Braids",
      description: "Stunning long box braids with auburn color for a rich, warm look",
      imageUrl: braidsAuburn,
      category: "box-braids",
      tags: ["long", "box-braids", "auburn", "color"],
      price: 220,
      duration: "4-5 hours",
      featured: true,
      order: 0
    },
    {
      id: 2,
      title: "Knotless Side Part",
      description: "Beautiful knotless braids with expert side parting and sleek finish",
      imageUrl: braidsSide,
      category: "knotless-braids",
      tags: ["medium-length", "knotless", "side-part", "black"],
      price: 190,
      duration: "3-4 hours",
      featured: true,
      order: 1
    },
    {
      id: 3,
      title: "Protective Bun Style",
      description: "Elegant braided bun for a professional, protective style",
      imageUrl: braidsBun,
      category: "protective-styles",
      tags: ["bun", "professional", "braids", "updo"],
      price: 160,
      duration: "2-3 hours",
      featured: false,
      order: 2
    },
    {
      id: 4,
      title: "Spiral Curls Updo",
      description: "Creative updo with spiral curls for special occasions",
      imageUrl: braidsCurls,
      category: "specialty",
      tags: ["curls", "updo", "special-occasion", "creative"],
      price: 200,
      duration: "3-4 hours",
      featured: true,
      order: 3
    },
    {
      id: 5,
      title: "Sleek Bob Braids",
      description: "Modern shoulder-length braided bob for a chic, manageable style",
      imageUrl: braidsBob,
      category: "bob-styles",
      tags: ["bob", "short", "braids", "modern"],
      price: 175,
      duration: "2-3 hours",
      featured: true,
      order: 4
    }
  ];

  // Use galleryItems from API or fallback to enhanced gallery
  const displayGallery = enhancedGalleryItems;
  
  // Filtering functionality
  const filteredGallery = activeFilter === "all" 
    ? displayGallery 
    : displayGallery.filter(item => item.category === activeFilter || item.tags.includes(activeFilter));
  
  const totalSlides = filteredGallery.length;

  // Navigation functions
  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Handle expanded image view
  const expandImage = (index: number) => {
    setExpandedImage(index);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  // Update slider position
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  }, [activeIndex]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // Available filters derived from gallery items
  const categories = Array.from(
    new Set(displayGallery.flatMap(item => [item.category, ...item.tags]))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">Error loading gallery: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Expanded image overlay */}
      <AnimatePresence>
        {expandedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={closeExpandedImage}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={filteredGallery[expandedImage].imageUrl} 
                  alt={filteredGallery[expandedImage].title}
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white font-heading text-xl md:text-2xl">{filteredGallery[expandedImage].title}</h3>
                  <p className="text-neutral-200 text-sm md:text-base mb-2">{filteredGallery[expandedImage].description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <Scissors className="w-4 h-4 mr-1 text-purple-300" />
                      <span className="text-white text-sm font-medium">${filteredGallery[expandedImage].price}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-purple-300" />
                      <span className="text-white text-sm font-medium">{filteredGallery[expandedImage].duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-2"
                onClick={closeExpandedImage}
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-300 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            Browse Our Styles
          </h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded-md ${!isGridView ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : ''}`}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded-md ${isGridView ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : ''}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition
              ${activeFilter === "all" 
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white" 
                : "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/40"
              }`}
          >
            All Styles
          </motion.button>
          
          {["box-braids", "knotless-braids", "protective-styles", "bob-styles", "specialty"].map((category) => (
            <motion.button 
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center
                ${activeFilter === category 
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white" 
                  : "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/40"
                }`}
            >
              <Hash className="w-3 h-3 mr-1" />
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Grid View */}
      {isGridView ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGallery.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex justify-end space-x-2 mb-4">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                      onClick={() => expandImage(index)}
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
                {item.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold uppercase py-1 px-2 rounded-md flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" /> Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg font-semibold text-neutral-800 dark:text-white mb-1">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">${item.price}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.duration}</span>
                </div>
                <div className="flex flex-wrap mt-3 gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(tag);
                      }}
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Slider view
        <div className="relative">
          <div className="relative flex justify-end mb-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPrev} 
                className="rounded-full bg-purple-100/70 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNext} 
                className="rounded-full bg-purple-100/70 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div 
              ref={sliderRef} 
              className="flex transition-transform duration-700 ease-out"
            >
              {filteredGallery.map((item) => (
                <div key={item.id} className="min-w-full relative">
                  <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl"
                      >
                        <h3 className="text-white font-heading text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                        <p className="text-neutral-200 text-sm md:text-base mb-4">{item.description}</p>
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Scissors className="w-4 h-4 mr-1 text-purple-300" />
                            <span className="text-white text-sm font-medium">${item.price}</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-purple-300" />
                            <span className="text-white text-sm font-medium">{item.duration}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                            onClick={() => expandImage(filteredGallery.findIndex(i => i.id === item.id))}
                          >
                            <Search className="w-4 h-4 mr-1" />
                            View Details
                          </motion.button>
                          <Link href="/booking" className="inline-block">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                            >
                              Book This Style
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
            {filteredGallery.map((item, index) => (
              <motion.button 
                key={item.id} 
                whileHover={{ y: -3 }}
                className={`rounded-lg overflow-hidden transition-all ${
                  index === activeIndex ? "ring-2 ring-purple-600 dark:ring-purple-500" : "ring-0 hover:ring-1 hover:ring-purple-400 dark:hover:ring-purple-600/70"
                }`} 
                onClick={() => goToSlide(index)}
              >
                <div className="relative aspect-[3/4]">
                  <img 
                    src={item.imageUrl} 
                    alt={`${item.title} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${index === activeIndex ? "bg-gradient-to-t from-purple-600/80 to-transparent" : "bg-gradient-to-t from-black/70 to-transparent"}`}>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs truncate">{item.title}</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
