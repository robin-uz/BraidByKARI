import { useState } from "react";
import { 
  AlertCircle, 
  Calendar,
  Clock,
  Loader2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BookingCancellationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingCancellationModal({
  booking,
  isOpen,
  onClose
}: BookingCancellationModalProps) {
  const { toast } = useToast();
  const [isClosing, setIsClosing] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("POST", `/api/client/bookings/${bookingId}/cancel`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      
      // Invalidate bookings cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/client/bookings'] });
      
      // Close the modal
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCancelBooking = () => {
    if (booking) {
      cancelMutation.mutate(booking.id);
    }
  };

  const handleClose = () => {
    // If already in closing state or mutation is pending, do nothing
    if (isClosing || cancelMutation.isPending) return;
    
    setIsClosing(true);
    // Add small delay before actually closing to allow animations
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "EEEE, MMMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    try {
      const date = parseISO(`2023-01-01T${timeStr}`);
      return format(date, "h:mm a");
    } catch (error) {
      return timeStr;
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-center text-red-600 dark:text-red-400">
            Cancel Appointment
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Are you sure you want to cancel this appointment?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg my-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <p className="font-medium mb-1">Cancellation Policy</p>
              <p>
                Cancellations within 24 hours of your appointment may be subject to a cancellation fee.
                Your deposit may not be refundable.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <h3 className="font-medium text-lg mb-3 text-purple-700 dark:text-purple-300">
            {booking.serviceType}
          </h3>
          <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-500" />
              <span>{formatTime(booking.time)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="px-5"
            disabled={cancelMutation.isPending}
          >
            Keep Appointment
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 px-5"
            onClick={handleCancelBooking}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Appointment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}