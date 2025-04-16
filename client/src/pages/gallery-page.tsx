import { Helmet } from "react-helmet";
import GallerySlider from "@/components/gallery/gallery-slider";
import PageTransition from "@/components/ui/page-transition";
import { useEffect, useState, useContext } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";
import { GallerySkeleton } from "@/components/ui/skeletons";

export default function GalleryPage() {
  const loadingContext = useContext(LoadingContext);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Set loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isImageLoading && loadingContext) {
        loadingContext.setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isImageLoading, loadingContext]);
  
  // Simulate loading of gallery images
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Gallery | KARI STYLEZ</title>
        <meta name="description" content="Browse our gallery of beautiful braiding styles created by our skilled stylists at KARI STYLEZ." />
      </Helmet>
      
      <PageTransition>
        <section className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="text-amber-600 font-medium block mb-3">OUR CREATIONS</span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Stunning Gallery</h1>
              <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mb-6"></div>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Browse through our collection of beautiful braided styles created by our talented team at KARI STYLEZ.
              </p>
            </div>
            
            {isImageLoading ? (
              <GallerySkeleton />
            ) : (
              <GallerySlider />
            )}
            
            <div className="mt-16 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4">Transform Your Look</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                Our team of skilled stylists at KARI STYLEZ can recreate these styles or customize them to suit your preferences.
                Book an appointment today to transform your look with our premium braiding services.
              </p>
              <a 
                href="/booking" 
                className="kari-button inline-block"
              >
                Book Your Appointment
              </a>
            </div>
          </div>
        </section>
      </PageTransition>
    </>
  );
}
