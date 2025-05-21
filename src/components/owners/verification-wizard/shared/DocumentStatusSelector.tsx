'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Warning, 
  Clock, 
  Question, 
  CaretDown 
} from 'phosphor-react';
import { DocumentStatus } from '@/hooks/verification/useVerificationState';

type StatusType = DocumentStatus['status'];

interface StatusOption {
  value: StatusType;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface DocumentStatusSelectorProps {
  value: StatusType;
  onChange: (status: StatusType) => void;
  onNoteRequired?: () => void;
  requiresNoteFor?: StatusType[];
}

export default function DocumentStatusSelector({
  value = 'PENDING',
  onChange,
  requiresNoteFor = ['OTHER_ISSUE', 'REJECTED', 'NEEDS_REVIEW'],
  onNoteRequired
}: DocumentStatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (status: StatusType) => {
    onChange(status);
    setIsOpen(false);
    
    // Check if this status requires a note and call the callback
    if (requiresNoteFor.includes(status) && onNoteRequired) {
      onNoteRequired();
    }
  };
  
  // Define status options
  const statusOptions: StatusOption[] = [
    {
      value: 'PENDING',
      label: 'Pending Review',
      icon: <Clock size={18} />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
    {
      value: 'VERIFIED',
      label: 'Verified',
      icon: <CheckCircle size={18} />,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      value: 'REJECTED',
      label: 'Rejected',
      icon: <XCircle size={18} />,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      value: 'NEEDS_REVIEW',
      label: 'Needs Further Review',
      icon: <Question size={18} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      value: 'OTHER_ISSUE',
      label: 'Other Issue',
      icon: <Warning size={18} />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    }
  ];
  
  // Get the currently selected option
  const selectedOption = statusOptions.find(opt => opt.value === value) || statusOptions[0];
  
  return (
    <div className="relative">
      {/* Selected status button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded p-2 hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center">
          <div className={`${selectedOption.color} mr-2`}>
            {selectedOption.icon}
          </div>
          <span className="text-sm text-gray-200">{selectedOption.label}</span>
        </div>
        <CaretDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <motion.div 
          className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          <ul className="py-1">
            {statusOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center px-3 py-2 text-sm ${
                    option.value === value 
                      ? `${option.bgColor} ${option.color}` 
                      : 'text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  <div className={`${option.color} mr-2`}>
                    {option.icon}
                  </div>
                  <span>{option.label}</span>
                  {requiresNoteFor.includes(option.value) && (
                    <span className="ml-auto text-xs text-gray-500 italic">
                      (requires note)
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
} 