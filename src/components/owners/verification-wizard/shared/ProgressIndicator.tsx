'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CaretRight } from 'phosphor-react';

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export default function ProgressIndicator({ 
  steps, 
  currentStep, 
  onStepClick 
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute h-0.5 bg-gray-700 left-0 right-0 top-1/2 transform -translate-y-1/2 -z-10" />
        
        {/* Completed progress line */}
        <div 
          className="absolute h-0.5 bg-blue-600 left-0 top-1/2 transform -translate-y-1/2 -z-10"
          style={{ 
            width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%`,
            transition: 'width 0.3s ease-in-out'
          }}
        />
        
        {/* Step indicators */}
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => onStepClick && step.isCompleted && onStepClick(step.id)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                step.isActive 
                  ? 'bg-blue-600 text-white' 
                  : step.isCompleted 
                    ? 'bg-blue-700 text-white cursor-pointer' 
                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              } transition-colors duration-200 group`}
              disabled={!step.isCompleted && !step.isActive}
            >
              {/* Step number */}
              <span className="text-sm font-medium">{step.id}</span>
              
              {/* Active indicator */}
              {step.isActive && (
                <motion.span
                  className="absolute w-full h-full rounded-full border-2 border-blue-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                />
              )}
            </button>
            
            {/* Step title */}
            <span 
              className={`mt-2 text-xs font-medium ${
                step.isActive ? 'text-blue-400' : step.isCompleted ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current step navigation */}
      <div className="mt-6 flex items-center">
        <CaretRight className="text-blue-500 mr-2" size={16} />
        <span className="text-gray-300 text-sm">
          <span className="font-semibold">Step {currentStep}:</span> {steps.find(s => s.id === currentStep)?.title}
        </span>
      </div>
    </div>
  );
} 