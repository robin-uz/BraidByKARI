import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleMapProps {
  address: string;
  apiKey?: string;
  height?: string;
}

export default function GoogleMap({
  address = "123 Braiding Avenue, Los Angeles, CA 90001",
  apiKey,
  height = "400px",
}: GoogleMapProps) {
  const [mapUrl, setMapUrl] = useState<string>("");
  
  useEffect(() => {
    // Encode the address for use in the URL
    const encodedAddress = encodeURIComponent(address);
    
    // Always use the embedded Google Maps without API key since it works reliably
    setMapUrl(`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
  }, [address]);
  
  // Function to open Google Maps in a new tab for directions
  const openDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };
  
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/50">
        <h3 className="font-heading text-base sm:text-lg font-semibold flex items-center text-purple-700 dark:text-purple-300">
          <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Our Location
        </h3>
      </div>
      
      <div className="flex-grow">
        <iframe
          title="Google Map"
          src={mapUrl}
          width="100%"
          height={height}
          className="border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      
      <div className="p-3 sm:p-4 border-t border-purple-100 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium truncate sm:mr-4">
          {address}
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={openDirections}
          className="whitespace-nowrap text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3 border-purple-300 text-purple-700 hover:text-purple-800 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
}
