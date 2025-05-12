import React, { ReactNode, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { AnimatePresence, motion } from 'framer-motion';
import { TouchableArea } from './container';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string; 
  hideFooter?: boolean;
  footerContent?: ReactNode;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  variant?: 'default' | 'bottom-sheet' | 'booking';
}

/**
 * GuideModal component that follows the layout guidelines
 * 
 * Desktop: 560px wide (max-width: 90vw), border-radius matches spec
 * Tablet: 94vw
 * Mobile: 100% width, slide-up sheet
 * 
 * Animation: 300ms ease fade + 8px translate-up
 */
export function GuideModal({
  children,
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  className,
  contentClassName,
  hideFooter = false,
  footerContent,
  showProgress = false,
  currentStep = 1,
  totalSteps = 3,
  variant = 'default'
}: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isBottomSheet = variant === 'bottom-sheet' || variant === 'booking';
  const isBooking = variant === 'booking';

  // Booking modal has special max width from spec
  const modalMaxWidth = isBooking 
    ? 'var(--booking-modal-max-width)' 
    : 'var(--modal-width-desktop)';
  
  // Booking modal has special padding from spec
  const modalPadding = isBooking
    ? 'var(--booking-modal-padding)'
    : 'var(--modal-padding-desktop)';
  
  const modalPaddingMobile = isBooking
    ? 'var(--booking-modal-padding-mobile)'
    : 'var(--modal-padding-mobile)';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: 'easeOut' 
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={isBottomSheet 
              ? { opacity: 1, y: '100%' } 
              : { opacity: 0, y: 'var(--animation-translate-y)', scale: 'var(--motion-modal-scale)' }
            }
            animate={isBottomSheet 
              ? { opacity: 1, y: 0 } 
              : { opacity: 1, y: 0, scale: 1 }
            }
            exit={isBottomSheet 
              ? { opacity: 1, y: '100%' } 
              : { opacity: 0, y: 'var(--animation-translate-y)', scale: 'var(--motion-modal-scale)' }
            }
            transition={{ 
              duration: 0.3, 
              ease: 'var(--animation-easing)'
            }}
            className={cn(
              // Base styles
              "relative z-50 overflow-hidden flex flex-col max-h-[calc(100vh-128px)]",
              // Width/max-width based on spec
              "w-full md:w-[94vw]",
              isBottomSheet ? "md:max-w-[var(--booking-modal-max-width)]" : `md:max-w-[${modalMaxWidth}]`,
              // Border radius based on spec
              isBottomSheet 
                ? "rounded-t-[var(--radius-lg-mobile)] md:rounded-[var(--radius-lg-tablet)] lg:rounded-[var(--radius-lg)]"
                : "rounded-[var(--radius-lg-mobile)] md:rounded-[var(--radius-lg-tablet)] lg:rounded-[var(--radius-lg)]",
              // Position for bottom sheet on mobile
              isBottomSheet && "absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto",
              // Background with shadow
              "bg-white dark:bg-zinc-900 shadow-lg",
              className
            )}
          >
            {/* Drag handle for mobile bottom sheets */}
            {isBottomSheet && (
              <div className="w-full flex justify-center py-2 md:hidden">
                <div className={cn(
                  `w-[var(--booking-drag-bar-width)] h-[var(--booking-drag-bar-height)]`,
                  "bg-neutral-300 dark:bg-neutral-700 rounded-full"
                )} />
              </div>
            )}
            
            {/* Header Section with safe touch zone for close button */}
            <div className={cn(
              "flex items-center justify-between",
              `px-[${modalPaddingMobile}] md:px-[${modalPadding}]`,
              "py-4 md:py-5",
              // Show progress bar for booking
              isBooking && showProgress ? "border-b-0" : "border-b border-neutral-200 dark:border-neutral-800"
            )}>
              {/* Title */}
              {title && (
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h2>
              )}
              
              {/* Progress indicator if enabled - NOT in header for booking */}
              {showProgress && !isBooking && (
                <div className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {Array.from({length: totalSteps}).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-8 h-1 rounded-full",
                        i < currentStep 
                          ? "bg-amber-500 dark:bg-amber-400" 
                          : "bg-neutral-200 dark:bg-neutral-700"
                      )}
                    />
                  ))}
                  <span className="ml-2">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
              )}
              
              {/* Close button with safe touch zone from spec */}
              {showCloseButton && (
                <TouchableArea
                  as="div" 
                  className={`w-[var(--booking-close-zone)] h-[var(--booking-close-zone)]`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </TouchableArea>
              )}
            </div>
            
            {/* Progress bar for booking */}
            {isBooking && showProgress && (
              <div className="w-full h-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-[var(--booking-modal-padding-mobile)] md:px-[var(--booking-modal-padding)]">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="ml-4 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            )}
            
            {/* Content with scrolling */}
            <div className={cn(
              "flex-1 overflow-y-auto",
              `px-[${modalPaddingMobile}] md:px-[${modalPadding}]`,
              "py-6",
              contentClassName
            )}>
              {children}
            </div>
            
            {/* Footer Section */}
            {!hideFooter && (
              <div className={cn(
                "border-t border-neutral-200 dark:border-neutral-800",
                `px-[${modalPaddingMobile}] md:px-[${modalPadding}]`,
                "py-4 md:py-5",
                "flex items-center justify-end space-x-4"
              )}>
                {footerContent || (
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                )}
              </div>
            )}
            
            {/* iOS safe area padding for bottom sheets */}
            {isBottomSheet && (
              <div className="h-[env(safe-area-inset-bottom)]" />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}