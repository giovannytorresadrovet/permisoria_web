'use client';

import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { Buildings } from 'phosphor-react';
import Link from 'next/link';

interface AuthFormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackgroundEffects?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg'; // Controls max width of the content container
}

export default function AuthFormLayout({ 
  children, 
  title, 
  subtitle, 
  showBackgroundEffects = true,
  maxWidth = 'md'
}: AuthFormLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };
  
  // Map maxWidth prop to appropriate Tailwind classes
  const maxWidthClasses = {
    sm: "max-w-sm", // ~384px
    md: "max-w-md", // ~448px
    lg: "max-w-lg"  // ~512px
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Header with logo */}
      <div className="px-4 py-6 flex justify-center md:justify-start md:px-10">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 group-hover:bg-blue-500 transition-colors duration-200">
            <Buildings size={24} color="white" />
          </div>
          <span className="text-white text-xl font-semibold">Permisoria</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <motion.div 
          className={`w-full ${maxWidthClasses[maxWidth]}`} 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Page title */}
          <motion.div className="mb-8 text-center" variants={itemVariants}>
            <h1 className="text-white text-2xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
          </motion.div>
          
          {/* Content */}
          {children}
        </motion.div>
      </div>
      
      {/* Animated background elements */}
      {showBackgroundEffects && (
        <>
          <motion.div 
            className="fixed -z-10 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"
            style={{ top: '33%', left: '-9rem' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 0.6, 
              scale: 1,
              y: [0, 8, 0],
              x: [0, -5, 0]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.5 },
              scale: { duration: 2, delay: 0.5 },
              y: { repeat: Infinity, duration: 10, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 15, ease: "easeInOut" }
            }}
          />
          <motion.div 
            className="fixed -z-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"
            style={{ bottom: '25%', right: '-12rem' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              y: [0, -10, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              opacity: { duration: 1.5, delay: 0.7 },
              scale: { duration: 2, delay: 0.7 },
              y: { repeat: Infinity, duration: 12, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 18, ease: "easeInOut" }
            }}
          />
        </>
      )}

      {/* Footer */}
      <div className="px-4 py-5 text-center text-gray-500 text-xs">
        <p>© 2025 Permisoria. All rights reserved.</p>
      </div>
    </div>
  );
} 