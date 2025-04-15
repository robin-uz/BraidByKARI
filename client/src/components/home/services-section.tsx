import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Loader2, Crown, Feather, Wind } from "lucide-react";

// Icons for services
const getIconComponent = (iconName: string) => {
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
      name: "Bob Boho Braids",
      description: "Stylish bob-length braids with elegant curls, perfect for a chic, sophisticated look.",
      price: 25000, // $250.00
      duration: "4-6 hours",
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
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            We offer a wide range of braiding styles to match your personal style and preferences, all executed with exceptional skill and care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayServices.map((service) => (
            <div key={service.id} className="bg-primary-50 dark:bg-neutral-950 rounded-lg shadow-md hover:shadow-lg transition-all p-6 group">
              <div className="mb-4 text-primary text-3xl">
                {getIconComponent(service.icon)}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-all">
                {service.name}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                {service.description}
              </p>
              <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-primary font-semibold">Starting at {formatPrice(service.price)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pricing Table */}
        <div className="mt-20">
          <h3 className="font-heading text-2xl font-bold text-center mb-8">Complete Pricing</h3>
          
          <div className="overflow-x-auto bg-white dark:bg-neutral-950 rounded-lg shadow-lg">
            <table className="w-full">
              <thead className="bg-primary-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-4 text-left font-heading font-semibold">Style</th>
                  <th className="px-6 py-4 text-left font-heading font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-heading font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left font-heading font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4 font-medium">Box Braids (Small)</td>
                  <td className="px-6 py-4">Thin box braids with detailed parting</td>
                  <td className="px-6 py-4">5-7 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$200</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4 font-medium">Box Braids (Medium)</td>
                  <td className="px-6 py-4">Standard size box braids</td>
                  <td className="px-6 py-4">4-6 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$180</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4 font-medium">Box Braids (Large)</td>
                  <td className="px-6 py-4">Chunky box braids with less installation time</td>
                  <td className="px-6 py-4">3-5 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$150</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4 font-medium">Knotless Braids</td>
                  <td className="px-6 py-4">Tension-free braids with a natural look</td>
                  <td className="px-6 py-4">5-8 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$220</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4 font-medium">Feed-in Braids</td>
                  <td className="px-6 py-4">Sleek braids with a natural transition</td>
                  <td className="px-6 py-4">4-6 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$180</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Bob Boho Braids</td>
                  <td className="px-6 py-4">Stylish bob-length braids with elegant curls</td>
                  <td className="px-6 py-4">4-6 hours</td>
                  <td className="px-6 py-4 text-primary font-semibold">$250</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
