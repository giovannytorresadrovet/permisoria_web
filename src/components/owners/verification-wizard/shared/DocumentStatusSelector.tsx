'use client';

import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Warning, 
  FileSearch, 
  Clock, 
  Asterisk,
  Question
} from 'phosphor-react';

// Status options for document verification
export const DOCUMENT_STATUSES = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending Review',
    color: 'bg-amber-500',
    icon: Clock
  },
  VERIFIED: {
    value: 'VERIFIED',
    label: 'Verified',
    color: 'bg-green-500',
    icon: Check
  },
  UNREADABLE: {
    value: 'UNREADABLE',
    label: 'Unreadable',
    color: 'bg-red-500',
    icon: FileSearch
  },
  EXPIRED: {
    value: 'EXPIRED',
    label: 'Expired',
    color: 'bg-red-500',
    icon: X
  },
  INCONSISTENT_DATA: {
    value: 'INCONSISTENT_DATA',
    label: 'Inconsistent Data',
    color: 'bg-red-500',
    icon: Warning
  },
  SUSPECTED_FRAUD: {
    value: 'SUSPECTED_FRAUD',
    label: 'Suspected Fraud',
    color: 'bg-red-900',
    icon: Warning
  },
  OTHER_ISSUE: {
    value: 'OTHER_ISSUE',
    label: 'Other Issue',
    color: 'bg-gray-500',
    icon: Question
  },
  NOT_APPLICABLE: {
    value: 'NOT_APPLICABLE',
    label: 'Not Applicable',
    color: 'bg-gray-400',
    icon: Asterisk
  }
};

// Type for the document status
export type DocumentStatus = keyof typeof DOCUMENT_STATUSES;

interface DocumentStatusSelectorProps {
  /**
   * The current status of the document
   */
  status: DocumentStatus;
  
  /**
   * Notes related to the document verification
   */
  notes?: string;
  
  /**
   * Called when the status changes
   */
  onStatusChange: (status: DocumentStatus) => void;
  
  /**
   * Called when notes are updated
   */
  onNotesChange?: (notes: string) => void;
  
  /**
   * Whether to display notes for this document (defaults to true)
   */
  showNotes?: boolean;
  
  /**
   * Whether the control is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom CSS class for the component
   */
  className?: string;
}

/**
 * A component for selecting a document verification status with optional notes
 */
export const DocumentStatusSelector: React.FC<DocumentStatusSelectorProps> = ({
  status,
  notes = '',
  onStatusChange,
  onNotesChange,
  showNotes = true,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes);
  
  // Get the current status configuration
  const currentStatus = DOCUMENT_STATUSES[status] || DOCUMENT_STATUSES.PENDING;
  
  // Handle status selection
  const handleStatusSelect = (newStatus: DocumentStatus) => {
    setIsOpen(false);
    if (newStatus !== status) {
      onStatusChange(newStatus);
    }
  };
  
  // Handle notes blur (save on blur)
  const handleNotesBlur = () => {
    if (onNotesChange && tempNotes !== notes) {
      onNotesChange(tempNotes);
    }
  };
  
  const StatusIcon = currentStatus.icon;
  
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Status selector dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
            currentStatus.color
          } text-white transition-colors ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          <span className="flex items-center">
            <StatusIcon size={18} className="mr-2" weight="bold" />
            {currentStatus.label}
          </span>
          <svg
            className={`ml-2 w-5 h-5 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {Object.entries(DOCUMENT_STATUSES).map(([key, option]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => handleStatusSelect(key as DocumentStatus)}
                    className={`w-full text-left px-3 py-2 flex items-center hover:bg-gray-700 transition-colors ${
                      key === status ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${option.color}`}
                    >
                      <option.icon size={14} weight="bold" className="text-white" />
                    </span>
                    <span className="text-white">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Notes textarea */}
      {showNotes && (
        <div className="mt-2">
          <textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            onBlur={handleNotesBlur}
            disabled={disabled}
            placeholder="Add verification notes..."
            className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentStatusSelector; 