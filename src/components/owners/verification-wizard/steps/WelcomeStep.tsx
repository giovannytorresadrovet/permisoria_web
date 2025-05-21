'use client';

import React from 'react';
import { Button } from 'keep-react';
import { ArrowRight } from 'phosphor-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Welcome to Business Owner Verification
      </h2>
      
      <div className="mb-8 max-w-xl mx-auto">
        <p className="text-gray-300 mb-4">
          You are about to start the verification process for a business owner. 
          This process will help ensure that the owner's identity and business 
          affiliations are verified accurately.
        </p>
        
        <p className="text-gray-400 text-sm mb-6">
          The verification process consists of several steps:
        </p>
        
        <ul className="text-left bg-gray-750 p-4 rounded-lg space-y-3 mb-6">
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              1
            </div>
            <div>
              <span className="text-blue-400 font-medium">Identity Verification</span>
              <p className="text-gray-400 text-sm">Verify the owner's personal identity documents</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              2
            </div>
            <div>
              <span className="text-blue-400 font-medium">Address Verification</span>
              <p className="text-gray-400 text-sm">Confirm the owner's residential address</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              3
            </div>
            <div>
              <span className="text-blue-400 font-medium">Business Affiliation</span>
              <p className="text-gray-400 text-sm">Verify the owner's relationship to their business</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              4
            </div>
            <div>
              <span className="text-blue-400 font-medium">Final Review</span>
              <p className="text-gray-400 text-sm">Review and submit the verification</p>
            </div>
          </li>
        </ul>
      </div>
      
      <Button
        onClick={onNext}
        variant="default"
        size="md"
        className="w-full max-w-xs mx-auto"
      >
        Start Verification Process
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
} 