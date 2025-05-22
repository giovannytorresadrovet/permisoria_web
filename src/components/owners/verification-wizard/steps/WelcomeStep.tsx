'use client';

import React from 'react';
import { CheckSquare, ShieldCheck, UserList } from 'phosphor-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-white mb-6">Welcome to the Business Owner Verification Process</h2>
      
      <div className="text-gray-300 mb-8">
        <p className="mb-4">
          This verification process will help us confirm your identity and business affiliation. 
          Completing verification allows you to access all features of the Permisoria platform.
        </p>
        
        <p>
          The process consists of the following steps:
        </p>
      </div>
      
      {/* Verification steps overview */}
      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <UserList size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Identity Verification</h3>
            <p className="text-gray-400">
              We'll need to verify your personal identity using government-issued ID documents
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <CheckSquare size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Address Verification</h3>
            <p className="text-gray-400">
              We'll confirm your current address with supporting documentation
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Business Affiliation</h3>
            <p className="text-gray-400">
              We'll verify your connection to the business you're representing
            </p>
          </div>
        </div>
      </div>
      
      {/* Important notes */}
      <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-medium text-white mb-2">Important Notes</h3>
        <ul className="text-gray-400 list-disc pl-5 space-y-2">
          <li>All information you provide is secure and protected.</li>
          <li>You can save your progress at any time and return later.</li>
          <li>Please have all your documents ready before proceeding.</li>
          <li>Verification typically takes 1-3 business days once submitted.</li>
        </ul>
      </div>
      
      {/* Privacy notice */}
      <div className="text-gray-500 text-sm mb-8">
        <p>
          By proceeding, you consent to our verification process and acknowledge that the information 
          provided will be used as described in our <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
      
      {/* Action button */}
      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Begin Verification Process
        </button>
      </div>
    </div>
  );
} 