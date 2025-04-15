import { useState, useEffect } from "react";

interface GoogleMapProps {
  address: string;
  apiKey?: string;
  height?: string;
}

export default function GoogleMap({
  address = "123 Braiding Avenue, Los Angeles, CA 90001",
  apiKey = process.env.GOOGLE_MAPS_API_KEY,
  height = "400px",
}: GoogleMapProps) {
  const [mapUrl, setMapUrl] = useState<string>("");
  
  useEffect(() => {
    // Encode the address for use in the URL
    const encodedAddress = encodeURIComponent(address);
    
    // Create map URL
    if (apiKey) {
      // Use Google Maps JavaScript API if we have a key
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`);
    } else {
      // Fallback to a static Google Maps link
      setMapUrl(`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
    }
  }, [address, apiKey]);
  
  return (
    <div className="bg-primary-50 dark:bg-neutral-950 rounded-lg shadow-lg overflow-hidden h-full">
      {mapUrl ? (
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
      ) : (
        <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center relative">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-primary">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-neutral-700 dark:text-neutral-300">
              Map will be displayed here when API key is provided
            </p>
          </div>
          {/* Placeholder overlay to simulate map appearance */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-primary/50"></div>
            <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-primary"></div>
            <div className="absolute top-2/3 left-1/3 w-32 h-4 rounded-full bg-white dark:bg-neutral-900"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-3 rounded-full bg-white dark:bg-neutral-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
