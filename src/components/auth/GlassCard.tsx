'use client';

import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
  animate?: boolean;
}

export default function GlassCard({ 
  children, 
  variant = 'default', 
  className = '',
  animate = false
}: GlassCardProps) {
  // Gradient variants for different card states
  const gradients: Record<string, string> = {
    default: 'from-blue-600/5 to-transparent',
    success: 'from-green-600/5 to-transparent',
    error: 'from-red-600/5 to-transparent',
    warning: 'from-amber-600/5 to-transparent',
    info: 'from-cyan-600/5 to-transparent'
  };

  // Border variants for different card states
  const borders: Record<string, string> = {
    default: 'border-[rgba(255,255,255,0.1)]',
    success: 'border-green-600/20',
    error: 'border-red-600/20',
    warning: 'border-amber-600/20',
    info: 'border-cyan-600/20'
  };

  const gradientClass = gradients[variant] || gradients.default;
  const borderClass = borders[variant] || borders.default;
  
  // Define animation variants if needed
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  return (
    <motion.div 
      className={`bg-[rgba(31,41,55,0.6)] backdrop-blur-sm border ${borderClass} rounded-xl p-8 shadow-xl relative overflow-hidden ${className}`}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
      variants={animate ? containerVariants : undefined}
    >
      {/* Inner highlight effect with variant-based gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} pointer-events-none`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
} 