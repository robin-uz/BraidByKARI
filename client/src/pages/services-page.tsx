import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { SimplifiedServiceCard } from '@/components/services/simplified-service-card';
import { Container, Section, ResponsiveText } from '@/components/ui/container';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Star } from 'lucide-react';

// KARI STYLEZ authentic service data
const SERVICES = [
  {
    id: "classic-knotless",
    name: "Classic Knotless Box Braids",
    description: "Medium size knotless box braids with natural hair color.",
    duration: "4-5 hours",
    price: 180,
    imageUrl: "/assets/kari-stylez/braids-model-1.png",
    category: "Knotless"
  },
  {
    id: "feed-in-cornrows",
    name: "Feed-in Cornrows",
    description: "Straight-back feed-in cornrows with clean parts.",
    duration: "3-4 hours",
    price: 160,
    imageUrl: "/assets/kari-stylez/braids-model-3.png",
    category: "Cornrows"
  },
  {
    id: "knotless-color",
    name: "Knotless Braids with Color",
    description: "Medium knotless braids with burgundy color accents.",
    duration: "5-6 hours",
    price: 220,
    imageUrl: "/assets/kari-stylez/braids-auburn.png",
    category: "Knotless"
  },
  {
    id: "kids-twist",
    name: "Kids Twist Style",
    description: "Cute twist style for children with accessories.",
    duration: "2-3 hours",
    price: 120,
    imageUrl: "/assets/kari-stylez/braids-bob.png",
    category: "Kids"
  },
  {
    id: "long-knotless",
    name: "Long Knotless Braids",
    description: "Waist-length knotless braids with golden highlights.",
    duration: "6-7 hours",
    price: 240,
    imageUrl: "/assets/kari-stylez/braids-model-2.png",
    category: "Knotless"
  },
  {
    id: "stitch-cornrows",
    name: "Stitch Cornrows",
    description: "Detailed stitch cornrows with zigzag pattern.",
    duration: "3-4 hours",
    price: 180,
    imageUrl: "/assets/kari-stylez/braids-model-3.png",
    category: "Cornrows"
  },
  {
    id: "faux-locs",
    name: "Faux Locs",
    description: "Bohemian faux locs with wrapped accents.",
    duration: "5-6 hours",
    price: 220,
    imageUrl: "/assets/kari-stylez/braids-model-5.jpg",
    category: "Locs"
  },
  {
    id: "distressed-locs",
    name: "Distressed Locs",
    description: "Bohemian distressed locs with natural finish.",
    duration: "5-6 hours",
    price: 220,
    imageUrl: "/assets/kari-stylez/braids-model-6.jpg",
    category: "Locs"
  },
  {
    id: "goddess-locs",
    name: "Goddess Locs",
    description: "Bohemian-inspired goddess locs with curly ends.",
    duration: "5-6 hours",
    price: 240,
    imageUrl: "/assets/kari-stylez/braids-model-7.jpg",
    category: "Locs"
  },
  {
    id: "kids-box-braids",
    name: "Kids Box Braids",
    description: "Colorful box braids for children with beads.",
    duration: "3-4 hours",
    price: 150,
    imageUrl: "/assets/kari-stylez/braids-model-8.jpg",
    category: "Kids"
  },
  {
    id: "jumbo-knotless",
    name: "Jumbo Knotless Braids",
    description: "Extra large knotless braids for a bold look.",
    duration: "4-5 hours",
    price: 200,
    imageUrl: "/assets/kari-stylez/braids-curls.png",
    category: "Knotless"
  },
  {
    id: "small-knotless",
    name: "Small Knotless Braids",
    description: "Fine knotless braids with intricate parts.",
    duration: "7-8 hours",
    price: 260,
    imageUrl: "/assets/kari-stylez/braids-model-4.jpg",
    category: "Knotless"
  },
  {
    id: "butterfly-locs",
    name: "Butterfly Locs",
    description: "Textured butterfly locs with distressed loops.",
    duration: "5-6 hours",
    price: 220,
    imageUrl: "/assets/kari-stylez/braids-side.png",
    category: "Locs"
  },
  {
    id: "kids-cornrows",
    name: "Kids Cornrows",
    description: "Gentle cornrows with heart design for kids.",
    duration: "2-3 hours",
    price: 120,
    imageUrl: "/assets/kari-stylez/braids-model-4.jpg",
    category: "Kids"
  },
  {
    id: "cornrow-updo",
    name: "Cornrow Updo",
    description: "Elegant cornrow updo style for special occasions.",
    duration: "4-5 hours",
    price: 180,
    imageUrl: "/assets/kari-stylez/braids-bun.png",
    category: "Cornrows"
  }
];

