// src/components/features/business-owners/verification/steps/SummaryStep.jsx
import React from 'react';
import { Card, Textarea, Button } from 'keep-react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  IdentificationCard, 
  MapPin, 
  Buildings, 
  WarningCircle 
} from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

const SummaryStep = ({
  verificationStatus,
  notes,
  checklists,
  finalDecision,
  setFinalDecision,
  updateNotes,
  affiliationType,
  newBusinessIntent,
  businessClaim
}) => {
  const allVerified = 
    verificationStatus.identityVerified && 
    verificationStatus.addressVerified && 
    verificationStatus.businessConnectionVerified;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Verification Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
              <div className="flex items-center">
                <IdentificationCard size={20} className="text-gray-400 mr-3" />
                <span>Identity Verification</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {checklists.identity.filter(item => item.checked || item.na).length}/{checklists.identity.length} Items
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  verificationStatus.identityVerified
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {verificationStatus.identityVerified
                    ? <CheckCircle size={12} weight="fill" className="mr-1" />
                    : <Clock size={12} weight="fill" className="mr-1" />
                  }
                  {verificationStatus.identityVerified ? "VERIFIED" : "PENDING"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
              <div className="flex items-center">
                <MapPin size={20} className="text-gray-400 mr-3" />
                <span>Address Verification</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {checklists.address.filter(item => item.checked || item.na).length}/{checklists.address.length} Items
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  verificationStatus.addressVerified
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {verificationStatus.addressVerified
                    ? <CheckCircle size={12} weight="fill" className="mr-1" />
                    : <Clock size={12} weight="fill" className="mr-1" />
                  }
                  {verificationStatus.addressVerified ? "VERIFIED" : "PENDING"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
              <div className="flex items-center">
                <Buildings size={20} className="text-gray-400 mr-3" />
                <span>Business Connection</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {checklists.business.filter(item => item.checked || item.na).length}/{checklists.business.length} Items
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  verificationStatus.businessConnectionVerified
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {verificationStatus.businessConnectionVerified
                    ? <CheckCircle size={12} weight="fill" className="mr-1" />
                    : <Clock size={12} weight="fill" className="mr-1" />
                  }
                  {verificationStatus.businessConnectionVerified ? "VERIFIED" : "PENDING"}
                </span>
              </div>
            </div>
            
            {/* Business Affiliation Summary Card */}
            <Card className="bg-gray-750 border border-gray-700">
              <div className="p-4">
                <h4 className="font-medium mb-3">Business Affiliation Type</h4>
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                    {affiliationType === 'NEW_INTENT' ? 'New Business Intent' : 'Existing Business Claim'}
                  </span>
                </div>
                
                {affiliationType === 'NEW_INTENT' ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Intended Business Name</p>
                      <p className="font-medium">{newBusinessIntent.legalName || 'Not specified'}</p>
                    </div>
                    {newBusinessIntent.dba && (
                      <div>
                        <p className="text-xs text-gray-400">DBA (Doing Business As)</p>
                        <p>{newBusinessIntent.dba}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400">Business Type</p>
                      <p>{newBusinessIntent.businessType || 'Not specified'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Selected Business</p>
                      <p className="font-medium">
                        {businessClaim.selectedBusiness?.name || 'No business selected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ownership Percentage</p>
                      <p>{businessClaim.ownershipPercentage || 'Not specified'}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Role in Business</p>
                      <p>{businessClaim.roleInBusiness || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Verification Decision</h3>
          
          <div className="space-y-4">
            {allVerified ? (
              <div className="bg-green-900/30 p-4 border border-green-700 rounded-md">
                <div className="flex items-start">
                  <CheckCircle size={24} className="text-green-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-green-400">All Verification Steps Complete</h4>
                    <p className="text-green-300 text-sm mt-1">
                      All required verification steps have been completed successfully. 
                      You can now approve this business owner.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/30 p-4 border border-yellow-700 rounded-md">
                <div className="flex items-start">
                  <WarningCircle size={24} className="text-yellow-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-yellow-400">Incomplete Verification</h4>
                    <p className="text-yellow-300 text-sm mt-1">
                      Some verification steps are still pending. You can 
                      request additional information, or reject the verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Decision buttons */}
            <div className="pt-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  color="success"
                  onClick={() => setFinalDecision({ 
                    status: "VERIFIED", 
                    rejectionReason: "",
                    additionalInfoRequested: ""
                  })}
                  className={`ring-2 ${finalDecision.status === "VERIFIED" ? 'ring-green-500' : 'ring-transparent'}`}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Approve Owner
                </Button>
                
                <Button
                  size="sm"
                  color="warning"
                  onClick={() => setFinalDecision({ 
                    status: "NEEDS_INFO", 
                    rejectionReason: "",
                    additionalInfoRequested: ""
                  })}
                  className={`ring-2 ${finalDecision.status === "NEEDS_INFO" ? 'ring-yellow-500' : 'ring-transparent'}`}
                >
                  <Clock size={16} weight="bold" className="mr-1.5" />
                  Request More Info
                </Button>
                
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => setFinalDecision({ 
                    status: "REJECTED", 
                    rejectionReason: "",
                    additionalInfoRequested: ""
                  })}
                  className={`ring-2 ${finalDecision.status === "REJECTED" ? 'ring-red-500' : 'ring-transparent'}`}
                >
                  <XCircle size={16} weight="bold" className="mr-1.5" />
                  Reject Verification
                </Button>
              </div>
            </div>
            
            {/* Conditional fields based on decision */}
            <AnimatePresence>
              {finalDecision.status === "REJECTED" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <label className="block font-medium mb-2 text-white">Rejection Reason</label>
                  <Textarea
                    value={finalDecision.rejectionReason}
                    onChange={(e) => setFinalDecision(prev => ({ 
                      ...prev, 
                      rejectionReason: e.target.value 
                    }))}
                    placeholder="Please provide a reason for rejection..."
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    rows={4}
                    required
                  />
                  <p className="mt-1 text-xs text-yellow-400">
                    Guidance: Avoid entering full sensitive PII (e.g., SSN, bank details). 
                    Describe issues or needs generally.
                  </p>
                </motion.div>
              )}
              
              {finalDecision.status === "NEEDS_INFO" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <label className="block font-medium mb-2 text-white">Additional Information Needed</label>
                  <Textarea
                    value={finalDecision.additionalInfoRequested}
                    onChange={(e) => setFinalDecision(prev => ({ 
                      ...prev, 
                      additionalInfoRequested: e.target.value 
                    }))}
                    placeholder="Please specify what additional information is needed..."
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    rows={4}
                    required
                  />
                  <p className="mt-1 text-xs text-yellow-400">
                    Guidance: Avoid entering full sensitive PII (e.g., SSN, bank details). 
                    Describe issues or needs generally.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-3">Final Notes</h3>
          <Textarea
            value={notes.general}
            onChange={(e) => updateNotes('general', e.target.value)}
            placeholder="Add any final notes about this verification process..."
            className="bg-gray-700 border-gray-600 text-white w-full"
            rows={4}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default SummaryStep;