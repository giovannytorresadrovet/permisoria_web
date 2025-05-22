'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowSquareOut, Clock, Calendar } from 'phosphor-react';

interface CompletionStepProps {
  ownerId: string;
}

export default function CompletionStep({ ownerId }: CompletionStepProps) {
  const router = useRouter();
  
  const estimatedCompletionDate = () => {
    // Calculate a date 3 business days from now
    const today = new Date();
    const daysToAdd = 3;
    
    // Skip weekends
    const businessDaysToAdd = (day: Date, daysToAdd: number): Date => {
      const date = new Date(day);
      let remainingDays = daysToAdd;
      
      while (remainingDays > 0) {
        date.setDate(date.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          remainingDays--;
        }
      }
      
      return date;
    };
    
    const estimatedDate = businessDaysToAdd(today, daysToAdd);
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-center">
        {/* Success icon */}
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
            <CheckCircle size={64} weight="fill" className="text-green-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Verification Submitted Successfully</h2>
        
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Your verification has been submitted and is now being reviewed by our team.
          We'll notify you once the review is complete.
        </p>
        
        {/* Status card */}
        <div className="bg-gray-750 border border-gray-700 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-white mb-4">What happens next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Clock size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-gray-300 font-medium">Review process</h4>
                <p className="text-gray-400 text-sm">
                  Our verification team will review your documents and information.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-gray-300 font-medium">Estimated completion</h4>
                <p className="text-gray-400 text-sm">
                  {estimatedCompletionDate()} (3 business days)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ArrowSquareOut size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-gray-300 font-medium">Status updates</h4>
                <p className="text-gray-400 text-sm">
                  You'll receive email notifications when your verification status changes.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => router.push(`/owners/${ownerId}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Return to Owner Profile
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 