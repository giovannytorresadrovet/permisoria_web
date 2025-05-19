'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* This is a placeholder for the navbar component that will be created later */}
      <header className="bg-surface p-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">Permisoria</h1>
        {/* Navbar will go here */}
      </header>
      
      <div className="flex-grow">
        {children}
      </div>
      
      <footer className="bg-surface p-4 text-center text-text-secondary text-sm border-t border-white/10">
        &copy; {new Date().getFullYear()} Permisoria. All rights reserved.
      </footer>
    </div>
  );
} 