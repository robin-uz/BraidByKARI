import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WizardLayoutProps {
  children: ReactNode;
  progress: number; // 0-100
  summary?: ReactNode;
}

export function WizardLayout({ children, progress, summary }: WizardLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-300">
              Step {Math.ceil(progress / 25)} of 4
            </span>
            <span className="text-xs text-amber-300">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-white/15 h-1 rounded">
            <motion.div
              className="h-1 rounded bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Main Content */}
          <div className={cn(
            "w-full",
            summary ? "lg:w-7/12" : "lg:w-full"
          )}>
            <div className="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6 md:p-8">
              {children}
            </div>
          </div>
          
          {/* Summary Card */}
          {summary && (
            <div className="lg:w-5/12 mt-4 lg:mt-0">
              <div className="lg:sticky lg:top-20">
                {/* Desktop View */}
                <div className="hidden lg:block bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6">
                  {summary}
                </div>
                
                {/* Mobile View - Slide up panel */}
                <div className="fixed lg:hidden bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/10 p-4 z-20">
                  <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-3" />
                  {summary}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}