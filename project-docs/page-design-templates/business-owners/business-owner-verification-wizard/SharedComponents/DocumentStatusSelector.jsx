// src/components/features/business-owners/verification/components/DocumentStatusSelector.jsx
import React from 'react';
import { Select } from 'keep-react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  WarningCircle, 
  FileX, 
  Eye,
  Question
} from 'phosphor-react';

// Defined document statuses from spec
const documentStatuses = [
  { 
    value: 'VERIFIED', 
    label: 'Verified/Acceptable', 
    icon: <CheckCircle size={16} weight="fill" className="text-green-500" />,
    color: 'text-green-500'
  },
  { 
    value: 'EXPIRED', 
    label: 'Issue - Expired', 
    icon: <Clock size={16} weight="fill" className="text-red-500" />,
    color: 'text-red-500'
  },
  { 
    value: 'MISMATCH', 
    label: 'Issue - Doesn\'t Match Record', 
    icon: <XCircle size={16} weight="fill" className="text-red-500" />,
    color: 'text-red-500'
  },
  { 
    value: 'SUSPICIOUS', 
    label: 'Issue - Suspected Fraudulent', 
    icon: <WarningCircle size={16} weight="fill" className="text-red-500" />,
    color: 'text-red-500'
  },
  { 
    value: 'OTHER_ISSUE', 
    label: 'Issue - Other', 
    icon: <XCircle size={16} weight="fill" className="text-red-500" />,
    color: 'text-red-500'
  },
  { 
    value: 'ILLEGIBLE', 
    label: 'Illegible/Unclear', 
    icon: <Eye size={16} weight="fill" className="text-yellow-500" />,
    color: 'text-yellow-500'
  },
  { 
    value: 'WRONG_TYPE', 
    label: 'Incorrect Document Type', 
    icon: <FileX size={16} weight="fill" className="text-yellow-500" />,
    color: 'text-yellow-500'
  },
  { 
    value: 'AWAITING_REPLACEMENT', 
    label: 'Awaiting Replacement', 
    icon: <Clock size={16} weight="fill" className="text-yellow-500" />,
    color: 'text-yellow-500'
  },
  { 
    value: 'NOT_APPLICABLE', 
    label: 'Not Applicable', 
    icon: <Question size={16} weight="fill" className="text-gray-500" />,
    color: 'text-gray-500'
  }
];

const DocumentStatusSelector = ({ 
  value = 'PENDING',
  onChange,
  requiresNoteFor = ['OTHER_ISSUE', 'NOT_APPLICABLE', 'SUSPICIOUS'],
  onNoteRequired
}) => {
  const handleChange = (newValue) => {
    onChange(newValue);
    
    // Check if a note is required for this status
    if (requiresNoteFor.includes(newValue)) {
      if (onNoteRequired) onNoteRequired(true);
    }
  };
  
  // Find current status object
  const currentStatus = documentStatuses.find(status => status.value === value) || {
    value: 'PENDING',
    label: 'Pending Review',
    icon: <Clock size={16} weight="fill" className="text-yellow-500" />,
    color: 'text-yellow-500'
  };
  
  return (
    <div className="w-full">
      <label className="block text-sm text-gray-400 mb-1">Document Status</label>
      <Select
        value={value}
        onValueChange={handleChange}
        placeholder="Select status..."
        className="w-full bg-gray-700 border-gray-600 text-white"
      >
        {documentStatuses.map(status => (
          <Select.Option key={status.value} value={status.value}>
            <div className="flex items-center">
              {React.cloneElement(status.icon, { className: `mr-2 ${status.color}` })}
              <span>{status.label}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default DocumentStatusSelector;