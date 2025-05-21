'use client';

import React, { useState } from 'react';
import { Check, Question, X } from 'phosphor-react';
import { motion } from 'framer-motion';
import { ChecklistItem } from '@/hooks/verification/useVerificationState';

interface VerificationChecklistItemProps {
  item: ChecklistItem;
  onToggle: (checked: boolean) => void;
  onNaToggle: () => void;
  onNaReasonChange?: (reason: string) => void;
  helpText?: string;
}

const VerificationChecklistItem: React.FC<VerificationChecklistItemProps> = ({
  item,
  onToggle,
  onNaToggle,
  onNaReasonChange,
  helpText
}) => {
  const [showNaInput, setShowNaInput] = useState(!!item.naReason);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle N/A toggle with reason prompt
  const handleNaToggle = () => {
    onNaToggle();
    setShowNaInput(prev => !prev);
  };
  
  return (
    <motion.div 
      className="mb-3 last:mb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(!item.checked)}
          className={`flex-shrink-0 w-5 h-5 rounded ${
            item.checked 
              ? 'bg-blue-600 hover:bg-blue-500' 
              : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors flex items-center justify-center`}
          disabled={item.isNA}
        >
          {item.checked && <Check size={14} className="text-white" />}
        </button>
        
        {/* Text */}
        <div className="flex-grow">
          <div className="flex items-center">
            <span className={`text-sm ${item.isNA ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
              {item.text}
            </span>
            
            {/* Help tooltip */}
            {helpText && (
              <div className="relative ml-1">
                <div 
                  onMouseEnter={() => setShowTooltip(true)} 
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Question size={16} className="text-gray-500 hover:text-blue-400 cursor-help" />
                </div>
                
                {showTooltip && (
                  <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-900 text-gray-200 text-xs rounded p-2 shadow-lg min-w-[12rem] mb-1">
                    {helpText}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* N/A reason input */}
          {item.isNA && showNaInput && (
            <div className="mt-1">
              <input 
                type="text"
                placeholder="Reason why this is not applicable..."
                value={item.naReason || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNaReasonChange && onNaReasonChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-xs p-1 rounded"
              />
            </div>
          )}
        </div>
        
        {/* N/A button */}
        <button
          type="button"
          onClick={handleNaToggle}
          className={`flex-shrink-0 w-5 h-5 rounded ${
            item.isNA 
              ? 'bg-amber-700 hover:bg-amber-600' 
              : 'bg-gray-700 hover:bg-gray-600'
          } transition-colors flex items-center justify-center`}
        >
          {item.isNA && <X size={12} className="text-white" />}
        </button>
      </div>
    </motion.div>
  );
};

interface VerificationChecklistProps {
  title: string;
  items: ChecklistItem[];
  category: string;
  onToggle: (category: string, itemId: string) => void;
  onNaToggle: (category: string, itemId: string) => void;
  onNaReasonChange?: (category: string, itemId: string, reason: string) => void;
  helpTexts?: Record<string, string>;
}

export default function VerificationChecklist({
  title,
  items,
  category,
  onToggle,
  onNaToggle,
  onNaReasonChange,
  helpTexts = {}
}: VerificationChecklistProps) {
  // Calculate completion percentage
  const completedCount = items.filter(item => item.checked || item.isNA).length;
  const completionPercentage = Math.round((completedCount / items.length) * 100);
  
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-200 font-medium">{title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {completionPercentage}% Complete
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item) => (
          <VerificationChecklistItem 
            key={item.id}
            item={item}
            onToggle={(checked) => onToggle(category, item.id)}
            onNaToggle={() => onNaToggle(category, item.id)}
            onNaReasonChange={
              onNaReasonChange 
                ? (reason) => onNaReasonChange(category, item.id, reason) 
                : undefined
            }
            helpText={helpTexts[item.id]}
          />
        ))}
      </div>
    </div>
  );
} 