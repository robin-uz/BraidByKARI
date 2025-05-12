import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials?active=true"],
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">Error loading testimonials: {error.message}</p>
      </div>
    );
  }

  // Fallback testimonials in case the API returns no data
  const defaultTestimonials = [
    {
      id: 1,
      name: "Jasmine Williams",
      testimonial: "I've been getting my braids done at different salons for years, but Divine Braids is on another level. The attention to detail is amazing, and my knotless braids lasted for 3 months!",
      rating: 5,
      imageUrl: "/testimonials/jasmine-testimonial.png",
      isActive: true
    },
    {
      id: 2,
      name: "Michelle Thompson",
      testimonial: "The owner really takes her time to understand what you want. My box braids were exactly how I envisioned them, and the atmosphere in the salon is so relaxing and welcoming.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      isActive: true
    },
    {
      id: 3,
      name: "Tanya Johnson",
      testimonial: "I appreciate how careful they are with my natural hair. No excessive pulling or tension. My feed-in braids were gorgeous and my edges stayed healthy. Will definitely be back!",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      isActive: true
    },
  ];

  // Use testimonials from API or fallback to default if empty
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderStars = (rating: number | null | undefined) => {
    // Default to 5 stars if rating is null or undefined
    const actualRating = rating ?? 5;
    const fullStars = Math.floor(actualRating);
    const hasHalfStar = actualRating % 1 >= 0.5;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current text-purple-600 dark:text-purple-400" />);
    }

    // Add half star if needed
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <svg 
          key="half" 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-purple-600 dark:text-purple-400"
        >
          <defs>
            <linearGradient id="halfStarGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon 
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
            fill="url(#halfStarGradient)" 
            stroke="currentColor"
          />
        </svg>
      );
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-neutral-300 dark:text-neutral-600" />);
    }

    return stars;
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden">
        <div className="absolute top-10 right-[15%] w-32 h-32 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-[5%] w-24 h-24 bg-fuchsia-200/20 dark:bg-fuchsia-600/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating quote marks */}
      <div className="absolute top-1/4 left-[5%] text-8xl font-serif text-purple-400/20 dark:text-purple-600/10 floating-icon">"</div>
      <div className="absolute bottom-1/4 right-[5%] text-8xl font-serif text-fuchsia-400/20 dark:text-fuchsia-600/10 floating-icon" style={{animationDelay: '1.5s'}}>"</div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
          {/* Background glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative glassmorphism rounded-xl overflow-hidden z-10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image side */}
              <div className="relative h-80 md:h-full">
                <img 
                  src={displayTestimonials[0]?.imageUrl || "/testimonials/client-testimonial.jpg"} 
                  alt={`${displayTestimonials[0]?.name || "Happy client"}`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent"></div>
              </div>
              
              {/* Content side */}
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white/95 dark:bg-neutral-900/95">
                <svg className="w-14 h-14 text-purple-500 dark:text-purple-400 mb-6 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7Z" fill="currentColor"/>
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5V16.5H14V9.5C12.6193 9.5 11.5 8.38071 11.5 7C11.5 5.61929 12.6193 4.5 14 4.5C15.3807 4.5 16.5 5.61929 16.5 7C16.5 8.38071 15.3807 9.5 14 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <p className="text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
                  {displayTestimonials[0]?.testimonial || "I've been getting my braids done at different salons for years, but this place is on another level. The attention to detail is amazing, and my knotless braids lasted for 3 months!"}
                </p>
                
                <div className="flex items-center mt-auto">
                  <div className="h-16 w-16 rounded-full overflow-hidden shadow-lg border-2 border-purple-200 dark:border-purple-800">
                    {displayTestimonials[0]?.imageUrl ? (
                      <img 
                        src={displayTestimonials[0].imageUrl}
                        alt={displayTestimonials[0].name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-xl font-bold">
                        {displayTestimonials[0]?.name?.charAt(0) || "J"}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 text-transparent bg-clip-text">
                      {displayTestimonials[0]?.name || "Jasmine Williams"}
                    </h4>
                    <div className="text-purple-600 dark:text-purple-400 flex">
                      {renderStars(displayTestimonials[0]?.rating || 5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.length > 1 ? (
            displayTestimonials.slice(1).map((testimonial, index) => (
            <div key={testimonial.id} className="luxury-card group">
              <div className="relative z-10 bg-white dark:bg-neutral-900 p-8 rounded-xl h-full flex flex-col">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-full blur-xl"></div>
                </div>
                
                <svg className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-6 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7Z" fill="currentColor"/>
                  <path d="M9.5 7C9.5 8.38071 8.38071 9.5 7 9.5V16.5H14V9.5C12.6193 9.5 11.5 8.38071 11.5 7C11.5 5.61929 12.6193 4.5 14 4.5C15.3807 4.5 16.5 5.61929 16.5 7C16.5 8.38071 15.3807 9.5 14 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <p className="mb-6 italic text-neutral-700 dark:text-neutral-300 leading-relaxed flex-grow">
                  {testimonial.testimonial}
                </p>
                
                <div className="flex items-center mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="h-14 w-14 rounded-full overflow-hidden shadow-md border-2 border-purple-100 dark:border-purple-900">
                    {testimonial.imageUrl ? (
                      <img 
                        src={testimonial.imageUrl}
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white font-medium">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 text-transparent bg-clip-text">
                      {testimonial.name}
                    </h4>
                    <div className="text-purple-600 dark:text-purple-400 flex">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonial submission CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block py-2 px-4 bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-sm rounded-full mb-4">
            <span className="text-purple-700 dark:text-purple-300 text-sm">Enjoyed our service?</span>
          </div>
          <h3 className="text-2xl font-semibold mb-6">Share Your Experience</h3>
          <button className="glow-button">
            Submit a Testimonial
          </button>
        </div>
      </div>
    </section>
  );
}
