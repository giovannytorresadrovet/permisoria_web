// src/components/features/business-owners/verification/BusinessOwnerVerificationWizard.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'keep-react';
import { X, CaretLeft, CaretRight, CheckCircle } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import useVerificationState from './hooks/useVerificationState';
import useAutoSave from './hooks/useAutoSave';
import useIdleTimeout from './hooks/useIdleTimeout';

// Components
import ProgressIndicator from './components/ProgressIndicator';
import AutoSaveIndicator from './components/AutoSaveIndicator';

// Step Components
import WelcomeStep from './StepComponents/WelcomeStep';
import IdentityVerificationStep from './StepComponents/IdentityVerificationStep';
import AddressVerificationStep from './StepComponents/AddressVerificationStep';
import BusinessAffiliationStep from './StepComponents/BusinessAffiliationStep';
import SummaryStep from './StepComponents/SummaryStep';
import CompletionStep from './StepComponents/CompletionStep';

// Constants
const TOTAL_STEPS = 6;

const BusinessOwnerVerificationWizard = ({
  isOpen,
  onClose,
  ownerId,
  ownerData,
  onVerificationComplete
}) => {
  // Initialize verification state
  const verificationState = useVerificationState(ownerId, ownerData);
  const { 
    currentStep, 
    setCurrentStep,
    getDraftData, 
    getSubmissionData
  } = verificationState;
  
  // Initialize auto-save functionality
  const { 
    lastSaved, 
    isSaving, 
    error: saveError, 
    triggerSave 
  } = useAutoSave(getDraftData, ownerId);
  
  // Initialize idle timeout (30 minutes)
  const { 
    isWarningVisible: isTimeoutWarningVisible, 
    timeLeft: timeoutTimeLeft,
    dismissWarning: dismissTimeoutWarning
  } = useIdleTimeout(30, () => {
    // Auto-save on timeout
    triggerSave();
    // Close modal
    onClose();
  });
  
  // Track if we need to show unsaved changes warning
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  
  // Auto-save on step change
  useEffect(() => {
    if (isOpen && currentStep > 0) {
      triggerSave();
    }
  }, [currentStep, isOpen]);
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle wizard close
  const handleClose = () => {
    // If we have unsaved changes, show warning
    if (lastSaved !== null && !isSaving) {
      // Proceed with normal close
      onClose();
    } else {
      // Show warning
      setShowUnsavedWarning(true);
    }
  };
  
  // Handle completion
  const completeVerification = async () => {
    // Get final submission data
    const submissionData = getSubmissionData();
    
    // Call API to complete verification
    // For now, just pass the data to the parent component
    if (onVerificationComplete) {
      onVerificationComplete(submissionData);
    }
    
    // Close the wizard
    onClose();
  };
  
  // Render the current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <WelcomeStep 
            ownerData={ownerData} 
            {...verificationState} 
          />
        );
      case 2:
        return (
          <IdentityVerificationStep 
            {...verificationState}
          />
        );
      case 3:
        return (
          <AddressVerificationStep 
            {...verificationState}
          />
        );
      case 4:
        return (
          <BusinessAffiliationStep 
            {...verificationState}
          />
        );
      case 5:
        return (
          <SummaryStep 
            {...verificationState}
          />
        );
      case 6:
        return (
          <CompletionStep 
            {...verificationState}
            onComplete={completeVerification}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <Modal
        size="5xl"
        show={isOpen}
        onClose={handleClose}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">
                Business Owner Verification: {ownerData?.firstName} {ownerData?.lastName}
              </h2>
              
              <ProgressIndicator 
                currentStep={currentStep} 
                totalSteps={TOTAL_STEPS}
                onStepClick={setCurrentStep}
              />
            </div>
            
            <Button
              size="sm"
              variant="circular"
              color="gray"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </Button>
          </div>
        </Modal.Header>
        
        <Modal.Body className="bg-gray-800 text-white p-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-4">
              <Button
                size="md"
                color="metal"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "opacity-50" : ""}
              >
                <CaretLeft size={16} weight="bold" className="mr-1.5" />
                Previous
              </Button>
              
              <AutoSaveIndicator 
                lastSaved={lastSaved}
                isSaving={isSaving}
                error={saveError}
              />
            </div>
            
            {currentStep < TOTAL_STEPS ? (
              <Button
                size="md"
                color="primary"
                onClick={nextStep}
                // Add logic to disable if current step requirements are not met
              >
                {currentStep === 1 ? 'Begin Verification' : 'Next'}
                <CaretRight size={16} weight="bold" className="ml-1.5" />
              </Button>
            ) : (
              <Button
                size="md"
                color="primary"
                onClick={completeVerification}
              >
                Complete Verification
                <CheckCircle size={16} weight="bold" className="ml-1.5" />
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
      
      {/* Idle Timeout Warning */}
      <Modal
        size="md"
        show={isTimeoutWarningVisible}
        onClose={dismissTimeoutWarning}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
          <h3 className="text-lg font-medium">Session Timeout Warning</h3>
        </Modal.Header>
        
        <Modal.Body className="bg-gray-800 text-white">
          <div className="p-4">
            <p className="mb-4">
              Your verification session has been inactive for an extended period. 
              For security reasons, you will be automatically logged out in:
            </p>
            
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-yellow-500">{timeoutTimeLeft}</span>
              <span className="text-xl"> seconds</span>
            </div>
            
            <p>
              Any unsaved progress will be auto-saved as a draft, but it's 
              recommended to continue working to avoid losing your place.
            </p>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <Button 
            size="md" 
            color="primary"
            onClick={dismissTimeoutWarning}
          >
            Continue Working
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Unsaved Changes Warning */}
      <Modal
        size="md"
        show={showUnsavedWarning}
        onClose={() => setShowUnsavedWarning(false)}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
          <h3 className="text-lg font-medium">Unsaved Changes</h3>
        </Modal.Header>
        
        <Modal.Body className="bg-gray-800 text-white">
          <div className="p-4">
            <p className="mb-4">
              You have unsaved changes. Are you sure you want to close the verification wizard?
              Your changes will be saved as a draft.
            </p>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-3">
            <Button 
              size="md" 
              color="metal"
              onClick={() => setShowUnsavedWarning(false)}
            >
              Cancel
            </Button>
            
            <Button 
              size="md" 
              color="danger"
              onClick={() => {
                triggerSave(); // Save draft
                setShowUnsavedWarning(false);
                onClose();
              }}
            >
              Save & Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BusinessOwnerVerificationWizard;