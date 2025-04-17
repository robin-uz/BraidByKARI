import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import PaymentForm from "./payment-form";

interface PaymentModalProps {
  amount: number;
  serviceType: string;
  bookingId?: number;
  customerEmail?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onPaymentSuccess?: () => void;
  isButtonBlock?: boolean;
  isDisabled?: boolean;
}

export default function PaymentModal({
  amount,
  serviceType,
  bookingId,
  customerEmail,
  buttonText = "Pay Deposit",
  buttonVariant = "default",
  onPaymentSuccess,
  isButtonBlock = false,
  isDisabled = false,
}: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    // Close the dialog
    setIsOpen(false);
    
    // Call the success callback if provided
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={isButtonBlock ? "w-full" : ""} 
          disabled={isDisabled}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Secure your appointment with a {amount > 0 ? `$${amount.toFixed(2)}` : ""} deposit.
          </DialogDescription>
        </DialogHeader>
        
        <PaymentForm
          amount={amount}
          serviceType={serviceType}
          bookingId={bookingId}
          customerEmail={customerEmail}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}