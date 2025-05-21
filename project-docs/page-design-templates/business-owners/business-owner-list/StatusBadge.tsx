// src/components/features/business-owners/StatusBadge.tsx
'use client';

import React from 'react';
import { Badge } from 'keep-react';
import { 
  CheckCircle, 
  Warning, 
  Clock, 
  X,
  Question
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Define all possible verification statuses
export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED' | string;

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
  animate?: boolean;
  className?: string;
}

export default function StatusBadge({ 
  status, 
  size = 'md', 
  animate = false,
  className = '' 
}: StatusBadgeProps) {
  // Status configuration with color, icon, and label mapping
  const statusConfig: Record<string, { 
    color: string, 
    icon: React.ReactNode,
    label: string
  }> = {
    VERIFIED: { 
      color: 'success', 
      icon: <CheckCircle size={size === 'sm' ? 12 : 16} weight="fill" className="mr-1" />,
      label: 'Verified'
    },
    UNVERIFIED: { 
      color: 'gray', 
      icon: <Warning size={size === 'sm' ? 12 : 16} weight="fill" className="mr-1" />,
      label: 'Unverified'
    },
    PENDING_VERIFICATION: { 
      color: 'warning', 
      icon: <Clock size={size === 'sm' ? 12 : 16} weight="fill" className="mr-1" />,
      label: 'Pending Verification'
    },
    REJECTED: { 
      color: 'error', 
      icon: <X size={size === 'sm' ? 12 : 16} weight="fill" className="mr-1" />,
      label: 'Rejected'
    }
  };
  
  // Default to a question mark if status is unknown
  const config = statusConfig[status] || {
    color: 'gray',
    icon: <Question size={size === 'sm' ? 12 : 16} weight="fill" className="mr-1" />,
    label: status ? status.toLowerCase().replace(/_/g, ' ') : 'Unknown'
  };

  // Format the label with proper capitalization
  const formattedLabel = config.label.charAt(0).toUpperCase() + config.label.slice(1);
  
  // Create base badge component
  const badgeContent = (
    <Badge 
      size={size}
      colorType="light" 
      color={config.color as any}
      className={`inline-flex items-center capitalize ${className}`}
    >
      {config.icon}
      {formattedLabel}
    </Badge>
  );
  
  // If animation is enabled, wrap in motion.div
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {badgeContent}
      </motion.div>
    );
  }
  
  return badgeContent;
}