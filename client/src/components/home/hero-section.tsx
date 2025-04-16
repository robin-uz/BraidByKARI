import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-minerva-beige overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[75vh]">
          {/* Text Content */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-minerva-brown block">Get Hair Style</span>
              <span className="text-minerva-brown">You Deserve</span>
            </h1>
            
            <p className="mt-4 md:mt-6 text-base md:text-lg text-minerva-brown/80">
              Style up your hair and unleash the goddess within you. Minerva's professional hair specialists will help you create your dream hairstyle.
            </p>
            
            <div className="mt-8 md:mt-10">
              <Link href="/booking">
                <Button size="lg" className="rounded-none px-6 py-2 bg-minerva-red hover:bg-minerva-red/90 text-white">
                  BOOK AN APPOINTMENT
                </Button>
              </Link>
            </div>
            
            {/* Promotions */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-minerva-cream rounded-lg p-4 flex items-center shadow-sm">
                <div className="mr-4">
                  <img 
                    src="/images/hair-dryer.png" 
                    alt="Hair dryer" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">NEW ARRIVALS</h3>
                  <p className="text-xs text-minerva-red font-medium">20% OFF</p>
                </div>
              </div>
              <div className="bg-minerva-cream rounded-lg p-4 flex items-center shadow-sm">
                <div className="mr-4">
                  <img 
                    src="/images/shampoo.png" 
                    alt="Shampoo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">HAIR CARE</h3>
                  <p className="text-xs text-minerva-red font-medium">50% OFF</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative mt-6 lg:mt-0">
            <img 
              src="/attached_assets/original-33f4ef525d160c76985a972bf8cf25e4.jpg" 
              alt="Beautiful woman with red hair" 
              className="w-full h-auto max-h-[80vh] lg:max-h-none object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Our Services Section */}
      <div className="w-full py-10 bg-minerva-beige">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-minerva-brown mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-minerva-red rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/haircut.jpg" 
                  alt="Haircut" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-white font-medium">Haircut</h3>
              </div>
            </div>
            <div className="bg-minerva-cream rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/braids.jpg" 
                  alt="Braids" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-minerva-brown font-medium">Highlights</h3>
              </div>
            </div>
            <div className="bg-minerva-cream rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/coloring.jpg" 
                  alt="Coloring" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-minerva-brown font-medium">Coloring</h3>
              </div>
            </div>
            <div className="bg-minerva-cream rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/extensions.jpg" 
                  alt="Extensions" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-minerva-brown font-medium">Extensions</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Section */}
      <div className="bg-minerva-beige py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-minerva-brown mb-8">Booking</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-minerva-cream p-4 rounded-lg">
              <h3 className="text-center font-semibold text-minerva-brown mb-4">January 2024</h3>
              <div className="grid grid-cols-7 gap-1">
                <div className="text-center text-xs py-1">Mon</div>
                <div className="text-center text-xs py-1">Tue</div>
                <div className="text-center text-xs py-1">Wed</div>
                <div className="text-center text-xs py-1">Thu</div>
                <div className="text-center text-xs py-1">Fri</div>
                <div className="text-center text-xs py-1">Sat</div>
                <div className="text-center text-xs py-1">Sun</div>
                
                {/* Calendar days */}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="text-center py-1 text-sm">
                    {i + 1 <= 31 ? i + 1 : ""}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <img 
                src="/images/salon-chair.jpg" 
                alt="Salon chair" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-center font-semibold text-minerva-brown mt-4">Working Hours</h3>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="text-sm">Monday-Friday</div>
                <div className="text-sm">9am - 7pm</div>
                <div className="text-sm">Saturday</div>
                <div className="text-sm">9am - 6pm</div>
                <div className="text-sm">Sunday</div>
                <div className="text-sm">Closed</div>
              </div>
            </div>
            
            <div className="bg-neutral-800 p-4 rounded-lg">
              <h3 className="text-center font-semibold text-white mb-4">We will call you</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    className="w-full p-2 bg-neutral-700 text-white placeholder-neutral-400 rounded border-none"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone number" 
                    className="w-full p-2 bg-neutral-700 text-white placeholder-neutral-400 rounded border-none"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full p-2 bg-neutral-700 text-white placeholder-neutral-400 rounded border-none"
                  />
                </div>
                <div>
                  <button type="button" className="w-full p-2 bg-minerva-red text-white rounded">
                    SEND REQUEST
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
