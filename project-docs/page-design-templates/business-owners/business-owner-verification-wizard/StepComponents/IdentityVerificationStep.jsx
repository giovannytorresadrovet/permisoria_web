// src/components/features/business-owners/verification/steps/IdentityVerificationStep.jsx
import React, { useState } from 'react';
import { Card, Badge, TextInput, Button } from 'keep-react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  IdentificationCard,
  Eye,
  EyeSlash
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Components
import DocumentViewer from '../components/DocumentViewer';
import DocumentUpload from '../components/DocumentUpload';
import VerificationChecklist from '../components/VerificationChecklist';
import NotesSection from '../components/NotesSection';
import ContextualHelp from '../components/ContextualHelp';
import DocumentStatusSelector from '../components/DocumentStatusSelector';

const IdentityVerificationStep = ({
  ownerFields,
  updateOwnerField,
  checklists,
  toggleChecklistItem,
  toggleNaChecklistItem,
  updateNaReason,
  verificationStatus,
  updateVerificationStatus,
  notes,
  updateNotes,
  selectedDocument,
  setSelectedDocument,
  documentStatuses,
  updateDocumentStatus,
  documentNotes,
  updateDocumentNote
}) => {
  // Sample identity documents - in a real implementation, these would come from the backend
  const [identityDocuments, setIdentityDocuments] = useState([
    {
      id: 'doc1',
      name: "Driver's License",
      type: "ID",
      category: "Identity",
      status: documentStatuses['doc1'] || "PENDING",
      thumbnailUrl: "https://via.placeholder.com/100",
      url: "https://via.placeholder.com/800x600"
    }
  ]);
  
  // State for showing/hiding sensitive information
  const [showSensitive, setShowSensitive] = useState(false);
  
  // Handle document upload completion
  const handleDocumentUpload = (doc) => {
    // In a real implementation, this would interact with the backend
    setIdentityDocuments(prev => [...prev, {
      ...doc,
      category: "Identity"
    }]);
  };
  
  // Mask sensitive information
  const maskTaxId = (taxId) => {
    if (!taxId) return '';
    const length = taxId.length;
    if (length <= 4) return taxId;
    return '•'.repeat(length - 4) + taxId.slice(-4);
  };
  
  // Help texts for checklist items
  const helpTexts = {
    'id1': 'Compare full name on the ID with the name entered in the system. They should match exactly.',
    'id2': 'Check that the photo on the ID is clear and visibly matches the person. The ID should not show signs of tampering.',
    'id3': 'Check the expiration date on the ID document. An expired ID is not acceptable for verification.',
    'id4': 'All information on the ID should be readable and match the information in our system.'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Identity Verification</h3>
        <Badge 
          color={verificationStatus.identityVerified ? "success" : "warning"} 
          size="sm"
          icon={verificationStatus.identityVerified ? 
            <CheckCircle size={14} weight="fill" /> : 
            <Clock size={14} weight="fill" />
          }
        >
          {verificationStatus.identityVerified ? "VERIFIED" : "PENDING"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Personal Information & Document Management */}
        <div className="space-y-4">
          {/* Personal Information Card */}
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <h4 className="font-medium">Personal Information</h4>
                <ContextualHelp content="Review and update the owner's personal information if needed. Fields become read-only after verification." />
              </div>
              
              <div className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-400 mb-1">First Name</label>
                    <TextInput
                      id="firstName"
                      placeholder="First Name"
                      value={ownerFields.firstName || ''}
                      onChange={(e) => updateOwnerField('firstName', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                      addon={<IdentificationCard size={16} color="#9CA3AF" />}
                    />
                  </div>
                  <div>
                    <label htmlFor="paternalLastName" className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <TextInput
                      id="paternalLastName"
                      placeholder="Last Name"
                      value={ownerFields.paternalLastName || ''}
                      onChange={(e) => updateOwnerField('paternalLastName', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                    />
                  </div>
                </div>
                
                {/* Additional name fields - optional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maternalLastName" className="block text-sm text-gray-400 mb-1">Maternal Last Name (if applicable)</label>
                    <TextInput
                      id="maternalLastName"
                      placeholder="Maternal Last Name"
                      value={ownerFields.maternalLastName || ''}
                      onChange={(e) => updateOwnerField('maternalLastName', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                    <TextInput
                      id="dateOfBirth"
                      placeholder="YYYY-MM-DD"
                      type="date"
                      value={ownerFields.dateOfBirth || ''}
                      onChange={(e) => updateOwnerField('dateOfBirth', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                    />
                  </div>
                </div>
                
                {/* Sensitive information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="taxId" className="block text-sm text-gray-400 mb-1">Tax ID (Last 4 digits visible)</label>
                      <button 
                        onClick={() => setShowSensitive(!showSensitive)}
                        className="text-gray-400 hover:text-blue-400 text-xs"
                        aria-label={showSensitive ? 'Hide sensitive data' : 'Show sensitive data'}
                      >
                        {showSensitive ? (
                          <span className="flex items-center">
                            <EyeSlash size={14} className="mr-1" />
                            Hide
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            Show
                          </span>
                        )}
                      </button>
                    </div>
                    <TextInput
                      id="taxId"
                      placeholder="Tax ID"
                      value={showSensitive ? (ownerFields.taxId || '') : maskTaxId(ownerFields.taxId || '')}
                      onChange={(e) => updateOwnerField('taxId', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="idLicenseNumber" className="block text-sm text-gray-400 mb-1">ID/License Number</label>
                    <TextInput
                      id="idLicenseNumber"
                      placeholder="ID/License Number"
                      value={showSensitive ? (ownerFields.idLicenseNumber || '') : maskTaxId(ownerFields.idLicenseNumber || '')}
                      onChange={(e) => updateOwnerField('idLicenseNumber', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.identityVerified}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Document Upload */}
          <DocumentUpload 
            documentType="Identity" 
            onUploadComplete={handleDocumentUpload}
          />
          
          {/* Document List */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Identity Documents</h4>
            
            {identityDocuments.length === 0 ? (
              <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded-md">
                <p className="text-yellow-400 text-sm">
                  No Identity documents found. Please upload at least one document to proceed with verification.
                </p>
              </div>
            ) : (
              identityDocuments.map(doc => (
                <Card 
                  key={doc.id}
                  className={`bg-gray-750 border ${selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-700'} cursor-pointer transition-all duration-200`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img src={doc.thumbnailUrl} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{doc.name}</h5>
                        <p className="text-gray-400 text-xs">{doc.type}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      color={getStatusColor(documentStatuses[doc.id] || "PENDING")}
                      size="sm"
                      icon={getStatusIcon(documentStatuses[doc.id] || "PENDING")}
                    >
                      {getStatusLabel(documentStatuses[doc.id] || "PENDING")}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Document Viewer, Checklist, Notes, Status */}
        <div className="space-y-4">
          {/* Document Viewer (if document selected) */}
          {selectedDocument && (
            <div className="space-y-4">
              <DocumentViewer document={selectedDocument} />
              
              {/* Document Status & Notes */}
              <Card className="bg-gray-800 border border-gray-700">
                <div className="p-4 space-y-4">
                  <DocumentStatusSelector 
                    value={documentStatuses[selectedDocument.id] || "PENDING"}
                    onChange={(value) => updateDocumentStatus(selectedDocument.id, value)}
                    onNoteRequired={() => {
                      // Ensure there's a note if we set a status that requires one
                      if (!documentNotes[selectedDocument.id]) {
                        updateDocumentNote(selectedDocument.id, '');
                      }
                    }}
                  />
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Document Notes</label>
                    <textarea
                      value={documentNotes[selectedDocument.id] || ''}
                      onChange={(e) => updateDocumentNote(selectedDocument.id, e.target.value)}
                      placeholder="Add notes about this document..."
                      className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Verification Checklist */}
          <VerificationChecklist
            title="Identity Verification Checklist"
            items={checklists.identity}
            category="identity"
            onToggle={toggleChecklistItem}
            onNaToggle={toggleNaChecklistItem}
            onNaReasonChange={updateNaReason}
            helpTexts={helpTexts}
          />
          
          {/* Notes Section */}
          <NotesSection
            title="Identity Verification Notes"
            value={notes.identity}
            onChange={(value) => updateNotes('identity', value)}
            placeholder="Add notes about the identity verification..."
          />
          
          {/* Verification Status */}
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Identity Verification Status</h4>
                <Badge 
                  color={verificationStatus.identityVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.identityVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.identityVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  color={verificationStatus.identityVerified ? "gray" : "success"}
                  onClick={() => updateVerificationStatus('identity', true)}
                  className={verificationStatus.identityVerified ? "opacity-50" : ""}
                  disabled={verificationStatus.identityVerified}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Verify Identity
                </Button>
                
                <Button
                  size="sm"
                  color={!verificationStatus.identityVerified ? "gray" : "error"}
                  onClick={() => updateVerificationStatus('identity', false)}
                  className={!verificationStatus.identityVerified ? "opacity-50" : ""}
                  disabled={!verificationStatus.identityVerified}
                >
                  <XCircle size={16} weight="bold" className="mr-1.5" />
                  Mark Unverified
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

// Utility functions for document status display
const getStatusColor = (status) => {
  switch(status) {
    case "VERIFIED": return "success";
    case "REJECTED": return "error";
    case "EXPIRED": return "error";
    case "MISMATCH": return "error";
    case "SUSPICIOUS": return "error";
    case "OTHER_ISSUE": return "error";
    case "ILLEGIBLE": return "warning";
    case "WRONG_TYPE": return "warning";
    case "AWAITING_REPLACEMENT": return "warning";
    case "NOT_APPLICABLE": return "gray";
    case "PENDING":
    default: return "warning";
  }
};

const getStatusIcon = (status) => {
  switch(status) {
    case "VERIFIED": 
      return <CheckCircle size={14} weight="fill" />;
    case "REJECTED":
    case "EXPIRED":
    case "MISMATCH":
    case "SUSPICIOUS":
    case "OTHER_ISSUE":
      return <XCircle size={14} weight="fill" />;
    case "PENDING":
    case "ILLEGIBLE":
    case "WRONG_TYPE":
    case "AWAITING_REPLACEMENT":
    default:
      return <Clock size={14} weight="fill" />;
  }
};

const getStatusLabel = (status) => {
  switch(status) {
    case "VERIFIED": return "Verified";
    case "REJECTED": return "Rejected";
    case "EXPIRED": return "Expired";
    case "MISMATCH": return "Mismatch";
    case "SUSPICIOUS": return "Suspicious";
    case "OTHER_ISSUE": return "Issue";
    case "ILLEGIBLE": return "Illegible";
    case "WRONG_TYPE": return "Wrong Type";
    case "AWAITING_REPLACEMENT": return "Awaiting New";
    case "NOT_APPLICABLE": return "N/A";
    case "PENDING":
    default: return "Pending";
  }
};

export default IdentityVerificationStep;