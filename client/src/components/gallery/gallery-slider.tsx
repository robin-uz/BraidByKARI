import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gallery } from "@shared/schema";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import gallery images
import braidsStyleImg from "../../assets/braids-style.png";
import afroStyleImg from "../../assets/afro-style.png";
import boxBraidsImg from "../../assets/box-braids.png";

export default function GallerySlider() {
  const { data: galleryItems, isLoading, error } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Default gallery images in case the API returns no data
  const defaultGalleryItems = [
    {
      id: 1,
      title: "Long Knotless Braids",
      description: "Elegant long braids with a clean, natural look",
      imageUrl: braidsStyleImg,
      order: 0
    },
    {
      id: 2,
      title: "Natural Afro Style",
      description: "Beautiful natural afro with defined curls",
      imageUrl: afroStyleImg,
      order: 1
    },
    {
      id: 3,
      title: "Medium Box Braids",
      description: "Classic box braids for versatile styling",
      imageUrl: boxBraidsImg,
      order: 2
    }
  ];

  // Use galleryItems from API or fallback to default if empty
  const displayGallery = galleryItems && galleryItems.length > 0 ? galleryItems : defaultGalleryItems;
  
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
          className="rounded-full bg-primary-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNext} 
          className="rounded-full bg-primary-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-primary transition-all"
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
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {displayGallery.map((item, index) => (
          <button 
            key={item.id} 
            className={`rounded overflow-hidden border-2 transition-all ${
              index === activeIndex ? "border-primary" : "border-transparent hover:border-primary/50"
            }`} 
            onClick={() => goToSlide(index)}
          >
            <img 
              src={item.imageUrl} 
              alt={`${item.title} thumbnail`}
              className="w-full h-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