const CATEGORIES = ["All", "Knotless", "Locs", "Cornrows", "Kids", "Treatments", "Add-ons"];

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredServices = selectedCategory === "All" 
    ? SERVICES 
    : SERVICES.filter(service => service.category === selectedCategory);
  
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="relative h-[48vh] min-h-[400px] flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src="/images-new/hero-braids-2.png" 
              alt="Services Banner" 
              className="w-full h-full object-cover"
            />
            
            {/* Corner Gradient Arc */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-amber-500/40 to-purple-600/30 rounded-br-full z-20 blur-xl"></div>
          </div>
          
          {/* Hero Content */}
          <Container className="relative z-30">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Elevate Your Style
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-neutral-200 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Expert braiding and styling services by Kari Stylez, where artistry meets precision.
              </motion.p>
            </div>
          </Container>
        </div>
        
        {/* Category Filters */}
        <Section className="pb-0 pt-8">
          <Container>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Container>
        </Section>
        
        {/* Services Grid */}
        <Section>
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredServices.map(service => (
                <SimplifiedServiceCard key={service.id} {...service} />
              ))}
            </div>
            
            {filteredServices.length === 0 && (
              <div className="py-20 text-center">
                <ResponsiveText variant="h3" className="text-neutral-400 mb-4">
                  No services found in this category
                </ResponsiveText>
                <Button 
                  onClick={() => setSelectedCategory("All")}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View All Services
                </Button>
              </div>
            )}
          </Container>
        </Section>
        
        {/* FAQs Section */}
        <Section className="bg-neutral-900">
          <Container>
            <div className="max-w-3xl mx-auto">
              <ResponsiveText variant="h2" className="text-center mb-8 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent font-bold">
                Frequently Asked Questions
              </ResponsiveText>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="upkeep">
                  <AccordionTrigger className="text-white text-left">
                    How should I maintain my braids between appointments?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    For optimal upkeep, we recommend wrapping your hair with a satin scarf at night, using a light oil spray on the scalp 2-3 times weekly, and avoiding heavy products that cause buildup. Touch up your edges with a small amount of edge control as needed. Schedule a maintenance appointment after 4-6 weeks.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="wash">
                  <AccordionTrigger className="text-white text-left">
                    How often should I wash my braided hairstyle?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    We recommend washing your braids every 2-3 weeks. Use a diluted shampoo in an applicator bottle to target the scalp, focus on gentle massage rather than scrubbing, and thoroughly rinse. Allow plenty of time to air dry completely to prevent mildew smell.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="edge">
                  <AccordionTrigger className="text-white text-left">
                    What's the best way to preserve my edges with braided styles?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    To preserve your edges, ensure your stylist doesn't braid too tightly, use minimal tension during installation, apply a light edge control product with fingers rather than a brush, avoid constant manipulation, and give your hairline regular breaks between protective styles.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="accessories">
                  <AccordionTrigger className="text-white text-left">
                    Can I add beads and cuffs to any braided style?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    Yes, most braided styles can be accessorized with beads and cuffs. However, the thickness of your braids will determine which accessories work best. We offer a variety of options from subtle gold cuffs to statement beads. These can be added at your initial appointment or during a maintenance visit.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="deposit">
                  <AccordionTrigger className="text-white text-left">
                    Do you require a deposit for booking appointments?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300">
                    Yes, we require a 30% non-refundable deposit to secure your appointment. This deposit goes toward your total service cost. For appointments over $200, we offer a payment plan option. Deposits can be transferred to a new date with 48 hours notice for rescheduling.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Container>
        </Section>
        
        {/* Reviews Strip */}
        <div className="py-10 bg-amber-600">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(num => (
                  <Star key={num} className="w-6 h-6 text-white fill-white" />
                ))}
              </div>
              <p className="text-xl font-medium text-black">
                Trusted by 5,000+ happy clients
              </p>
            </div>
          </Container>
        </div>
        
        {/* CTA Section */}
        <Section className="bg-gradient-to-r from-neutral-900 to-neutral-950">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <ResponsiveText variant="h2" className="mb-6 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent font-bold">
                Ready to Transform Your Look?
              </ResponsiveText>
              <p className="text-neutral-300 mb-8 text-lg">
                Book your appointment today and experience the Kari Stylez difference. Our expert stylists are ready to create your perfect look.
              </p>
              <Link href="/booking">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black text-lg px-8 py-6">
                  Book Your Appointment
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </motion.div>
    </MainLayout>
  );
};

export default ServicesPage;