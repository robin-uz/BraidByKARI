import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryItem } from '@shared/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Section, Container, ResponsiveText } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export function GalleryGrid() {
  const { data: galleryItems, isLoading, error } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery'],
  });
  
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedItem(null);
    // Restore scrolling
    document.body.style.overflow = '';
  };
  
  const navigateItem = (direction: 'prev' | 'next') => {
    if (!galleryItems) return;
    
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    } else {
      newIndex = (currentIndex + 1) % galleryItems.length;
    }
    
    setCurrentIndex(newIndex);
    setSelectedItem(galleryItems[newIndex]);
  };
  
  // Handle keyboard events for navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateItem('prev');
          break;
        case 'ArrowRight':
          navigateItem('next');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, currentIndex]);
  
  if (isLoading) {
    return (
      <Section className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </Section>
    );
  }
  
  if (error || !galleryItems) {
    return (
      <Section className="text-center">
        <ResponsiveText variant="h3" className="text-red-500">
          Error loading gallery
        </ResponsiveText>
        <ResponsiveText>
          Please try again later or contact us directly.
        </ResponsiveText>
      </Section>
    );
  }
  
  return (
    <>
      <Section id="gallery">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block py-1.5 px-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium mb-3">
              Our Portfolio
            </span>
            <ResponsiveText 
              as="h2" 
              variant="h1" 
              className="font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text"
            >
              Braiding Excellence
            </ResponsiveText>
            <ResponsiveText className="max-w-3xl mx-auto text-neutral-600 dark:text-neutral-400">
              Browse our gallery of stunning braids and styles. Our talented stylists have created 
              these beautiful looks for real clients. Get inspired for your next appointment!
            </ResponsiveText>
          </div>
          
          {/* Gallery Grid - Using specs from layout guide */}
          <Grid 
            variant="gallery" 
            className="mb-8"
          >
            {galleryItems.map((item, index) => (
              <GalleryCard 
                key={item.id} 
                item={item} 
                index={index} 
                onClick={() => openLightbox(item, index)} 
              />
            ))}
          </Grid>
        </Container>
      </Section>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white hover:text-amber-300 z-10"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>
            
            {/* Navigation - Previous */}
            <button 
              className="absolute left-4 text-white hover:text-amber-300 z-10"
              onClick={(e) => { e.stopPropagation(); navigateItem('prev'); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={48} />
            </button>
            
            {/* Navigation - Next */}
            <button 
              className="absolute right-4 text-white hover:text-amber-300 z-10"
              onClick={(e) => { e.stopPropagation(); navigateItem('next'); }}
              aria-label="Next image"
            >
              <ChevronRight size={48} />
            </button>
            
            {/* Image container */}
            <div 
              className="px-12 max-w-5xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="max-h-[80vh] max-w-full object-contain rounded-md"
              />
              
              {/* Caption */}
              <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-md">
                <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-neutral-200 text-sm">{selectedItem.description}</p>
                )}
              </div>
            </div>
            
            {/* Counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-neutral-400">
              {currentIndex + 1} / {galleryItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-md",
        "aspect-square",
        "shadow-md hover:shadow-xl transition-shadow duration-300"
      )}
      onClick={onClick}
    >
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.title || 'Gallery image'} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800">
          <ImageIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-600" />
        </div>
      )}
      
      {/* Overlay with info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-lg">{item.title}</h3>
        {item.description && (
          <p className="text-neutral-200 text-sm line-clamp-2">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}