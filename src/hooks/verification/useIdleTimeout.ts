'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_TIMEOUT_MINUTES = 30;
const WARNING_BEFORE_TIMEOUT_MS = 60000; // 1 minute warning before timeout

interface IdleTimeoutState {
  isIdle: boolean;
  showWarning: boolean;
  remainingSeconds: number;
}

export default function useIdleTimeout(
  timeoutMinutes: number = DEFAULT_TIMEOUT_MINUTES,
  onTimeout: () => void
) {
  const [state, setState] = useState<IdleTimeoutState>({
    isIdle: false,
    showWarning: false,
    remainingSeconds: 0
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  // Reset the timer when user is active
  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    // Reset state if we were showing a warning
    if (state.showWarning) {
      setState({
        isIdle: false,
        showWarning: false,
        remainingSeconds: 0
      });
    }
    
    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setState({
        isIdle: false,
        showWarning: true,
        remainingSeconds: Math.floor(WARNING_BEFORE_TIMEOUT_MS / 1000)
      });
      
      // Start countdown interval
      countdownIntervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.remainingSeconds <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return prev;
          }
          
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1
          };
        });
      }, 1000);
      
    }, timeoutMs - WARNING_BEFORE_TIMEOUT_MS);
    
    // Set final timeout
    timeoutRef.current = setTimeout(() => {
      setState({
        isIdle: true,
        showWarning: false,
        remainingSeconds: 0
      });
      onTimeout();
    }, timeoutMs);
  }, [timeoutMs, onTimeout, state.showWarning]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Start the initial timer
    resetTimer();
    
    // Add event listeners to reset the timer on user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [resetTimer]);
  
  // Function to dismiss the warning
  const dismissWarning = useCallback(() => {
    resetTimer();
  }, [resetTimer]);
  
  return {
    ...state,
    dismissWarning
  };
} 