'use client';

import { motion } from 'framer-motion';
import { Card } from 'keep-react';
import StatusBadge from './StatusBadge';
import { Phone, MapPin } from 'phosphor-react';

interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  verificationStatus: string;
  createdAt?: string;
  _count?: { businesses?: number };
}

interface OwnerGridProps {
  owners: BusinessOwner[];
  onViewOwner: (id: string) => void;
}

export default function OwnerGrid({ owners, onViewOwner }: OwnerGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {owners.map((owner) => (
        <motion.div
          key={owner.id}
          variants={itemVariants}
          onClick={() => onViewOwner(owner.id)}
          className="cursor-pointer h-full"
        >
          <Card className="bg-gray-800 hover:bg-gray-750 transition-colors h-full shadow-lg border border-gray-700">
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/20 text-primary rounded-full mr-3 flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
                    {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-white">
                      {`${owner.firstName} ${owner.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {owner.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-y-2 justify-between mb-3 text-sm text-gray-400">
                  {owner.phone && (
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-primary" />
                      {owner.phone}
                    </div>
                  )}
                  
                  {(owner.city || owner.state) && (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-primary" />
                      {[owner.city, owner.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                <StatusBadge status={owner.verificationStatus} />
                
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 mr-2">Businesses:</span>
                  <span className="font-medium text-gray-300">{owner._count?.businesses || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 