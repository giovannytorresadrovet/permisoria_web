'use client';

import { Badge } from 'keep-react';
import { CheckCircle, Warning, Clock, XCircle, Info } from 'phosphor-react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  size?: 'xs'| 'sm' | 'md';
  animate?: boolean;
  className?: string;
}

// Status configuration
const statusConfig: Record<string, { color: 'error' | 'success' | 'warning' | 'primary' | 'secondary' | undefined; icon?: JSX.Element; text: string }> = {
  VERIFIED: { 
    color: 'success', 
    icon: <CheckCircle size={14} weight="fill" className="mr-1" />,
    text: 'Verified'
  },
  UNVERIFIED: { 
    color: undefined, 
    icon: undefined,
    text: 'Unverified'
  },
  PENDING_VERIFICATION: { 
    color: 'warning', 
    icon: <Clock size={14} weight="fill" className="mr-1" />,
    text: 'Pending'
  },
  REJECTED: { 
    color: 'error', 
    icon: <XCircle size={14} weight="fill" className="mr-1" />,
    text: 'Rejected'
  },
  NEEDS_INFO: { 
    color: 'primary',
    icon: <Info size={14} weight="fill" className="mr-1" />,
    text: 'Needs Info'
  },
  // Default fallback
  DEFAULT: {
    color: undefined,
    icon: undefined,
    text: 'Unknown'
  }
};

export default function StatusBadge({ 
  status, 
  size = 'sm',
  animate = false,
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.DEFAULT;
  
  const badgeContent = (
    <span className="flex items-center">
      {config.icon}
      {config.text}
    </span>
  );
  
  const badgeProps = {
    size: size,
    colorType: "light" as "light",
    color: config.color,
    className: `capitalize ${className}`
  };

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        <Badge {...badgeProps}>
          {badgeContent}
        </Badge>
      </motion.div>
    );
  }
  
  return (
    <Badge {...badgeProps}>
      {badgeContent}
    </Badge>
  );
} 