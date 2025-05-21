// src/components/features/business-owners/verification/components/AutoSaveIndicator.jsx
import React from 'react';
import { CheckCircle, CloudArrowUp, Warning } from 'phosphor-react';
import { motion } from 'framer-motion';

const AutoSaveIndicator = ({ lastSaved, isSaving, error }) => {
  const formatTime = (date) => {
    if (!date) return '';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <motion.div 
      className="flex items-center text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isSaving ? (
        <div className="flex items-center text-blue-400">
          <CloudArrowUp size={16} className="mr-1.5 animate-pulse" />
          <span>Saving...</span>
        </div>
      ) : error ? (
        <div className="flex items-center text-red-400">
          <Warning size={16} className="mr-1.5" />
          <span>Error saving: {error}</span>
        </div>
      ) : lastSaved ? (
        <div className="flex items-center text-green-400">
          <CheckCircle size={16} className="mr-1.5" />
          <span>Last saved: {formatTime(lastSaved)}</span>
        </div>
      ) : null}
    </motion.div>
  );
};

export default AutoSaveIndicator;