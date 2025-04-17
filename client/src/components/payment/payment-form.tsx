import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Initialize Stripe with the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// CheckoutForm component that handles the payment submission
function CheckoutForm({ 
  bookingId, 
  onSuccess,
  amount,
  email,
  serviceType,
}: { 
  bookingId?: number; 
  onSuccess: () => void; 
  amount: number;
  email?: string;
  serviceType: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Payment failed
        setErrorMessage(error.message || "An error occurred with your payment.");
        toast({
          title: "Payment Failed",
          description: error.message || "There was an issue processing your payment.",
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        toast({
          title: "Payment Successful",
          description: "Your booking deposit has been processed successfully.",
        });

        // If we have a booking ID, update the deposit status
        if (bookingId) {
          try {
            await apiRequest("POST", "/api/update-booking-payment", {
              bookingId,
              depositPaid: true,
            });
          } catch (updateError) {
            console.error("Failed to update booking payment status:", updateError);
          }
        }

        // Call the success callback
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)} Deposit`
        )}
      </Button>
      
      <p className="mt-4 text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We do not store your card details.
      </p>
    </form>
  );
}

// Main payment form component that creates the Payment Intent
export default function PaymentForm({
  amount,
  bookingId,
  customerEmail,
  serviceType,
  onSuccess,
}: {
  amount: number;
  bookingId?: number;
  customerEmail?: string;
  serviceType: string;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create a PaymentIntent on the server
    const createPaymentIntent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount,
          serviceType,
          customerEmail,
          bookingId,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create payment intent");
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        setError(err.message || "Failed to initialize payment");
        toast({
          title: "Payment Setup Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, bookingId, customerEmail, serviceType, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Setting up payment...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
        <h3 className="font-medium text-red-700">Payment Error</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 bg-amber-50 text-amber-600 rounded-md mb-4">
        <h3 className="font-medium">Payment Not Available</h3>
        <p>Payment system is currently unavailable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-md p-6 shadow-sm">
      <h3 className="text-xl font-medium mb-4">Secure Payment</h3>
      <p className="text-muted-foreground mb-6">
        Please provide your payment details to secure your booking with a deposit.
      </p>
      
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm 
          bookingId={bookingId} 
          onSuccess={onSuccess} 
          amount={amount}
          email={customerEmail}
          serviceType={serviceType}
        />
      </Elements>
      
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Deposit Information</h4>
        <p className="text-sm text-muted-foreground">
          This deposit secures your appointment and is non-refundable if cancelled 
          less than 24 hours before your scheduled time. The deposit will be applied 
          towards your total service cost.
        </p>
      </div>
    </div>
  );
}