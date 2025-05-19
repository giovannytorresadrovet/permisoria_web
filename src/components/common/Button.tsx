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

    const buttonContent = (
      // @ts-ignore - Ignoring type issues with keep-react
      <KeepReactButton 
        ref={ref}
        {...keepReactProps}
        {...restProps}
      >
        {children}
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