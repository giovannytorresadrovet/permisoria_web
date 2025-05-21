// src/components/features/business-owners/verification/hooks/useIdleTimeout.js
import { useState, useEffect, useRef } from 'react';

export default function useIdleTimeout(timeoutMinutes = 30, onTimeout) {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const idleTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  // Convert minutes to milliseconds
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = 60 * 1000; // 1 minute warning
  
  // Reset the timer when there's user activity
  const resetTimer = () => {
    // Clear existing timeouts
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    // Hide warning if visible
    setIsWarningVisible(false);
    
    // Set new timeouts
    warningTimeoutRef.current = setTimeout(() => {
      setIsWarningVisible(true);
      setTimeLeft(60); // 60 seconds countdown
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, timeoutMs - warningMs);
    
    // Set final timeout
    idleTimeoutRef.current = setTimeout(() => {
      if (onTimeout) onTimeout();
    }, timeoutMs);
  };
  
  // Dismiss warning and reset timer
  const dismissWarning = () => {
    setIsWarningVisible(false);
    resetTimer();
  };
  
  // Set up event listeners
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Initial timer setup
    resetTimer();
    
    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [timeoutMs, onTimeout]);
  
  return {
    isWarningVisible,
    timeLeft,
    dismissWarning
  };
}