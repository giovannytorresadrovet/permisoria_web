'use client';

import React from 'react';
import { Button as KeepReactButton } from 'keep-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'color'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  withAnimation?: boolean;
  loadingText?: string;
  /**
   * Optional icon to display before button text
   */
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      withAnimation = true,
      loadingText,
      icon,
      ...props
    },
    ref
  ) => {
    // Common button styles
    const baseStyles = cn(
      'focus-ring', // Using our focus ring utility
      fullWidth && 'w-full'
    );

    // Get the appropriate keep-react props based on our variant
    const getKeepReactProps = () => {
      // Base props that don't change with variant
      const baseProps = {
        size,
        disabled: disabled || isLoading,
        className: cn(baseStyles, className),
        "aria-disabled": disabled || isLoading ? "true" : undefined,
        ...(isLoading && { 
          "aria-busy": "true",
          "aria-live": "polite"
        }),
      };

      // Add variant-specific props
      switch (variant) {
        case 'primary':
          return { ...baseProps, color: 'primary' as any, variant: 'default' as any };
        case 'secondary':
          return { ...baseProps, color: 'secondary' as any, variant: 'default' as any };
        case 'danger':
          return { ...baseProps, color: 'error' as any, variant: 'default' as any };
        case 'outline':
          return { ...baseProps, color: 'primary' as any, variant: 'outline' as any };
        case 'link':
          return { ...baseProps, color: 'primary' as any, variant: 'link' as any };
        default:
          return { ...baseProps, color: 'primary' as any, variant: 'default' as any };
      }
    };

    const keepReactProps = getKeepReactProps();

    // Create a modified version of props with loading removed
    const { loading, ...restProps } = { loading: isLoading, ...props } as any;

    // Enhance the button with screen reader information
    const buttonContent = (
      // @ts-ignore - Ignoring type issues with keep-react
      <KeepReactButton 
        ref={ref}
        {...keepReactProps}
        {...restProps}
      >
        <span className="flex items-center justify-center">
          {isLoading && (
            <span 
              className="inline-block mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" 
              role="progressbar" 
              aria-hidden="true"
            />
          )}
          {icon && !isLoading && (
            <span className="mr-2" aria-hidden="true">
              {icon}
            </span>
          )}
          <span>
            {isLoading && loadingText ? loadingText : children}
          </span>
          {isLoading && !loadingText && (
            <span className="sr-only">Loading</span>
          )}
        </span>
      </KeepReactButton>
    );

    // Apply framer-motion animation if enabled
    if (withAnimation && !disabled && !isLoading) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={fullWidth ? 'w-full' : 'inline-block'}
        >
          {buttonContent}
        </motion.div>
      );
    }

    return buttonContent;
  }
);

Button.displayName = 'Button'; 