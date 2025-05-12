import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { AvatarCard } from '@/components/about/avatar-card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Stylist data
const stylists = [
  {
    name: "Kari Thompson",
    specialty: "Founder, Master Stylist",
    image: "/about/kari.jpg",
    instagramUrl: "https://instagram.com/karistylez"
  },
  {
    name: "Amara Williams",
    specialty: "Braids Specialist",
    image: "/about/amara.jpg",
    instagramUrl: "https://instagram.com/amarastylez"
  },
  {
    name: "Tiana Jackson",
    specialty: "Locs Expert",
    image: "/about/tiana.jpg",
    instagramUrl: "https://instagram.com/tianastylez"
  },
  {
    name: "Jordan Bell",
    specialty: "Protective Styles",
    image: "/about/jordan.jpg",
    instagramUrl: "https://instagram.com/jordanstylez"
  },
  {
    name: "Maya Richards",
    specialty: "Natural Hair Care",
    image: "/about/maya.jpg",
    instagramUrl: "https://instagram.com/mayastylez"
  }
];

// Timeline data
const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Kari Stylez founded as a part-time passion project out of a home studio."
  },
  {
    year: "2019",
    title: "First Studio",
    description: "Opened our first dedicated studio in the heart of the city."
  },
  {
    year: "2020",
    title: "Pandemic Pivot",
    description: "Launched virtual hair care consultations and DIY braiding kits."
  },
  {
    year: "2022",
    title: "Expansion",
    description: "Moved to our luxury flagship location with expanded team and services."
  },
  {
    year: "2023",
    title: "Training Academy",
    description: "Launched Kari Stylez Academy to train the next generation of braiders."
  },
  {
    year: "2024",
    title: "Digital Transformation",
    description: "Introduced advanced booking technology and virtual try-on experiences."
  }
];

// Press logos
const pressLogos = [
  { name: "Essence", logo: "/about/press/essence.png" },
  { name: "Vogue", logo: "/about/press/vogue.png" },
  { name: "Cosmetology License", logo: "/about/press/license.png" },
  { name: "Beauty Association", logo: "/about/press/beauty-assoc.png" },
  { name: "Elle", logo: "/about/press/elle.png" }
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="bg-purple-950/90">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero/about-banner.jpg" 
              alt="About Kari Stylez" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Luxury Braiding Rooted in Culture
              </motion.h1>
              <motion.p 
                className="text-xl text-amber-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Where heritage meets high fashion
              </motion.p>
            </div>
          </div>
          
          {/* Founder Headshot */}
          <div className="absolute -bottom-20 left-8 md:left-16 z-20">
            <div className="w-40 h-40 rounded-full border-4 border-brand-gold overflow-hidden shadow-xl">
              <img 
                src="/about/founder.jpg" 
                alt="Kari Thompson, Founder" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        
        {/* Founder Story Section */}
        <section className="container mx-auto px-4 pt-32 pb-20">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <div>
              <img 
                src="/about/founder-story.jpg" 
                alt="Kari's Journey" 
                className="rounded-2xl w-full h-auto shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-semibold text-white mb-6">Our Founder's Journey</h2>
              <p className="text-neutral-300 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
              </p>
              <p className="text-neutral-300 mb-6">
                Vestibulum tempor feugiat sem, non dapibus justo semper vitae. Duis fringilla convallis purus vitae fermentum. Suspendisse potenti. Etiam sagittis faucibus quam, at sagittis magna hendrerit non. Duis tristique egestas sapien eget cursus. Fusce fermentum orci a nunc condimentum, vel varius diam tempus.
              </p>
              <img 
                src="/about/signature.png" 
                alt="Kari's Signature" 
                className="h-16 w-auto"
              />
            </div>
          </motion.div>
        </section>
        
        {/* Mission & Values Section */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-3">Our Mission & Values</h2>
              <p className="text-neutral-300 max-w-2xl mx-auto">
                Guided by our commitment to excellence and cultural reverence
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              {/* Card 1 */}
              <div className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-6 transition-transform hover:transform hover:scale-105">
                <div className="text-4xl mb-4">💇🏾‍♀️</div>
                <h3 className="text-xl font-heading font-medium text-white mb-3">Healthy Hair</h3>
                <p className="text-neutral-300">
                  We prioritize the health of your natural hair in every style we create, using gentle techniques and premium products.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-6 transition-transform hover:transform hover:scale-105">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-heading font-medium text-white mb-3">Luxury Experience</h3>
                <p className="text-neutral-300">
                  From our serene atmosphere to our personalized consultations, we ensure every visit feels indulgent and rejuvenating.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-6 transition-transform hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-heading font-medium text-white mb-3">Cultural Celebration</h3>
                <p className="text-neutral-300">
                  We honor the rich heritage and artistry of braiding traditions while innovating for the modern era.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Meet the Stylists Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-3">Meet the Stylists</h2>
              <p className="text-neutral-300 max-w-2xl mx-auto">
                Our team of passionate professionals dedicated to your hair transformation
              </p>
            </motion.div>
            
            <motion.div 
              className="overflow-x-auto pb-6 -mx-4 px-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <div className="flex snap-x snap-mandatory space-x-4 min-w-full">
                {stylists.map((stylist, index) => (
                  <AvatarCard 
                    key={index}
                    name={stylist.name}
                    specialty={stylist.specialty}
                    image={stylist.image}
                    instagramUrl={stylist.instagramUrl}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-3">Our Journey</h2>
              <p className="text-neutral-300 max-w-2xl mx-auto">
                From humble beginnings to becoming a premier destination for protective styling
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-gold/60 transform md:translate-x-px"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div 
                    key={index}
                    className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                  >
                    <div className="md:w-1/2 pr-12 pl-8 md:pl-0 md:pr-12 relative">
                      {/* Dot */}
                      <div className="absolute left-0 md:left-auto md:right-0 top-1.5 w-4 h-4 rounded-full bg-brand-gold transform md:translate-x-1/2"></div>
                      
                      <div className={`text-right ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <span className="text-amber-500 font-bold text-lg">{milestone.year}</span>
                        <h3 className="text-xl font-heading font-medium text-white mt-1 mb-2">{milestone.title}</h3>
                        <p className="text-neutral-300">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Press & Certifications */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-3">Featured In</h2>
              <p className="text-neutral-300 max-w-2xl mx-auto">
                Recognized for our excellence and innovation
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariants}
            >
              {pressLogos.map((item, index) => (
                <div key={index} className="w-24 md:w-32 h-16 flex items-center justify-center">
                  <img 
                    src={item.logo} 
                    alt={item.name} 
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Strip */}
        <motion.section 
          className="bg-gradient-to-r from-amber-700 to-amber-500 py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">
              Ready to elevate your crown?
            </h2>
            <Link to="/booking">
              <button className="inline-flex items-center bg-black text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-gray-900 transition-colors">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}