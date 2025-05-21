// src/components/features/business-owners/verification/steps/BusinessAffiliationStep/index.jsx
import React from 'react';
import { Card, Badge } from 'keep-react';
import { CheckCircle, XCircle, Clock } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import AffiliationTypeSelector from './AffiliationTypeSelector';
import NewBusinessIntent from './NewBusinessIntent';
import ClaimExistingBusiness from './ClaimExistingBusiness';
import DocumentUpload from '../../components/DocumentUpload';
import VerificationChecklist from '../../components/VerificationChecklist';
import NotesSection from '../../components/NotesSection';

const BusinessAffiliationStep = ({ 
  affiliationType,
  setAffiliationType,
  checklists,
  toggleChecklistItem,
  toggleNaChecklistItem,
  updateNaReason,
  verificationStatus,
  updateVerificationStatus,
  notes,
  updateNotes,
  newBusinessIntent,
  setNewBusinessIntent,
  businessClaim,
  setBusinessClaim,
  areAllChecked
}) => {
  // Business checklist help texts
  const helpTexts = {
    'biz1': 'Check if the owner's name appears on business registration documents as a founder, partner, or authorized representative.',
    'biz2': 'Verify that documents clearly state the percentage of ownership held by this person.',
    'biz3': 'Confirm that there is a clear, documented relationship between this person and the business being claimed or registered.'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold mb-4">Business Affiliation Verification</h3>
      
      {/* Affiliation Type Selection */}
      {!affiliationType && (
        <AffiliationTypeSelector onSelect={setAffiliationType} />
      )}
      
      <AnimatePresence mode="wait">
        {affiliationType && (
          <motion.div
            key={affiliationType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Type-specific UI */}
            {affiliationType === 'NEW_INTENT' ? (
              <NewBusinessIntent 
                data={newBusinessIntent}
                onChange={setNewBusinessIntent}
              />
            ) : (
              <ClaimExistingBusiness 
                data={businessClaim}
                onChange={setBusinessClaim}
              />
            )}
            
            {/* Document Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DocumentUpload 
                  documentType="Business Affiliation" 
                  onUploadComplete={(doc) => {
                    // Handle document upload
                    console.log('Document uploaded:', doc);
                  }}
                />
                
                {/* Additional document-related components would go here */}
              </div>
              
              <div className="space-y-4">
                {/* Verification Checklist */}
                <VerificationChecklist
                  title="Business Connection Verification"
                  items={checklists.business}
                  category="business"
                  onToggle={toggleChecklistItem}
                  onNaToggle={toggleNaChecklistItem}
                  onNaReasonChange={updateNaReason}
                  helpTexts={helpTexts}
                />
                
                {/* Notes Section */}
                <NotesSection
                  title="Business Connection Notes"
                  value={notes.business}
                  onChange={(value) => updateNotes('business', value)}
                  placeholder="Add notes about the business connection verification..."
                />
                
                {/* Status Card */}
                <Card className="bg-gray-800 border border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Business Connection Status</h4>
                      <Badge 
                        color={verificationStatus.businessConnectionVerified ? "success" : "warning"} 
                        size="sm"
                        icon={verificationStatus.businessConnectionVerified ? 
                          <CheckCircle size={14} weight="fill" /> : 
                          <Clock size={14} weight="fill" />
                        }
                      >
                        {verificationStatus.businessConnectionVerified ? "VERIFIED" : "PENDING"}
                      </Badge>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                          verificationStatus.businessConnectionVerified 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        onClick={() => updateVerificationStatus('businessConnection', true)}
                        disabled={verificationStatus.businessConnectionVerified}
                        aria-label="Verify Business Connection"
                      >
                        <CheckCircle size={16} weight="bold" className="mr-1.5" />
                        Verify Connection
                      </button>
                      
                      <button
                        className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                          !verificationStatus.businessConnectionVerified 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                        onClick={() => updateVerificationStatus('businessConnection', false)}
                        disabled={!verificationStatus.businessConnectionVerified}
                        aria-label="Mark as Unverified"
                      >
                        <XCircle size={16} weight="bold" className="mr-1.5" />
                        Mark Unverified
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Type change option */}
            <div className="flex justify-center">
              <button
                className="text-sm text-blue-400 hover:text-blue-300 underline focus:outline-none"
                onClick={() => setAffiliationType(null)}
              >
                Change Affiliation Type
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BusinessAffiliationStep;