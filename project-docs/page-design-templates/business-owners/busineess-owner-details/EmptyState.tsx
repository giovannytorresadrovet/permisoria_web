'use client';

import React, { ReactNode } from 'react';
import { Button } from 'keep-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <motion.div 
      className={`bg-surface/60 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      aria-live="polite"
      role="status"
    >
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          size="md"
          type="button"
          onClick={onAction}
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}