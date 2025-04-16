import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Loader2, Crown, Feather, Wind, ArrowRight, Scissors, Award, Clock } from "lucide-react";
import { Link } from "wouter";

// Import user-uploaded assets for authentic salon images
import model1 from "@/assets/kari-stylez/braids-model-1.png";
import model2 from "@/assets/kari-stylez/braids-model-2.png";
import model3 from "@/assets/kari-stylez/braids-model-3.png";
import model4 from "@/assets/kari-stylez/braids-model-4.jpg";
import model5 from "@/assets/kari-stylez/braids-model-5.jpg";

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
    case "scissors":
      return <Scissors className="w-8 h-8" />;
    case "award":
      return <Award className="w-8 h-8" />;
    case "clock":
      return <Clock className="w-8 h-8" />;
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
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
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
      name: "Classic Box Braids",
      description: "Traditional square-shaped parts with clean lines and uniform size.",
      price: 20000, // $200.00
      duration: "4-6 hours",
      icon: "crown",
      image: model1
    },
    {
      id: 2,
      name: "Jumbo Box Braids",
      description: "Larger box braids that take less time to install but are heavier.",
      price: 18000, // $180.00
      duration: "3-5 hours",
      icon: "feather",
      image: model2
    },
    {
      id: 3,
      name: "Goddess Braids",
      description: "Raised braids close to the scalp, often in intricate patterns.",
      price: 22000, // $220.00
      duration: "4-7 hours",
      icon: "award",
      image: model3
    },
    {
      id: 4,
      name: "Knotless Braids",
      description: "Modern technique with a seamless look and reduced tension.",
      price: 24000, // $240.00
      duration: "5-8 hours",
      icon: "scissors",
      image: model4
    },
    {
      id: 5,
      name: "Feed-In Braids",
      description: "Sleek cornrows with extension hair fed in gradually for a natural look.",
      price: 19000, // $190.00
      duration: "3-5 hours",
      icon: "wind",
      image: model5
    }
  ];

  // Use services from API or fallback to default services if empty
  const displayServices = services && services.length > 0 ? services : defaultServices;
  
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Simple feature showcase for the top section
  const topFeatures = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Quality",
      description: "We use only the highest quality hair extensions for lasting beauty.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Efficient",
      description: "Our skilled stylists work efficiently without sacrificing quality.",
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Custom Styles",
      description: "Every style is customized to suit your unique face shape and preferences.",
    }
  ];

  return (
    <section id="services" className="relative py-24 bg-gradient-to-b from-white to-amber-50 dark:from-neutral-900 dark:to-amber-950/20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden">
        <div className="curved-divider">
          <div className="absolute top-0 right-[10%] w-24 h-24 bg-amber-200/20 dark:bg-amber-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-[15%] w-32 h-32 bg-amber-200/20 dark:bg-amber-700/10 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-[5%] w-16 h-16 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-600/20 backdrop-blur-sm floating-icon"></div>
      <div className="absolute bottom-1/4 left-[7%] w-20 h-20 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-700/20 backdrop-blur-sm floating-icon" style={{animationDelay: '1.5s'}}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 text-transparent bg-clip-text">
            Signature Services
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            At KARI STYLEZ, we create luxurious braided hairstyles designed to enhance your beauty 
            and protect your natural hair, all executed with exceptional skill and care.
          </p>
        </div>
        
        {/* Features row - replaces the duplicated service listings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {topFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl glassmorphism transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/10 hover:shadow-lg">
              <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-700 dark:text-amber-400">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Featured service with image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">
              Expert Hair Braiding
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Our salon specializes in creating stunning braided hairstyles that are both beautiful and protective for your natural hair.
            </p>
            
            {/* Service list with realistic pricing */}
            <div className="space-y-6">
              {displayServices.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-start glassmorphism p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/10 hover:shadow-lg">
                  <div className="shrink-0 bg-gradient-to-br from-amber-500 to-amber-700 p-3 rounded-xl mr-4 shadow-md">
                    <div className="text-white text-xl">
                      {getIconComponent(service.icon)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-amber-700 dark:text-amber-300">{service.name}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">{service.description}</p>
                    <span className="text-amber-600 dark:text-amber-400 font-medium text-sm">
                      Starting at {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/pricing">
              <button className="mt-10 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-medium shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/30">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </button>
            </Link>
          </div>
          
          <div className="relative order-1 lg:order-2 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-amber-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
              <img 
                src={model3} 
                alt="Woman with beautiful braided hairstyle by KARI STYLEZ" 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h4 className="text-white text-xl font-semibold">Artistic Excellence</h4>
                <p className="text-white/80 text-sm">Our braiding techniques combine tradition with modern artistry</p>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-5 -right-5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg p-3 shadow-lg z-10 floating-icon">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <Link href="/booking">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-medium shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/30 text-lg">
              Book Your Appointment Today
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* Wavy bottom */}
      <div className="wavy-bottom mt-24"></div>
    </section>
  );
}
