'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  error: string | null;
}

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export default function useAutoSave<T>(
  data: T, 
  ownerId: string,
  saveFunction: (ownerId: string, data: T) => Promise<void>
) {
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    error: null
  });
  
  const lastDataRef = useRef<T>(data);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to save data
  const saveData = useCallback(async () => {
    if (!ownerId) return;
    
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      await saveFunction(ownerId, data);
      setState({
        lastSaved: new Date(),
        isSaving: false,
        error: null
      });
      lastDataRef.current = data;
    } catch (err) {
      console.error('Error saving verification data:', err);
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to save'
      }));
    }
  }, [ownerId, data, saveFunction]);
  
  // Set up auto-save functionality
  useEffect(() => {
    const hasDataChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
    
    if (hasDataChanged) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        saveData();
      }, AUTOSAVE_INTERVAL);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveData]);
  
  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      const hasDataChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
      if (hasDataChanged) {
        saveData();
      }
    };
  }, [data, saveData]);
  
  // Function to manually trigger a save
  const triggerSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    saveData();
  }, [saveData]);
  
  return {
    ...state,
    triggerSave
  };
} 