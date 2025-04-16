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
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
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
    <section className="py-20 bg-purple-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it – hear from our satisfied clients about their hair styling experience.
          </p>
        </div>
        
        {/* Featured testimonial */}
        <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image side */}
            <div className="relative h-64 md:h-full">
              <img 
                src="https://images.unsplash.com/photo-1605980776566-0486c3ac7065?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                alt="Happy client" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Content side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-purple-600 dark:text-purple-400 text-5xl mb-6">"</div>
              <p className="text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 mb-8">
                {displayTestimonials[0]?.testimonial || "I've been getting my braids done at different salons for years, but this place is on another level. The attention to detail is amazing, and my knotless braids lasted for 3 months!"}
              </p>
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                  {displayTestimonials[0]?.imageUrl ? (
                    <img 
                      src={displayTestimonials[0].imageUrl}
                      alt={displayTestimonials[0].name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-600 dark:bg-purple-400 text-white text-xl font-bold">
                      {displayTestimonials[0]?.name?.charAt(0) || "J"}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-lg">{displayTestimonials[0]?.name || "Jasmine Williams"}</h4>
                  <div className="text-purple-600 dark:text-purple-400 flex">
                    {renderStars(displayTestimonials[0]?.rating || 5)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* More testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.slice(1).map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 relative">
              <div className="text-purple-600 dark:text-purple-400 text-4xl mb-4">"</div>
              <p className="mb-4 italic text-neutral-700 dark:text-neutral-300">
                {testimonial.testimonial}
              </p>
              <div className="flex items-center mt-6">
                <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                  {testimonial.imageUrl ? (
                    <img 
                      src={testimonial.imageUrl}
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-600 dark:bg-purple-400 text-white font-medium">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="text-purple-600 dark:text-purple-400 flex">
                    {renderStars(testimonial.rating || 5)}
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
