import React from 'react';
import { format } from 'date-fns';
import { CalendarDays, Clock, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingSummaryProps {
  service?: {
    id: string;
    name: string;
    price: number;
    duration: string;
    imageUrl?: string;
  };
  date?: Date;
  time?: string;
  onAction?: () => void;
  actionLabel?: string;
  actionDisabled?: boolean;
  currentStep: number;
}

export function BookingSummary({
  service,
  date,
  time,
  onAction,
  actionLabel = 'Continue',
  actionDisabled = false,
  currentStep
}: BookingSummaryProps) {
  const deposit = service ? Math.round(service.price * 0.3) : 0;
  
  return (
    <div className="text-white">
      <h3 className="text-xl font-bold text-center mb-4">Booking Summary</h3>
      
      {!service && !date && !time && (
        <div className="text-sm text-neutral-300 text-center mb-4">
          Follow the steps to complete your booking
        </div>
      )}
      
      <div className="space-y-5">
        {service && (
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
        )}
        
        {date && (
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <CalendarDays className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-grow">
              <div className="text-sm text-neutral-300">Date</div>
              <div className="text-white font-medium">{format(date, 'EEEE, MMMM d, yyyy')}</div>
            </div>
          </div>
        )}
        
        {time && (
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-grow">
              <div className="text-sm text-neutral-300">Time</div>
              <div className="text-white font-medium">{time}</div>
            </div>
          </div>
        )}
      </div>
      
      {service && (
        <div className="mt-6 pt-4 border-t border-white/10">
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
      )}
      
      {onAction && (
        <Button
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black"
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </Button>
      )}
      
      <div className="text-xs text-neutral-400 mt-4 text-center">
        {currentStep < 4 ? 'A 30% deposit is required to secure your appointment' : 'Remaining balance to be paid at the salon'}
      </div>
    </div>
  );
}