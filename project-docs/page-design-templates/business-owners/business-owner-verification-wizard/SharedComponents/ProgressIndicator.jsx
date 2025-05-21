// src/components/features/business-owners/verification/components/ProgressIndicator.jsx
import React from 'react';
import { Breadcrumb } from 'keep-react';
import { motion } from 'framer-motion';

const stepLabels = [
  'Introduction',
  'Identity',
  'Address',
  'Business',
  'Summary',
  'Completion'
];

const ProgressIndicator = ({ currentStep, totalSteps = 6, onStepClick }) => {
  return (
    <div className="w-full">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-3">
        {stepLabels.map((label, index) => (
          <Breadcrumb.Item
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Only allow clicking on steps that we've already reached
              if (currentStep >= index + 1 && onStepClick) {
                onStepClick(index + 1);
              }
            }}
            className={`${
              currentStep >= index + 1 
                ? 'text-blue-400 cursor-pointer' 
                : 'text-gray-400 cursor-not-allowed'
            } ${currentStep === index + 1 ? 'font-medium' : ''}`}
          >
            {label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      
      {/* Visual progress indicator */}
      <div className="flex items-center space-x-1.5">
        {[...Array(totalSteps)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: currentStep === index + 1 ? 1.1 : 1,
              opacity: 1
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index + 1 === currentStep
                ? 'w-8 bg-blue-500'
                : index + 1 < currentStep
                  ? 'w-6 bg-blue-600'
                  : 'w-6 bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;