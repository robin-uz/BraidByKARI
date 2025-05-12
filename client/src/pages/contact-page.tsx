import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Phone, Clock, MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import ContactForm from '@/components/contact/contact-form';
import { HeroWrapper } from '@/components/home/hero-wrapper';
import { ResponsiveText } from '@/components/ui/container';
import { SiTiktok } from 'react-icons/si';

const ContactPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  return (
    <MainLayout>
      <div className="w-full">
        {/* Slim Hero Section */}
        <HeroWrapper 
          img="/images-new/contact-banner.png" 
          className="h-[30vh]"
          overlayOpacity="bg-black/60"
        >
          <div className="container mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <ResponsiveText
                as="h1"
                variant="h1"
                className="font-bold text-white drop-shadow-lg font-serif mb-2"
              >
                <span className="bg-gradient-to-r from-amber-300 to-amber-600 text-transparent bg-clip-text">
                  Get in Touch
                </span>
              </ResponsiveText>
              <ResponsiveText
                variant="h3"
                className="text-neutral-200 max-w-2xl drop-shadow-md font-light"
              >
                We're here to answer your questions
              </ResponsiveText>
            </motion.div>
          </div>
        </HeroWrapper>

        {/* Contact + Map Grid */}
        <section className="py-12 md:py-16 bg-purple-950">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Contact Information Card */}
              <motion.div 
                {...fadeIn}
                className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-8 md:p-10 flex flex-col"
              >
                <ResponsiveText
                  as="h2"
                  variant="h2"
                  className="text-amber-400 font-serif mb-6"
                >
                  Contact Information
                </ResponsiveText>
                
                <div className="space-y-6 mb-10">
                  <div className="flex items-start">
                    <MapPin className="text-amber-500 mr-4 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">Our Location</h3>
                      <p className="text-gray-300">
                        123 Braiding Avenue<br />
                        Atlanta, GA 30303
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-amber-500 mr-4 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">Phone</h3>
                      <p className="text-gray-300">(404) 555-1234</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="text-amber-500 mr-4 mt-1 shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">Hours</h3>
                      <p className="text-gray-300">
                        Monday - Friday: 10am - 8pm<br />
                        Saturday: 9am - 6pm<br />
                        Sunday: 11am - 5pm
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-white font-medium mb-3">Connect With Us</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://instagram.com/karistylez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-black/20 rounded-full hover:text-[#d9a43b] transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={24} />
                    </a>
                    <a 
                      href="https://tiktok.com/@karistylez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-black/20 rounded-full hover:text-[#d9a43b] transition-colors"
                      aria-label="TikTok"
                    >
                      <SiTiktok size={24} />
                    </a>
                    <a 
                      href="https://facebook.com/karistylez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-black/20 rounded-full hover:text-[#d9a43b] transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={24} />
                    </a>
                  </div>
                </div>
              </motion.div>
              
              {/* Google Map Card */}
              <motion.div 
                {...fadeIn}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl overflow-hidden"
              >
                <div className="aspect-[16/9] w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106162.92927441687!2d-84.47670364179685!3d33.78118360000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA!5e0!3m2!1sen!2sus!4v1647294882553!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="KARI STYLEZ Location"
                    className="grayscale hover:grayscale-0 transition-all duration-300"
                  ></iframe>
                </div>
                <div className="p-4 flex justify-end">
                  <a 
                    href="https://maps.google.com/?q=Atlanta,GA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-purple-950 to-purple-900">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <ResponsiveText
                as="h2"
                variant="h2"
                className="text-amber-400 font-serif mb-6 text-center"
              >
                Send Us a Message
              </ResponsiveText>
              <p className="text-gray-300 text-center mb-10">
                Have questions about our services or want to book an appointment? Send us a message and we'll get back to you as soon as possible.
              </p>
              
              <ContactForm />
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ContactPage;