// src/components/features/business-owners/verification/components/VerificationChecklist.jsx
import React from 'react';
import { Card, Textarea } from 'keep-react';
import { CheckSquare, Square, WarningCircle } from 'phosphor-react';
import { motion } from 'framer-motion';
import ContextualHelp from './ContextualHelp';

const ChecklistItem = ({ 
  item, 
  onToggle, 
  onNaToggle, 
  onNaReasonChange,
  helpText
}) => {
  return (
    <div className="mb-3">
      <div className="flex items-start">
        <div className="flex space-x-2 mr-2">
          <button
            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-0.5 ${
              item.checked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'
            }`}
            onClick={() => onToggle(item.id)}
            disabled={item.na}
            aria-label={item.checked ? "Uncheck item" : "Check item"}
          >
            {item.checked ? 
              <CheckSquare size={20} weight="fill" /> : 
              <Square size={20} />
            }
          </button>
          
          <button
            className={`focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded p-0.5 ${
              item.na ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-400'
            }`}
            onClick={() => onNaToggle(item.id)}
            disabled={item.checked}
            aria-label={item.na ? "Mark as applicable" : "Mark as not applicable"}
          >
            <WarningCircle size={20} weight={item.na ? "fill" : "regular"} />
          </button>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center">
            <span className={`${
              item.checked ? 'text-blue-400' : 
              item.na ? 'text-yellow-400' : 
              'text-gray-300'
            }`}>
              {item.text}
            </span>
            
            {helpText && <ContextualHelp content={helpText} />}
          </div>
          
          {item.na && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2"
            >
              <Textarea
                value={item.naReason}
                onChange={(e) => onNaReasonChange(item.id, e.target.value)}
                placeholder="Explain why this is not applicable..."
                className="bg-gray-700 border-gray-600 text-white text-sm w-full"
                rows={2}
                required
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const VerificationChecklist = ({ 
  title,
  items, 
  category,
  onToggle,
  onNaToggle,
  onNaReasonChange,
  helpTexts = {} // Map of itemId -> helpText
}) => {
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-4">
        <h4 className="font-medium mb-3 text-white">{title}</h4>
        <div className="space-y-1">
          {items.map(item => (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={() => onToggle(category, item.id)}
              onNaToggle={() => onNaToggle(category, item.id)}
              onNaReasonChange={(id, reason) => onNaReasonChange(category, id, reason)}
              helpText={helpTexts[item.id]}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default VerificationChecklist;