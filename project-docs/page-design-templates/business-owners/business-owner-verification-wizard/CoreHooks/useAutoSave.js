// src/components/features/business-owners/verification/hooks/useAutoSave.js
import { useState, useEffect, useRef } from 'react';

export default function useAutoSave(draftDataFn, ownerId) {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeoutRef = useRef(null);
  
  // Mock API call - replace with actual API call
  const saveDraft = async (data) => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Replace with actual API call to save draft
      // const response = await fetch('/api/business-owners/verification/draft', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Mock successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error saving draft:', err);
      setError('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Trigger save when navigating between steps
  const triggerSave = () => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Get current draft data
    const draftData = draftDataFn();
    
    // Save immediately
    saveDraft(draftData);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    lastSaved,
    isSaving,
    error,
    triggerSave
  };
}