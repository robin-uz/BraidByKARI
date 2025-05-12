import React, { useReducer, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { WizardLayout } from '@/components/booking/wizard-layout';
import { BookingSummary } from '@/components/booking/booking-summary';
import { StepService } from '@/components/booking/step-service';
import { StepDate } from '@/components/booking/step-date';
import { StepTime } from '@/components/booking/step-time';
import { StepReview } from '@/components/booking/step-review';
import { ServiceType } from '@/components/booking/style-card';
import { useLocation } from 'wouter';

// Define the state types for our booking flow
interface BookingState {
  step: number;
  service: ServiceType | null;
  date: Date | null;
  time: string | null;
}

// Define the action types
type BookingAction =
  | { type: 'SET_SERVICE'; service: ServiceType }
  | { type: 'SET_DATE'; date: Date }
  | { type: 'SET_TIME'; time: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'RESET' };

// Create the reducer function
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, service: action.service };
    case 'SET_DATE':
      return { ...state, date: action.date };
    case 'SET_TIME':
      return { ...state, time: action.time };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 4) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'RESET':
      return { step: 1, service: null, date: null, time: null };
    default:
      return state;
  }
}

// Initial state
const initialState: BookingState = {
  step: 1,
  service: null,
  date: null,
  time: null,
};

export default function BookingPage() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [, navigate] = useLocation();
  
  // Calculate the progress percentage based on current step
  const progress = state.step * 25; // 25%, 50%, 75%, 100%
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    dispatch({ type: 'SET_SERVICE', service });
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    dispatch({ type: 'SET_DATE', date });
  };
  
  // Handle time selection
  const handleTimeSelect = (time: string) => {
    dispatch({ type: 'SET_TIME', time });
  };
  
  // Handle step navigation
  const handleNextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  const handlePrevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  // Handle booking completion
  const handleComplete = () => {
    // In a real app, you would save the booking to the database and redirect
    navigate('/');
    
    // Reset the form
    dispatch({ type: 'RESET' });
  };
  
  // Summary component to show on the right side (or bottom on mobile)
  const renderSummary = () => {
    // Don't show summary on the review step since it already shows a summary
    if (state.step === 4) return null;
    
    let actionLabel = 'Continue';
    let actionDisabled = true;
    
    switch (state.step) {
      case 1:
        actionDisabled = !state.service;
        break;
      case 2:
        actionDisabled = !state.date;
        break;
      case 3:
        actionDisabled = !state.time;
        actionLabel = 'Review & Pay';
        break;
    }
    
    return (
      <BookingSummary
        service={state.service || undefined}
        date={state.date || undefined}
        time={state.time || undefined}
        onAction={handleNextStep}
        actionLabel={actionLabel}
        actionDisabled={actionDisabled}
        currentStep={state.step}
      />
    );
  };
  
  // Render the current step
  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <StepService
            selectedService={state.service}
            onSelect={handleServiceSelect}
          />
        );
      case 2:
        return (
          <StepDate
            selectedDate={state.date}
            onSelect={handleDateSelect}
          />
        );
      case 3:
        return (
          state.date && (
            <StepTime
              selectedDate={state.date}
              selectedTime={state.time}
              onSelect={handleTimeSelect}
            />
          )
        );
      case 4:
        return (
          state.service && state.date && state.time && (
            <StepReview
              service={state.service}
              date={state.date}
              time={state.time}
              onComplete={handleComplete}
            />
          )
        );
      default:
        return null;
    }
  };
  
  // Check if each step is complete to determine if we can navigate
  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!state.service;
      case 2:
        return !!state.date;
      case 3:
        return !!state.time;
      default:
        return false;
    }
  };
  
  return (
    <MainLayout>
      <WizardLayout
        progress={progress}
        summary={renderSummary()}
      >
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </WizardLayout>
    </MainLayout>
  );
}