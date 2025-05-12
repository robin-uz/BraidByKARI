import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
  as?: React.ElementType;
  centered?: boolean;
}

/**
 * Container component that implements the layout guide's responsive width constraints
 * 
 * Desktop: 1240px max-width, centered
 * Tablet: 96vw viewport
 * Mobile: 96vw viewport
 */
export function Container({ 
  children, 
  className, 
  fluid = false,
  as: Component = 'div',
  centered = true
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-[var(--page-max-mobile)] sm:w-[var(--page-max-tablet)]",  // Mobile and tablet width constraints
        {
          "mx-auto": centered,    // Center container if requested
          "max-w-[var(--page-max)]": !fluid // Apply max-width constraint for desktop if not fluid
        },
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Section component that implements the layout guide's vertical spacing
 * 
 * Desktop: 96px vertical spacing
 * Tablet: 64px vertical spacing
 * Mobile: 48px vertical spacing
 */
export function Section({ 
  children, 
  className, 
  as: Component = 'section',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn(
        "py-[var(--section-gap-mobile)] md:py-[var(--section-gap-tablet)] lg:py-[var(--section-gap)]", 
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card component that implements the layout guide's card specifications
 */
export function Card({ 
  children, 
  className, 
  as: Component = 'div',
  variant = 'default',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement> & {
  variant?: 'default' | 'service' | 'testimonial'
}) {
  // Different card styles based on variant
  const variantStyles = {
    default: "rounded-[var(--radius-lg-mobile)] sm:rounded-[var(--radius-lg-tablet)] lg:rounded-[var(--radius-lg)]",
    service: cn(
      "min-h-[var(--service-card-min-height)]",
      "p-[var(--service-card-padding-mobile)] sm:p-[var(--service-card-padding-tablet)] lg:p-[var(--service-card-padding)]",
      "shadow-[0_12px_40px_-12px_rgba(255,203,112,0.25)]"
    ),
    testimonial: cn(
      "max-w-[var(--testimonial-card-width-mobile)] sm:max-w-[var(--testimonial-card-width-tablet)] lg:max-w-[var(--testimonial-card-width)]",
      "h-[var(--testimonial-card-height)]"
    )
  };

  return (
    <Component
      className={cn(
        "w-full overflow-hidden", // Common card styles
        "shadow-[0_8px_2px_rgba(0,0,0,0.2)]", // Card shadow
        variantStyles[variant], // Apply variant-specific styles
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Grid component that implements the layout guide's grid specifications
 */
export function Grid({ 
  children, 
  className, 
  variant = 'default',
  as: Component = 'div',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement> & {
  variant?: 'default' | 'services' | 'gallery'
}) {
  // Different grid styles based on variant
  const variantStyles = {
    default: cn(
      "grid-cols-4 sm:grid-cols-8 lg:grid-cols-12", // Standard grid columns
      "gap-3 sm:gap-5 lg:gap-6", // Standard grid gaps
      "px-[var(--gutter-mobile)] sm:px-[var(--gutter-tablet)] lg:px-[var(--gutter)]" // Standard gutters
    ),
    services: cn(
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", // Services grid columns
      "gap-[var(--services-grid-gap-mobile)] md:gap-[var(--services-grid-gap-tablet)] lg:gap-[var(--services-grid-gap)]" // Services grid gaps
    ),
    gallery: cn(
      "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", // Gallery grid columns
      "gap-[var(--gallery-grid-gap-sm)] md:gap-[var(--gallery-grid-gap-md)] lg:gap-[var(--gallery-grid-gap-lg)] xl:gap-[var(--gallery-grid-gap)]" // Gallery grid gaps
    )
  };

  return (
    <Component
      className={cn(
        "grid", // Common grid styles
        variantStyles[variant], // Apply variant-specific styles
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * A component that renders responsive typography adhering to our style guide
 */
export function ResponsiveText({
  children,
  className,
  as: Component = 'p',
  variant = 'body',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement> & {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label'
}) {
  // Get the appropriate classes based on the variant
  const sizeClasses = {
    display: cn(
      "text-[calc(var(--font-display)*0.75)] md:text-[calc(var(--font-display)*0.9)] lg:text-[var(--font-display)]",
      "leading-[var(--font-display-line-height)]"
    ),
    h1: cn(
      "text-[calc(var(--font-h1)*0.7)] md:text-[calc(var(--font-h1)*0.8)] lg:text-[var(--font-h1)]",
      "leading-[var(--font-h1-line-height)]"
    ),
    h2: "text-2xl md:text-3xl lg:text-4xl leading-tight",
    h3: "text-xl md:text-2xl lg:text-3xl leading-tight",
    h4: "text-lg md:text-xl lg:text-2xl leading-tight",
    body: cn(
      "text-[var(--font-body)]",
      "leading-[var(--font-body-line-height)]"
    ),
    label: cn(
      "text-[var(--font-label)]",
      "leading-[var(--font-label-line-height)]"
    )
  };

  return (
    <Component
      className={cn(
        sizeClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Components for the touchable elements with proper size
 */
export function TouchableArea({
  children,
  className,
  as: Component = 'button',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn(
        "min-w-[var(--tap-min)] min-h-[var(--tap-min)]", // Minimum touch size
        "inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Hero container with proper sizing based on specs
 */
export function HeroContainer({
  children,
  className,
  as: Component = 'div',
  ...props
}: ContainerProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn(
        "h-[var(--hero-height-mobile)] md:h-[var(--hero-height)]", // Height
        "min-h-[var(--hero-min-height-mobile)] md:min-h-[var(--hero-min-height)]", // Min height
        "max-h-[var(--hero-max-height)]", // Max height (desktop only)
        "w-full",
        "relative",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}