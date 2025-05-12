import React from 'react';
import { Link } from 'wouter';
import { Container } from '@/components/ui/container';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Logo and About */}
          <div>
            <h3 className="text-3xl font-serif mb-4 font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              KARI STYLEZ
            </h3>
            <p className="mb-6 text-neutral-300 max-w-md">
              Luxury braiding salon specializing in premium styles, expert techniques, and an elevated experience for every client.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-amber-700 transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Booking', path: '/booking' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-neutral-300 hover:text-amber-300 transition-colors inline-block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-amber-400">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-amber-500 mt-1 h-5 w-5 flex-shrink-0" />
                <p className="text-neutral-300">
                  123 Styling Ave, Suite 101<br />
                  Atlanta, GA 30303
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="text-amber-500 h-5 w-5 flex-shrink-0" />
                <a href="tel:+14045551234" className="text-neutral-300 hover:text-amber-300 transition-colors">
                  (404) 555-1234
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="text-amber-500 h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@karistylez.com" className="text-neutral-300 hover:text-amber-300 transition-colors">
                  info@karistylez.com
                </a>
              </div>
              
              <div>
                <h5 className="font-semibold mb-1 text-white">Business Hours</h5>
                <p className="text-neutral-300">
                  Mon-Fri: 9:00 AM - 7:00 PM<br />
                  Saturday: 9:00 AM - 5:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-neutral-800 pt-8 mt-8 text-neutral-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {year} KARI STYLEZ. All rights reserved.</p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/legal/privacy-policy" className="hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="hover:text-amber-300 transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/legal/refund-policy" className="hover:text-amber-300 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}