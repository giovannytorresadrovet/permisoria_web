'use client';

import React from 'react';
import { Warning } from 'phosphor-react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  title?: string;
  className?: string;
}

export default function ErrorMessage({ 
  message, 
  title = 'Authentication Error',
  className = ''
}: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <motion.div 
      className={`mb-6 p-4 rounded-lg bg-[rgba(239,68,68,0.15)] border-l-4 border-red-600 text-red-200 shadow-lg shadow-red-900/10 ${className}`}
      initial={{ opacity: 0, y: -10, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }}
    >
      <div className="flex items-start">
        <Warning weight="fill" size={24} className="mr-3 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-red-200 mb-1">{title}</h4>
          <p className="text-red-200/90">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}