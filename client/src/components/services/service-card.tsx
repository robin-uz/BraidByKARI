import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function ServiceCard({ 
  id, 
  name, 
  description, 
  duration, 
  price, 
  imageUrl,
  category 
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group overflow-hidden rounded-2xl",
        "bg-white/5 backdrop-blur-lg",
        "ring-1 ring-white/10",
        "flex flex-col h-full"
      )}
    >
      {/* Service Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-black">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-bold mb-2 text-white bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">{name}</h3>
        <p className="text-neutral-300 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="mt-auto space-y-4">
          {/* Duration and Price */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-amber-300 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="text-white font-bold text-lg">${price}</div>
          </div>
          
          {/* Book Button */}
          <Link href={`/booking?service=${id}`}>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black">
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}