'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FloppyDisk, X } from 'phosphor-react';

// Hook import
import { useVerificationWizard } from '@/hooks/verification/useVerificationWizard';

// Component imports
import AutoSaveIndicator from '@/components/owners/verification-wizard/shared/AutoSaveIndicator';
import ProgressIndicator from '@/components/owners/verification-wizard/shared/ProgressIndicator';

// Step components (will create these later as separate components)
import WelcomeStep from '@/components/owners/verification-wizard/steps/WelcomeStep';
import IdentityVerificationStep from '@/components/owners/verification-wizard/steps/IdentityVerificationStep';
import AddressVerificationStep from '@/components/owners/verification-wizard/steps/AddressVerificationStep';
import BusinessAffiliationStep from '@/components/owners/verification-wizard/steps/BusinessAffiliationStep';
import SummaryStep from '@/components/owners/verification-wizard/steps/SummaryStep';
import CompletionStep from '@/components/owners/verification-wizard/steps/CompletionStep';

export default function VerificationWizardPage() {
  const router = useRouter();
  const params = useParams();
  const ownerId = params.id as string;
  
  // State for initial loading
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Initialize the verification wizard hook
  const {
    state,
    loading,
    error,
    nextStep,
    prevStep,
    goToStep,
    updateSection,
    updateDocumentVerification,
    saveVerification,
    createVerification,
    submitVerification,
    cancelVerification
  } = useVerificationWizard({
    ownerId,
    autoSave: true,
    autoSaveInterval: 30000 // 30 seconds
  });
  
  // Create a new verification attempt when the page loads
  useEffect(() => {
    async function initializeVerification() {
      try {
        // If there's no verification ID yet, create one
        if (!state.id) {
          await createVerification();
        }
      } catch (err) {
        console.error('Failed to initialize verification:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    
    if (!loading) {
      initializeVerification();
    }
  }, [loading, state.id, createVerification]);
  
  // Define steps for the progress indicator
  const steps = [
    { id: 1, title: 'Welcome', isCompleted: true, isActive: state.currentStep === 'welcome' },
    { id: 2, title: 'Identity', isCompleted: state.sections.identity.status !== 'INCOMPLETE', isActive: state.currentStep === 'identity' },
    { id: 3, title: 'Address', isCompleted: state.sections.address.status !== 'INCOMPLETE', isActive: state.currentStep === 'address' },
    { id: 4, title: 'Business', isCompleted: state.sections.businessAffiliation.status !== 'INCOMPLETE', isActive: state.currentStep === 'business_affiliation' },
    { id: 5, title: 'Summary', isCompleted: state.currentStep === 'complete', isActive: state.currentStep === 'summary' }
  ];
  
  // Handle step navigation
  const handleStepClick = (stepId: number) => {
    const stepMap = {
      1: 'welcome',
      2: 'identity',
      3: 'address',
      4: 'business_affiliation',
      5: 'summary'
    } as const;
    
    goToStep(stepMap[stepId as keyof typeof stepMap]);
  };
  
  // Map step ID to current step number
  const getCurrentStepNumber = () => {
    const stepMap = {
      'welcome': 1,
      'identity': 2,
      'address': 3,
      'business_affiliation': 4,
      'summary': 5,
      'complete': 5
    };
    return stepMap[state.currentStep] || 1;
  };
  
  // Render current step component
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} />;
      case 'identity':
        return (
          <IdentityVerificationStep
            section={state.sections.identity}
            documents={state.documents.filter(doc => doc.document.category === 'identification')}
            onUpdateSection={(status, notes) => updateSection('identity', status, notes)}
            onUpdateDocument={updateDocumentVerification}
            ownerId={ownerId}
          />
        );
      case 'address':
        return (
          <AddressVerificationStep
            section={state.sections.address}
            documents={state.documents.filter(doc => doc.document.category === 'address_proof')}
            onUpdateSection={(status, notes) => updateSection('address', status, notes)}
            onUpdateDocument={updateDocumentVerification}
            ownerId={ownerId}
          />
        );
      case 'business_affiliation':
        return (
          <BusinessAffiliationStep
            section={state.sections.businessAffiliation}
            documents={state.documents.filter(doc => doc.document.category === 'business_affiliation')}
            onUpdateSection={(status, notes) => updateSection('businessAffiliation', status, notes)}
            onUpdateDocument={updateDocumentVerification}
            ownerId={ownerId}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            sections={state.sections}
            documents={state.documents}
            onSubmit={submitVerification}
          />
        );
      case 'complete':
        return <CompletionStep ownerId={ownerId} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  // Show loading state
  if (loading || isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <div className="text-red-500 text-5xl mb-4">
          <X weight="bold" />
        </div>
        <h1 className="text-xl font-bold text-red-500 mb-2">Error</h1>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => router.push(`/owners/${ownerId}`)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Return to Owner Profile
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Owner Verification</h1>
          <p className="text-gray-400 mt-1">Complete the verification process by filling out all required information</p>
        </div>
        
        {/* Auto-save indicator */}
        <div className="flex items-center space-x-4">
          <AutoSaveIndicator
            isDirty={state.isDirty}
            isAutoSaving={state.isAutoSaving}
            lastSaved={state.lastSaved}
            saveError={error}
          />
          
          <button
            onClick={cancelVerification}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center"
          >
            <X size={16} className="mr-1" />
            Cancel
          </button>
          
          <button
            onClick={saveVerification}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors flex items-center"
          >
            <FloppyDisk size={16} className="mr-1" />
            Save
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <ProgressIndicator
        steps={steps}
        currentStep={getCurrentStepNumber()}
        onStepClick={handleStepClick}
      />
      
      {/* Current step */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        {renderCurrentStep()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={state.currentStep === 'welcome' || state.currentStep === 'complete'}
          className={`px-4 py-2 rounded flex items-center transition-colors ${
            state.currentStep === 'welcome' || state.currentStep === 'complete'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <ArrowLeft size={20} className="mr-2" />
          Previous
        </button>
        
        <button
          onClick={state.currentStep === 'summary' ? submitVerification : nextStep}
          disabled={state.currentStep === 'complete'}
          className={`px-4 py-2 rounded flex items-center transition-colors ${
            state.currentStep === 'complete'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : state.currentStep === 'summary'
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {state.currentStep === 'summary' ? 'Submit' : 'Next'}
          {state.currentStep !== 'summary' && <ArrowRight size={20} className="ml-2" />}
        </button>
      </div>
    </div>
  );
} 