import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, isBefore, isToday, parse, isValid } from 'date-fns';
import { Service } from '@shared/schema';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GuideModal } from '@/components/ui/guide-modal';
import { 
  FormField, 
  GuideForm, 
  FormRow, 
  ResponsiveInput,
  FormActions
} from '@/components/ui/guide-form';
import { Card, Section, Container, ResponsiveText } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema for form validation
const bookingSchema = z.object({
  service: z.string().min(1, "Please select a service"),
  date: z.string().refine(val => {
    // Validate date format
    return isValid(parse(val, 'yyyy-MM-dd', new Date()));
  }, { message: "Please enter a valid date" }),
  time: z.string().min(1, "Please select a time"),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: '',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '',
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });
  
  // Available time slots - would be dynamic in a real implementation
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  
  // Minimum date is tomorrow
  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  
  // Maximum date is 30 days from now
  const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');
  
  const onSubmit = (data: BookingFormValues) => {
    console.log('Form submitted:', data);
    alert('Booking submitted successfully! We\'ll confirm your appointment shortly.');
    setIsModalOpen(false);
    form.reset();
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleNextStep = () => {
    // Get the fields to validate based on current step
    let fieldsToValidate: Array<keyof BookingFormValues> = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['service'];
        break;
      case 2:
        fieldsToValidate = ['date', 'time'];
        break;
      case 3:
        fieldsToValidate = ['name', 'email', 'phone'];
        break;
    }
    
    // Validate only the relevant fields
    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) {
        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
        } else {
          form.handleSubmit(onSubmit)();
        }
      }
    });
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (isLoading) {
    return (
      <Section className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </Section>
    );
  }
  
  if (error || !services) {
    return (
      <Section className="text-center">
        <ResponsiveText variant="h3" className="text-red-500">
          Error loading services
        </ResponsiveText>
        <ResponsiveText>
          Please try again later or contact us directly.
        </ResponsiveText>
      </Section>
    );
  }
  
  // Get selected service details
  const selectedService = selectedServiceId 
    ? services.find(s => s.id.toString() === selectedServiceId) 
    : null;
  
  return (
    <Section id="booking" className="bg-neutral-100 dark:bg-neutral-900">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block py-1.5 px-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium mb-3">
            Book With Us
          </span>
          <ResponsiveText 
            as="h2" 
            variant="h1" 
            className="font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text"
          >
            Reserve Your Appointment
          </ResponsiveText>
          <ResponsiveText className="max-w-3xl mx-auto text-neutral-600 dark:text-neutral-400">
            Book your appointment in just a few simple steps. Select your preferred service, 
            date, and time, and we'll take care of the rest.
          </ResponsiveText>
        </div>
        
        {/* Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--services-grid-gap-mobile)] md:gap-[var(--services-grid-gap-tablet)] lg:gap-[var(--services-grid-gap)]">
          {/* Book Online Card */}
          <Card 
            className={cn(
              "bg-white dark:bg-neutral-800",
              "shadow-lg hover:shadow-xl transition-shadow duration-300",
              "flex flex-col"
            )}
          >
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="mb-6 text-amber-600 dark:text-amber-400">
                <Calendar className="w-12 h-12" />
              </div>
              <ResponsiveText as="h3" variant="h3" className="font-bold mb-3">
                Book Online
              </ResponsiveText>
              <ResponsiveText className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow">
                Schedule your appointment online at your convenience. Choose from our various services 
                and select a time that works best for you.
              </ResponsiveText>
              <Button 
                onClick={handleOpenModal}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Book Now
              </Button>
            </div>
          </Card>
          
          {/* Call to Book Card */}
          <Card 
            className={cn(
              "bg-white dark:bg-neutral-800",
              "shadow-lg hover:shadow-xl transition-shadow duration-300",
              "flex flex-col"
            )}
          >
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="mb-6 text-amber-600 dark:text-amber-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <ResponsiveText as="h3" variant="h3" className="font-bold mb-3">
                Call to Book
              </ResponsiveText>
              <ResponsiveText className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow">
                Prefer to speak with someone directly? Give us a call and our friendly staff 
                will help you schedule your appointment.
              </ResponsiveText>
              <a href="tel:+14045551234">
                <Button className="w-full bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-2 border-amber-600 dark:border-amber-400">
                  (404) 555-1234
                </Button>
              </a>
            </div>
          </Card>
          
          {/* Walk-in Availability Card */}
          <Card 
            className={cn(
              "bg-white dark:bg-neutral-800",
              "shadow-lg hover:shadow-xl transition-shadow duration-300",
              "flex flex-col"
            )}
          >
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="mb-6 text-amber-600 dark:text-amber-400">
                <Clock className="w-12 h-12" />
              </div>
              <ResponsiveText as="h3" variant="h3" className="font-bold mb-3">
                Walk-In Availability
              </ResponsiveText>
              <ResponsiveText className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow">
                Limited walk-in slots are available each day. However, we 
                recommend booking in advance to ensure availability.
              </ResponsiveText>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-700 p-4">
                <ResponsiveText variant="label" className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Business Hours:
                </ResponsiveText>
                <ul className="mt-2 space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li className="text-sm">Monday - Friday: 9am - 7pm</li>
                  <li className="text-sm">Saturday: 10am - 6pm</li>
                  <li className="text-sm">Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Booking Modal - Uses booking modal specs */}
        <GuideModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Book Your Appointment"
          showProgress={true}
          currentStep={currentStep}
          totalSteps={4}
          variant="booking"
          hideFooter={true}
        >
          <GuideForm onSubmit={onSubmit} className="py-4">
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <div>
                <ResponsiveText as="h3" variant="h3" className="font-bold mb-6">
                  Select a Service
                </ResponsiveText>
                
                <FormField
                  id="service"
                  label="Service Type"
                  required
                  error={form.formState.errors.service?.message}
                  variant="booking"
                  wide
                >
                  <Controller
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedServiceId(value);
                        }}
                      >
                        <SelectTrigger 
                          className="w-full h-[var(--booking-field-height)]"
                        >
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - ${service.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                
                {selectedService && (
                  <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <ResponsiveText variant="h4" className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                      {selectedService.name}
                    </ResponsiveText>
                    <ResponsiveText className="text-amber-700 dark:text-amber-400 mb-3">
                      ${selectedService.price.toFixed(2)} • {selectedService.duration} {selectedService.duration === 1 ? 'hour' : 'hours'}
                    </ResponsiveText>
                    <ResponsiveText variant="body" className="text-amber-600 dark:text-amber-300">
                      {selectedService.description}
                    </ResponsiveText>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 2: Select Date and Time */}
            {currentStep === 2 && (
              <div>
                <ResponsiveText as="h3" variant="h3" className="font-bold mb-6">
                  Select Date & Time
                </ResponsiveText>
                
                <FormRow>
                  <FormField
                    id="date"
                    label="Appointment Date"
                    required
                    error={form.formState.errors.date?.message}
                    variant="booking"
                  >
                    <ResponsiveInput
                      type="date"
                      min={minDate}
                      max={maxDate}
                      variant="booking"
                      {...form.register("date")}
                    />
                  </FormField>
                  
                  <FormField
                    id="time"
                    label="Appointment Time"
                    required
                    error={form.formState.errors.time?.message}
                    variant="booking"
                  >
                    <Controller
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-[var(--booking-field-height)]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </FormRow>
                
                <div className="mt-6 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <ResponsiveText variant="label" className="font-semibold">
                    Please Note:
                  </ResponsiveText>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Appointments must be booked at least 24 hours in advance</li>
                    <li>• For same-day appointments, please call us directly</li>
                    <li>• A 15-minute grace period is provided for late arrivals</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Step 3: Your Information */}
            {currentStep === 3 && (
              <div>
                <ResponsiveText as="h3" variant="h3" className="font-bold mb-6">
                  Your Information
                </ResponsiveText>
                
                <FormField
                  id="name"
                  label="Full Name"
                  required
                  error={form.formState.errors.name?.message}
                  variant="booking"
                  wide
                >
                  <ResponsiveInput
                    type="text"
                    placeholder="Your full name"
                    variant="booking"
                    {...form.register("name")}
                  />
                </FormField>
                
                <FormField
                  id="email"
                  label="Email Address"
                  required
                  error={form.formState.errors.email?.message}
                  variant="booking"
                  wide
                >
                  <ResponsiveInput
                    type="email"
                    placeholder="Your email address"
                    variant="booking"
                    {...form.register("email")}
                  />
                </FormField>
                
                <FormField
                  id="phone"
                  label="Phone Number"
                  required
                  error={form.formState.errors.phone?.message}
                  variant="booking"
                  wide
                >
                  <ResponsiveInput
                    type="tel"
                    placeholder="Your phone number"
                    variant="booking"
                    {...form.register("phone")}
                  />
                </FormField>
                
                <FormField
                  id="notes"
                  label="Special Requests or Notes"
                  error={form.formState.errors.notes?.message}
                  variant="booking"
                  wide
                >
                  <textarea
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 text-[var(--font-body)] min-h-[100px] focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                    placeholder="Any special instructions or notes for your stylist"
                    {...form.register("notes")}
                  />
                </FormField>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <ResponsiveText as="h3" variant="h3" className="font-bold mb-6">
                  Confirm Your Booking
                </ResponsiveText>
                
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6">
                  <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <ResponsiveText variant="h4" className="font-bold">
                      Booking Summary
                    </ResponsiveText>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                          Service
                        </ResponsiveText>
                        <ResponsiveText className="font-medium">
                          {selectedService?.name}
                        </ResponsiveText>
                      </div>
                      <div>
                        <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                          Date
                        </ResponsiveText>
                        <ResponsiveText className="font-medium">
                          {form.getValues("date")}
                        </ResponsiveText>
                      </div>
                      <div>
                        <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                          Time
                        </ResponsiveText>
                        <ResponsiveText className="font-medium">
                          {form.getValues("time")}
                        </ResponsiveText>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                        Client Information
                      </ResponsiveText>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <div>
                          <ResponsiveText className="font-medium">
                            {form.getValues("name")}
                          </ResponsiveText>
                        </div>
                        <div>
                          <ResponsiveText className="font-medium">
                            {form.getValues("email")}
                          </ResponsiveText>
                        </div>
                        <div>
                          <ResponsiveText className="font-medium">
                            {form.getValues("phone")}
                          </ResponsiveText>
                        </div>
                      </div>
                    </div>
                    
                    {form.getValues("notes") && (
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                          Special Requests
                        </ResponsiveText>
                        <ResponsiveText className="mt-1">
                          {form.getValues("notes")}
                        </ResponsiveText>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="flex justify-between">
                        <ResponsiveText variant="h4" className="font-bold">
                          Total
                        </ResponsiveText>
                        <ResponsiveText variant="h4" className="font-bold text-amber-600 dark:text-amber-400">
                          ${selectedService?.price.toFixed(2)}
                        </ResponsiveText>
                      </div>
                      <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                        Payment will be collected in-store
                      </ResponsiveText>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-700 dark:text-amber-300">
                  <p className="text-sm">
                    By confirming this booking, you agree to our cancellation policy. 
                    Cancellations less than 24 hours before your appointment may be subject to a fee.
                  </p>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <FormActions className="mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
              )}
              
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
              >
                {currentStep < 4 ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </FormActions>
          </GuideForm>
        </GuideModal>
      </Container>
    </Section>
  );
}