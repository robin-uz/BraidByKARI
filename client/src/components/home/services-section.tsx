import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Loader2, Crown, Feather, Wind, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Icons for services
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return <Crown className="w-8 h-8" />;
  
  switch (iconName) {
    case "crown":
      return <Crown className="w-8 h-8" />;
    case "feather":
      return <Feather className="w-8 h-8" />;
    case "wind":
      return <Wind className="w-8 h-8" />;
    default:
      return <Crown className="w-8 h-8" />;
  }
};

export default function ServicesSection() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
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
        <p className="text-red-500">Error loading services: {error.message}</p>
      </div>
    );
  }

  // Fallback data in case no services are returned from API
  const defaultServices = [
    {
      id: 1,
      name: "Box Braids",
      description: "Classic box braids in various sizes, perfect for a versatile, low-maintenance style that lasts.",
      price: 15000, // $150.00
      duration: "4-6 hours",
      icon: "crown",
    },
    {
      id: 2,
      name: "Knotless Braids",
      description: "Modern, gentle braids with a seamless look and reduced tension for maximum comfort.",
      price: 18000, // $180.00
      duration: "5-7 hours",
      icon: "feather",
    },
    {
      id: 3,
      name: "Long Box Braids",
      description: "Classic long box braids with clean parting, perfect for an elegant, sophisticated look.",
      price: 23000, // $230.00
      duration: "5-7 hours",
      icon: "wind",
    },
  ];

  // Use services from API or fallback to default services if empty
  const displayServices = services && services.length > 0 ? services : defaultServices;
  
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <section id="services" className="relative py-24 bg-gradient-to-b from-white to-purple-50 dark:from-neutral-900 dark:to-purple-950/20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden">
        <div className="curved-divider">
          <div className="absolute top-0 right-[10%] w-24 h-24 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-[15%] w-32 h-32 bg-fuchsia-200/20 dark:bg-fuchsia-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-[5%] w-16 h-16 rounded-full bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 backdrop-blur-sm floating-icon"></div>
      <div className="absolute bottom-1/4 left-[7%] w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-400/20 to-purple-400/20 backdrop-blur-sm floating-icon" style={{animationDelay: '1.5s'}}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 text-transparent bg-clip-text">
            Signature Services
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            We offer a wide range of braiding styles to match your personal style and preferences, 
            all executed with exceptional skill and care by our experienced stylists.
          </p>
        </div>
        
        {/* Feature showcase with image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
              Expert Hair Braiding
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Our salon specializes in creating stunning braided hairstyles that are both beautiful and protective for your natural hair.
            </p>
            
            <div className="space-y-6">
              {displayServices.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-start glassmorphism p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/10 hover:shadow-lg">
                  <div className="shrink-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 p-3 rounded-xl mr-4 shadow-md">
                    <div className="text-white text-xl">
                      {getIconComponent(service.icon)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-purple-700 dark:text-purple-300">{service.name}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">{service.description}</p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                      Starting at {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/pricing">
              <button className="glow-button mt-10">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </button>
            </Link>
          </div>
          
          <div className="relative order-1 lg:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
              <img 
                src="/images/afro-style.jpg" 
                alt="Woman with beautiful braided hairstyle" 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h4 className="text-white text-xl font-semibold">Artistic Excellence</h4>
                <p className="text-white/80 text-sm">Our braiding techniques combine tradition with modern artistry</p>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-5 -right-5 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg p-3 shadow-lg z-10 floating-icon">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Services grid - luxury cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {displayServices.map((service, index) => (
            <div key={service.id} className="luxury-card relative p-1 group">
              <div className="relative z-10 bg-white dark:bg-neutral-900 p-6 rounded-xl h-full flex flex-col">
                <div className="mb-4 relative">
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-xl"></div>
                  <div className="relative z-10 w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-3xl shadow-lg">
                    {getIconComponent(service.icon)}
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all">
                  {service.name}
                </h3>
                
                <p className="text-neutral-700 dark:text-neutral-300 mb-4 flex-grow">
                  {service.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {service.duration}
                  </span>
                </div>
              </div>
              
              {/* Gradient border animation on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-700 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-20 text-center">
          <Link href="/booking">
            <button className="glow-button">
              Book Your Appointment Today
              <ArrowRight className="ml-2 h-4 w-4 inline" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* Wavy bottom */}
      <div className="wavy-bottom mt-24"></div>
    </section>
  );
}
