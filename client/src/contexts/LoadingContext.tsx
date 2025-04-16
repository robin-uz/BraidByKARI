import { createContext, ReactNode, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Auto-trigger loading when location changes
  useEffect(() => {
    setIsLoading(true);
    
    // Reset after a brief delay to allow for animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}