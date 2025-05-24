'use client';

import { WarningCircle, Info } from 'phosphor-react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'info';
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  message, 
  type = 'error',
  onRetry 
}: ErrorMessageProps) {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-500/10' : 'bg-blue-500/10';
  const borderColor = isError ? 'border-red-500/30' : 'border-blue-500/30';
  const textColor = isError ? 'text-red-500' : 'text-blue-400';
  const Icon = isError ? WarningCircle : Info;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 ${bgColor} ${borderColor} border rounded-lg shadow-sm mb-6`}
    >
      <div className="flex items-start">
        <Icon size={24} weight="light" className={`${textColor} mr-3 flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1">
          <p className={`${textColor} mb-2`}>
            {message}
          </p>
          
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-2 text-sm font-medium hover:underline text-primary"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 