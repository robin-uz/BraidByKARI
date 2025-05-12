import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { Container, Section, ResponsiveText } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { GalleryItem } from '@/components/gallery/gallery-item';
import { LightboxModal } from '@/components/gallery/lightbox-modal';

// Gallery metadata
const GALLERY_ITEMS = [
  {
    id: 1,
    src: '/images/gallery/knotless-01.jpg',
    alt: 'Knotless Box Braids',
    title: 'Classic Knotless Box Braids',
    description: 'Medium size knotless box braids with natural hair color.',
    category: 'Knotless'
  },
  {
    id: 2,
    src: '/images/gallery/knotless-02.jpg',
    alt: 'Long Knotless Braids',
    title: 'Long Knotless Braids',
    description: 'Waist-length knotless braids with golden highlights.',
    category: 'Knotless'
  },
  {
    id: 3,
    src: '/images/gallery/locs-01.jpg',
    alt: 'Goddess Locs',
    title: 'Goddess Locs',
    description: 'Bohemian-inspired goddess locs with curly ends.',
    category: 'Locs'
  },
  {
    id: 4,
    src: '/images/gallery/locs-02.jpg',
    alt: 'Butterfly Locs',
    title: 'Butterfly Locs',
    description: 'Textured butterfly locs with distressed loops.',
    category: 'Locs'
  },
  {
    id: 5,
    src: '/images/gallery/cornrows-01.jpg',
    alt: 'Feed-in Cornrows',
    title: 'Feed-in Cornrows',
    description: 'Straight-back feed-in cornrows with clean parts.',
    category: 'Cornrows'
  },
  {
    id: 6,
    src: '/images/gallery/cornrows-02.jpg',
    alt: 'Stitch Cornrows',
    title: 'Stitch Cornrows',
    description: 'Detailed stitch cornrows with zigzag pattern.',
    category: 'Cornrows'
  },
  {
    id: 7,
    src: '/images/gallery/kids-01.jpg',
    alt: 'Kids Box Braids',
    title: 'Kids Box Braids',
    description: 'Colorful box braids for children with beads.',
    category: 'Kids'
  },
  {
    id: 8,
    src: '/images/gallery/kids-02.jpg',
    alt: 'Kids Cornrows',
    title: 'Kids Cornrows',
    description: 'Gentle cornrows with heart design for kids.',
    category: 'Kids'
  },
  {
    id: 9,
    src: '/images/gallery/knotless-03.jpg',
    alt: 'Knotless Braids with Color',
    title: 'Knotless Braids with Color',
    description: 'Medium knotless braids with burgundy color accents.',
    category: 'Knotless'
  },
  {
    id: 10,
    src: '/images/gallery/locs-03.jpg',
    alt: 'Faux Locs',
    title: 'Faux Locs',
    description: 'Bohemian faux locs with wrapped accents.',
    category: 'Locs'
  },
  {
    id: 11,
    src: '/images/gallery/knotless-04.jpg',
    alt: 'Jumbo Knotless Braids',
    title: 'Jumbo Knotless Braids',
    description: 'Extra large knotless braids for a bold look.',
    category: 'Knotless'
  },
  {
    id: 12,
    src: '/images/gallery/cornrows-03.jpg',
    alt: 'Cornrow Updo',
    title: 'Cornrow Updo',
    description: 'Elegant cornrow updo style for special occasions.',
    category: 'Cornrows'
  },
  {
    id: 13,
    src: '/images/gallery/kids-03.jpg',
    alt: 'Kids Twist Style',
    title: 'Kids Twist Style',
    description: 'Cute twist style for children with accessories.',
    category: 'Kids'
  },
  {
    id: 14,
    src: '/images/gallery/locs-04.jpg',
    alt: 'Distressed Locs',
    title: 'Distressed Locs',
    description: 'Bohemian distressed locs with natural finish.',
    category: 'Locs'
  },
  {
    id: 15,
    src: '/images/gallery/knotless-05.jpg',
    alt: 'Small Knotless Braids',
    title: 'Small Knotless Braids',
    description: 'Fine knotless braids with intricate parts.',
    category: 'Knotless'
  }
];

const CATEGORIES = ["All", "Knotless", "Locs", "Cornrows", "Kids"];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Filter gallery items based on selected category
  const filteredItems = useMemo(() => {
    return selectedCategory === "All" 
      ? GALLERY_ITEMS 
      : GALLERY_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);
  
  // Handlers for lightbox navigation
  const handleItemClick = useCallback((id: number) => {
    setSelectedImage(id);
  }, []);
  
  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);
  
  const handlePrevImage = useCallback(() => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex].id);
  }, [selectedImage, filteredItems]);
  
  const handleNextImage = useCallback(() => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex].id);
  }, [selectedImage, filteredItems]);
  
  // Current lightbox image data
  const currentImage = useMemo(() => {
    if (selectedImage === null) return null;
    return GALLERY_ITEMS.find(item => item.id === selectedImage) || null;
  }, [selectedImage]);
  
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="relative h-[40vh] min-h-[320px] flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src="/images-new/hero-braids-1.png" 
              alt="Gallery Banner" 
              className="w-full h-full object-cover"
            />
            
            {/* Corner Gradient Arc */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/10 via-purple-900/60 to-transparent rounded-br-full z-20 blur-xl"></div>
          </div>
          
          {/* Hero Content */}
          <Container className="relative z-30">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Our Craft
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-neutral-200 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Browse our portfolio of premium braiding styles and artistry
              </motion.p>
            </div>
          </Container>
        </div>
        
        {/* Category Filters */}
        <Section className="pb-0 pt-8">
          <Container>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Container>
        </Section>
        
        {/* Masonry Grid */}
        <Section>
          <Container>
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-x-3.5 md:gap-x-4.5">
              {filteredItems.map(item => (
                <GalleryItem
                  key={item.id}
                  src={item.src}
                  alt={item.alt}
                  category={item.category}
                  title={item.title}
                  description={item.description}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="py-20 text-center">
                <ResponsiveText variant="h3" className="text-neutral-400 mb-4">
                  No images found in this category
                </ResponsiveText>
                <Button 
                  onClick={() => setSelectedCategory("All")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View All Images
                </Button>
              </div>
            )}
          </Container>
        </Section>
        
        {/* CTA Strip */}
        <div className="py-12 bg-gradient-to-r from-amber-600 to-amber-800">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Inspired by what you see?</h3>
                <p className="text-white/80">Book your appointment today and experience the KARI STYLEZ magic.</p>
              </div>
              <Link href="/booking">
                <Button size="lg" className="bg-black text-white hover:bg-neutral-900">
                  Book Now
                </Button>
              </Link>
            </div>
          </Container>
        </div>
        
        {/* Lightbox Modal */}
        {currentImage && (
          <LightboxModal
            src={currentImage.src}
            alt={currentImage.alt}
            title={currentImage.title}
            description={currentImage.description}
            onClose={handleCloseLightbox}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
        )}
      </motion.div>
    </MainLayout>
  );
};

export default GalleryPage;