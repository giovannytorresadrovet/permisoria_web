// src/components/features/business-owners/verification/components/NotesSection.jsx
import React from 'react';
import { Card, Textarea } from 'keep-react';

const NotesSection = ({ 
  title = "Verification Notes", 
  value = "", 
  onChange, 
  placeholder = "Add notes about the verification...",
  rows = 4,
  warning = null
}) => {
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-4">
        <h4 className="font-medium mb-2 text-white">{title}</h4>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-gray-700 border-gray-600 text-white w-full"
          rows={rows}
        />
        
        {warning && (
          <p className="mt-2 text-xs text-yellow-400">
            {warning}
          </p>
        )}
      </div>
    </Card>
  );
};

export default NotesSection;