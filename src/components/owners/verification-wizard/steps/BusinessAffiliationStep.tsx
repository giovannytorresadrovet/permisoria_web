'use client';

import React, { useState } from 'react';
import { Button } from 'keep-react';
import { ArrowRight, ArrowLeft } from 'phosphor-react';
import NotesSection from '../shared/NotesSection';
import DocumentUpload from '../shared/DocumentUpload';
import DocumentViewer from '../shared/DocumentViewer';
import VerificationChecklist from '../shared/VerificationChecklist';
import DocumentStatusSelector from '../shared/DocumentStatusSelector';

interface BusinessAffiliationStepProps {
  verification: any; // This would be properly typed with the actual verification state
  onNext: () => void;
  onPrev: () => void;
}

export default function BusinessAffiliationStep({
  verification,
  onNext,
  onPrev
}: BusinessAffiliationStepProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // For demonstration purposes
  const mockDocument = selectedDocument ? {
    id: 'doc-789',
    url: 'https://sample-files.com/download/pdf/sample.pdf',
    fileName: 'sample-business-document.pdf'
  } : null;
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Business Affiliation Verification
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Document upload section */}
          <DocumentUpload
            documentType="Business Ownership"
            onUploadComplete={(doc) => {
              console.log('Document uploaded:', doc);
              // In a real implementation, this would update the state
            }}
            ownerId="123" // Would use actual owner ID
          />
          
          {/* Business verification checklist */}
          <div className="mt-6">
            <VerificationChecklist
              title="Business Affiliation Checklist"
              items={verification.state.checklists.business}
              category="business"
              onToggle={verification.toggleChecklistItem}
              onNaToggle={verification.toggleNaChecklistItem}
              onNaReasonChange={verification.updateNaReason}
              helpTexts={{
                'business-owner': 'Verify the person is listed as an owner, partner, or authorized representative',
                'business-active': 'Check that the business is active and in good standing',
                'business-docs': 'Review business registration, articles of incorporation, or similar documents'
              }}
            />
          </div>
          
          {/* Notes section */}
          <NotesSection
            title="Business Affiliation Notes"
            value={verification.state.notes.business}
            onChange={(value) => verification.updateNotes('business', value)}
            placeholder="Add notes about business affiliation verification..."
          />
        </div>
        
        <div>
          {/* Document viewer or placeholder */}
          {mockDocument ? (
            <DocumentViewer
              documentUrl={mockDocument.url}
              fileName={mockDocument.fileName}
              onClose={() => setSelectedDocument(null)}
            />
          ) : (
            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-8 border border-gray-700 h-64 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Upload and select a business document to view it here
              </p>
            </div>
          )}
          
          {/* Document status */}
          <div className="mt-6">
            <h3 className="text-gray-200 font-medium mb-2">Document Status</h3>
            <DocumentStatusSelector
              value={verification.state.verificationStatus.business}
              onChange={(status) => verification.updateVerificationStatus('business', status)}
              onNoteRequired={() => {
                // This would focus the notes section
              }}
            />
          </div>
        </div>
      </div>
      
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
          onClick={onNext}
          variant="default"
          size="md"
        >
          Next Step
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
} 