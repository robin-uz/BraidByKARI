import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { ResponsiveText } from './container';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
  description?: string;
  labelClassName?: string;
  wide?: boolean;
  variant?: 'default' | 'booking';
}

/**
 * FormField component that implements the layout guide's form field specifications
 * 
 * Desktop: Form field width as per guide
 * Tablet: Form field width as per guide
 * Mobile: 100%
 * Row height: From spec
 * Error text: 12px red
 */
export function FormField({
  id,
  label,
  children,
  error,
  className,
  required = false,
  description,
  labelClassName,
  wide = false,
  variant = 'default',
}: FormFieldProps) {
  // Use booking field height if booking variant
  const fieldWidth = variant === 'booking' 
    ? "var(--form-field-width-desktop)" 
    : "var(--form-field-width-desktop)";

  return (
    <div 
      className={cn(
        "flex flex-col space-y-2 mb-4",
        wide 
          ? "w-full" 
          : "w-[var(--form-field-width-mobile)] sm:w-[var(--form-field-width-tablet)] lg:max-w-[var(--form-field-width-desktop)]",
        className
      )}
    >
      <Label 
        htmlFor={id}
        className={cn(
          "text-[var(--font-label)] leading-[var(--font-label-line-height)] font-medium flex gap-1 items-center",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      {description && (
        <ResponsiveText 
          variant="label"
          className="text-neutral-500 dark:text-neutral-400"
        >
          {description}
        </ResponsiveText>
      )}
      
      {children}
      
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-[var(--form-error-text-size)] mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/**
 * FormRow component for creating horizontal layouts of form fields
 */
export function FormRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:flex-wrap gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveInput component that implements the layout guide's form field height
 */
export function ResponsiveInput({
  className,
  variant = 'default',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'booking';
}) {
  // Use booking field height if booking variant
  const heightClass = variant === 'booking' 
    ? "h-[var(--booking-field-height)]"
    : "h-[var(--form-field-height)]";

  return (
    <Input 
      className={cn(
        heightClass,
        className
      )}
      {...props}
    />
  );
}

/**
 * Form component that implements proper structuring for forms
 */
export function GuideForm({
  children,
  className,
  onSubmit,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={cn(
        "space-y-4",
        className
      )}
      onSubmit={(e) => {
        if (onSubmit) {
          e.preventDefault();
          onSubmit(e);
        }
      }}
      {...props}
    >
      {children}
    </form>
  );
}

/**
 * FormActions component for handling form buttons with proper spacing
 */
export function FormActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row items-center justify-end gap-3 pt-6",
        "before:content-[''] before:block before:w-full before:h-px before:bg-neutral-200 dark:before:bg-neutral-800 before:absolute before:top-0 before:left-0",
        "relative",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Pricing row for pricing page - follows specs (row height, thumbnail size)
 */
export function PricingRow({
  children,
  className,
  title,
  price,
  thumbnail,
  description,
}: {
  children?: ReactNode;
  className?: string;
  title: string;
  price: string | number;
  thumbnail?: string;
  description?: string;
}) {
  return (
    <div 
      className={cn(
        "flex items-center py-3 border-b border-neutral-200 dark:border-neutral-800",
        "min-h-[var(--pricing-row-height)]",
        className
      )}
    >
      {/* Thumbnail if provided */}
      {thumbnail && (
        <div className="mr-4 flex-shrink-0">
          <div 
            className="w-[var(--pricing-thumbnail-size)] h-[var(--pricing-thumbnail-size)] rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800"
          >
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-grow">
        <ResponsiveText variant="h4" className="font-semibold">
          {title}
        </ResponsiveText>
        {description && (
          <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
            {description}
          </ResponsiveText>
        )}
      </div>
      
      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <ResponsiveText variant="h4" className="font-bold text-amber-600 dark:text-amber-400">
          ${typeof price === 'number' ? price.toFixed(2) : price}
        </ResponsiveText>
      </div>
      
      {/* Extra content if provided */}
      {children}
    </div>
  );
}