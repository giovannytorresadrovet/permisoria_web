'use client';

import React from 'react';
import { Button as KeepReactButton } from 'keep-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Define the color types accepted by keep-react Button
type ButtonColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
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
    // Mapping our variant names to keep-react's color props
    const variantToKeepReactColor: Record<ButtonVariant, ButtonColorVariant> = {
      primary: 'primary',
      secondary: 'secondary',
      danger: 'error',
      outline: 'primary', // Use primary for outline but set variant to outline
      link: 'primary', // Use primary for link but set variant to link
    };

    // Common button styles
    const baseStyles = cn(
      'focus-ring', // Using our focus ring utility
      fullWidth && 'w-full'
    );

    // Determine the button variant for keep-react
    const keepVariant = variant === 'outline' ? 'outline' : 
                         variant === 'link' ? 'link' : 'default';

    const buttonContent = (
      <KeepReactButton
        ref={ref}
        size={size}
        color={variantToKeepReactColor[variant]}
        variant={keepVariant}
        disabled={disabled || isLoading}
        loading={isLoading}
        className={cn(baseStyles, className)}
        {...props}
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