import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend, isBefore, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepDateProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export function StepDate({ selectedDate, onSelect }: StepDateProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Mock available days (in a real app, this would come from an API)
  const isDateAvailable = (date: Date) => {
    // Simulate unavailable days (closed on Sundays and past dates)
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && !isBefore(date, today) && !isToday(date);
  };
  
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="text-white"
    >
      <h2 className="text-2xl font-bold mb-6">Select Appointment Date</h2>
      <p className="text-neutral-300 mb-6">
        Choose a date for your appointment. Highlighted dates are available for booking.
      </p>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-sm text-neutral-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOfMonth(currentMonth).getDay() }, (_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12" />
          ))}
          
          {daysInMonth.map((date) => {
            const isAvailable = isDateAvailable(date);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => isAvailable && onSelect(date)}
                disabled={!isAvailable}
                className={cn(
                  "h-10 sm:h-12 rounded-lg flex items-center justify-center relative",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500",
                  isSelected 
                    ? "bg-amber-500 text-black font-bold" 
                    : isAvailable 
                      ? "hover:bg-white/10 text-white" 
                      : "text-neutral-500 cursor-not-allowed"
                )}
              >
                {date.getDate()}
                
                {/* Highlight for today */}
                {isToday(date) && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border border-amber-500 rounded-full mr-2"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white/20 rounded-full mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-neutral-700 rounded-full mr-2"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
      
      {selectedDate && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl flex items-center text-white">
          <Calendar className="w-5 h-5 text-amber-500 mr-3" />
          <span>
            Selected Date: <strong>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</strong>
          </span>
        </div>
      )}
    </motion.div>
  );
}