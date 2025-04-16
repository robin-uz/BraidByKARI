import { Helmet } from "react-helmet";
import { Link } from "wouter";
import UpdatedBookingForm from "@/components/booking/updated-booking-form";
import { Button } from "@/components/ui/button";
import { Brush, Scissors, Calendar, Clock, CreditCard } from "lucide-react";

export default function BookingPage() {
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Divine Braids</title>
        <meta name="description" content="Schedule your braiding appointment at Divine Braids. Choose from our premium services and select your preferred date and time." />
      </Helmet>
      
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Book Your Appointment</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
              Schedule your next braiding session with our expert stylists. We require a deposit for booking confirmation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex flex-col items-center max-w-[200px] p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Scissors className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-sm mb-1">Choose a Service</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Select from our professional braiding styles
                </p>
              </div>
              
              <div className="flex flex-col items-center max-w-[200px] p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-sm mb-1">Pick a Date</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Choose from our available appointment dates
                </p>
              </div>
              
              <div className="flex flex-col items-center max-w-[200px] p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-sm mb-1">Select a Time</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Find a convenient time slot that works for you
                </p>
              </div>
              
              <div className="flex flex-col items-center max-w-[200px] p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-sm mb-1">Confirm & Pay</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  Secure your booking with a deposit
                </p>
              </div>
            </div>
            
            <Link href="/client/hair-simulator">
              <Button variant="outline" className="mx-auto flex items-center">
                <Brush className="mr-2 h-4 w-4" />
                Try our Hair Simulator first
              </Button>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
            <UpdatedBookingForm />
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
                <h3 className="font-heading text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">Email Confirmation</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  After booking, you'll receive an immediate email confirmation with your appointment details.
                </p>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
                <h3 className="font-heading text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">Stylist Review</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  One of our stylists will review your booking and confirm within 24 hours.
                </p>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm">
                <h3 className="font-heading text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">Cancellation Policy</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Need to cancel or reschedule? Please contact us at least 48 hours before your appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
