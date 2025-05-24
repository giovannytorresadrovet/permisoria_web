'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Avatar } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Buildings, 
  MagnifyingGlass, 
  Plus, 
  CaretRight,
  CheckCircle,
  Warning,
  Clock,
  XCircle,
} from 'phosphor-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import StatusBadge from './StatusBadge';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

// Business type definition
interface Business {
  id: string;
  legalName: string;
  dba?: string;
  type?: string;
  verificationStatus: string;
}

// Association type definition
interface BusinessAssociation {
  businessId: string;
  business: Business;
  role: string;
  ownershipPercentage?: number;
  isPrimaryContact: boolean;
}

interface BusinessesTabProps {
  ownerId: string;
  ownerName?: string;
}

export default function BusinessesTab({ ownerId, ownerName }: BusinessesTabProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [businesses, setBusinesses] = useState<BusinessAssociation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session found, but continuing in development mode');
        }
        setAuthChecked(true);
      } catch (err) {
        console.error('Error checking auth:', err);
        // Continue anyway in development mode
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [supabase.auth]);
  
  // Fetch owner's businesses
  useEffect(() => {
    // Only fetch data if auth check is complete
    if (!authChecked) return;
    
    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/business-owners/${ownerId}/businesses`);
        // const data = await response.json();
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockBusinesses: BusinessAssociation[] = [
          {
            businessId: '1',
            business: {
              id: '1',
              legalName: 'Acme Corporation',
              dba: 'Acme Inc.',
              type: 'Corporation',
              verificationStatus: 'VERIFIED'
            },
            role: 'CEO',
            ownershipPercentage: 51,
            isPrimaryContact: true
          },
          {
            businessId: '2',
            business: {
              id: '2',
              legalName: 'Tech Solutions LLC',
              type: 'LLC',
              verificationStatus: 'PENDING_VERIFICATION'
            },
            role: 'Partner',
            ownershipPercentage: 33.3,
            isPrimaryContact: false
          },
          {
            businessId: '3',
            business: {
              id: '3',
              legalName: 'Smith Consulting',
              type: 'Sole Proprietorship',
              verificationStatus: 'UNVERIFIED'
            },
            role: 'Owner',
            ownershipPercentage: 100,
            isPrimaryContact: true
          }
        ];
        
        setBusinesses(mockBusinesses);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch business associations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, [ownerId, authChecked]);
  
  // If still checking auth, show loading
  if (!authChecked) {
    return <LoadingSkeleton type="ownerGrid" count={3} />;
  }

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter(
    association => 
      association.business.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (association.business.dba && association.business.dba.toLowerCase().includes(searchTerm.toLowerCase())) ||
      association.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenLinkModal = () => {
    setIsLinkModalOpen(true);
  };
  
  const handleBusinessLinked = () => {
    // Refresh businesses after linking
    const fetchBusinesses = async () => {
      try {
        // In a real app, this would be an API call
        // In this mock version, just add a new business to the list
        const newBusiness: BusinessAssociation = {
          businessId: '4',
          business: {
            id: '4',
            legalName: 'New Linked Business',
            type: 'Partnership',
            verificationStatus: 'UNVERIFIED'
          },
          role: 'Partner',
          ownershipPercentage: 25,
          isPrimaryContact: false
        };
        
        setBusinesses(prev => [...prev, newBusiness]);
      } catch (err: any) {
        setError(err.message || 'Failed to refresh business associations');
      }
    };
    
    fetchBusinesses();
  };
  
  const handleViewBusiness = (businessId: string) => {
    console.log(`Navigate to business detail page for ID: ${businessId}`);
    // window.location.href = `/dashboard/businesses/${businessId}`;
  };
  
  const handleCreateNewBusiness = () => {
    console.log(`Create new business for owner ID: ${ownerId}`);
    // window.location.href = `/dashboard/businesses/new?ownerId=${ownerId}`;
  };
  
  // Animation variants
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
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-white">Businesses</h2>
          <p className="text-gray-400 text-sm mt-1">
            {businesses.length === 0 
              ? 'No businesses associated yet.' 
              : `${businesses.length} business${businesses.length !== 1 ? 'es' : ''} associated with this owner.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white rounded-md py-2 pl-10 pr-3 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Action buttons */}
          <Button
            size="md"
            variant="outline"
            onClick={handleOpenLinkModal}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Buildings size={18} className="mr-2" />
            Link Business
          </Button>
          
          <Button
            size="md"
            onClick={handleCreateNewBusiness}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <Plus size={18} className="mr-2" />
            New Business
          </Button>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="bg-gray-700 h-5 w-1/3 rounded mb-2"></div>
                  <div className="bg-gray-700 h-4 w-1/4 rounded"></div>
                </div>
                <div className="bg-gray-700 h-6 w-20 rounded"></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between">
                <div className="bg-gray-700 h-4 w-1/4 rounded"></div>
                <div className="bg-gray-700 h-4 w-1/6 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <ErrorMessage message={error} type="error" />
      )}
      
      {/* Empty state */}
      {!isLoading && !error && businesses.length === 0 && (
        <EmptyState
          icon={<Buildings size={48} className="text-primary" weight="light" />}
          title="No Businesses Associated"
          description={`${ownerName || 'This business owner'} is not associated with any businesses yet. You can link an existing business or create a new one.`}
          actionLabel="Link Business"
          onAction={handleOpenLinkModal}
        />
      )}
      
      {/* Businesses grid */}
      {!isLoading && !error && filteredBusinesses.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredBusinesses.map((association) => (
              <motion.div
                key={association.businessId}
                variants={itemVariants}
                className="h-full"
              >
                <Card 
                  className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer h-full flex flex-col"
                  onClick={() => handleViewBusiness(association.business.id)}
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="font-medium text-white">{association.business.legalName}</h3>
                        {association.business.dba && (
                          <p className="text-sm text-gray-400">dba: {association.business.dba}</p>
                        )}
                      </div>
                      <StatusBadge status={association.business.verificationStatus} />
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-sm text-gray-400 mt-2">
                        <span className="font-medium text-white">{association.role}</span>
                        {association.ownershipPercentage && (
                          <span className="ml-2">({association.ownershipPercentage}% ownership)</span>
                        )}
                      </div>
                      {association.isPrimaryContact && (
                        <p className="text-xs text-green-400 mt-1 flex items-center">
                          <CheckCircle size={12} className="mr-1" weight="fill" />
                          Primary Contact
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
                      <div className="text-xs text-gray-400">
                        Type: <span className="text-white">{association.business.type || 'Business'}</span>
                      </div>
                      <div className="text-primary text-xs font-medium flex items-center">
                        View Details
                        <CaretRight size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* No search results */}
      {!isLoading && !error && businesses.length > 0 && filteredBusinesses.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlass size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No businesses found</h3>
          <p className="text-gray-400 mb-4">
            No businesses match your search criteria. Try adjusting your search term.
          </p>
          {searchTerm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
      
      {/* Link Business Modal Placeholder - Would be implemented as separate component */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-medium text-white mb-4">Link Existing Business</h3>
            <p className="text-gray-400 mb-6">
              This modal would allow searching for existing businesses and linking them to this owner.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                size="md"
                variant="outline"
                onClick={() => setIsLinkModalOpen(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                size="md"
                onClick={() => {
                  handleBusinessLinked();
                  setIsLinkModalOpen(false);
                }}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Link (Demo)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 