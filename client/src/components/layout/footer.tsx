import { FaInstagram, FaFacebookF, FaTiktok, FaPinterest } from "react-icons/fa";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-primary font-serif text-3xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Divine</span>
              <span className="text-white font-heading text-xl font-semibold">Braids</span>
            </div>
            <p className="text-neutral-300 dark:text-neutral-400 mb-6">
              Elevating the art of braiding with premium techniques, personalized service, and stunning results.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-primary transition-all">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-primary transition-all">
                <FaFacebookF size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-primary transition-all">
                <FaTiktok size={20} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-primary transition-all">
                <FaPinterest size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-300 hover:text-primary transition-all">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-neutral-300 hover:text-primary transition-all">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/gallery">
                  <a className="text-neutral-300 hover:text-primary transition-all">Gallery</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="text-neutral-300 hover:text-primary transition-all">Book Now</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-300 hover:text-primary transition-all">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-neutral-300 hover:text-primary transition-all">Admin Login</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy-policy">
                  <a className="text-neutral-300 hover:text-primary transition-all">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/legal/terms">
                  <a className="text-neutral-300 hover:text-primary transition-all">Terms & Conditions</a>
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-policy">
                  <a className="text-neutral-300 hover:text-primary transition-all">Refund & Deposit Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-neutral-300 dark:text-neutral-400 mb-4">
              Subscribe to our newsletter for style tips, promotions, and more.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary bg-neutral-800 dark:bg-neutral-900 border border-neutral-700"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-lg transition-all"
                aria-label="Subscribe"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paper-plane">
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-6 mt-8 text-center">
          <p className="text-neutral-400">
            &copy; {currentYear} Divine Braids. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
