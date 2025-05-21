'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'phosphor-react';
import Link from 'next/link';
import useVerificationState from '@/hooks/verification/useVerificationState';
import useAutoSave from '@/hooks/verification/useAutoSave';
import useIdleTimeout from '@/hooks/verification/useIdleTimeout';
import { Button } from 'keep-react';
import ProgressIndicator from '@/components/owners/verification-wizard/shared/ProgressIndicator';
import AutoSaveIndicator from '@/components/owners/verification-wizard/shared/AutoSaveIndicator';
import WelcomeStep from '@/components/owners/verification-wizard/steps/WelcomeStep';
import IdentityVerificationStep from '@/components/owners/verification-wizard/steps/IdentityVerificationStep';
import AddressVerificationStep from '@/components/owners/verification-wizard/steps/AddressVerificationStep';
import BusinessAffiliationStep from '@/components/owners/verification-wizard/steps/BusinessAffiliationStep';
import SummaryStep from '@/components/owners/verification-wizard/steps/SummaryStep';
import CompletionStep from '@/components/owners/verification-wizard/steps/CompletionStep';

// Mock save function - in a real app this would connect to your API
const saveVerificationData = async (ownerId: string, data: any) => {
  console.log('Saving verification data for owner', ownerId, data);
  // Simulate API call
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), 800);
  });
};

// Define steps for the wizard
const wizardSteps = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Identity' },
  { id: 3, title: 'Address' },
  { id: 4, title: 'Business' },
  { id: 5, title: 'Summary' },
  { id: 6, title: 'Completion' }
];

export default function VerificationWizardPage() {
  const { id } = useParams() as { id: string };
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  // Initialize verification state with owner ID
  const verification = useVerificationState(id);
  
  // Set up auto-save
  const autoSave = useAutoSave(
    verification.state,
    id,
    saveVerificationData
  );
  
  // Handle idle timeout (redirect to dashboard after 30 min of inactivity)
  const idleTimeout = useIdleTimeout(30, () => {
    // This would redirect to dashboard in a real app
    console.log('User inactive for too long');
    setShowTimeoutWarning(true);
  });
  
  // Get current steps with completion status
  const stepsWithStatus = wizardSteps.map(step => ({
    ...step,
    isCompleted: step.id < currentStep,
    isActive: step.id === currentStep
  }));
  
  // Handle going to next step
  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      // Trigger auto-save when moving to next step
      autoSave.triggerSave();
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top for new step
    }
  };
  
  // Handle going to previous step
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0); // Scroll to top for new step
    }
  };
  
  // Handle clicking on a completed step to navigate back
  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo(0, 0); // Scroll to top for new step
    }
  };
  
  // Render the appropriate step component based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return (
          <IdentityVerificationStep 
            verification={verification} 
            onNext={handleNext} 
            onPrev={handlePrev} 
          />
        );
      case 3:
        return (
          <AddressVerificationStep 
            verification={verification} 
            onNext={handleNext} 
            onPrev={handlePrev} 
          />
        );
      case 4:
        return (
          <BusinessAffiliationStep 
            verification={verification} 
            onNext={handleNext} 
            onPrev={handlePrev} 
          />
        );
      case 5:
        return (
          <SummaryStep 
            verification={verification} 
            onNext={handleNext} 
            onPrev={handlePrev}
            onSubmit={() => {
              // Submit verification data
              autoSave.triggerSave();
              handleNext();
            }}
          />
        );
      case 6:
        return <CompletionStep ownerId={id} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6 flex justify-between items-center">
        <Link href={`/owners/${id}`} className="flex items-center text-gray-400 hover:text-blue-400 transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Owner Details</span>
        </Link>
        
        {/* AutoSave indicator */}
        <AutoSaveIndicator 
          lastSaved={autoSave.lastSaved} 
          isSaving={autoSave.isSaving} 
          error={autoSave.error} 
          onManualSave={autoSave.triggerSave}
        />
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Business Owner Verification</h1>
        <p className="text-gray-400 mb-6">
          Complete the verification process for this business owner
        </p>
        
        {/* Progress indicator */}
        <ProgressIndicator 
          steps={stepsWithStatus} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
        />
        
        {/* Step content */}
        <div className="mt-8">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Inactivity warning dialog */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Session Timeout Warning</h2>
            <p className="text-gray-300 mb-6">
              Your session has been inactive for an extended period. Would you like to continue working or return to the dashboard?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowTimeoutWarning(false)}
              >
                Continue Working
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 