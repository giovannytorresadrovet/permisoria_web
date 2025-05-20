'use client';

import { motion } from 'framer-motion';
import { Users, Plus } from 'phosphor-react';
import { Button } from 'keep-react';

interface EmptyStateProps {
  onAddNew: () => void;
}

export default function EmptyState({ onAddNew }: EmptyStateProps) {
  return (
    <motion.div 
      className="bg-surface/60 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 mb-6">
        <Users size={36} className="text-primary" weight="duotone" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">No Business Owners Found</h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Start by adding business owners to manage their permits and verification status.
      </p>
      
      <Button
        size="md"
        type="button"
        onClick={onAddNew}
        className="mx-auto"
      >
        <Plus size={20} className="mr-2" />
        Add Business Owner
      </Button>
    </motion.div>
  );
}