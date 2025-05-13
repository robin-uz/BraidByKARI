import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { Link } from 'wouter';

// Services data with KARI STYLEZ folder images
const SERVICES = [
  {
    id: "classic-knotless",
    name: "Classic Knotless Box Braids",
    description: "Medium size knotless box braids with natural hair color.",
    imageUrl: "/assets/kari-stylez/braids-model-1.png",
    category: "Knotless"
  },
  {
    id: "feed-in-cornrows",
    name: "Feed-in Cornrows",
    description: "Straight-back feed-in cornrows with clean parts.",
    imageUrl: "/assets/kari-stylez/braids-model-3.png",
    category: "Cornrows"
  },
  {
    id: "knotless-color",
    name: "Knotless Braids with Color",
    description: "Medium knotless braids with burgundy color accents.",
    imageUrl: "/assets/kari-stylez/braids-auburn.png",
    category: "Knotless"
  },
  {
    id: "kids-twist",
    name: "Kids Twist Style",
    description: "Cute twist style for children with accessories.",
    imageUrl: "/assets/kari-stylez/braids-bob.png",
    category: "Kids"
  },
  {
    id: "long-knotless",
    name: "Long Knotless Braids",
    description: "Waist-length knotless braids with golden highlights.",
    imageUrl: "/assets/kari-stylez/braids-model-2.png",
    category: "Knotless"
  },
  {
    id: "stitch-cornrows",
    name: "Stitch Cornrows",
    description: "Detailed stitch cornrows with zigzag pattern.",
    imageUrl: "/assets/kari-stylez/braids-model-3.png",
    category: "Cornrows"
  },
  {
    id: "faux-locs",
    name: "Faux Locs",
    description: "Bohemian faux locs with wrapped accents.",
    imageUrl: "/assets/kari-stylez/braids-model-5.jpg",
    category: "Locs"
  },
  {
    id: "distressed-locs",
    name: "Distressed Locs",
    description: "Bohemian distressed locs with natural finish.",
    imageUrl: "/assets/kari-stylez/braids-model-6.jpg",
    category: "Locs"
  },
  {
    id: "goddess-locs",
    name: "Goddess Locs",
    description: "Bohemian-inspired goddess locs with curly ends.",
    imageUrl: "/assets/kari-stylez/braids-model-7.jpg",
    category: "Locs"
  },
  {
    id: "kids-box-braids",
    name: "Kids Box Braids",
    description: "Colorful box braids for children with beads.",
    imageUrl: "/assets/kari-stylez/braids-model-8.jpg",
    category: "Kids"
  },
  {
    id: "jumbo-knotless",
    name: "Jumbo Knotless Braids",
    description: "Extra large knotless braids for a bold look.",
    imageUrl: "/assets/kari-stylez/braids-curls.png",
    category: "Knotless"
  },
  {
    id: "small-knotless",
    name: "Small Knotless Braids",
    description: "Fine knotless braids with intricate parts.",
    imageUrl: "/assets/kari-stylez/braids-model-4.jpg",
    category: "Knotless"
  }
];

const CATEGORIES = ["All", "Knotless", "Locs", "Cornrows", "Kids"];

// Service Card Component that matches the screenshot
function ServiceCard({ id, name, description, imageUrl, category }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg relative group cursor-pointer">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
      </div>
      
      {/* Category Badge */}
      <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-black text-xs font-medium rounded-full">
        {category}
      </div>
      
      {/* Service Description */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold mb-1">{name}</h3>
        <p className="text-sm text-neutral-200">{description}</p>
      </div>
    </div>
  );
}

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredServices = selectedCategory === "All" 
    ? SERVICES 
    : SERVICES.filter(service => service.category === selectedCategory);
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
        {/* Category Filters */}
        <div className="pt-8 pb-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="py-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;