// src/components/features/business-owners/verification/steps/AddressVerificationStep.jsx
import React, { useState } from 'react';
import { Card, Badge, TextInput, Button } from 'keep-react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Buildings
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Components
import DocumentViewer from '../components/DocumentViewer';
import DocumentUpload from '../components/DocumentUpload';
import VerificationChecklist from '../components/VerificationChecklist';
import NotesSection from '../components/NotesSection';
import ContextualHelp from '../components/ContextualHelp';
import DocumentStatusSelector from '../components/DocumentStatusSelector';

const AddressVerificationStep = ({
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
  // Sample address documents - in a real implementation, these would come from the backend
  const [addressDocuments, setAddressDocuments] = useState([
    {
      id: 'doc2',
      name: "Utility Bill",
      type: "Address",
      category: "Address",
      status: documentStatuses['doc2'] || "PENDING",
      thumbnailUrl: "https://via.placeholder.com/100",
      url: "https://via.placeholder.com/800x600"
    }
  ]);
  
  // Handle document upload completion
  const handleDocumentUpload = (doc) => {
    // In a real implementation, this would interact with the backend
    setAddressDocuments(prev => [...prev, {
      ...doc,
      category: "Address"
    }]);
  };
  
  // Help texts for checklist items
  const helpTexts = {
    'addr1': 'Confirm the address on the document matches exactly what is entered in the system.',
    'addr2': 'Ensure the document is recent - utility bills, bank statements, or official mail should be dated within the last 90 days.',
    'addr3': 'The name on the address documents should match the owner\'s name in our system.',
    'addr4': 'All document fields should be clear and legible, with no cut-off sections or unclear information.'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Address Verification</h3>
        <Badge 
          color={verificationStatus.addressVerified ? "success" : "warning"} 
          size="sm"
          icon={verificationStatus.addressVerified ? 
            <CheckCircle size={14} weight="fill" /> : 
            <Clock size={14} weight="fill" />
          }
        >
          {verificationStatus.addressVerified ? "VERIFIED" : "PENDING"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Address Information & Document Management */}
        <div className="space-y-4">
          {/* Address Information Card */}
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <h4 className="font-medium">Address Information</h4>
                <ContextualHelp content="Review and update the owner's address information if needed. Fields become read-only after verification." />
              </div>
              
              <div className="space-y-4">
                {/* Address fields */}
                <div>
                  <label htmlFor="addressLine1" className="block text-sm text-gray-400 mb-1">Street Address</label>
                  <TextInput
                    id="addressLine1"
                    placeholder="Street Address"
                    value={ownerFields.addressLine1 || ''}
                    onChange={(e) => updateOwnerField('addressLine1', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    disabled={verificationStatus.addressVerified}
                    addon={<MapPin size={16} color="#9CA3AF" />}
                  />
                </div>
                
                <div>
                  <label htmlFor="addressLine2" className="block text-sm text-gray-400 mb-1">Address Line 2 (Optional)</label>
                  <TextInput
                    id="addressLine2"
                    placeholder="Apartment, suite, unit, etc."
                    value={ownerFields.addressLine2 || ''}
                    onChange={(e) => updateOwnerField('addressLine2', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    disabled={verificationStatus.addressVerified}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm text-gray-400 mb-1">City</label>
                    <TextInput
                      id="city"
                      placeholder="City"
                      value={ownerFields.city || ''}
                      onChange={(e) => updateOwnerField('city', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.addressVerified}
                      addon={<Buildings size={16} color="#9CA3AF" />}
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm text-gray-400 mb-1">Zip/Postal Code</label>
                    <TextInput
                      id="zipCode"
                      placeholder="Zip/Postal Code"
                      value={ownerFields.zipCode || ''}
                      onChange={(e) => updateOwnerField('zipCode', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white w-full"
                      disabled={verificationStatus.addressVerified}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Map Preview - simplified for this example */}
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Map Location</h4>
              <div className="w-full h-48 rounded-md bg-gray-700 flex items-center justify-center">
                {/* In a real implementation, this would be a Google Map or similar */}
                <div className="text-center p-6">
                  <MapPin size={32} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    {ownerFields.addressLine1}, {ownerFields.city}, {ownerFields.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Document Upload */}
          <DocumentUpload 
            documentType="Address" 
            onUploadComplete={handleDocumentUpload}
          />
          
          {/* Document List */}
          <div className="space-y-3">
            <h4 className="font-medium text-white">Address Documents</h4>
            
            {addressDocuments.length === 0 ? (
              <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded-md">
                <p className="text-yellow-400 text-sm">
                  No Address documents found. Please upload at least one document to proceed with verification.
                </p>
              </div>
            ) : (
              addressDocuments.map(doc => (
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
            title="Address Verification Checklist"
            items={checklists.address}
            category="address"
            onToggle={toggleChecklistItem}
            onNaToggle={toggleNaChecklistItem}
            onNaReasonChange={updateNaReason}
            helpTexts={helpTexts}
          />
          
          {/* Notes Section */}
          <NotesSection
            title="Address Verification Notes"
            value={notes.address}
            onChange={(value) => updateNotes('address', value)}
            placeholder="Add notes about the address verification..."
          />
          
          {/* Verification Status */}
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Address Verification Status</h4>
                <Badge 
                  color={verificationStatus.addressVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.addressVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.addressVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  color={verificationStatus.addressVerified ? "gray" : "success"}
                  onClick={() => updateVerificationStatus('address', true)}
                  className={verificationStatus.addressVerified ? "opacity-50" : ""}
                  disabled={verificationStatus.addressVerified}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Verify Address
                </Button>
                
                <Button
                  size="sm"
                  color={!verificationStatus.addressVerified ? "gray" : "error"}
                  onClick={() => updateVerificationStatus('address', false)}
                  className={!verificationStatus.addressVerified ? "opacity-50" : ""}
                  disabled={!verificationStatus.addressVerified}
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

// Utility functions for document status display (same as in IdentityVerificationStep)
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

export default AddressVerificationStep;