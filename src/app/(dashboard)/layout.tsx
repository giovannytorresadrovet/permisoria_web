'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* This is a placeholder for the navbar component that will be created later */}
      <header className="bg-surface p-4 border-b border-white/10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary">Permisoria</h1>
          {/* Navbar will go here */}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {children}
      </main>
      
      <footer className="bg-surface p-4 text-center text-text-secondary text-sm border-t border-white/10">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Permisoria. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 