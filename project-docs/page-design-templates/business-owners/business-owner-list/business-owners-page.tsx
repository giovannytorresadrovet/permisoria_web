'use client';

import { useState, useEffect } from 'react';
import { Table, Card, Avatar, Badge, Button, Pagination } from 'keep-react';
import { MagnifyingGlass, Plus, DotsThreeOutline } from 'phosphor-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AddOwnerModal from '@/components/features/business-owners/AddOwnerModal';
import LoadingSkeleton from '@/components/features/business-owners/LoadingSkeleton';
import EmptyState from '@/components/features/business-owners/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { cn } from '@/lib/utils';

// Badge variants for different statuses
const statusVariants = {
  VERIFIED: 'success',
  UNVERIFIED: 'gray',
  PENDING_VERIFICATION: 'warning',
  REJECTED: 'error'
};

export default function BusinessOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch business owners data
  useEffect(() => {
    const fetchOwners = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // API call to fetch owners with pagination
        const response = await fetch(`/api/business-owners?page=${currentPage}&search=${searchQuery}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch business owners');
        }
        
        const data = await response.json();
        
        setOwners(data.owners || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching business owners:', err);
        setError(err.message || 'An error occurred while fetching business owners');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwners();
  }, [currentPage, searchQuery]);

  // Handle refresh after adding new owner
  const handleRefreshList = async () => {
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/business-owners?page=1&search=${searchQuery}`);
      
      if (!response.ok) {
        throw new Error('Failed to refresh business owners list');
      }
      
      const data = await response.json();
      
      setOwners(data.owners || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'An error occurred while refreshing the list');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to owner detail page
  const handleViewOwner = (ownerId) => {
    router.push(`/business-owners/${ownerId}`);
  };

  // Animation variants for list items
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

  if (isLoading && owners.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRefreshList} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Business Owners</h1>
          <p className="text-text-secondary mt-1">Manage business owner profiles and verification</p>
        </div>
        
        <Button
          size="md"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Business Owner
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search owners..."
            className="bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Additional filters could be added here */}
      </div>
      
      {/* Mobile view - Cards */}
      {isMobile && (
        <>
          {owners.length === 0 ? (
            <EmptyState onAddNew={() => setIsAddModalOpen(true)} />
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {owners.map((owner) => (
                <motion.div key={owner.id} variants={itemVariants}>
                  <Card 
                    className="card-glass hover:bg-surface/80 transition-colors cursor-pointer"
                    onClick={() => handleViewOwner(owner.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <Avatar 
                          shape="circle" 
                          size="md" 
                          className="bg-primary/20 text-primary"
                        >
                          {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-text-primary">{`${owner.firstName} ${owner.lastName}`}</h3>
                          <p className="text-sm text-text-secondary">{owner.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div>
                          <span className="text-text-secondary">Phone:</span>
                        </div>
                        <div className="text-text-primary">{owner.phone || 'N/A'}</div>
                        
                        <div>
                          <span className="text-text-secondary">Status:</span>
                        </div>
                        <div>
                          <Badge 
                            colorType="light" 
                            color={statusVariants[owner.verificationStatus] || 'gray'}
                            className="capitalize"
                          >
                            {owner.verificationStatus?.toLowerCase().replace('_', ' ') || 'Unverified'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
      
      {/* Desktop view - Table */}
      {!isMobile && (
        <>
          {owners.length === 0 ? (
            <EmptyState onAddNew={() => setIsAddModalOpen(true)} />
          ) : (
            <Card className="overflow-hidden border border-white/10 bg-surface/60 backdrop-blur-sm">
              <Table>
                <Table.Head>
                  <Table.HeadCell className="bg-gray-800 text-gray-300">Name</Table.HeadCell>
                  <Table.HeadCell className="bg-gray-800 text-gray-300">Email</Table.HeadCell>
                  <Table.HeadCell className="bg-gray-800 text-gray-300">Phone</Table.HeadCell>
                  <Table.HeadCell className="bg-gray-800 text-gray-300">Status</Table.HeadCell>
                  <Table.HeadCell className="bg-gray-800 text-gray-300">Actions</Table.HeadCell>
                </Table.Head>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {owners.map((owner) => (
                    <motion.tr 
                      key={owner.id} 
                      className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => handleViewOwner(owner.id)}
                      variants={itemVariants}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-text-primary">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            shape="circle" 
                            size="sm" 
                            className="bg-primary/20 text-primary"
                          >
                            {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                          </Avatar>
                          {`${owner.firstName} ${owner.lastName}`}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary">{owner.email}</Table.Cell>
                      <Table.Cell className="text-text-secondary">{owner.phone || 'N/A'}</Table.Cell>
                      <Table.Cell>
                        <Badge 
                          colorType="light" 
                          color={statusVariants[owner.verificationStatus] || 'gray'}
                          className="capitalize"
                        >
                          {owner.verificationStatus?.toLowerCase().replace('_', ' ') || 'Unverified'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Button 
                          type="button" 
                          size="xs"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // You could implement a dropdown menu for more actions here
                          }}
                        >
                          <DotsThreeOutline size={16} />
                        </Button>
                      </Table.Cell>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </Table>
            </Card>
          )}
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            showControls
            className="bg-surface/60 backdrop-blur-sm border border-white/10 rounded-lg"
          />
        </div>
      )}
      
      {/* Add Business Owner Modal */}
      <AddOwnerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRefreshList}
      />
    </div>
  );
}