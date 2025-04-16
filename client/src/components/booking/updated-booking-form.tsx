import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookingFormData, bookingFormSchema, Service } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, User, Mail, Phone, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaPaypal } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceSelection from "@/components/booking/service-selection";
import BookingCalendar from "@/components/booking/booking-calendar";
import { format } from "date-fns";

export default function UpdatedBookingForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("service");
  const [selectedService, setSelectedService] = useState<Service>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get service from URL query parameter if available
  const [searchParams] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  const preselectedServiceName = searchParams.get("service") || "";
  
  // Form setup
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      date: "",
      time: "",
      notes: preselectedServiceName ? `Interested in ${preselectedServiceName} style from Hair Simulator` : "",
    },
  });
  
  // Update form values when selections change
  useEffect(() => {
    if (selectedService) {
      form.setValue("serviceType", selectedService.name);
    }
    
    if (selectedDate) {
      form.setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
    
    if (selectedTime) {
      form.setValue("time", selectedTime);
    }
  }, [selectedService, selectedDate, selectedTime, form]);
  
  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      setIsSubmitting(true);
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "Booking Request Submitted",
        description: "We'll be in touch soon to confirm your appointment.",
      });
      
      // Reset the form and selections
      form.reset();
      setSelectedService(undefined);
      setSelectedDate(undefined);
      setSelectedTime("");
      setActiveTab("service");
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission
  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };
  
  // Tab navigation
  const navigateToTab = (tab: string) => {
    if (tab === "date" && !selectedService) {
      toast({
        title: "Please select a service first",
        description: "You need to choose a service before selecting a date and time.",
        variant: "destructive",
      });
      return;
    }
    
    if (tab === "contact" && (!selectedService || !selectedDate || !selectedTime)) {
      toast({
        title: "Complete previous steps first",
        description: "Please select a service, date, and time before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveTab(tab);
  };
  
  // Check if form tab is complete
  const isContactFormComplete = () => {
    return (
      form.getValues("name") !== "" &&
      form.getValues("email") !== "" &&
      form.getValues("phone") !== ""
    );
  };
  
  // Progress status
  const getProgressStatus = (tab: string) => {
    if (tab === "service") {
      return selectedService ? "complete" : "current";
    } else if (tab === "date") {
      if (!selectedService) return "incomplete";
      return (selectedDate && selectedTime) ? "complete" : "current";
    } else if (tab === "contact") {
      if (!selectedService || !selectedDate || !selectedTime) return "incomplete";
      return isContactFormComplete() ? "complete" : "current";
    } else if (tab === "payment") {
      if (!isContactFormComplete()) return "incomplete";
      return "current";
    }
    return "incomplete";
  };
  
  return (
    <div className="space-y-8">
      {/* Progress Tabs */}
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger 
            value="service" 
            onClick={() => navigateToTab("service")}
            data-state={getProgressStatus("service")}
            className="data-[state=complete]:bg-green-100 data-[state=complete]:text-green-700 dark:data-[state=complete]:bg-green-900/20 dark:data-[state=complete]:text-green-400"
          >
            {getProgressStatus("service") === "complete" && <CheckCircle className="h-4 w-4 mr-1" />}
            Service
          </TabsTrigger>
          <TabsTrigger 
            value="date" 
            onClick={() => navigateToTab("date")}
            data-state={getProgressStatus("date")}
            className="data-[state=complete]:bg-green-100 data-[state=complete]:text-green-700 dark:data-[state=complete]:bg-green-900/20 dark:data-[state=complete]:text-green-400"
          >
            {getProgressStatus("date") === "complete" && <CheckCircle className="h-4 w-4 mr-1" />}
            Date & Time
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            onClick={() => navigateToTab("contact")}
            data-state={getProgressStatus("contact")}
            className="data-[state=complete]:bg-green-100 data-[state=complete]:text-green-700 dark:data-[state=complete]:bg-green-900/20 dark:data-[state=complete]:text-green-400"
          >
            {getProgressStatus("contact") === "complete" && <CheckCircle className="h-4 w-4 mr-1" />}
            Contact
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            onClick={() => navigateToTab("payment")}
            data-state={getProgressStatus("payment")}
            className="data-[state=complete]:bg-green-100 data-[state=complete]:text-green-700 dark:data-[state=complete]:bg-green-900/20 dark:data-[state=complete]:text-green-400"
          >
            Payment
          </TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-8">
              {/* Service Selection Tab */}
              <TabsContent value="service" className="space-y-4">
                <ServiceSelection 
                  selectedService={selectedService} 
                  setSelectedService={setSelectedService}
                  preselectedServiceName={preselectedServiceName}
                />
                
                <div className="flex justify-end mt-8">
                  <Button
                    type="button"
                    onClick={() => navigateToTab("date")}
                    disabled={!selectedService}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
                  >
                    Continue to Date & Time
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Date & Time Tab */}
              <TabsContent value="date" className="space-y-4">
                <BookingCalendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  selectedService={selectedService}
                />
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigateToTab("service")}
                  >
                    Back to Services
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => navigateToTab("contact")}
                    disabled={!selectedDate || !selectedTime}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
                  >
                    Continue to Contact Info
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Contact Information Tab */}
              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Your Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Full Name <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="focus:border-purple-500 focus:ring-purple-500"
                            />
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
                          <FormLabel className="flex items-center">
                            Email Address <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email" 
                              {...field} 
                              className="focus:border-purple-500 focus:ring-purple-500"
                            />
                          </FormControl>
                          <FormDescription>
                            Your booking confirmation will be sent here
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Phone Number <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(123) 456-7890" 
                              {...field} 
                              className="focus:border-purple-500 focus:ring-purple-500"
                            />
                          </FormControl>
                          <FormDescription>
                            For appointment reminders and updates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400" />
                            Special Requests
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific requests or details about your preferred style..." 
                              className="resize-none focus:border-purple-500 focus:ring-purple-500 h-[112px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigateToTab("date")}
                  >
                    Back to Date & Time
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => navigateToTab("payment")}
                    disabled={!form.formState.isValid || !isContactFormComplete()}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
                  >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* Payment Tab */}
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
                  
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
                    {selectedService && (
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <h4 className="font-medium">Service</h4>
                          <p className="text-purple-600 dark:text-purple-400">{selectedService.name}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{selectedService.description}</p>
                        </div>
                        <p className="font-medium">${(selectedService.price / 100).toFixed(2)}</p>
                      </div>
                    )}
                    
                    {selectedDate && selectedTime && (
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                          <h4 className="font-medium">Appointment</h4>
                          <p className="text-purple-600 dark:text-purple-400">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-purple-600 dark:text-purple-400 mt-1">
                            {selectedTime.split(":")[0] > "12" 
                              ? `${parseInt(selectedTime.split(":")[0]) - 12}:${selectedTime.split(":")[1]} PM`
                              : selectedTime.split(":")[0] === "12"
                              ? `12:${selectedTime.split(":")[1]} PM`
                              : `${parseInt(selectedTime.split(":")[0])}:${selectedTime.split(":")[1]} AM`}
                          </p>
                        </div>
                        <p>{selectedService?.duration} minutes</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h4 className="font-medium">Contact</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{form.getValues("name")}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{form.getValues("email")}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{form.getValues("phone")}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start font-medium">
                      <p>Required deposit (to be deducted from total)</p>
                      <p className="text-purple-600 dark:text-purple-400">$50.00</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Payment Options</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      A non-refundable deposit of $50 is required to secure your booking. This amount will be deducted from your final service cost.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button 
                        type="button" 
                        className="bg-[#0070BA] hover:bg-[#005ea6] text-white"
                      >
                        <FaPaypal className="mr-2" /> Pay with PayPal
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-[#635BFF] hover:bg-[#4b44d3] text-white"
                      >
                        <SiStripe className="mr-2" /> Pay with Stripe
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigateToTab("contact")}
                  >
                    Back to Contact
                  </Button>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md hover:shadow-lg w-full sm:w-auto text-base py-6 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Complete Booking"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </TabsContent>
            </div>
            
            {bookingMutation.isError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-lg flex items-start"
              >
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  {bookingMutation.error.message || "There was an error submitting your booking. Please try again."}
                </p>
              </motion.div>
            )}
          </form>
        </Form>
      </Tabs>
    </div>
  );
}