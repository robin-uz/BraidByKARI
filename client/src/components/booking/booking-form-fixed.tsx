import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookingFormData, bookingFormSchema, Service } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaPaypal } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import StylingTipsPopup from "./styling-tips-popup";

export default function BookingForm() {
  const { toast } = useToast();
  const [showStylingTips, setShowStylingTips] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingFormData | null>(null);
  
  // Get services for the dropdown
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      date: "",
      time: "",
      notes: "",
    },
  });
  
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted",
        description: "We'll be in touch soon to confirm your appointment.",
      });
      
      // Store the submitted data before resetting the form
      const submittedData = form.getValues();
      setSubmittedBooking(submittedData);
      
      // Show styling tips popup after successful booking
      setShowStylingTips(true);
      
      // Reset the form
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };
  
  const handleClosePopup = () => {
    setShowStylingTips(false);
  };
  
  // Generate available times
  const times = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  
  return (
    <div>
      {/* Styling tips popup */}
      <StylingTipsPopup 
        isOpen={showStylingTips} 
        onClose={handleClosePopup} 
        bookingData={submittedBooking}
      />
      
      {/* Booking form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servicesLoading ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : services && services.length > 0 ? (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} - ${(service.price / 100).toFixed(2)}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="box-small">Box Braids (Small) - $200</SelectItem>
                          <SelectItem value="box-medium">Box Braids (Medium) - $180</SelectItem>
                          <SelectItem value="box-large">Box Braids (Large) - $150</SelectItem>
                          <SelectItem value="knotless">Knotless Braids - $220</SelectItem>
                          <SelectItem value="feed-in">Feed-in Braids - $180</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" min={today} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {times.map((time) => (
                        <SelectItem key={time} value={time}>
                          {parseInt(time) > 12 
                            ? `${parseInt(time) - 12}:00 PM` 
                            : time === "12:00" 
                              ? "12:00 PM" 
                              : `${parseInt(time)}:00 AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific requests or details about your preferred style..." 
                      className="resize-none"
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Full Width */}
          <div className="md:col-span-2 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h4 className="font-heading font-semibold text-lg mb-2">Deposit Required</h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  A non-refundable deposit of $50 is required to secure your booking.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex space-x-4">
                  <Button type="button" className="bg-[#0070BA] hover:bg-[#005ea6] text-white">
                    <FaPaypal className="mr-2" /> PayPal
                  </Button>
                  <Button type="button" className="bg-[#635BFF] hover:bg-[#4b44d3] text-white">
                    <SiStripe className="mr-2" /> Stripe
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={bookingMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                {bookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Booking"
                )}
              </Button>
            </div>
            
            {bookingMutation.isError && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  {bookingMutation.error.message || "There was an error submitting your booking. Please try again."}
                </p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}