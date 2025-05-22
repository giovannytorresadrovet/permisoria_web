import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types for verification wizard
type VerificationStep = 
  | 'welcome'
  | 'identity' 
  | 'address' 
  | 'business_affiliation'
  | 'summary'
  | 'complete';

type VerificationStatus = 
  | 'INCOMPLETE'
  | 'COMPLETE'
  | 'VERIFIED'
  | 'REJECTED'
  | 'NEEDS_INFO';

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

interface VerificationState {
  id: string;
  ownerId: string;
  currentStep: VerificationStep;
  sections: {
    identity: VerificationSection;
    address: VerificationSection;
    businessAffiliation: VerificationSection;
  };
  documents: DocumentVerification[];
  isDirty: boolean;
  lastSaved?: Date;
  isAutoSaving: boolean;
}

interface VerificationWizardProps {
  ownerId: string;
  initialVerificationId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

/**
 * Hook to manage the verification wizard state and API interactions
 */
export function useVerificationWizard({
  ownerId,
  initialVerificationId,
  autoSave = true,
  autoSaveInterval = 30000
}: VerificationWizardProps) {
  const router = useRouter();
  
  // State for the verification process
  const [state, setState] = useState<VerificationState>({
    id: initialVerificationId || '',
    ownerId,
    currentStep: 'welcome',
    sections: {
      identity: { status: 'INCOMPLETE' },
      address: { status: 'INCOMPLETE' },
      businessAffiliation: { status: 'INCOMPLETE' }
    },
    documents: [],
    isDirty: false,
    isAutoSaving: false
  });
  
  // State for error handling
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load verification data if initialVerificationId is provided
  useEffect(() => {
    async function loadVerification() {
      if (!initialVerificationId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(
          `/api/business-owners/${ownerId}/verification?includeDocuments=true`,
          { method: 'GET' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to load verification data');
        }
        
        const data = await response.json();
        
        if (data.currentAttempt) {
          setState(prev => ({
            ...prev,
            id: data.currentAttempt.id,
            sections: data.currentAttempt.sections || prev.sections,
            documents: data.currentAttempt.documentVerifications || [],
            isDirty: false
          }));
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading verification:', err);
        setError(err.message || 'Failed to load verification data');
      } finally {
        setLoading(false);
      }
    }
    
    loadVerification();
  }, [initialVerificationId, ownerId]);
  
  // Save verification data
  const saveVerification = useCallback(async () => {
    if (!state.isDirty) return;
    
    try {
      setState(prev => ({ ...prev, isAutoSaving: true }));
      
      const payload = {
        isDraft: true,
        draftData: {
          currentStep: state.currentStep,
          sections: state.sections
        }
      };
      
      const url = `/api/business-owners/${ownerId}/verification`;
      const method = state.id ? 'POST' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save verification data');
      }
      
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        id: data.id || prev.id,
        isDirty: false,
        lastSaved: new Date(),
        isAutoSaving: false
      }));
      
      setError(null);
    } catch (err: any) {
      console.error('Error saving verification:', err);
      setError(err.message || 'Failed to save verification data');
      setState(prev => ({ ...prev, isAutoSaving: false }));
    }
  }, [ownerId, state.id, state.isDirty, state.currentStep, state.sections]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !state.isDirty || state.id === '') return;
    
    const timer = setTimeout(() => {
      saveVerification();
    }, autoSaveInterval);
    
    return () => clearTimeout(timer);
  }, [state.isDirty, autoSave, autoSaveInterval, state.id, saveVerification]);
  
  // Create a new verification attempt
  const createVerification = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/business-owners/${ownerId}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDraft: false })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create verification attempt');
      }
      
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        id: data.id,
        sections: data.sections || prev.sections,
        isDirty: false
      }));
      
      setError(null);
      return data.id;
    } catch (err: any) {
      console.error('Error creating verification:', err);
      setError(err.message || 'Failed to create verification attempt');
      return null;
    } finally {
      setLoading(false);
    }
  }, [ownerId]);
  
  // Move to next step
  const nextStep = useCallback(() => {
    setState(prev => {
      const steps: VerificationStep[] = ['welcome', 'identity', 'address', 'business_affiliation', 'summary', 'complete'];
      const currentIndex = steps.indexOf(prev.currentStep);
      const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
      
      return {
        ...prev,
        currentStep: steps[nextIndex],
        isDirty: true
      };
    });
  }, []);
  
  // Move to previous step
  const prevStep = useCallback(() => {
    setState(prev => {
      const steps: VerificationStep[] = ['welcome', 'identity', 'address', 'business_affiliation', 'summary', 'complete'];
      const currentIndex = steps.indexOf(prev.currentStep);
      const prevIndex = Math.max(currentIndex - 1, 0);
      
      return {
        ...prev,
        currentStep: steps[prevIndex],
        isDirty: true
      };
    });
  }, []);
  
  // Go to specific step
  const goToStep = useCallback((step: VerificationStep) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      isDirty: true
    }));
  }, []);
  
  // Update section status
  const updateSection = useCallback((
    section: keyof VerificationState['sections'],
    status: SectionStatus,
    notes?: string
  ) => {
    setState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          status,
          notes: notes || prev.sections[section].notes,
          lastUpdated: new Date()
        }
      },
      isDirty: true
    }));
  }, []);
  
  // Update document verification status
  const updateDocumentVerification = useCallback(async (
    documentId: string,
    status: DocumentVerification['status'],
    notes?: string
  ) => {
    try {
      if (!state.id) {
        throw new Error('No active verification attempt');
      }
      
      const response = await fetch(`/api/business-owners/${ownerId}/verification/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: state.id,
          documentId,
          status,
          notes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update document verification');
      }
      
      const data = await response.json();
      
      // Update local state with the updated document verification
      setState(prev => ({
        ...prev,
        documents: prev.documents.map(doc => 
          doc.documentId === documentId
            ? {
                ...doc,
                status,
                notes: notes || doc.notes
              }
            : doc
        )
      }));
      
      setError(null);
      return true;
    } catch (err: any) {
      console.error('Error updating document verification:', err);
      setError(err.message || 'Failed to update document verification');
      return false;
    }
  }, [ownerId, state.id]);
  
  // Submit verification for review
  const submitVerification = useCallback(async () => {
    try {
      if (!state.id) {
        throw new Error('No active verification attempt');
      }
      
      // Save any pending changes first
      await saveVerification();
      
      // Navigate to submission confirmation page
      router.push(`/owners/${ownerId}/verify/complete`);
      return true;
    } catch (err: any) {
      console.error('Error submitting verification:', err);
      setError(err.message || 'Failed to submit verification');
      return false;
    }
  }, [ownerId, state.id, saveVerification, router]);
  
  // Cancel verification and discard changes
  const cancelVerification = useCallback(() => {
    router.push(`/owners/${ownerId}`);
  }, [ownerId, router]);
  
  return {
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
  };
}

export default useVerificationWizard; 