import { useState } from 'react';
import { motion } from 'framer-motion';
import { StyleCard, ServiceType } from './style-card';

// Sample services data
const SERVICES: ServiceType[] = [
  {
    id: "knotless-lg",
    name: "Knotless Box Braids (Large)",
    description: "Protective style with a natural-looking part and less tension on the scalp. Our large knotless braids offer a lightweight feel.",
    duration: "4-5 hours",
    price: 180,
    category: "Knotless",
    imageUrl: "/images/styles/knotless-braids-lg.jpg"
  },
  {
    id: "knotless-sm",
    name: "Knotless Box Braids (Small)",
    description: "Finer braids with all the benefits of the knotless technique. More braids for a fuller look that lasts longer.",
    duration: "6-7 hours",
    price: 220,
    category: "Knotless",
    imageUrl: "/images/styles/knotless-braids-sm.jpg"
  },
  {
    id: "goddess-locs",
    name: "Goddess Locs",
    description: "Bohemian-inspired locs with a soft, curly texture. Perfect for a natural yet elegant protective style.",
    duration: "5-6 hours",
    price: 240,
    category: "Locs",
    imageUrl: "/images/styles/goddess-locs.jpg"
  },
  {
    id: "butterfly-locs",
    name: "Butterfly Locs",
    description: "Textured, distressed locs with a bohemian flair. Lightweight and perfect for summer.",
    duration: "5-6 hours",
    price: 200,
    category: "Locs",
    imageUrl: "/images/styles/butterfly-locs.jpg"
  },
  {
    id: "stitch-cornrows",
    name: "Stitch Cornrows",
    description: "Intricate cornrow design with clean parts and sleek finish. Can be styled in various patterns.",
    duration: "3-4 hours",
    price: 160,
    category: "Cornrows",
    imageUrl: "/images/styles/stitch-cornrows.jpg"
  },
  {
    id: "kids-braids",
    name: "Kids Braided Styles",
    description: "Gentle braided styles specifically for children. Includes beads and cute accessories.",
    duration: "2-3 hours",
    price: 120,
    category: "Kids",
    imageUrl: "/images/styles/kids-braids.jpg"
  },
  {
    id: "scalp-detox",
    name: "Scalp Detox Treatment",
    description: "Deep cleansing treatment that removes buildup, soothes the scalp, and prepares hair for styling.",
    duration: "45 min",
    price: 70,
    category: "Treatments",
    imageUrl: "/images/styles/scalp-treatment.jpg"
  },
  {
    id: "bead-addons",
    name: "Bead & Cuff Add-ons",
    description: "Elevate your style with our selection of beads, cuffs, and hair jewelry. Price varies by quantity.",
    duration: "30-60 min",
    price: 50,
    category: "Add-ons",
    imageUrl: "/images/styles/bead-addons.jpg"
  }
];

const CATEGORIES = ["All", "Knotless", "Locs", "Cornrows", "Kids", "Treatments", "Add-ons"];

interface StepServiceProps {
  selectedService: ServiceType | null;
  onSelect: (service: ServiceType) => void;
}

export function StepService({ selectedService, onSelect }: StepServiceProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredServices = selectedCategory === "All" 
    ? SERVICES 
    : SERVICES.filter(service => service.category === selectedCategory);
    
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Choose Your Style</h2>
      
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-amber-500 text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Services Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-0">
        {filteredServices.map(service => (
          <StyleCard
            key={service.id}
            service={service}
            selected={selectedService?.id === service.id}
            onClick={() => onSelect(service)}
          />
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-neutral-300">No services found in this category.</p>
          <button
            className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 font-medium"
            onClick={() => setSelectedCategory("All")}
          >
            View All Services
          </button>
        </div>
      )}
    </motion.div>
  );
}