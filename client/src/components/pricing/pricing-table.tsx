import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'wouter';
import { Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@shared/schema';
import { Card, Section, Container, ResponsiveText } from '@/components/ui/container';
import { PricingRow } from '@/components/ui/guide-form';
import { Button } from '@/components/ui/button';

export function PricingTable() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, navigate] = useRouter();
  
  // Group services by category
  const servicesByCategory: {[key: string]: Service[]} = {};
  
  if (services) {
    services.forEach(service => {
      const category = service.category || 'Other Services';
      if (!servicesByCategory[category]) {
        servicesByCategory[category] = [];
      }
      servicesByCategory[category].push(service);
    });
  }
  
  // If no active category is set, use the first one
  React.useEffect(() => {
    if (!activeCategory && Object.keys(servicesByCategory).length > 0) {
      setActiveCategory(Object.keys(servicesByCategory)[0]);
    }
  }, [services]);
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? null : category);
  };
  
  if (isLoading) {
    return (
      <Section className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </Section>
    );
  }
  
  if (error || !services) {
    return (
      <Section className="text-center">
        <ResponsiveText variant="h3" className="text-red-500">
          Error loading services
        </ResponsiveText>
        <ResponsiveText>
          Please try again later or contact us directly.
        </ResponsiveText>
      </Section>
    );
  }
  
  return (
    <Section id="pricing" className="bg-neutral-50 dark:bg-neutral-900">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-1.5 px-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium mb-3">
            Our Pricing
          </span>
          <ResponsiveText 
            as="h2" 
            variant="h1" 
            className="font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text"
          >
            Transparent & Consistent
          </ResponsiveText>
          <ResponsiveText className="max-w-3xl mx-auto text-neutral-600 dark:text-neutral-400">
            We believe in transparent pricing with no hidden fees. Our prices reflect the quality, 
            attention to detail, and expertise you'll experience with every service.
          </ResponsiveText>
        </div>
        
        {/* Pricing Table - Width follows pricing table specs */}
        <div className="max-w-[var(--pricing-table-max-width)] mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(servicesByCategory).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  "border",
                  activeCategory === category
                    ? "bg-amber-600 text-white border-amber-600 dark:bg-amber-700 dark:border-amber-700"
                    : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-300 dark:hover:border-amber-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Pricing Card - Uses card specs */}
          <Card className={cn(
            "bg-white dark:bg-neutral-800 overflow-hidden",
            "shadow-lg hover:shadow-xl transition-shadow duration-300"
          )}>
            {/* Accent Top Border */}
            <div className="h-[var(--pricing-accent-height)] bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500"></div>
            
            <div className="p-6 md:p-8">
              {/* Active Category Section */}
              {activeCategory && (
                <div>
                  <ResponsiveText 
                    as="h3" 
                    variant="h2" 
                    className="font-bold mb-6 text-amber-600 dark:text-amber-400"
                  >
                    {activeCategory}
                  </ResponsiveText>
                  
                  <div className="space-y-1">
                    {servicesByCategory[activeCategory].map((service) => (
                      <PricingRow
                        key={service.id}
                        title={service.name}
                        price={service.price.toFixed(2)}
                        description={`${service.duration} ${service.duration === 1 ? 'hour' : 'hours'} • ${service.description.split('.')[0]}`}
                        thumbnail={service.imageUrl}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Notes and disclaimer */}
          <div className="mt-8 text-neutral-500 dark:text-neutral-400">
            <ResponsiveText variant="label" className="mb-4 font-semibold">Important Notes:</ResponsiveText>
            <ul className="space-y-2 text-sm list-disc pl-5">
              <li>Prices may vary based on hair length, thickness, and complexity of the style.</li>
              <li>Additional services like extensions or special treatments may incur extra costs.</li>
              <li>We recommend booking a consultation for a precise quote on complex styles.</li>
              <li>Cancellations with less than 24 hours notice may be subject to a fee.</li>
            </ul>
          </div>
          
          {/* Call to action */}
          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate('/booking')} 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}