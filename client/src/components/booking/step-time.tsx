import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepTimeProps {
  selectedDate: Date;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function StepTime({ selectedDate, selectedTime, onSelect }: StepTimeProps) {
  const firstAvailableRef = useRef<HTMLButtonElement>(null);
  
  // Mock available times (in a real app, this would come from an API based on selected date)
  const timeSlots = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '12:30 PM', available: false },
    { time: '1:00 PM', available: false },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: false },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true },
    { time: '5:00 PM', available: true },
    { time: '5:30 PM', available: true },
    { time: '6:00 PM', available: true },
    { time: '6:30 PM', available: false },
  ];
  
  // Auto-scroll to first available time slot
  useEffect(() => {
    if (firstAvailableRef.current) {
      firstAvailableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="text-white"
    >
      <h2 className="text-2xl font-bold mb-6">Select Appointment Time</h2>
      
      <div className="flex items-center mb-6 p-4 bg-white/5 rounded-xl">
        <Clock className="w-5 h-5 text-amber-500 mr-3" />
        <span>
          Selected Date: <strong>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</strong>
        </span>
      </div>
      
      <p className="text-neutral-300 mb-6">
        Choose an available time slot for your appointment.
      </p>
      
      <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map((slot, index) => {
            const isFirstAvailable = slot.available && !timeSlots.slice(0, index).some(s => s.available);
            
            return (
              <button
                key={slot.time}
                ref={isFirstAvailable ? firstAvailableRef : null}
                onClick={() => slot.available && onSelect(slot.time)}
                disabled={!slot.available}
                className={cn(
                  "py-3 px-4 rounded-lg text-center transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-amber-500",
                  selectedTime === slot.time
                    ? "bg-amber-500 text-black font-bold"
                    : slot.available
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                )}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 flex items-center text-sm text-neutral-300">
        <div className="w-3 h-3 bg-white/10 rounded-full mr-2"></div>
        <span>Available times are shown in white</span>
      </div>
      
      {selectedTime && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl flex items-center text-white">
          <Clock className="w-5 h-5 text-amber-500 mr-3" />
          <span>
            Selected Time: <strong>{selectedTime}</strong>
          </span>
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </motion.div>
  );
}