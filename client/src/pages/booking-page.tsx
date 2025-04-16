import { Helmet } from "react-helmet";
import { Link } from "wouter";
import BookingForm from "@/components/booking/booking-form";
import { Button } from "@/components/ui/button";
import { Brush } from "lucide-react";

export default function BookingPage() {
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Divine Braids</title>
        <meta name="description" content="Schedule your braiding appointment at Divine Braids. Choose from our premium services and select your preferred date and time." />
      </Helmet>
      
      <section className="py-20 bg-primary-50 dark:bg-neutral-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-6">
              Schedule your next braiding session with us. We require a deposit for booking confirmation.
            </p>
            <Link href="/client/hair-simulator">
              <Button variant="outline" className="mx-auto flex items-center">
                <Brush className="mr-2 h-4 w-4" />
                Try our Hair Simulator first
              </Button>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <BookingForm />
          </div>
          
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <h3 className="font-heading text-xl font-semibold mb-2">What to Expect After Booking</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              After submitting your booking request, you will receive an email confirmation. 
              One of our stylists will review your booking and confirm your appointment within 24 hours.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              If you need to cancel or reschedule, please contact us at least 48 hours before your appointment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
