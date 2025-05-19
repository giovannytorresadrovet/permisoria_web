'use client';

import React, { forwardRef, ReactNode } from 'react';
import { Input as KeepInput } from 'keep-react';
import { cn } from '@/lib/utils';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  size?: 'sm' | 'md' | 'lg';
  withBg?: boolean;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      registration,
      size = 'md',
      withBg = false,
      type = 'text',
      icon,
      ...props
    },
    ref
  ) => {
    // Prepare props for keep-react Input
    const inputProps: any = {
      ref,
      id: props.id || props.name,
      type,
      placeholder: props.placeholder,
      color: error ? 'error' : 'gray',
      className: cn('w-full rounded-md focus:ring-2 focus:ring-primary', className)
    };
    
    // Only add withBg if it's supported by the version of keep-react
    if (withBg) {
      inputProps.withBg = true;
    }

    return (
      <div className="mb-4 w-full">
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <KeepInput
            {...inputProps}
            {...registration}
            {...props}
            className={cn(
              inputProps.className,
              icon && 'pl-10' // Add padding if there's an icon
            )}
          />
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-xs text-text-secondary">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
); 