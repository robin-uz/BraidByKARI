import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, Grid, Section, Container, ResponsiveText } from '@/components/ui/container';
import { Service } from '@shared/schema';

export function ServicesGrid() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const [, navigate] = useRouter();
  
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
    <Section id="services" className="bg-neutral-50 dark:bg-neutral-900">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-1.5 px-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium mb-3">
            Our Expertise
          </span>
          <ResponsiveText 
            as="h2" 
            variant="h1" 
            className="font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text"
          >
            Luxury Hair Services
          </ResponsiveText>
          <ResponsiveText className="max-w-3xl mx-auto text-neutral-600 dark:text-neutral-400">
            At KARI STYLEZ, we offer a wide range of premium hair braiding and styling services tailored 
            to your unique needs and preferences. Each service is performed with meticulous attention 
            to detail by our expert stylists.
          </ResponsiveText>
        </div>
        
        {/* Services Grid - Using specs from layout guide */}
        <Grid 
          variant="services" 
          className="mb-16"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Grid>
        
        {/* Call to action */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/services')} 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            View All Services
          </Button>
        </div>
      </Container>
    </Section>
  );
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const [, navigate] = useRouter();
  
  const handleClick = () => {
    navigate(`/services/${service.id}`);
  };
  
  return (
    <Card 
      as="div"
      variant="service"
      className={cn(
        "group transition-all duration-300 ease-out relative overflow-hidden",
        "flex flex-col h-full",
        "bg-white dark:bg-neutral-800",
        "hover:shadow-[0_20px_50px_-12px_rgba(255,203,112,0.35)] dark:hover:shadow-[0_20px_30px_-15px_rgba(255,203,112,0.20)]",
        "hover:-translate-y-1"
      )}
      onClick={handleClick}
    >
      {/* Service Image */}
      {service.imageUrl && (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-[calc(var(--radius-lg-mobile)-1px)] sm:rounded-t-[calc(var(--radius-lg-tablet)-1px)] lg:rounded-t-[calc(var(--radius-lg)-1px)]">
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      )}
      
      {/* Service Info */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
          <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
            {service.category || 'Hair Styling'}
          </span>
        </div>
        
        <ResponsiveText 
          as="h3" 
          variant="h3" 
          className="font-bold mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
        >
          {service.name}
        </ResponsiveText>
        
        <ResponsiveText className="text-neutral-600 dark:text-neutral-400 mb-4 flex-grow">
          {service.description}
        </ResponsiveText>
        
        {/* Price and duration */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <ResponsiveText className="font-bold text-amber-600 dark:text-amber-400">
            ${service.price}
          </ResponsiveText>
          <span className="text-sm text-neutral-500 dark:text-neutral-500">
            {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
          </span>
        </div>
      </div>
      
      {/* Hover effect gradient border */}
      <div className="absolute inset-0 border-2 border-transparent rounded-[var(--radius-lg-mobile)] sm:rounded-[var(--radius-lg-tablet)] lg:rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-500 to-amber-400 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]"></div>
    </Card>
  );
}