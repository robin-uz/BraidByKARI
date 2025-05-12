import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroWrapperProps {
  img: string;
  children: ReactNode;
  className?: string;
  overlayOpacity?: string;
}

export function HeroWrapper({ 
  img, 
  children, 
  className,
  overlayOpacity = 'bg-black/40'
}: HeroWrapperProps) {
  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      "aspect-[16/9] md:aspect-[21/9]", // Fixed aspect ratio
      className
    )}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={img} 
          alt="" 
          className="w-full h-full object-cover object-center" 
        />
        <div className={cn("absolute inset-0", overlayOpacity)}></div>
      </div>
      
      {/* Decorative Arc Overlay - we keep this exactly as before */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full"
        >
          <g transform="matrix(1,0,0,1,0,0)">
            <path 
              d="M1920,0 L1920,1080 L0,1080 L0,0 L1920,0 Z" 
              opacity="0.25" 
              fill="none" 
              stroke="#d89a3e" 
              strokeWidth="3" 
              strokeDasharray="none" 
              strokeLinecap="butt" 
              strokeDashoffset="0" 
              strokeLinejoin="miter" 
              strokeMiterlimit="4" 
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(0.85,0,0,0.85,145,82)">
            <path 
              d="M1920,0 L1920,1080 L0,1080 L0,0 L1920,0 Z" 
              opacity="0.25" 
              fill="none" 
              stroke="#d89a3e" 
              strokeWidth="3" 
              strokeDasharray="none" 
              strokeLinecap="butt" 
              strokeDashoffset="0" 
              strokeLinejoin="miter" 
              strokeMiterlimit="4" 
              fillRule="nonzero"
            />
          </g>
          <g transform="matrix(0.7,0,0,0.7,290,164)">
            <path 
              d="M1920,0 L1920,1080 L0,1080 L0,0 L1920,0 Z" 
              opacity="0.25" 
              fill="none" 
              stroke="#d89a3e" 
              strokeWidth="3" 
              strokeDasharray="none" 
              strokeLinecap="butt" 
              strokeDashoffset="0" 
              strokeLinejoin="miter" 
              strokeMiterlimit="4" 
              fillRule="nonzero"
            />
          </g>
        </svg>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        {children}
      </div>
    </div>
  );
}