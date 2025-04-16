import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Scissors, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceSelectionProps {
  selectedService: Service | undefined;
  setSelectedService: (service: Service) => void;
  preselectedServiceName?: string;
}

export default function ServiceSelection({
  selectedService,
  setSelectedService,
  preselectedServiceName
}: ServiceSelectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Get services
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  // Get service categories
  const getCategories = (services: Service[] | undefined) => {
    if (!services) return [];
    const categories = services.map(service => {
      // Extract category from service name (before the first space)
      const category = service.name.split(" ")[0];
      return category;
    });
    // Convert Set to Array to fix the TypeScript error
    return ["all", ...Array.from(new Set(categories))];
  };
  
  const categories = getCategories(services);
  
  // Filter services by category
  const filteredServices = services?.filter(service => {
    if (activeCategory === "all") return true;
    return service.name.startsWith(activeCategory);
  });
  
  // Set preselected service
  useState(() => {
    if (preselectedServiceName && services) {
      const service = services.find(s => s.name === preselectedServiceName);
      if (service) {
        setSelectedService(service);
      }
    }
  });
  
  // Format price from cents to dollars
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };
  
  // Format duration (e.g., "120" to "2 hours")
  const formatDuration = (duration: string) => {
    const minutes = parseInt(duration.replace(/\D/g, ""));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} hr ${remainingMinutes} min` 
        : `${hours} hr`;
    }
    return `${minutes} min`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Scissors className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400" />
          Select a Service
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
          Choose from our range of professional braiding services
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 dark:text-purple-400 mb-2" />
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">Loading services...</p>
        </div>
      ) : services && services.length > 0 ? (
        <>
          {/* Category Tabs */}
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap pb-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize data-[state=active]:text-purple-600 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {filteredServices?.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedService(service)}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedService?.id === service.id 
                        ? "border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                        : "border-neutral-200 dark:border-neutral-800"
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                            {service.description}
                          </p>
                        </div>
                        {selectedService?.id === service.id && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(service.duration)}
                        </div>
                        <div className="flex items-center font-medium text-purple-600 dark:text-purple-300">
                          <DollarSign className="h-4 w-4 mr-0.5" />
                          {formatPrice(service.price)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">No services available.</p>
        </div>
      )}
      
      {/* Selected Service Summary */}
      {selectedService && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mt-4">
          <h4 className="font-medium flex items-center text-purple-700 dark:text-purple-300">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
            Selected Service
          </h4>
          <div className="mt-2 flex flex-wrap justify-between">
            <div>
              <p className="font-medium">{selectedService.name}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedService.description}</p>
            </div>
            <div className="flex flex-col items-end mt-2 sm:mt-0">
              <p className="text-purple-600 dark:text-purple-300 font-medium">{formatPrice(selectedService.price)}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {formatDuration(selectedService.duration)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}