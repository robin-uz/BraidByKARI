import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb, X } from "lucide-react";
import { BookingFormData } from "@shared/schema";

interface StylingTipsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingFormData | null;
}

export default function StylingTipsPopup({ isOpen, onClose, bookingData }: StylingTipsPopupProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && bookingData) {
      setLoading(true);
      
      // Extract the service type
      const selectedService = bookingData.serviceType || "";
      setServiceType(selectedService);
      
      // Generate personalized tips based on the service
      const generatedTips = getServiceSpecificTips(selectedService);
      setTips(generatedTips);
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [isOpen, bookingData]);

  // Function to return tips based on service type
  const getServiceSpecificTips = (service: string): string[] => {
    // Default tips for all services
    const defaultTips = [
      "Avoid washing your hair for at least 48 hours after installation.",
      "Sleep with a satin bonnet or pillowcase to prevent frizz.",
      "Moisturize your scalp regularly with lightweight oils."
    ];

    // Service-specific tips
    if (service.toLowerCase().includes("box")) {
      return [
        "Properly moisturize your scalp 2-3 times a week with a lightweight oil.",
        "Avoid excessive pulling or tension on your box braids to prevent breakage.",
        "To reduce frizz, apply a small amount of mousse to your braids.",
        "Wrap your box braids in a silk scarf at night to maintain their neat appearance.",
        "For washing, dilute shampoo with water and apply directly to the scalp using an applicator bottle."
      ];
    } 
    else if (service.toLowerCase().includes("knotless")) {
      return [
        "Apply oil to your scalp 2-3 times a week to maintain moisture.",
        "Keep your parts clean by using a cotton swab dipped in alcohol-free witch hazel.",
        "Avoid heavy products that can cause build-up on your knotless braids.",
        "For longer-lasting braids, refresh your edges with a light edge control product.",
        "When washing, focus on your scalp rather than the length of the braids."
      ];
    }
    else if (service.toLowerCase().includes("feed-in")) {
      return [
        "To maintain your feed-in braids, apply a light hold edge control to keep flyaways in place.",
        "Avoid excessive manipulation of the braids to prevent loosening.",
        "Use a leave-in conditioner spray to keep your natural hair moisturized.",
        "Touch up your edges periodically with a small amount of gel to maintain a neat look.",
        "When sleeping, tie your braids down with a silk scarf to maintain the pattern."
      ];
    }
    else {
      // Return default tips for other services
      return defaultTips;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl flex items-center text-purple-700 dark:text-purple-300">
              <Lightbulb className="mr-2 h-5 w-5" />
              {loading ? "Preparing Your Styling Tips..." : `Styling Tips for Your ${serviceType}`}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-6 w-6 rounded-full p-0 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Personalizing your styling recommendations...</p>
          </div>
        ) : (
          <>
            <div className="py-4">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Thank you for booking with Divine Braids! Here are some personalized tips to help you maintain 
                your new style and keep your hair looking its best between appointments.
              </p>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-neutral-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mt-2">
              <p className="text-purple-700 dark:text-purple-300 font-medium text-sm">
                Want more personalized advice? Feel free to contact your stylist anytime or check our social media for styling tutorials!
              </p>
            </div>
          </>
        )}

        <DialogFooter>
          <Button 
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white" 
            onClick={onClose}
          >
            Got It, Thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}