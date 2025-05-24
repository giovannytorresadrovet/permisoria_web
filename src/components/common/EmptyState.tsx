'use client';

import { ReactNode } from 'react';
import { Button } from 'keep-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  secondaryActionLabel,
  onAction,
  onSecondaryAction
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
    >
      <div className="bg-gray-700/50 rounded-full p-6 mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-medium text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 max-w-md mb-8">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && onAction && (
          <Button
            size="md"
            onClick={onAction}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            {actionLabel}
          </Button>
        )}
        
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            size="md"
            variant="outline"
            onClick={onSecondaryAction}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
} 