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
    <section id="services" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600 dark:text-purple-400">
            Our Premium Services
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            We offer a wide range of braiding styles to match your personal style and preferences, all executed with exceptional skill and care by our experienced stylists.
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
                <div key={service.id} className="flex items-start">
                  <div className="shrink-0 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                    <div className="text-purple-600 dark:text-purple-400 text-xl">
                      {getIconComponent(service.icon)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{service.name}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">{service.description}</p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                      Starting at {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/pricing" className="inline-flex items-center mt-8 text-purple-600 dark:text-purple-400 font-medium">
              View all services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl order-1 lg:order-2">
            <img 
              src="/images/afro-style.jpg" 
              alt="Woman with beautiful braided hairstyle" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Services grid - condensed version */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {displayServices.map((service) => (
            <div key={service.id} className="bg-purple-50 dark:bg-neutral-950 rounded-lg shadow-md hover:shadow-lg transition-all p-6 group">
              <div className="mb-4 text-purple-600 dark:text-purple-400 text-3xl">
                {getIconComponent(service.icon)}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all">
                {service.name}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                {service.description}
              </p>
              <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Starting at {formatPrice(service.price)}</span>
              </div>
            </div>
          ))}
        </div>
        

      </div>
    </section>
  );
}
