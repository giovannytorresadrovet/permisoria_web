'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  title: string;
  subtitle: string;
  completed: boolean;
  active?: boolean;
}

interface VerificationTimelineProps {
  steps: TimelineStep[];
}

export default function VerificationTimeline({ steps }: VerificationTimelineProps) {
  return (
    <div className="py-4">
      <div className="relative">
        {/* Timeline line - enhanced with gradient */}
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-blue-600 via-blue-500/30 to-gray-700 left-6 top-0"></div>
        
        {steps.map((step, index) => (
          <div key={index} className={`flex mb-${index < steps.length - 1 ? '8' : '0'} relative`}>
            <div className="relative">
              <div 
                className={`${step.completed ? 'bg-green-500' : step.active ? 'bg-blue-600' : 'bg-gray-600 border-2 border-gray-700'} 
                            rounded-full h-3 w-3 mt-1.5 ml-5 z-20 relative`}
              ></div>
              
              {/* Pulsing effect for active step */}
              {step.active && (
                <motion.div 
                  className="absolute top-1.5 left-5 h-3 w-3 bg-blue-500/30 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
            <div className="ml-6 text-left">
              <p className={`text-sm font-medium ${step.completed ? 'text-white' : step.active ? 'text-white' : 'text-gray-300'}`}>
                {step.title}
              </p>
              <p className={`text-xs ${step.completed ? 'text-gray-400' : step.active ? 'text-gray-400' : 'text-gray-500'}`}>
                {step.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}