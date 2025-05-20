'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'phosphor-react';

interface PasswordStrengthMeterProps {
  password: string;
  strength: number;
}

export default function PasswordStrengthMeter({ 
  password, 
  strength 
}: PasswordStrengthMeterProps) {
  if (!password) return null;
  
  const getStrengthText = () => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  };
  
  const getTextColor = () => {
    if (strength < 50) return 'text-red-400';
    if (strength < 75) return 'text-orange-400';
    if (strength < 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="mt-3 p-4 bg-gray-800/70 border border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">Password strength:</span>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      
      {/* Segmented strength meter */}
      <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
        <motion.div 
          className={`h-full rounded-l-full ${strength >= 25 ? 'bg-red-500' : 'bg-gray-700'}`}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: strength >= 25 ? 1 : 0.5, scale: strength >= 25 ? 1 : 0.98 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div 
          className={`h-full ${strength >= 50 ? 'bg-orange-500' : 'bg-gray-700'}`}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: strength >= 50 ? 1 : 0.5, scale: strength >= 50 ? 1 : 0.98 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        />
        <motion.div 
          className={`h-full ${strength >= 75 ? 'bg-yellow-500' : 'bg-gray-700'}`}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: strength >= 75 ? 1 : 0.5, scale: strength >= 75 ? 1 : 0.98 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        />
        <motion.div 
          className={`h-full rounded-r-full ${strength >= 100 ? 'bg-green-500' : 'bg-gray-700'}`}
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: strength >= 100 ? 1 : 0.5, scale: strength >= 100 ? 1 : 0.98 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        />
      </div>
      
      {/* Password requirements */}
      <div className="mt-3">
        <p className="text-gray-400 mb-2 text-sm">Your password must include:</p>
        <ul className="space-y-1">
          <li className={`flex items-center ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
            <CheckCircle size={16} className="mr-2" weight={password.length >= 8 ? 'fill' : 'regular'} />
            At least 8 characters
          </li>
          <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <CheckCircle size={16} className="mr-2" weight={/[A-Z]/.test(password) ? 'fill' : 'regular'} />
            At least one uppercase letter
          </li>
          <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <CheckCircle size={16} className="mr-2" weight={/[0-9]/.test(password) ? 'fill' : 'regular'} />
            At least one number
          </li>
          <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <CheckCircle size={16} className="mr-2" weight={/[^A-Za-z0-9]/.test(password) ? 'fill' : 'regular'} />
            At least one special character
          </li>
        </ul>
      </div>
    </div>
  );
}