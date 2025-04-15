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

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current text-primary" />);
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
          className="text-primary"
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
    <section className="py-20 bg-primary-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Don't just take our word for it – hear from our satisfied clients about their Divine Braids experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 relative">
              <div className="text-primary text-4xl absolute -top-4 -left-2">"</div>
              <p className="mb-4 pt-3 italic text-neutral-700 dark:text-neutral-300">
                {testimonial.testimonial}
              </p>
              <div className="flex items-center mt-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                  {testimonial.imageUrl ? (
                    <img 
                      src={testimonial.imageUrl}
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="text-primary flex">
                    {renderStars(testimonial.rating)}
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
