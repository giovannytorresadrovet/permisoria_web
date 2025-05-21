'use client';

import React, { useState } from 'react';
import { Button } from 'keep-react';
import { ArrowRight, ArrowLeft } from 'phosphor-react';
import NotesSection from '../shared/NotesSection';
import DocumentUpload from '../shared/DocumentUpload';
import DocumentViewer from '../shared/DocumentViewer';
import VerificationChecklist from '../shared/VerificationChecklist';
import DocumentStatusSelector from '../shared/DocumentStatusSelector';

interface AddressVerificationStepProps {
  verification: any; // This would be properly typed with the actual verification state
  onNext: () => void;
  onPrev: () => void;
}

export default function AddressVerificationStep({
  verification,
  onNext,
  onPrev
}: AddressVerificationStepProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // For demonstration purposes
  const mockDocument = selectedDocument ? {
    id: 'doc-456',
    url: 'https://sample-files.com/download/pdf/sample.pdf',
    fileName: 'sample-address-document.pdf'
  } : null;
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Address Verification
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Document upload section */}
          <DocumentUpload
            documentType="Address Proof"
            onUploadComplete={(doc) => {
              console.log('Document uploaded:', doc);
              // In a real implementation, this would update the state
            }}
            ownerId="123" // Would use actual owner ID
          />
          
          {/* Address verification checklist */}
          <div className="mt-6">
            <VerificationChecklist
              title="Address Verification Checklist"
              items={verification.state.checklists.address}
              category="address"
              onToggle={verification.toggleChecklistItem}
              onNaToggle={verification.toggleNaChecklistItem}
              onNaReasonChange={verification.updateNaReason}
              helpTexts={{
                'address-match': 'Check that the address on the document matches the provided address',
                'address-valid': 'Verify this is a real and deliverable address',
                'proof-recent': 'Documents should be dated within the last 3 months'
              }}
            />
          </div>
          
          {/* Notes section */}
          <NotesSection
            title="Address Verification Notes"
            value={verification.state.notes.address}
            onChange={(value) => verification.updateNotes('address', value)}
            placeholder="Add notes about address verification..."
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
                Upload and select an address document to view it here
              </p>
            </div>
          )}
          
          {/* Document status */}
          <div className="mt-6">
            <h3 className="text-gray-200 font-medium mb-2">Document Status</h3>
            <DocumentStatusSelector
              value={verification.state.verificationStatus.address}
              onChange={(status) => verification.updateVerificationStatus('address', status)}
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