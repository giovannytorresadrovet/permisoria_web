'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CloudCheck, Warning, CloudArrowUp } from 'phosphor-react';

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
  error: string | null;
  onManualSave?: () => void;
}

export default function AutoSaveIndicator({
  lastSaved,
  isSaving,
  error,
  onManualSave
}: AutoSaveIndicatorProps) {
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex items-center justify-end text-xs">
      {error ? (
        // Error state
        <motion.div 
          className="flex items-center text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Warning size={14} className="mr-1" />
          <span>Save failed: {error}</span>
          {onManualSave && (
            <button
              type="button"
              onClick={onManualSave}
              className="ml-2 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
            >
              Retry
            </button>
          )}
        </motion.div>
      ) : isSaving ? (
        // Saving state
        <motion.div 
          className="flex items-center text-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-1"
          >
            <CloudArrowUp size={14} />
          </motion.div>
          <span>Saving...</span>
        </motion.div>
      ) : lastSaved ? (
        // Saved state
        <motion.div 
          className="flex items-center text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <CloudCheck size={14} className="mr-1" />
          <span>Saved at {formatTime(lastSaved)}</span>
        </motion.div>
      ) : (
        // Initial state (no saves yet)
        <span className="text-gray-500">
          Verification in progress
        </span>
      )}
      
      {/* Manual save button (always visible unless already saving) */}
      {!isSaving && onManualSave && (
        <button
          type="button"
          onClick={onManualSave}
          className="ml-3 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
        >
          Save Now
        </button>
      )}
    </div>
  );
} 