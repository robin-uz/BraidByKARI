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
import { Loader2, AlertTriangle, Scissors, CalendarDays, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaPaypal } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import { motion } from "framer-motion";

export default function BookingForm() {
  const { toast } = useToast();
  
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
  
  // Generate available times
  const times = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  
  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24
      }
    }
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-900 p-2 rounded-lg mb-8"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 text-white">
            <h3 className="font-heading text-xl font-semibold flex items-center">
              <Scissors className="mr-2 h-5 w-5" />
              Book Your Braiding Session
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Fill out the form below to schedule your appointment with our expert stylists
            </p>
          </div>
      
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Personal Information */}
              <motion.div 
                variants={itemVariants}
                className="space-y-6"
              >
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">Personal Information</h4>
                </div>
              
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
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
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
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
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(123) 456-7890" 
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
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Scissors className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                        Service Type <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-300 dark:border-neutral-700 focus:ring-purple-500 focus:border-purple-500">
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
              </motion.div>
              
              {/* Right Column - Appointment Details */}
              <motion.div 
                variants={itemVariants}
                className="space-y-6"
              >
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                    <CalendarDays className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">Appointment Details</h4>
                </div>
              
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                        Preferred Date <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          min={today} 
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                        Preferred Time <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-neutral-300 dark:border-neutral-700 focus:ring-purple-500 focus:border-purple-500">
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
                      <FormLabel className="flex items-center">
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-purple-500 dark:text-purple-400" />
                        Special Requests
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific requests or details about your preferred style..." 
                          className="resize-none focus:border-purple-500 focus:ring-purple-500"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              {/* Full Width - Payment */}
              <motion.div 
                variants={itemVariants}
                className="md:col-span-2 border-t border-neutral-200 dark:border-neutral-800 pt-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg max-w-md">
                    <h4 className="font-heading font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300 flex items-center">
                      <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center mr-2">
                        <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">$</span>
                      </div>
                      Deposit Required
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      A non-refundable deposit of $50 is required to secure your booking. This amount will be deducted from your final service cost.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button 
                        type="button" 
                        className="bg-[#0070BA] hover:bg-[#005ea6] text-white transform transition-transform duration-300 hover:scale-105"
                      >
                        <FaPaypal className="mr-2" /> PayPal
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-[#635BFF] hover:bg-[#4b44d3] text-white transform transition-transform duration-300 hover:scale-105"
                      >
                        <SiStripe className="mr-2" /> Stripe
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={bookingMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md hover:shadow-lg w-full sm:w-auto text-base py-6 px-8"
                    >
                      {bookingMutation.isPending ? (
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
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </div>
  );
}
