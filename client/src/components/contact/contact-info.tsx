import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface ContactInfoProps {
  location?: {
    address: string;
    city: string;
    zip: string;
  };
  phone?: string;
  email?: string;
  hours?: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export default function ContactInfo({
  location = {
    address: "123 Braiding Avenue, Suite 201",
    city: "Los Angeles",
    zip: "90001",
  },
  phone = "(234) 567-8901",
  email = "info@divinebraids.com",
  hours = {
    weekdays: "9:00 AM - 7:00 PM",
    saturday: "9:00 AM - 5:00 PM",
    sunday: "Closed",
  },
}: ContactInfoProps) {
  return (
    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <h3 className="font-heading text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-700 dark:text-purple-300">Contact Information</h3>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start">
          <div className="text-purple-600 dark:text-purple-400 mt-1">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h4 className="font-semibold mb-1 text-sm sm:text-base">Location</h4>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
              {location.address}<br />
              {location.city}, {location.zip}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-purple-600 dark:text-purple-400 mt-1">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h4 className="font-semibold mb-1 text-sm sm:text-base">Phone</h4>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
              <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-all">{phone}</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-purple-600 dark:text-purple-400 mt-1">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h4 className="font-semibold mb-1 text-sm sm:text-base">Email</h4>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
              <a href={`mailto:${email}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-all">{email}</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="text-purple-600 dark:text-purple-400 mt-1">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="ml-3 sm:ml-4">
            <h4 className="font-semibold mb-1 text-sm sm:text-base">Business Hours</h4>
            <div className="text-neutral-700 dark:text-neutral-300 grid grid-cols-2 gap-2 text-sm sm:text-base">
              <div>Monday - Friday</div>
              <div>{hours.weekdays}</div>
              <div>Saturday</div>
              <div>{hours.saturday}</div>
              <div>Sunday</div>
              <div>{hours.sunday}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8">
        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Connect</h4>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <a 
            href="https://wa.me/12345678901" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <Button variant="outline" size="sm" className="rounded-full bg-purple-100/10 border-purple-500 hover:bg-purple-100/20 dark:border-purple-700 h-8 w-8 sm:h-10 sm:w-10 p-0">
              <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </Button>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Button variant="outline" size="sm" className="rounded-full bg-purple-100/10 border-purple-500 hover:bg-purple-100/20 dark:border-purple-700 h-8 w-8 sm:h-10 sm:w-10 p-0">
              <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </Button>
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Button variant="outline" size="sm" className="rounded-full bg-purple-100/10 border-purple-500 hover:bg-purple-100/20 dark:border-purple-700 h-8 w-8 sm:h-10 sm:w-10 p-0">
              <FaFacebookF className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </Button>
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <Button variant="outline" size="sm" className="rounded-full bg-purple-100/10 border-purple-500 hover:bg-purple-100/20 dark:border-purple-700 h-8 w-8 sm:h-10 sm:w-10 p-0">
              <FaTiktok className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
