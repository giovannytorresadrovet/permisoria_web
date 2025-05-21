'use client';

import React from 'react';
import { Button } from 'keep-react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Clock,
  Warning 
} from 'phosphor-react';
import NotesSection from '../shared/NotesSection';

interface SummaryStepProps {
  verification: any; // This would be properly typed with the actual verification state
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function SummaryStep({
  verification,
  onNext,
  onPrev,
  onSubmit
}: SummaryStepProps) {
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'REJECTED':
        return <XCircle size={20} className="text-red-400" />;
      case 'NEEDS_REVIEW':
        return <Warning size={20} className="text-amber-400" />;
      default:
        return <Clock size={20} className="text-blue-400" />;
    }
  };
  
  // Calculate overall completion status
  const identityComplete = verification.areAllChecked('identity');
  const addressComplete = verification.areAllChecked('address');
  const businessComplete = verification.areAllChecked('business');
  const allComplete = identityComplete && addressComplete && businessComplete;
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Verification Summary
      </h2>
      
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700 mb-6">
        <h3 className="text-gray-200 font-medium mb-4">Status Overview</h3>
        
        <div className="space-y-4">
          {/* Identity verification status */}
          <div className="flex items-center justify-between bg-gray-750 p-3 rounded-lg">
            <div className="flex items-center">
              {getStatusIcon(verification.state.verificationStatus.identity)}
              <span className="ml-2 text-gray-200">Identity Verification</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 font-medium ${
                identityComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                {identityComplete ? 'Complete' : 'Incomplete'}
              </span>
              <div className={`w-3 h-3 rounded-full ${
                identityComplete ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
            </div>
          </div>
          
          {/* Address verification status */}
          <div className="flex items-center justify-between bg-gray-750 p-3 rounded-lg">
            <div className="flex items-center">
              {getStatusIcon(verification.state.verificationStatus.address)}
              <span className="ml-2 text-gray-200">Address Verification</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 font-medium ${
                addressComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                {addressComplete ? 'Complete' : 'Incomplete'}
              </span>
              <div className={`w-3 h-3 rounded-full ${
                addressComplete ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
            </div>
          </div>
          
          {/* Business affiliation status */}
          <div className="flex items-center justify-between bg-gray-750 p-3 rounded-lg">
            <div className="flex items-center">
              {getStatusIcon(verification.state.verificationStatus.business)}
              <span className="ml-2 text-gray-200">Business Affiliation</span>
            </div>
            <div className="flex items-center">
              <span className={`mr-2 font-medium ${
                businessComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                {businessComplete ? 'Complete' : 'Incomplete'}
              </span>
              <div className={`w-3 h-3 rounded-full ${
                businessComplete ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overall verification notes */}
      <NotesSection
        title="Final Verification Notes"
        value={verification.state.notes.overall}
        onChange={(value) => verification.updateNotes('overall', value)}
        placeholder="Add any final notes about the overall verification..."
      />
      
      {/* Submit warning if incomplete */}
      {!allComplete && (
        <div className="mt-6 p-4 bg-amber-900/30 border border-amber-700/50 rounded flex items-start">
          <Warning size={24} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-amber-300 font-medium mb-1">Incomplete Verification</h4>
            <p className="text-amber-200/70 text-sm">
              Some verification steps are incomplete. You can still submit the verification, 
              but it may require additional review later.
            </p>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          size="md"
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous Step
        </Button>
        
        <Button
          onClick={onSubmit}
          variant="default"
          size="md"
        >
          Submit Verification
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
} 