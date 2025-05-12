import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showControls?: boolean;
}

export function LightboxModal({
  src,
  alt,
  title,
  description,
  onClose,
  onPrev,
  onNext,
  showControls = true
}: LightboxModalProps) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal element if it doesn't exist
    let portalElement = document.getElementById('lightbox-portal');
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.id = 'lightbox-portal';
      document.body.appendChild(portalElement);
    }
    setPortal(portalElement);
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Event listeners for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);
  
  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);
  
  if (!portal) return null;
  
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
        onClick={handleOutsideClick}
      >
        <div className="relative w-full max-w-screen-lg max-h-[90vh] flex flex-col">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          {/* Navigation buttons */}
          {showControls && onPrev && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 transition-colors opacity-70 hover:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {showControls && onNext && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 transition-colors opacity-70 hover:opacity-100"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}
          
          {/* Image container */}
          <div className="relative flex-grow h-full flex items-center justify-center">
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-[calc(90vh-4rem)] object-contain rounded-md"
            />
          </div>
          
          {/* Caption */}
          {(title || description) && (
            <div className="bg-black/60 p-4 rounded-b-md mt-1">
              {title && <h3 className="text-white text-lg font-medium">{title}</h3>}
              {description && <p className="text-white/80 mt-1">{description}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    portal
  );
}