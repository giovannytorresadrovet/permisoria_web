"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import MobileSidebar from './MobileSidebar';
import DesktopSidebar from './DesktopSidebar';
import DesktopHeader from './DesktopHeader';
import NotificationPanel from './NotificationPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when switching between mobile and desktop
  useEffect(() => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [isMobile]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);
  
  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100">
      {/* Mobile layout */}
      {isMobile && (
        <>
          <MobileHeader 
            onMenuToggle={toggleMenu}
            onNotificationsToggle={toggleNotifications} 
          />
          
          <AnimatePresence>
            {isMenuOpen && (
              <MobileSidebar onClose={() => setIsMenuOpen(false)} />
            )}
          </AnimatePresence>
          
          <div className="flex flex-col w-full pb-16 pt-16">
            <main className="flex-1 overflow-y-auto px-4 py-6">
              {children}
            </main>
          </div>
          
          <MobileNavigation />
        </>
      )}
      
      {/* Desktop layout */}
      {!isMobile && (
        <>
          <DesktopSidebar />
          
          <div className="flex flex-col flex-1">
            <DesktopHeader onNotificationsToggle={toggleNotifications} />
            
            <main className="flex-1 overflow-y-auto px-8 py-6">
              {children}
            </main>
          </div>
        </>
      )}
      
      {/* Shared components */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
