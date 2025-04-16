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
              src="/images/hero-hairstyle.png" 
              alt="Beautiful hairstyle" 
              className="w-full h-auto object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80";
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Brands Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">Brands that we collaborated with</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-purple-500 dark:text-purple-400 font-bold text-xl">GQ</div>
            <div className="text-purple-500 dark:text-purple-400 font-bold text-xl">ELLE</div>
            <div className="text-purple-500 dark:text-purple-400 font-bold text-xl">COSMOPOLITAN</div>
            <div className="text-purple-500 dark:text-purple-400 font-bold text-xl">VOGUE</div>
            <div className="text-purple-500 dark:text-purple-400 font-bold text-xl">teespring</div>
          </div>
        </div>
      </div>
    </section>
  );
}
