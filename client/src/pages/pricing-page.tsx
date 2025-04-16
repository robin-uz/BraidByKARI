import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Service } from "@shared/schema";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"hourly" | "package">("package");
  
  // Fetch services data
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  // Organize services into categories
  const getServicesByCategory = () => {
    if (!services || !services.length) return {};
    
    const categories = {};
    
    services.forEach(service => {
      // Create categories based on the first word of the service name
      // For example: "Box Braids" goes to "Box" category
      const category = service.name.split(' ')[0];
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(service);
    });
    
    return categories;
  };
  
  // Featured packages with additional information
  const featuredPackages = [
    {
      name: "Basic Braids",
      price: 129,
      hourlyPrice: 65,
      description: "Perfect for clients seeking traditional braiding styles with minimal complexity.",
      features: [
        "Consultation with stylist",
        "Standard braid patterns",
        "Basic hair care tips",
        "Up to shoulder length",
        "Free edge control product"
      ],
      limitations: [
        "Extension hair not included",
        "Limited style options",
        "No color treatments"
      ],
      popular: false,
      tag: "Basic"
    },
    {
      name: "Premium Styles",
      price: 189,
      hourlyPrice: 85,
      description: "Our most popular package for clients wanting versatile, intricate braid designs.",
      features: [
        "Extended consultation",
        "Custom braid patterns",
        "Detailed aftercare guide",
        "Up to mid-back length",
        "Complimentary edge control & oil",
        "One free touch-up appointment"
      ],
      limitations: [],
      popular: true,
      tag: "Popular"
    },
    {
      name: "Luxury Experience",
      price: 299,
      hourlyPrice: 110,
      description: "The ultimate braiding experience with premium products and personalized service.",
      features: [
        "VIP consultation",
        "Custom color matching",
        "Any length or complexity",
        "Full hair care product set",
        "Scalp treatment included",
        "Two free touch-up appointments",
        "Priority booking for future appointments"
      ],
      limitations: [],
      popular: false,
      tag: "Deluxe"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Services & Pricing | Divine Braids</title>
        <meta name="description" content="Our comprehensive pricing for all braiding and styling services at Divine Braids salon." />
      </Helmet>
      
      <div className="container py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Services & Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our range of expert braiding services designed to match your style and budget
          </p>
        </div>
        
        {/* Package/Hourly Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs 
            defaultValue="package" 
            className="w-[300px]"
            onValueChange={(value) => setBillingCycle(value as "hourly" | "package")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="package">Package Pricing</TabsTrigger>
              <TabsTrigger value="hourly">Hourly Pricing</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Featured Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredPackages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden ${
                pkg.popular ? 'border-amber-400 shadow-lg dark:border-amber-600' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-5 right-5">
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`p-1 ${
                pkg.popular ? 'bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-900 dark:to-amber-800' : ''
              }`}>
                <CardContent className="p-6 bg-white dark:bg-slate-950 rounded-sm">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm uppercase font-medium text-muted-foreground">
                        {pkg.tag}
                      </div>
                      <h3 className="text-2xl font-bold">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          ${billingCycle === "package" ? pkg.price : pkg.hourlyPrice}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{billingCycle === "package" ? "package" : "hour"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {pkg.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start">
                          <XCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                          <span className="text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/booking">
                        <Button className="w-full">
                          Book Appointment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Individual Services */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading mb-2">Individual Services</h2>
            <p className="text-muted-foreground">All our braiding and styling services with transparent pricing</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(getServicesByCategory()).map(([category, categoryServices]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-2xl font-bold font-heading border-b pb-2">{category} Styles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(categoryServices as Service[]).map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {service.icon && (
                              <div className="w-full md:w-24 bg-amber-100 dark:bg-amber-950 flex items-center justify-center p-4">
                                <span className="text-2xl">{service.icon}</span>
                              </div>
                            )}
                            
                            <div className="p-4 flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{service.name}</h4>
                                <div className="font-bold">${service.price}</div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                              <div className="text-xs text-muted-foreground">Duration: {service.duration}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold font-heading">Ready to transform your look?</h2>
            <p className="text-muted-foreground">
              Book your appointment today and experience our premium braiding services.
              Special discounts available for first-time clients.
            </p>
            <div className="pt-4">
              <Link href="/booking">
                <Button size="lg">
                  Book Your Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}