import { Helmet } from "react-helmet";
import GallerySlider from "@/components/gallery/gallery-slider";

export default function GalleryPage() {
  return (
    <>
      <Helmet>
        <title>Gallery | Divine Braids</title>
        <meta name="description" content="Browse our gallery of beautiful braiding styles created by our skilled stylists at Divine Braids." />
      </Helmet>
      
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Stunning Gallery</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Browse through our collection of beautiful braided styles created by our talented team.
            </p>
          </div>
          
          <GallerySlider />
          
          <div className="mt-16 text-center">
            <h2 className="font-heading text-2xl font-semibold mb-4">Like What You See?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
              Our team of skilled stylists can recreate these styles or customize them to suit your preferences.
              Book an appointment today to transform your look with our premium braiding services.
            </p>
            <a 
              href="/booking" 
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
