'use client';

import { motion } from 'framer-motion';
import { Warning, ArrowClockwise } from 'phosphor-react';
import { Button } from 'keep-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
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
    >
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
        <Warning size={36} className="text-red-400" weight="duotone" />
      </div>
      
      <h3 className="text-xl font-semibold text-red-100 mb-2">Error Loading Data</h3>
      <p className="text-red-200/80 mb-6 max-w-md mx-auto">
        {message || "We encountered an error while loading data. Please try again later."}
      </p>
      
      {onRetry && (
        <Button
          size="md"
          type="button"
          onClick={onRetry}
          className="mx-auto bg-red-500 hover:bg-red-600 text-white"
        >
          <ArrowClockwise size={20} className="mr-2" />
          Retry
        </Button>
      )}
    </motion.div>
  );
}