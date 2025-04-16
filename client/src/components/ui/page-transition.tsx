import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(location);

  // Reset loading state when location changes
  useEffect(() => {
    setIsLoading(true);
    
    // Give a slight delay to allow loading animation to show
    const timer = setTimeout(() => {
      setIsLoading(false);
      setKey(location);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}