import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ServiceType } from './style-card';
import { Scissors, CalendarDays, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepReviewProps {
  service: ServiceType;
  date: Date;
  time: string;
  onComplete: () => void;
}

export function StepReview({ service, date, time, onComplete }: StepReviewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const deposit = Math.round(service.price * 0.3);
  
  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      
      // Notify parent
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };
  
  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-8"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Booking Confirmed!</h2>
        <p className="text-neutral-300 mb-8 max-w-md mx-auto">
          Your appointment has been successfully booked. A confirmation email will be sent to you shortly.
        </p>
        
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl mb-8 inline-block mx-auto">
          <div className="text-white text-left">
            <p className="mb-1"><strong>Service:</strong> {service.name}</p>
            <p className="mb-1"><strong>Date:</strong> {format(date, 'EEEE, MMMM d, yyyy')}</p>
            <p className="mb-1"><strong>Time:</strong> {time}</p>
            <p><strong>Deposit Paid:</strong> ${deposit}</p>
          </div>
        </div>
        
        <Button
          onClick={onComplete}
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
        >
          Return to Home
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="text-white"
    >
      <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>
      <p className="text-neutral-300 mb-6">
        Please review your booking details below and confirm by paying the deposit.
      </p>
      
      <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl mb-6">
        <h3 className="text-lg font-medium mb-4 border-b border-white/10 pb-2">Appointment Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <Scissors className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-grow">
              <div className="text-sm text-neutral-300">Service</div>
              <div className="text-white font-medium">{service.name}</div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-neutral-300">{service.duration}</span>
                <span className="text-amber-300 font-medium">${service.price}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <CalendarDays className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-grow">
              <div className="text-sm text-neutral-300">Date</div>
              <div className="text-white font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-grow">
              <div className="text-sm text-neutral-300">Time</div>
              <div className="text-white font-medium">{time}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl mb-6">
        <h3 className="text-lg font-medium mb-4 border-b border-white/10 pb-2">Payment Details</h3>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-neutral-300">Service Price</span>
            <span className="text-white">${service.price}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-neutral-300">Deposit Required (30%)</span>
            <span className="text-white">${deposit}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
            <span className="text-white font-medium">Total Due Today</span>
            <span className="text-amber-300 font-bold">${deposit}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-amber-300 mr-2" />
            <label className="text-white font-medium">Payment Method</label>
          </div>
          
          {/* This would be replaced with an actual Stripe component in a real app */}
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="text-neutral-300 text-sm mb-3">
              Credit Card Details (Stripe Integration)
            </div>
            <div className="h-12 bg-white/10 rounded-md mb-3"></div>
            <div className="flex space-x-2">
              <div className="h-12 bg-white/10 rounded-md w-1/2"></div>
              <div className="h-12 bg-white/10 rounded-md w-1/2"></div>
            </div>
          </div>
          
          <p className="text-xs text-neutral-400 mt-3">
            Your payment information is processed securely by Stripe. We do not store your card details.
          </p>
        </div>
      </div>
      
      <div className="text-sm text-neutral-300 mb-6">
        By confirming this booking, you agree to our <a href="/terms" className="text-amber-400 hover:underline">Terms and Conditions</a> and <a href="/cancellation-policy" className="text-amber-400 hover:underline">Cancellation Policy</a>.
      </div>
      
      <Button
        onClick={handleSubmit}
        disabled={isProcessing}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 h-auto text-lg"
      >
        {isProcessing ? (
          <>
            <span className="mr-2">Processing...</span>
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </>
        ) : (
          'Pay Deposit & Confirm'
        )}
      </Button>
    </motion.div>
  );
}