import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceType {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: string;
  imageUrl: string;
}

interface StyleCardProps {
  service: ServiceType;
  selected: boolean;
  onClick: () => void;
}

export function StyleCard({ service, selected, onClick }: StyleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group cursor-pointer rounded-xl overflow-hidden break-inside-avoid-column mb-4",
        "border-2",
        selected ? "border-amber-500" : "border-transparent hover:border-amber-500/50"
      )}
      onClick={onClick}
    >
      <div className="relative">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        
        {/* Category tag & price */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between">
          <div className="px-2 py-1 text-xs font-medium bg-amber-500 text-black rounded-md">
            {service.category}
          </div>
          <div className="px-2 py-1 text-xs font-bold bg-black/70 text-white rounded-md">
            ${service.price}
          </div>
        </div>
        
        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
            <div className="bg-amber-500 text-black font-medium rounded-full px-3 py-1">
              Selected
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 bg-white/5">
        <h3 className="text-white font-medium text-lg mb-1">{service.name}</h3>
        <p className="text-neutral-300 text-sm line-clamp-2 mb-2">{service.description}</p>
        <div className="flex items-center text-xs text-amber-300">
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span>{service.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}