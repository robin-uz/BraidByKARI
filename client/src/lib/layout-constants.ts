/**
 * Layout Constants
 * 
 * This file provides standardized layout values based on the design reference guide.
 * Use these values throughout the application for consistent spacing, sizing, and responsive behavior.
 */

export const LAYOUT = {
  /** Page width constraints for each breakpoint */
  pageWidth: {
    desktop: '1280px', // Max width for desktop (≥1024px)
    tablet: '92vw',    // Percentage of viewport for tablet
    mobile: '94vw'     // Percentage of viewport for mobile
  },

  /** Grid configuration for each breakpoint */
  grid: {
    desktop: {
      columns: 12,
      outerGutter: '72px',
      innerGutter: '24px'
    },
    tablet: {
      columns: 8,
      outerGutter: '56px',
      innerGutter: '20px'
    },
    mobile: {
      columns: 4,
      outerGutter: '16px',
      innerGutter: '12px'
    }
  },

  /** Card dimensions for primary booking elements */
  bookingCard: {
    desktop: '720px',  // Width for desktop
    tablet: '90vw',    // Percentage of viewport for tablet
    mobile: '100%'     // Full width for mobile
  },

  /** Modal configurations */
  modal: {
    desktop: {
      width: '600px',
      maxWidth: '90vw',
      borderRadius: '16px',
      padding: '32px'
    },
    tablet: {
      width: '520px',
      maxWidth: '94vw',
      borderRadius: '16px',
      padding: '24px'
    },
    mobile: {
      width: '100%',
      maxHeight: 'calc(100vh - 120px)',
      borderRadius: '16px 16px 0 0', // Rounded top corners for slide-up sheet
      padding: '20px'
    }
  },

  /** Button specifications */
  buttons: {
    desktop: {
      minWidth: '140px',
      height: '48px',
      borderRadius: '16px'
    },
    tablet: {
      minWidth: '140px',
      height: '48px',
      borderRadius: '16px'
    },
    mobile: {
      width: '100%',
      height: '48px',
      borderRadius: '16px'
    },
    verticalSpacing: '24px' // Space before/after buttons
  },

  /** Typography scales */
  typography: {
    desktop: {
      display: '56px',
      h1: '40px',
      h2: '32px',
      h3: '24px',
      h4: '20px',
      body: '16px'
    },
    tablet: {
      display: '48px',
      h1: '32px', 
      h2: '28px',
      h3: '22px',
      h4: '18px',
      body: '15px'
    },
    mobile: {
      display: '36px',
      h1: '28px',
      h2: '24px',
      h3: '20px',
      h4: '18px',
      body: '15px'
    },
    lineHeight: {
      heading: 1.2,
      body: 1.4
    }
  },

  /** Section spacing (vertical rhythm) */
  verticalSpacing: {
    desktop: '64px',
    tablet: '48px',
    mobile: '32px'
  },

  /** Form field dimensions */
  formFields: {
    desktop: {
      width: '420px',  // Max width for desktop
      rowHeight: '44px'
    },
    tablet: {
      width: '90%',    // Percentage width for tablet
      rowHeight: '44px'
    },
    mobile: {
      width: '100%',   // Full width for mobile
      rowHeight: '44px'
    },
    errorText: {
      size: '12px',
      color: 'red'
    }
  },

  /** Animation settings */
  animation: {
    duration: '200ms',
    easing: 'ease-out',
    translateY: '8px'
  },

  /** Progress indicator spacing */
  progressIndicator: {
    topSpacing: '32px',
    closeButtonSafeZone: '64px'
  }
};

/**
 * Helper function to access typography values with proper type safety
 */
export function getTypographyValue(size: keyof typeof LAYOUT.typography.desktop, breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'): string {
  return LAYOUT.typography[breakpoint][size];
}

/**
 * Helper function to access spacing values
 */
export function getSpacingValue(breakpoint: 'desktop' | 'tablet' | 'mobile' = 'desktop'): string {
  return LAYOUT.verticalSpacing[breakpoint];
}

/**
 * Helper function to generate responsive clamp values for typography
 */
export function getResponsiveTypography(size: keyof typeof LAYOUT.typography.desktop): string {
  const mobile = LAYOUT.typography.mobile[size];
  const desktop = LAYOUT.typography.desktop[size];
  
  // Create fluid typography with clamp
  return `clamp(${mobile}, calc(${mobile} + (${parseInt(desktop)} - ${parseInt(mobile)}) * ((100vw - 375px) / (1440 - 375))), ${desktop})`;
}