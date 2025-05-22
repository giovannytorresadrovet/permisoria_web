'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from 'keep-react';
import { motion } from 'framer-motion';
import { 
  Buildings, 
  MagnifyingGlass, 
  Plus, 
  CaretRight,
  CheckCircle,
  Warning,
  Clock,
  X,
  User
} from 'phosphor-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Components
import ErrorMessage from '@/components/auth/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Input } from '@/components/common/Input';

// Status configuration
const statusConfig = {
  VERIFIED: { 
    color: 'success', 
    icon: <CheckCircle size={16} weight="fill" />,
    text: 'Verified'
  },
  UNVERIFIED: { 
    color: 'gray', 
    icon: null,
    text: 'Unverified'
  },
  PENDING_VERIFICATION: { 
    color: 'warning', 
    icon: <Clock size={16} weight="fill" />,
    text: 'Pending'
  },
  REJECTED: { 
    color: 'error', 
    icon: <X size={16} weight="fill" />,
    text: 'Rejected'
  },
};

// Component for business card
const BusinessCard = ({ business, ownerRole, isOwnerPrimaryContact, ownershipPercentage, onClick }) => {
  return (
    <Card 
      className="card-glass hover:bg-surface/80 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-text-primary">{business.legalName}</h3>
            {business.dba && (
              <p className="text-sm text-text-secondary">dba: {business.dba}</p>
            )}
          </div>
          <Badge
            size="sm"
            colorType="light"
            color={statusConfig[business.verificationStatus]?.color || 'gray'}
          >
            <span className="flex items-center">
              {statusConfig[business.verificationStatus]?.icon}
              <span className="ml-1">{statusConfig[business.verificationStatus]?.text || business.verificationStatus}</span>
            </span>
          </Badge>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-white">{ownerRole || 'Owner'}</span>
            {ownershipPercentage && (
              <span className="ml-2">({ownershipPercentage}% ownership)</span>
            )}
          </p>
          {isOwnerPrimaryContact && (
            <p className="text-xs text-green-400 mt-1">
              <CheckCircle size={12} className="inline mr-1" weight="fill" />
              Primary Contact
            </p>
          )}
        </div>
        
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Type: <span className="text-white">{business.type || 'Business'}</span>
          </div>
          <div className="text-primary text-xs font-medium flex items-center">
            View Details
            <CaretRight size={12} className="ml-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component for searching existing businesses
const LinkBusinessModal = ({ isOpen, onClose, ownerId, onBusinessLinked }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ownerRole, setOwnerRole] = useState('Owner');
  const [ownershipPercentage, setOwnershipPercentage] = useState('');
  const [isPrimaryContact, setIsPrimaryContact] = useState(false);
  
  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch(`/api/businesses/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search businesses');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching businesses:', err);
      setError(err.message || 'Failed to search businesses');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle business selection
  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBusiness) {
      setError('Please select a business');
      return;
    }
    
    if (!ownerRole.trim()) {
      setError('Please enter a role for the owner');
      return;
    }
    
    if (ownershipPercentage && (isNaN(parseFloat(ownershipPercentage)) || parseFloat(ownershipPercentage) <= 0 || parseFloat(ownershipPercentage) > 100)) {
      setError('Ownership percentage must be between 0.01 and 100');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/business-owners/${ownerId}/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: selectedBusiness.id,
          role: ownerRole,
          ownershipPercentage: ownershipPercentage ? parseFloat(ownershipPercentage) : null,
          isPrimaryContact,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to link business to owner');
      }
      
      // Notify parent of successful link
      onBusinessLinked();
      
      // Reset form
      setSearchTerm('');
      setSearchResults([]);
      setSelectedBusiness(null);
      setOwnerRole('Owner');
      setOwnershipPercentage('');
      setIsPrimaryContact(false);
      
      // Close modal
      onClose();
    } catch (err) {
      console.error('Error linking business to owner:', err);
      setError(err.message || 'Failed to link business to owner');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      size="lg"
      show={isOpen}
      onClose={onClose}
      className="bg-surface border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden"
    >
      <Modal.Header className="border-b border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary">Link to Existing Business</h3>
      </Modal.Header>
      
      <Modal.Body className="p-6">
        {error && <ErrorMessage message={error} className="mb-4" />}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Search bar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search for Business
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, ID, or tax ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                  icon={<MagnifyingGlass size={20} className="text-gray-400" />}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSearch}
                  disabled={isSearching || !searchTerm.trim()}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            
            {/* Search results */}
            {searchResults.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Results
                </label>
                <div className="border border-gray-700 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                  {searchResults.map((business) => (
                    <div 
                      key={business.id}
                      className={`p-3 border-b border-gray-700 last:border-0 cursor-pointer transition-colors ${
                        selectedBusiness?.id === business.id ? 'bg-primary/20' : 'hover:bg-gray-700/50'
                      }`}
                      onClick={() => handleSelectBusiness(business)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-text-primary">{business.legalName}</div>
                          {business.dba && (
                            <div className="text-sm text-text-secondary">dba: {business.dba}</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Type: {business.type || 'Business'} • ID: {business.id.substring(0, 8)}...
                          </div>
                        </div>
                        <Badge
                          size="xs"
                          colorType="light"
                          color={statusConfig[business.verificationStatus]?.color || 'gray'}
                        >
                          {statusConfig[business.verificationStatus]?.text || business.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Business association details section (shown when a business is selected) */}
            {selectedBusiness && (
              <div className="p-4 bg-gray-800 rounded-md">
                <h4 className="font-medium text-text-primary mb-3">
                  Association Details for "{selectedBusiness.legalName}"
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Owner's Role in Business <span className="text-red-400">*</span>
                    </label>
                    <Input
                      placeholder="e.g., CEO, Director, Partner"
                      value={ownerRole}
                      onChange={(e) => setOwnerRole(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ownership Percentage (Optional)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 51.5"
                      min="0.01"
                      max="100"
                      step="0.01"
                      value={ownershipPercentage}
                      onChange={(e) => setOwnershipPercentage(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Note: The sum of all owners' percentages for this business should not exceed 100%.
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrimaryContact"
                      checked={isPrimaryContact}
                      onChange={(e) => setIsPrimaryContact(e.target.checked)}
                      className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isPrimaryContact" className="ml-2 text-sm text-text-primary">
                      Designate as primary contact for this business
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={onClose}
                variant="outline"
                size="md"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || !selectedBusiness}
              >
                {isSubmitting ? 'Linking...' : 'Link Business'}
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default function BusinessesTab({ ownerId, ownerName }) {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  // Fetch associated businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/business-owners/${ownerId}/businesses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch business associations');
        }
        
        const data = await response.json();
        setBusinesses(data);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(err.message || 'Failed to load associated businesses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, [ownerId]);
  
  const handleOpenLinkModal = () => {
    setIsLinkModalOpen(true);
  };
  
  const handleBusinessLinked = () => {
    // Refresh the businesses list
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(`/api/business-owners/${ownerId}/businesses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch business associations');
        }
        
        const data = await response.json();
        setBusinesses(data);
      } catch (err) {
        console.error('Error refreshing businesses:', err);
      }
    };
    
    fetchBusinesses();
  };
  
  const handleViewBusiness = (businessId) => {
    router.push(`/businesses/${businessId}`);
  };
  
  const handleCreateNewBusiness = () => {
    // Navigate to business creation page with owner pre-selected
    router.push(`/businesses/create?ownerId=${ownerId}`);
  };
  
  // Variants for motion animations
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
  
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="documentGrid" count={3} />;
  }
  
  // Empty state
  if (businesses.length === 0 && !error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Associated Businesses</h2>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              type="button"
              onClick={handleOpenLinkModal}
            >
              <Buildings size={18} className="mr-2" />
              Link Existing Business
            </Button>
            
            <Button
              size="sm"
              type="button"
              variant="primary"
              onClick={handleCreateNewBusiness}
            >
              <Plus size={18} className="mr-2" />
              Create New Business
            </Button>
          </div>
        </div>
        
        <EmptyState
          icon={<Buildings size={36} className="text-primary" weight="light" />}
          title="No Associated Businesses"
          description={`${ownerName || 'This owner'} isn't associated with any businesses yet. Link them to an existing business or create a new one.`}
          actionLabel="Link to Business"
          onAction={handleOpenLinkModal}
        />
        
        <LinkBusinessModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          ownerId={ownerId}
          onBusinessLinked={handleBusinessLinked}
        />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Associated Businesses</h2>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Associated Businesses</h2>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            type="button"
            onClick={handleOpenLinkModal}
          >
            <Buildings size={18} className="mr-2" />
            Link Existing Business
          </Button>
          
          <Button
            size="sm"
            type="button"
            variant="primary"
            onClick={handleCreateNewBusiness}
          >
            <Plus size={18} className="mr-2" />
            Create New Business
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {businesses.map((business) => (
          <motion.div key={business.id} variants={itemVariants}>
            <BusinessCard
              business={business.business}
              ownerRole={business.role}
              isOwnerPrimaryContact={business.isPrimaryContact}
              ownershipPercentage={business.ownershipPercentage}
              onClick={() => handleViewBusiness(business.business.id)}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <LinkBusinessModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        ownerId={ownerId}
        onBusinessLinked={handleBusinessLinked}
      />
    </motion.div>
  );
}