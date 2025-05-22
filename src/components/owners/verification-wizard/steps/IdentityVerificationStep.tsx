'use client';

import React, { useState } from 'react';
import { UserCircle, Plus, FileX, Info } from 'phosphor-react';

// Import shared components
import DocumentUpload from '../shared/DocumentUpload';
import DocumentViewer from '../shared/DocumentViewer';
import DocumentStatusSelector, { DocumentStatus } from '../shared/DocumentStatusSelector';

// Types for verification data
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

interface IdentityVerificationStepProps {
  section: VerificationSection;
  documents: DocumentVerification[];
  onUpdateSection: (status: SectionStatus, notes?: string) => void;
  onUpdateDocument: (documentId: string, status: DocumentVerification['status'], notes?: string) => Promise<boolean>;
  ownerId: string;
}

// Map between SectionStatus and DocumentStatus
const mapSectionToDocumentStatus = (status: SectionStatus): DocumentStatus => {
  switch (status) {
    case 'VERIFIED':
      return 'VERIFIED';
    case 'REJECTED':
      return 'OTHER_ISSUE';
    case 'NEEDS_INFO':
      return 'INCONSISTENT_DATA';
    case 'COMPLETE':
      return 'VERIFIED';
    case 'IN_PROGRESS':
    case 'INCOMPLETE':
    default:
      return 'PENDING';
  }
};

const mapDocumentToSectionStatus = (status: DocumentStatus): SectionStatus => {
  switch (status) {
    case 'VERIFIED':
      return 'VERIFIED';
    case 'UNREADABLE':
    case 'EXPIRED':
    case 'SUSPECTED_FRAUD':
      return 'REJECTED';
    case 'INCONSISTENT_DATA':
      return 'NEEDS_INFO';
    case 'OTHER_ISSUE':
      return 'REJECTED';
    case 'NOT_APPLICABLE':
      return 'COMPLETE';
    case 'PENDING':
    default:
      return 'IN_PROGRESS';
  }
};

export default function IdentityVerificationStep({
  section,
  documents,
  onUpdateSection,
  onUpdateDocument,
  ownerId
}: IdentityVerificationStepProps) {
  // State for viewing documents
  const [viewingDocument, setViewingDocument] = useState<{
    url: string;
    filename: string;
    contentType: string;
  } | null>(null);
  
  // State for section notes
  const [sectionNotes, setSectionNotes] = useState(section.notes || '');
  
  // Handle document upload success
  const handleUploadSuccess = (result: any) => {
    // In a real implementation, this would automatically add the document to the documents array
    // For now, we'll just show a success message
    alert('Document uploaded successfully!');
  };
  
  // Handle document view
  const handleViewDocument = (doc: DocumentVerification) => {
    // In a real implementation, we would fetch the document URL
    // For now, we'll use a placeholder
    setViewingDocument({
      url: `https://example.com/documents/${doc.documentId}`,
      filename: doc.document.filename,
      contentType: doc.document.category === 'identification' ? 'application/pdf' : 'image/jpeg'
    });
  };
  
  // Handle section status update
  const handleSectionStatusChange = (newStatus: DocumentStatus) => {
    onUpdateSection(mapDocumentToSectionStatus(newStatus), sectionNotes);
  };
  
  // Handle section notes update
  const handleSectionNotesChange = (notes: string) => {
    setSectionNotes(notes);
    onUpdateSection(section.status, notes);
  };
  
  // Handle document status update
  const handleDocumentStatusChange = async (doc: DocumentVerification, newStatus: DocumentStatus) => {
    // Map DocumentStatus from the UI component to the backend status
    const backendStatus = newStatus as DocumentVerification['status'];
    
    // Update document status
    await onUpdateDocument(doc.documentId, backendStatus, doc.notes);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-blue-600 p-3 rounded-full mr-4">
          <UserCircle size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Identity Verification</h2>
          <p className="text-gray-400">
            Upload government-issued identification documents to verify your identity
          </p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-gray-200 font-medium mb-2">Requirements</h3>
            <ul className="text-gray-400 list-disc pl-5 space-y-1 text-sm">
              <li>A valid government-issued ID (passport, driver&apos;s license, or national ID card)</li>
              <li>Document must be current (not expired)</li>
              <li>All information must be clearly visible</li>
              <li>Both front and back of the ID if applicable</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Document upload section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Upload Identification Documents</h3>
        
        {/* Existing documents */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-300 truncate">{doc.document.filename}</h4>
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="text-blue-500 hover:text-blue-400 text-sm"
                    >
                      View
                    </button>
                  </div>
                  
                  <DocumentStatusSelector
                    status={doc.status as DocumentStatus}
                    notes={doc.notes}
                    onStatusChange={(status) => handleDocumentStatusChange(doc, status)}
                    onNotesChange={(notes) => onUpdateDocument(doc.documentId, doc.status, notes)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center mb-6">
            <FileX size={40} className="text-gray-500 mb-2" />
            <p className="text-gray-400 mb-2">No identification documents uploaded yet</p>
            <p className="text-gray-500 text-sm text-center max-w-md mb-4">
              Please upload at least one government-issued ID to continue with the verification process
            </p>
          </div>
        )}
        
        {/* Upload new document button */}
        <div className="mb-6">
          <h4 className="text-gray-300 font-medium mb-3">Upload New Document</h4>
          <DocumentUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => console.error('Upload error:', error)}
            ownerId={ownerId}
            category="identification"
            className="max-w-xl"
          />
        </div>
      </div>
      
      {/* Section verification status */}
      <div className="border-t border-gray-700 pt-6 mb-4">
        <h3 className="text-lg font-medium text-white mb-4">Verification Status</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Current Status</label>
            <DocumentStatusSelector
              status={mapSectionToDocumentStatus(section.status)}
              onStatusChange={handleSectionStatusChange}
              showNotes={false}
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Verification Notes</label>
            <textarea
              value={sectionNotes}
              onChange={(e) => handleSectionNotesChange(e.target.value)}
              placeholder="Add any notes about this verification..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
        </div>
      </div>
      
      {/* Document viewer modal */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <DocumentViewer
              documentUrl={viewingDocument.url}
              fileName={viewingDocument.filename}
              documentType={viewingDocument.contentType.includes('pdf') ? 'pdf' : 'image'}
              onClose={() => setViewingDocument(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 