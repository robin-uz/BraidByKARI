import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays, isSameDay, isAfter, isBefore, isSameMonth } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeSlot, Service, BusinessHours } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string | undefined;
  setSelectedTime: (time: string) => void;
  selectedService: Service | undefined;
}

export default function BookingCalendar({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedService
}: BookingCalendarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Get business hours to show closed days
  const { data: businessHours, isLoading: hoursLoading } = useQuery<BusinessHours[]>({
    queryKey: ["/api/business-hours"],
  });
  
  // Get available time slots for the selected date and service
  const { data: availableSlots, isLoading: slotsLoading, refetch: refetchSlots } = useQuery<TimeSlot[]>({
    queryKey: ["/api/available-slots", selectedDate?.toISOString(), selectedService?.id],
    queryFn: async () => {
      if (!selectedDate || !selectedService) return [];
      
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const res = await apiRequest(
        "GET", 
        `/api/available-slots?date=${dateString}&serviceId=${selectedService.id}`
      );
      return res.json();
    },
    enabled: !!selectedDate && !!selectedService,
  });
  
  // Update time slots when available slots change
  useEffect(() => {
    if (availableSlots) {
      setTimeSlots(availableSlots);
    }
  }, [availableSlots]);
  
  // Clear selected time when date changes
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate, setSelectedTime]);
  
  // Refetch slots when service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      refetchSlots();
    }
  }, [selectedService, refetchSlots, selectedDate]);
  
  // Function to check if a day is closed
  const isDayClosed = (day: Date) => {
    if (!businessHours) return false;
    
    const dayOfWeek = day.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const dayHours = businessHours.find(h => h.dayOfWeek === dayOfWeek);
    
    return dayHours ? !dayHours.isOpen : false;
  };
  
  // Function to format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get 3 months from today for calendar max date
  const threeMonthsLater = addDays(today, 90);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400" />
            Select a Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full",
                  !selectedDate && "text-neutral-500 dark:text-neutral-400"
                )}
                disabled={!selectedService}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                initialFocus
                disabled={(date) => 
                  isDayClosed(date) || 
                  isBefore(date, today) || 
                  isAfter(date, threeMonthsLater)
                }
                modifiers={{
                  closed: (date) => isDayClosed(date),
                }}
                modifiersClassNames={{
                  closed: "bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-300 line-through",
                }}
              />
            </PopoverContent>
          </Popover>
          {!selectedService && (
            <p className="text-orange-500 dark:text-orange-400 text-xs mt-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Please select a service first
            </p>
          )}
        </div>
        
        {/* Time Slots Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-purple-500 dark:text-purple-400" />
            Available Times
          </label>
          
          {!selectedDate ? (
            <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
              <CalendarIcon className="h-8 w-8 text-neutral-400 dark:text-neutral-600 mb-2" />
              <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center">
                Select a date to see available time slots
              </p>
            </div>
          ) : slotsLoading ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
              <X className="h-8 w-8 text-red-400 mb-2" />
              <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center">
                No available slots for this date. Please select another day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={cn(
                    "h-10",
                    selectedTime === slot.time 
                      ? "bg-purple-600 hover:bg-purple-700"
                      : slot.available 
                        ? "hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20" 
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                  )}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.available && selectedTime === slot.time && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {formatTime(slot.time)}
                </Button>
              ))}
            </div>
          )}
          
          {selectedDate && selectedTime && (
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
              <p className="text-purple-700 dark:text-purple-300 text-sm flex items-center font-medium">
                <Check className="h-4 w-4 mr-1.5 text-green-500" />
                {`Appointment time selected: ${format(selectedDate, "MMM d")} at ${formatTime(selectedTime)}`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Business Hours Information */}
      <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <h4 className="text-sm font-medium mb-2">Business Hours</h4>
        
        {hoursLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : businessHours && businessHours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {businessHours
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map((hours) => {
                const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                return (
                  <div key={hours.id} className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-900">
                    <span className="font-medium">{dayNames[hours.dayOfWeek]}</span>
                    {hours.isOpen ? (
                      <span>
                        {hours.openTime} - {hours.closeTime}
                        {hours.breakStart && hours.breakEnd && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            Break: {hours.breakStart}-{hours.breakEnd}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      <span className="text-neutral-500 dark:text-neutral-400">Closed</span>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Business hours information not available.
          </p>
        )}
      </div>
    </div>
  );
}