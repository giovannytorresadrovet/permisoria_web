'use client';

import React, { forwardRef } from 'react';
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
      ...props
    },
    ref
  ) => {
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
        
        <KeepInput
          ref={ref}
          id={props.id || props.name}
          type={type}
          placeholder={props.placeholder}
          sizing={size}
          color={error ? 'error' : 'gray'}
          withBg={withBg}
          className={cn(
            'w-full rounded-md focus:ring-2 focus:ring-primary',
            className
          )}
          {...registration}
          {...props}
        />
        
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