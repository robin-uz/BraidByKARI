import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-200/20 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-purple-600 dark:text-purple-400 block">Hair by Design:</span>
              <span className="text-neutral-900 dark:text-white">Where Imagination Takes Shape</span>
            </h1>
            
            <p className="mt-6 text-lg text-neutral-700 dark:text-neutral-300">
              Experience the art of luxurious hair braiding that combines tradition with modern styles for a truly stunning look that tells your unique story.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg" className="rounded-full px-6 bg-purple-600 hover:bg-purple-700 text-white">
                  Book now
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="rounded-full px-6 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <img 
              src="/images/box-braids.jpg" 
              alt="Beautiful box braids hairstyle" 
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Our Expertise Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">Our Premium Services</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              </div>
              <p className="font-medium">Box Braids</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
              <p className="font-medium">Knotless Braids</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                  <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                  <path d="M17 21h-1a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h1"></path>
                  <path d="M8 4a2 2 0 1 1 4 0v12a2 2 0 1 1-4 0V4Z"></path>
                  <path d="M16 4a2 2 0 1 0-4 0v12a2 2 0 1 0 4 0V4Z"></path>
                </svg>
              </div>
              <p className="font-medium">Feed-in Braids</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <p className="font-medium">Bob Boho Braids</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
