import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

export function SimplifiedServiceCard({ id, name, description, imageUrl, category }: ServiceCardProps) {
  return (
    <Link href={`/booking?service=${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="cursor-pointer overflow-hidden rounded-xl group relative"
      >
        {/* Background Image */}
        <div className="w-full aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        </div>
        
        {/* Category Tag */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-amber-500 text-black">
          {category}
        </div>
        
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-sm text-neutral-200 opacity-85">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}