// src/components/features/business-owners/ErrorState.tsx
'use client';

import { motion } from 'framer-motion';
import { Warning, ArrowClockwise } from 'phosphor-react';
import { Button } from 'keep-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  context?: 'load' | 'filter' | 'network';
}

export default function ErrorState({ message, onRetry, context = 'load' }: ErrorStateProps) {
  // Contextual help messages based on error type
  const contextualHelp = {
    load: "We encountered an error while loading the business owners data.",
    filter: "We encountered an error while applying your filters.",
    network: "There appears to be a network connection issue."
  };
  
  // Default message if none provided
  const displayMessage = message || contextualHelp[context];
  
  return (
    <motion.div 
      className="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
        <Warning size={36} className="text-red-400" weight="duotone" aria-hidden="true" />
      </div>
      
      <h3 className="text-xl font-semibold text-red-100 mb-2">Error Loading Data</h3>
      <p className="text-red-200/80 mb-6 max-w-md mx-auto">
        {displayMessage}
      </p>
      
      {onRetry && (
        <Button
          size="md"
          type="button"
          onClick={onRetry}
          className="mx-auto bg-red-500 hover:bg-red-600 text-white"
          aria-label="Retry loading data"
        >
          <ArrowClockwise size={20} className="mr-2" aria-hidden="true" />
          Retry
        </Button>
      )}
    </motion.div>
  );
}