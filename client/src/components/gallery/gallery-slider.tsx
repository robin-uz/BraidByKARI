import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gallery } from "@shared/schema";
import { ChevronLeft, ChevronRight, Loader2, X, ZoomIn, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
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
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Function to handle image expansion
  const expandImage = (index: number) => {
    setExpandedImageIndex(index);
    setIsImageExpanded(true);
  };

  // Our new gallery items with real braid images
  const braidGalleryItems = [
    {
      id: 1,
      title: "Auburn Box Braids",
      description: "Stunning long box braids with auburn color for a rich, warm look",
      imageUrl: braidsAuburn,
      price: 220
    },
    {
      id: 2,
      title: "Knotless Side Part",
      description: "Beautiful knotless braids with expert side parting and sleek finish",
      imageUrl: braidsSide,
      price: 190
    },
    {
      id: 3,
      title: "Protective Bun Style",
      description: "Elegant braided bun for a professional, protective style",
      imageUrl: braidsBun,
      price: 160
    },
    {
      id: 4,
      title: "Spiral Curls Updo",
      description: "Creative updo with spiral curls for special occasions",
      imageUrl: braidsCurls,
      price: 200
    },
    {
      id: 5,
      title: "Sleek Bob Braids",
      description: "Modern shoulder-length braided bob for a chic, manageable style",
      imageUrl: braidsBob,
      price: 175
    }
  ];

  const displayGallery = braidGalleryItems;
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
      <div className="absolute -top-12 right-0 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPrev} 
          className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNext} 
          className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
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
                  <div className="bg-purple-600/80 text-white text-sm inline-block px-2 py-1 rounded-full">
                    ${item.price}
                  </div>
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
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
        {displayGallery.map((item, index) => (
          <div key={item.id} className="relative group">
            <button 
              className={`rounded overflow-hidden border-2 transition-all w-full ${
                index === activeIndex ? "border-purple-600" : "border-transparent hover:border-purple-400"
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
                  className="text-white text-xs font-medium bg-purple-500/80 px-2 py-1 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    expandImage(index);
                  }}
                >
                  View
                </button>
                <a 
                  href="/booking" 
                  className="text-white text-xs font-medium bg-purple-600/80 px-2 py-1 rounded-full"
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