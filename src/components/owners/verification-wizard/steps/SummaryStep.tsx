'use client';

import React, { useState } from 'react';
import { Button } from 'keep-react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Clock,
  Warning,
  Check,
  X,
  ClockClockwise
} from 'phosphor-react';
import NotesSection from '../shared/NotesSection';

// Define SectionStatus type directly
type SectionStatus = 
  | 'INCOMPLETE'
  | 'IN_PROGRESS'
  | 'COMPLETE'
  | 'VERIFIED'
  | 'REJECTED'
  | 'NEEDS_INFO';

interface VerificationSection {
  status: SectionStatus;
  notes?: string;
  lastUpdated?: Date;
}

interface DocumentVerification {
  id: string;
  documentId: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO';
  notes?: string;
  document: {
    id: string;
    filename: string;
    category: string;
  };
}

interface SummaryStepProps {
  sections: {
    identity: VerificationSection;
    address: VerificationSection;
    businessAffiliation: VerificationSection;
  };
  documents: DocumentVerification[];
  onSubmit: () => Promise<boolean>;
}

export default function SummaryStep({ sections, documents, onSubmit }: SummaryStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Check if all sections are complete
  const isAllSectionsComplete = 
    sections.identity.status !== 'INCOMPLETE' &&
    sections.address.status !== 'INCOMPLETE' &&
    sections.businessAffiliation.status !== 'INCOMPLETE';
  
  // Count documents by category and status
  const documentStats = documents.reduce((acc: Record<string, Record<string, number>>, doc) => {
    const category = doc.document.category;
    const status = doc.status;
    
    if (!acc[category]) {
      acc[category] = {
        VERIFIED: 0,
        REJECTED: 0,
        PENDING: 0,
        NEEDS_INFO: 0
      };
    }
    
    acc[category][status]++;
    return acc;
  }, {});
  
  // Handle submit button click
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const success = await onSubmit();
      if (!success) {
        setSubmitError('Failed to submit verification. Please try again.');
      }
    } catch (error: any) {
      setSubmitError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render section status badge
  const renderStatusBadge = (status: SectionStatus) => {
    switch (status) {
      case 'COMPLETE':
        return (
          <span className="flex items-center bg-green-500/20 text-green-500 text-sm px-2 py-1 rounded-full">
            <Check size={16} className="mr-1" weight="bold" />
            Complete
          </span>
        );
      case 'INCOMPLETE':
        return (
          <span className="flex items-center bg-red-500/20 text-red-500 text-sm px-2 py-1 rounded-full">
            <X size={16} className="mr-1" weight="bold" />
            Incomplete
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center bg-blue-500/20 text-blue-500 text-sm px-2 py-1 rounded-full">
            <ClockClockwise size={16} className="mr-1" weight="bold" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center bg-gray-500/20 text-gray-400 text-sm px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };
  
  // Get a human-readable category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'identification':
        return 'Identification';
      case 'address_proof':
        return 'Address Proof';
      case 'business_affiliation':
        return 'Business Affiliation';
      default:
        return category;
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Verification Summary</h2>
      
      <div className="text-gray-300 mb-6">
        <p>
          Please review the information below before submitting your verification. 
          You can go back to any section to make changes if needed.
        </p>
      </div>
      
      {/* Verification status overview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3">Verification Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Identity verification status */}
          <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Identity</h4>
              {renderStatusBadge(sections.identity.status)}
            </div>
            {sections.identity.notes && (
              <p className="text-gray-400 text-sm mt-2 border-t border-gray-700 pt-2">
                {sections.identity.notes}
              </p>
            )}
          </div>
          
          {/* Address verification status */}
          <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Address</h4>
              {renderStatusBadge(sections.address.status)}
            </div>
            {sections.address.notes && (
              <p className="text-gray-400 text-sm mt-2 border-t border-gray-700 pt-2">
                {sections.address.notes}
              </p>
            )}
          </div>
          
          {/* Business affiliation status */}
          <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-300">Business Affiliation</h4>
              {renderStatusBadge(sections.businessAffiliation.status)}
            </div>
            {sections.businessAffiliation.notes && (
              <p className="text-gray-400 text-sm mt-2 border-t border-gray-700 pt-2">
                {sections.businessAffiliation.notes}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Documents summary */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3">Document Summary</h3>
        
        {Object.keys(documentStats).length === 0 ? (
          <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 text-gray-400">
            No documents have been uploaded.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(documentStats).map(([category, stats]) => (
              <div key={category} className="bg-gray-750 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-300 mb-2">{getCategoryName(category)}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total documents:</span>
                    <span className="text-gray-300">{Object.values(stats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                  
                  {stats.VERIFIED > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-green-500">
                        <CheckCircle size={14} className="mr-1" weight="fill" />
                        Verified:
                      </span>
                      <span className="text-green-500">{stats.VERIFIED}</span>
                    </div>
                  )}
                  
                  {stats.PENDING > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-amber-500">
                        <ClockClockwise size={14} className="mr-1" weight="fill" />
                        Pending:
                      </span>
                      <span className="text-amber-500">{stats.PENDING}</span>
                    </div>
                  )}
                  
                  {stats.REJECTED > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-red-500">
                        <XCircle size={14} className="mr-1" weight="fill" />
                        Rejected:
                      </span>
                      <span className="text-red-500">{stats.REJECTED}</span>
                    </div>
                  )}
                  
                  {stats.NEEDS_INFO > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-blue-500">
                        <Warning size={14} className="mr-1" weight="fill" />
                        Needs info:
                      </span>
                      <span className="text-blue-500">{stats.NEEDS_INFO}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Warnings for incomplete sections */}
      {!isAllSectionsComplete && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Warning size={20} className="text-amber-500 mr-2 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-amber-500 mb-1">Incomplete Verification</h4>
              <p className="text-amber-300 text-sm">
                One or more verification sections are incomplete. Please go back and complete all sections
                before submitting your verification.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Submit button */}
      <div className="flex flex-col items-center justify-center mt-8">
        {submitError && (
          <div className="text-red-500 mb-4 text-center">
            <p>{submitError}</p>
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isAllSectionsComplete}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
            isSubmitting
              ? 'bg-gray-700 text-gray-400 cursor-wait'
              : !isAllSectionsComplete
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <ClockClockwise size={20} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Verification'
          )}
        </button>
        
        <p className="text-gray-500 text-sm mt-4 text-center max-w-md">
          By submitting, you confirm that all information provided is accurate and complete.
          Verification will be reviewed by our team and typically takes 1-3 business days.
        </p>
      </div>
    </div>
  );
} 