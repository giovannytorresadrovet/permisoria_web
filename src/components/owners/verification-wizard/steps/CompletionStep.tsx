'use client';

import React from 'react';
import { Button } from 'keep-react';
import { CheckCircle, ArrowSquareOut } from 'phosphor-react';
import Link from 'next/link';

interface CompletionStepProps {
  ownerId: string;
}

export default function CompletionStep({ ownerId }: CompletionStepProps) {
  return (
    <div className="text-center max-w-xl mx-auto">
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center">
          <CheckCircle size={48} weight="fill" className="text-green-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-green-400 mb-4">
        Verification Submitted Successfully
      </h2>
      
      <p className="text-gray-300 mb-6">
        The business owner verification has been successfully submitted for processing. 
        You will be notified of any updates or if additional information is required.
      </p>
      
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-gray-200 font-medium mb-3">What happens next?</h3>
        
        <ul className="text-left space-y-4 mb-0">
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              1
            </div>
            <div className="text-gray-300">
              Our team will review the submitted verification documents and information.
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              2
            </div>
            <div className="text-gray-300">
              You will receive notifications about the status of this verification.
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              3
            </div>
            <div className="text-gray-300">
              If additional information is needed, you will be notified to provide further details.
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              4
            </div>
            <div className="text-gray-300">
              Once verified, the business owner will have access to all relevant features.
            </div>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={`/owners/${ownerId}`}>
          <Button
            variant="default"
            size="md"
            className="w-full"
          >
            Return to Owner Details
          </Button>
        </Link>
        
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="md"
            className="w-full"
          >
            Go to Dashboard
            <ArrowSquareOut size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
} 