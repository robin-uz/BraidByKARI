import { FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AvatarCardProps {
  name: string;
  specialty: string;
  image: string;
  instagramUrl?: string;
}

export function AvatarCard({ name, specialty, image, instagramUrl }: AvatarCardProps) {
  return (
    <motion.div 
      className="flex flex-col items-center p-4 min-w-[180px] snap-center"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative mb-3">
        <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-brand-gold">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        {instagramUrl && (
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute bottom-1 right-1 bg-black/60 text-brand-gold p-2 rounded-full hover:bg-black transition-colors"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
        )}
      </div>
      
      <h4 className="font-heading text-lg font-medium text-white">{name}</h4>
      <p className="text-sm text-amber-300/80">{specialty}</p>
    </motion.div>
  );
}