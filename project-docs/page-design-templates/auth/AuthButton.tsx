'use client';

import React, { ReactNode } from 'react';
import { Button } from 'keep-react';

interface AuthButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

export default function AuthButton({
  children,
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'lg',
  icon,
  className = ''
}: AuthButtonProps) {
  // Define variant-specific classes
  const variantClasses = {
    primary: `bg-blue-600 text-white relative overflow-hidden
              transition-all duration-200 ease-in-out transform hover:scale-[1.02] 
              active:scale-[0.98] shadow-lg hover:shadow-blue-600/30`,
    secondary: `bg-transparent border border-gray-600 hover:bg-gray-800 
                text-gray-300 transition-all duration-200`,
    outline: `bg-transparent border border-gray-700 hover:bg-gray-800 
              text-gray-300 transition-all duration-200`
  };

  // Define size-specific classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-2.5'
  };
  
  // Base button class that applies to all variants
  const baseClasses = 'rounded-lg w-full group';
  
  // Combine all classes based on props
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
    >
      {variant === 'primary' && (
        <>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-[1.08] transition-transform duration-300 ease-out -z-10"></span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-blue-600/0 via-blue-400/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </>
      )}
      
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
}