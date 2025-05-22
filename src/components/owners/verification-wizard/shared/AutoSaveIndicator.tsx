'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudCheck, CloudArrowUp, CloudSlash } from 'phosphor-react';

interface AutoSaveIndicatorProps {
  /**
   * Whether there are changes that haven't been saved yet
   */
  isDirty: boolean;
  
  /**
   * Whether the auto-save operation is in progress
   */
  isAutoSaving: boolean;
  
  /**
   * The timestamp of the last successful save
   */
  lastSaved?: Date;
  
  /**
   * Error message if the last save failed
   */
  saveError?: string | null;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  isDirty,
  isAutoSaving,
  lastSaved,
  saveError
}) => {
  /**
   * Format the last saved timestamp in a human-readable way
   */
  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    
    // If saved in the last minute, show "Just now"
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // If saved in the last hour, show X minutes ago
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Otherwise show the time
    return lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <AnimatePresence mode="wait">
        {saveError ? (
          <motion.div
            key="error"
            className="flex items-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloudSlash size={16} className="mr-1" weight="bold" />
            <span>Save failed</span>
          </motion.div>
        ) : isAutoSaving ? (
          <motion.div
            key="saving"
            className="flex items-center text-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloudArrowUp size={16} className="mr-1" weight="bold" />
            <span>Saving...</span>
          </motion.div>
        ) : isDirty ? (
          <motion.div
            key="dirty"
            className="flex items-center text-amber-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloudArrowUp size={16} className="mr-1" weight="duotone" />
            <span>Unsaved changes</span>
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            className="flex items-center text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloudCheck size={16} className="mr-1" weight="bold" />
            <span>Saved {lastSaved ? formatLastSaved() : ''}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoSaveIndicator; 