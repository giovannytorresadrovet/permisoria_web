'use client';

import React, { useState } from 'react';
import { Button } from 'keep-react';
import { ArrowRight, ArrowLeft } from 'phosphor-react';
import NotesSection from '../shared/NotesSection';
import DocumentUpload from '../shared/DocumentUpload';
import DocumentViewer from '../shared/DocumentViewer';
import VerificationChecklist from '../shared/VerificationChecklist';
import DocumentStatusSelector from '../shared/DocumentStatusSelector';

interface IdentityVerificationStepProps {
  verification: any; // This would be properly typed with the actual verification state
  onNext: () => void;
  onPrev: () => void;
}

export default function IdentityVerificationStep({
  verification,
  onNext,
  onPrev
}: IdentityVerificationStepProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // For demonstration purposes
  const mockDocument = selectedDocument ? {
    id: 'doc-123',
    url: 'https://sample-files.com/download/pdf/sample.pdf',
    fileName: 'sample-identity-document.pdf'
  } : null;
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        Identity Verification
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {/* Document upload section */}
          <DocumentUpload
            documentType="Identity"
            onUploadComplete={(doc) => {
              console.log('Document uploaded:', doc);
              // In a real implementation, this would update the state
            }}
            ownerId="123" // Would use actual owner ID
          />
          
          {/* Identity verification checklist */}
          <div className="mt-6">
            <VerificationChecklist
              title="Identity Verification Checklist"
              items={verification.state.checklists.identity}
              category="identity"
              onToggle={verification.toggleChecklistItem}
              onNaToggle={verification.toggleNaChecklistItem}
              onNaReasonChange={verification.updateNaReason}
              helpTexts={{
                'id-match': 'Check that the name, date of birth, and other details on the ID match what the owner provided',
                'id-valid': 'Ensure the ID is not expired and appears legitimate',
                'photo-match': 'If applicable, check that the photo resembles the owner',
                'tax-id-valid': 'Verify the tax ID follows the correct format for the appropriate type'
              }}
            />
          </div>
          
          {/* Notes section */}
          <NotesSection
            title="Identity Verification Notes"
            value={verification.state.notes.identity}
            onChange={(value) => verification.updateNotes('identity', value)}
            placeholder="Add notes about identity verification..."
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
                Upload and select an identity document to view it here
              </p>
            </div>
          )}
          
          {/* Document status */}
          <div className="mt-6">
            <h3 className="text-gray-200 font-medium mb-2">Document Status</h3>
            <DocumentStatusSelector
              value={verification.state.verificationStatus.identity}
              onChange={(status) => verification.updateVerificationStatus('identity', status)}
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