// src/components/features/business-owners/verification/steps/CompletionStep.jsx
import React from 'react';
import { Button, Card } from 'keep-react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DownloadSimple,
  ArrowRight,
  House
} from 'phosphor-react';
import { motion } from 'framer-motion';

const CompletionStep = ({
  finalDecision,
  affiliationType,
  businessClaim,
  onComplete
}) => {
  // Generate a mock unique verification ID
  const verificationId = `VID-${Date.now().toString().slice(-8)}`;
  // Generate a mock certificate ID
  const certificateId = `CERT-${Date.now().toString().slice(-8)}`;
  
  const renderStatusIcon = () => {
    switch(finalDecision.status) {
      case "VERIFIED":
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 text-green-500 mb-4">
            <CheckCircle size={36} weight="fill" />
          </div>
        );
      case "REJECTED":
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 text-red-500 mb-4">
            <XCircle size={36} weight="fill" />
          </div>
        );
      case "NEEDS_INFO":
      default:
        return (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/30 text-yellow-500 mb-4">
            <Clock size={36} weight="fill" />
          </div>
        );
    }
  };
  
  const renderStatusTitle = () => {
    switch(finalDecision.status) {
      case "VERIFIED":
        return <h2 className="text-2xl font-bold text-green-400 mb-2">Verification Approved</h2>;
      case "REJECTED":
        return <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Rejected</h2>;
      case "NEEDS_INFO":
      default:
        return <h2 className="text-2xl font-bold text-yellow-400 mb-2">Additional Information Requested</h2>;
    }
  };
  
  const renderStatusMessage = () => {
    switch(finalDecision.status) {
      case "VERIFIED":
        return (
          <p className="text-gray-300 mb-6">
            This business owner has been successfully verified and is now eligible to be associated 
            with businesses and apply for permits.
            {finalDecision.status === "VERIFIED" && affiliationType === 'EXISTING_CLAIM' && businessClaim?.selectedBusiness && (
              <span className="block mt-2">
                Their claimed affiliation with '{businessClaim.selectedBusiness.legalName}' is now 
                'Pending External Confirmation' by the existing verified owner(s) of that business. 
                You and the business owner will be notified of their decision.
              </span>
            )}
          </p>
        );
      case "REJECTED":
        return (
          <p className="text-gray-300 mb-6">
            This business owner's verification has been rejected. They will need to provide corrected 
            or additional information before reapplying.
          </p>
        );
      case "NEEDS_INFO":
      default:
        return (
          <p className="text-gray-300 mb-6">
            Additional information has been requested from this business owner. Verification will 
            remain in pending status until this is provided.
          </p>
        );
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center py-6">
        {renderStatusIcon()}
        {renderStatusTitle()}
        {renderStatusMessage()}
      </div>
      
      {finalDecision.status === "VERIFIED" && (
        <Card className="bg-gray-800 border border-green-700">
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4">Verification Certificate</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Certificate ID:</p>
                <p className="font-medium">{certificateId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Verification Attempt ID:</p>
                <p className="font-medium">{verificationId}</p>
              </div>
            </div>
            
            <Button
              size="md"
              color="success"
              className="w-full"
            >
              <DownloadSimple size={18} className="mr-2" />
              Download Verification Certificate
            </Button>
          </div>
        </Card>
      )}
      
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          
          <div className="space-y-3">
            {finalDecision.status === "VERIFIED" && (
              <>
                <div className="flex items-start">
                  <div className="bg-green-900/30 text-green-500 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Verification Complete</h5>
                    <p className="text-gray-400 text-sm">
                      The owner's verification status has been updated to 'Verified' and all submitted 
                      information has been saved. Verification ID: {verificationId}
                    </p>
                  </div>
                </div>
                
                {affiliationType === 'NEW_INTENT' ? (
                  <div className="flex items-start">
                    <div className="bg-blue-900/30 text-blue-500 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                      <ArrowRight size={20} />
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Create Business Record</h5>
                      <p className="text-gray-400 text-sm">
                        You can now proceed to create a new Business record with this verified owner as 
                        the primary owner. Navigate to the 'Businesses' section to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <div className="bg-yellow-900/30 text-yellow-500 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Awaiting Confirmation</h5>
                      <p className="text-gray-400 text-sm">
                        The owner's claim to the selected business will need to be confirmed by existing verified 
                        owners. You will receive a notification when this process is complete.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {finalDecision.status === "REJECTED" && (
              <div className="flex items-start">
                <div className="bg-red-900/30 text-red-500 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <h5 className="font-medium mb-1">Verification Rejected</h5>
                  <p className="text-gray-400 text-sm">
                    The owner has been notified about the rejection. They will need to address the issues 
                    and submit updated documents before you can attempt verification again.
                  </p>
                </div>
              </div>
            )}
            
            {finalDecision.status === "NEEDS_INFO" && (
              <div className="flex items-start">
                <div className="bg-yellow-900/30 text-yellow-500 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h5 className="font-medium mb-1">Information Requested</h5>
                  <p className="text-gray-400 text-sm">
                    The owner has been notified about the additional information needed. You will be able to 
                    resume this verification process once they provide the requested information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col space-y-3 items-center">
        <Button
          size="lg"
          color="primary"
          onClick={onComplete}
        >
          <CheckCircle size={20} weight="bold" className="mr-2" />
          Complete Verification Process
        </Button>
        
        <Button
          size="md"
          color="metal"
          onClick={onComplete}
        >
          <House size={16} className="mr-1.5" />
          Return to Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

export default CompletionStep;