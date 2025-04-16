import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gallery } from "@shared/schema";
import { ChevronLeft, ChevronRight, Loader2, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";

// Import client-provided images for authentic salon styles
import model1 from "@/assets/kari-stylez/braids-model-1.png";
import model2 from "@/assets/kari-stylez/braids-model-2.png";
import model3 from "@/assets/kari-stylez/braids-model-3.png";
import model4 from "@/assets/kari-stylez/braids-model-4.jpg";
import model5 from "@/assets/kari-stylez/braids-model-5.jpg";

// New client asset imports for extended gallery
import IMG_12 from "@assets/IMG-20250416-WA0012.jpg";
import IMG_14 from "@assets/IMG-20250416-WA0014.jpg";
import IMG_15 from "@assets/IMG-20250416-WA0015.jpg";
import IMG_17 from "@assets/IMG-20250416-WA0017.jpg";
import IMG_19 from "@assets/IMG-20250416-WA0019.jpg";
import IMG_21 from "@assets/IMG-20250416-WA0021.jpg";

export default function GallerySlider() {
  const { data: galleryItems, isLoading, error } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Function to handle image expansion
  const expandImage = (index: number) => {
    setExpandedImageIndex(index);
    setIsImageExpanded(true);
  };

  // Gallery items with client's actual salon images
  const braidGalleryItems = [
    {
      id: 1,
      title: "Classic Box Braids",
      description: "Traditional square-shaped parts with clean lines and uniform size.",
      imageUrl: model1,
      price: 200
    },
    {
      id: 2,
      title: "Knotless Side Part",
      description: "Beautiful knotless braids with expert side parting and sleek finish.",
      imageUrl: model2,
      price: 190
    },
    {
      id: 3,
      title: "Feed-In Braids",
      description: "Sleek cornrows with extension hair fed in gradually for a natural look.",
      imageUrl: model3,
      price: 180
    },
    {
      id: 4,
      title: "Goddess Braids",
      description: "Raised braids close to the scalp, often in intricate patterns.",
      imageUrl: model4,
      price: 220
    },
    {
      id: 5,
      title: "Long Box Braids",
      description: "Classic long box braids with clean parting for an elegant look.",
      imageUrl: model5,
      price: 210
    },
    {
      id: 6,
      title: "Bohemian Braids",
      description: "Flowing, textured braids with a free-spirited aesthetic.",
      imageUrl: IMG_12,
      price: 230
    },
    {
      id: 7,
      title: "Braided Updo",
      description: "Elegant braided style perfect for special occasions.",
      imageUrl: IMG_14,
      price: 195
    },
    {
      id: 8,
      title: "Tribal Pattern Braids",
      description: "Intricate geometric patterns inspired by traditional designs.",
      imageUrl: IMG_15,
      price: 245
    },
    {
      id: 9,
      title: "Fulani Braids",
      description: "Beautiful braids with decorative elements and cultural inspiration.",
      imageUrl: IMG_17,
      price: 235
    },
    {
      id: 10,
      title: "Creative Color Braids",
      description: "Artistic braided style with vibrant color accents.",
      imageUrl: IMG_19,
      price: 260
    },
    {
      id: 11,
      title: "Protective Braids",
      description: "Durable, low-maintenance braids that protect natural hair.",
      imageUrl: IMG_21,
      price: 185
    }
  ];

  const displayGallery = galleryItems && galleryItems.length > 0 ? galleryItems : braidGalleryItems;
  const totalSlides = displayGallery.length;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Update slider position
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
  }, [activeIndex]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
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
      {/* Image Preview Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative rounded-lg overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img 
                src={displayGallery[expandedImageIndex]?.imageUrl} 
                alt={displayGallery[expandedImageIndex]?.title}
                className="w-full max-h-[80vh] object-contain bg-black/90 rounded-lg shadow-xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-heading text-2xl">
                  {displayGallery[expandedImageIndex]?.title}
                </h3>
                <p className="text-neutral-200 mt-1 mb-3">
                  {displayGallery[expandedImageIndex]?.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-600/80 text-white text-sm inline-block px-3 py-1.5 rounded-full">
                    ${displayGallery[expandedImageIndex]?.price}
                  </div>
                  <a 
                    href="/booking" 
                    className="bg-white text-amber-700 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                  >
                    Book This Style
                  </a>
                </div>
              </div>
              
              <DialogClose className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-all">
                <X className="h-5 w-5" />
              </DialogClose>
              
              <div className="absolute top-1/2 -translate-y-1/2 left-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                  onClick={() => setExpandedImageIndex(prev => prev === 0 ? displayGallery.length - 1 : prev - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/30 hover:bg-black/50 text-white"
                  onClick={() => setExpandedImageIndex(prev => prev === displayGallery.length - 1 ? 0 : prev + 1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="absolute -top-12 right-0 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPrev} 
          className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNext} 
          className="rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div 
          ref={sliderRef} 
          className="flex transition-transform duration-500 ease-in-out"
        >
          {displayGallery.map((item) => (
            <div key={item.id} className="min-w-full relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white font-heading text-xl">{item.title}</h3>
                <p className="text-neutral-200 text-sm">{item.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="bg-amber-600/80 text-white text-sm inline-block px-2 py-1 rounded-full">
                    ${item.price}
                  </div>
                  <button
                    onClick={() => expandImage(activeIndex)}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm mr-2"
                  >
                    <ZoomIn className="h-3.5 w-3.5 inline-block mr-1" />
                    View Larger
                  </button>
                  <a 
                    href="/booking" 
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    Book This Style
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Thumbnail gallery grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-4">
        {displayGallery.map((item, index) => (
          <div key={item.id} className="relative group">
            <button 
              className={`rounded overflow-hidden border-2 transition-all w-full ${
                index === activeIndex ? "border-amber-600" : "border-transparent hover:border-amber-400"
              }`} 
              onClick={() => goToSlide(index)}
            >
              <img 
                src={item.imageUrl} 
                alt={`${item.title} thumbnail`}
                className="w-full h-16 md:h-20 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  className="text-white text-xs font-medium bg-amber-500/80 px-2 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    expandImage(index);
                  }}
                >
                  View
                </button>
                <a 
                  href="/booking" 
                  className="text-white text-xs font-medium bg-amber-600/80 px-2 py-1 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  Book
                </a>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}