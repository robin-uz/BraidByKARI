import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Loader2, Star } from "lucide-react";

export default function TestimonialsSection() {
  // Fetch testimonials from API
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials?active=true"],
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">Error loading testimonials: {error.message}</p>
      </div>
    );
  }

  // Fallback testimonials if API returns no data
  const defaultTestimonials = [
    {
      id: 1,
      name: "Jasmine Williams",
      testimonial: "I've been getting my braids done at different salons for years, but Divine Braids is on another level. The attention to detail is amazing, and my knotless braids lasted for 3 months!",
      rating: 5,
      imageUrl: "/testimonials/jasmine-braids.jpg",
      isActive: true
    },
    {
      id: 2,
      name: "Michelle Thompson",
      testimonial: "The owner really takes her time to understand what you want. My box braids were exactly how I envisioned them, and the atmosphere in the salon is so relaxing and welcoming.",
      rating: 5,
      imageUrl: "/default-avatar.jpg", 
      isActive: true
    }
  ];

  // Use testimonials from API or fallback to default if empty
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-24 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
            Client Love
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 text-transparent bg-clip-text">
            What Our Clients Say
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it – hear from our satisfied clients about their hair styling experience.
          </p>
        </div>
        
        {/* Featured testimonial */}
        <div className="relative mb-20 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-xl z-10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image side - Responsive for both mobile and web */}
              <div className="relative h-96 md:h-full">
                <img 
                  src={displayTestimonials[0]?.imageUrl || "/testimonials/jasmine-braids.jpg"} 
                  alt={`${displayTestimonials[0]?.name || "Happy client"}`} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent"></div>
              </div>
              
              {/* Content side */}
              <div className="p-6 md:p-12 flex flex-col justify-center">
                <svg className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-6 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7Z" fill="currentColor"/>
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5V16.5H14V9.5C12.6193 9.5 11.5 8.38071 11.5 7C11.5 5.61929 12.6193 4.5 14 4.5C15.3807 4.5 16.5 5.61929 16.5 7C16.5 8.38071 15.3807 9.5 14 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <p className="text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
                  {displayTestimonials[0]?.testimonial || "I've been getting my braids done at different salons for years, but this place is on another level. The attention to detail is amazing, and my knotless braids lasted for 3 months!"}
                </p>
                
                <div className="flex items-center mt-auto">
                  <div className="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                    <img 
                      src={displayTestimonials[0]?.imageUrl || "/testimonials/jasmine-braids.jpg"} 
                      alt={displayTestimonials[0]?.name || "Client"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg text-purple-700 dark:text-purple-400">
                      {displayTestimonials[0]?.name || "Jasmine Williams"}
                    </h4>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < (displayTestimonials[0]?.rating || 5) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More testimonials - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayTestimonials.slice(1).map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg h-full flex flex-col">
              <svg className="w-10 h-10 text-purple-500 dark:text-purple-400 mb-4 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7Z" fill="currentColor"/>
                <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5V16.5H14V9.5C12.6193 9.5 11.5 8.38071 11.5 7C11.5 5.61929 12.6193 4.5 14 4.5C15.3807 4.5 16.5 5.61929 16.5 7C16.5 8.38071 15.3807 9.5 14 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <p className="text-sm md:text-base italic text-gray-600 dark:text-gray-300 leading-relaxed flex-grow line-clamp-6 md:line-clamp-4">
                "{testimonial.testimonial}"
              </p>
              
              <div className="flex items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-purple-100 dark:border-purple-900">
                  <img 
                    src={testimonial.imageUrl || "/default-avatar.jpg"} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-sm md:text-base text-purple-700 dark:text-purple-400">
                    {testimonial.name}
                  </h4>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-3 w-3 md:h-4 md:w-4 ${i < (testimonial.rating || 5) ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}