import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative pt-16 md:pt-24 pb-32 md:pb-48 bg-gradient-to-b from-primary-50 to-white dark:from-neutral-950 dark:to-neutral-900 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-neutral-300"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Elevate Your Beauty with <span className="text-primary">Premium Braiding</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 text-neutral-700 dark:text-neutral-300">
              Experience the art of luxurious hair braiding that combines tradition with modern styles for a truly stunning look.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/booking">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1594359850659-6d9768e89cfb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Beautiful braided hairstyle" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-lg">
              <p className="font-serif text-primary text-2xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Divine Beauty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
