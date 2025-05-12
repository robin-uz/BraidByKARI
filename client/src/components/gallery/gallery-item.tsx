import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GalleryItemProps {
  src: string;
  alt: string;
  category: string;
  title?: string;
  description?: string;
  onClick: () => void;
}

export function GalleryItem({
  src,
  alt,
  category,
  title,
  description,
  onClick
}: GalleryItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
      className={cn(
        "break-inside-avoid mb-4",
        "cursor-pointer rounded-xl overflow-hidden",
        "group"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {/* Image */}
        <div 
          className={cn(
            "transition-all duration-500 ease-out",
            "transform group-hover:scale-[1.03]",
            !isLoaded && "blur-sm"
          )}
        >
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-auto" 
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
        
        {/* Category tag */}
        <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full bg-amber-500/90 text-black">
          {category}
        </div>
        
        {/* Optional title */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium text-lg line-clamp-1">{title}</h3>
            {description && (
              <p className="text-white/80 text-sm line-clamp-2">{description}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}