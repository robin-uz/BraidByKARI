import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative pt-16 md:pt-24 pb-32 md:pb-48 bg-amber-100 dark:bg-amber-900 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl mx-auto text-center mb-12">
            <div className="relative mb-8">
              <img 
                src="/images/hero-image.jpg" 
                alt="Beautiful braided hairstyle with sunflowers" 
                className="rounded-lg shadow-xl w-full h-auto object-cover mx-auto"
              />
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Good Looking<br/>
              <span className="text-primary">Reflects Your Story</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-neutral-800 dark:text-neutral-200">
              Experience the art of luxurious hair braiding that combines tradition with modern styles for a truly stunning look that tells your unique story.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 w-full max-w-3xl">
            <div className="text-center">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <p className="text-xs mt-1">In-salon</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p className="text-xs mt-1">Expert Stylists</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </div>
              <p className="text-xs mt-1">Premium Products</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <p className="text-xs mt-1">Aftercare</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
