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
  /** Optional label for screen readers only */
  srOnlyLabel?: string;
  /** Optional description for screen readers */
  description?: string;
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
      srOnlyLabel,
      description,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const uniqueId = props.id || props.name || `input-${Math.random().toString(36).substring(2, 9)}`;
    const helperId = `${uniqueId}-helper`;
    const errorId = `${uniqueId}-error`;
    const descriptionId = `${uniqueId}-description`;
    
    // Prepare props for keep-react Input
    const inputProps: any = {
      ref,
      id: uniqueId,
      type,
      placeholder: props.placeholder,
      color: error ? 'error' : 'gray',
      className: cn('w-full rounded-md focus:ring-2 focus:ring-primary', className),
      "aria-invalid": error ? "true" : undefined,
      "aria-describedby": error 
        ? errorId 
        : (description 
            ? descriptionId 
            : (helperText ? helperId : undefined)),
      "aria-required": props.required ? "true" : undefined,
    };
    
    // Only add withBg if it's supported by the version of keep-react
    if (withBg) {
      inputProps.withBg = true;
    }

    return (
      <div className="mb-4 w-full">
        {(label || srOnlyLabel) && (
          <label 
            htmlFor={uniqueId}
            className={cn(
              "block text-sm font-medium mb-1",
              srOnlyLabel && !label ? "sr-only" : "text-text-secondary"
            )}
          >
            {label || srOnlyLabel}
            {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        
        {description && (
          <p id={descriptionId} className="text-xs text-text-secondary mb-1">
            {description}
          </p>
        )}
        
        <div className="relative">
          {icon && (
            <div 
              className="absolute inset-y-0 left-3 flex items-center pointer-events-none" 
              aria-hidden="true"
            >
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
          <p id={helperId} className="mt-1 text-xs text-text-secondary">
            {helperText}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="mt-1 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 