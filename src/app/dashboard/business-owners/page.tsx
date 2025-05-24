'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Plus, FunnelSimple as Filter, ArrowsDownUp, GridFour, Rows, Users } from 'phosphor-react';
import { useDebounce } from '@/hooks/useDebounce';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuthStore } from '@/stores/authStore';

// Components
import StatusBadge from '@/components/features/business-owners/StatusBadge';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import SavedFiltersPanel from '@/components/features/business-owners/SavedFiltersPanel';
import OwnerGrid from '@/components/features/business-owners/OwnerGrid';
import OwnerTable from '@/components/features/business-owners/OwnerTable';
import AddOwnerModal from '@/components/features/business-owners/AddOwnerModal';

// Types 
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

export default function BusinessOwnersPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [owners, setOwners] = useState<BusinessOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOwners, setTotalOwners] = useState(0);

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Redirect to login if not authenticated
          router.push('/auth/login');
          return;
        }
        setAuthChecked(true);
      } catch (err) {
        console.error('Error checking auth:', err);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  // Mock fetch owners API call
  useEffect(() => {
    // Only fetch data if authentication is confirmed
    if (!authChecked) return;
    
    const fetchOwners = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would be an API call
        const mockOwners: BusinessOwner[] = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            city: 'New York',
            state: 'NY',
            verificationStatus: 'VERIFIED',
            createdAt: new Date(2023, 3, 15).toISOString(),
            _count: { businesses: 3 }
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '(555) 987-6543',
            city: 'San Francisco',
            state: 'CA',
            verificationStatus: 'PENDING_VERIFICATION',
            createdAt: new Date(2023, 5, 22).toISOString(),
            _count: { businesses: 1 }
          },
          {
            id: '3',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.johnson@example.com',
            city: 'Chicago',
            state: 'IL',
            verificationStatus: 'UNVERIFIED',
            createdAt: new Date(2023, 6, 10).toISOString(),
            _count: { businesses: 0 }
          },
          {
            id: '4',
            firstName: 'Maria',
            lastName: 'Garcia',
            email: 'maria.garcia@example.com',
            phone: '(555) 456-7890',
            city: 'Miami',
            state: 'FL',
            verificationStatus: 'REJECTED',
            createdAt: new Date(2023, 7, 5).toISOString(),
            _count: { businesses: 2 }
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@example.com',
            phone: '(555) 234-5678',
            city: 'Seattle',
            state: 'WA',
            verificationStatus: 'NEEDS_INFO',
            createdAt: new Date(2023, 8, 18).toISOString(),
            _count: { businesses: 1 }
          }
        ];
        
        // Filter by status if needed
        let filteredOwners = [...mockOwners];
        if (statusFilter) {
          filteredOwners = filteredOwners.filter(owner => 
            owner.verificationStatus === statusFilter
          );
        }
        
        // Filter by search query
        if (debouncedSearchQuery) {
          const query = debouncedSearchQuery.toLowerCase();
          filteredOwners = filteredOwners.filter(owner => 
            owner.firstName.toLowerCase().includes(query) ||
            owner.lastName.toLowerCase().includes(query) ||
            owner.email.toLowerCase().includes(query) ||
            (owner.phone && owner.phone.toLowerCase().includes(query))
          );
        }
        
        // Sort if needed
        if (sortBy) {
          filteredOwners.sort((a, b) => {
            let aValue: any = a[sortBy as keyof BusinessOwner];
            let bValue: any = b[sortBy as keyof BusinessOwner];
            
            // Handle nested properties
            if (sortBy === 'name') {
              aValue = `${a.lastName} ${a.firstName}`;
              bValue = `${b.lastName} ${b.firstName}`;
            }
            
            if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
            if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1;
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortOrder === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
            }
            
            return sortOrder === 'asc' 
              ? (aValue > bValue ? 1 : -1) 
              : (aValue < bValue ? 1 : -1);
          });
        }
        
        // Calculate pagination
        const totalItems = filteredOwners.length;
        const totalPagesCount = Math.ceil(totalItems / limit);
        const paginatedOwners = filteredOwners.slice(
          (currentPage - 1) * limit, 
          currentPage * limit
        );
        
        setOwners(paginatedOwners);
        setTotalOwners(totalItems);
        setTotalPages(totalPagesCount);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch business owners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, [currentPage, limit, debouncedSearchQuery, statusFilter, sortBy, sortOrder, authChecked]);

  // If authentication check is still in progress, show loading
  if (!authChecked) {
    return <LoadingSkeleton type="ownerGrid" count={limit} />;
  }

  const handleViewOwner = (ownerId: string) => {
    router.push(`/dashboard/business-owners/${ownerId}`);
  };

  const handleOwnerAdded = (newOwner: BusinessOwner) => {
    setOwners(prev => [newOwner, ...prev]);
    setTotalOwners(prev => prev + 1);
  };
  
  const handleApplyFilter = (filter: { search: string; status: string }) => {
    setSearchQuery(filter.search);
    setStatusFilter(filter.status);
    setCurrentPage(1);
    setIsFiltersOpen(false);
  };

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-white">
          Business Owners {!isLoading && totalOwners > 0 && (
            <span className="text-sm font-normal text-gray-400">
              (Showing {owners.length} of {totalOwners})
            </span>
          )}
        </h1>
        
        <Button
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <Plus size={18} className="mr-2" />
          Add Business Owner
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 text-white rounded-md py-2 pl-10 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-gray-700 text-white rounded-md py-2 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="REJECTED">Rejected</option>
            <option value="NEEDS_INFO">Needs Information</option>
          </select>
          
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-md py-2 px-3 flex items-center transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View toggle buttons */}
          <div className="bg-gray-700 rounded-md p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
              aria-label="Grid view"
            >
              <GridFour size={18} />
            </button>
            
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
              aria-label="Table view"
            >
              <Rows size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <label htmlFor="perPage">Show:</label>
            <select
              id="perPage"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-gray-700 text-white rounded py-1 px-2 border-0 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Saved filters panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 rounded-lg shadow-xl"
          >
            <SavedFiltersPanel
              onApplyFilter={handleApplyFilter}
              currentFilter={{ search: searchQuery, status: statusFilter }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && <ErrorMessage message={error} />}
      
      {/* Loading state */}
      {isLoading && <LoadingSkeleton type={viewMode === 'grid' ? 'ownerGrid' : 'ownerTable'} count={limit} />}
      
      {/* Empty state */}
      {!isLoading && !error && owners.length === 0 && (
        <EmptyState
          icon={<Users size={48} className="text-primary" weight="light" />}
          title="No Business Owners Found"
          description={
            searchQuery || statusFilter ? 
              "No owners match your current search criteria. Try adjusting your filters or search terms." : 
              "Get started by adding your first business owner to manage their permits and verification status."
          }
          actionLabel="Add First Business Owner"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}
      
      {/* Business owners grid/table */}
      {!isLoading && !error && owners.length > 0 && (
        viewMode === 'grid' ? (
          <OwnerGrid 
            owners={owners} 
            onViewOwner={handleViewOwner} 
          />
        ) : (
          <OwnerTable
            owners={owners}
            onViewOwner={handleViewOwner}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )
      )}
      
      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm">
          <div className="text-gray-400 mb-2 sm:mb-0">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalOwners)} of {totalOwners} owners
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1 items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .reduce((acc, page, index, array) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    if (acc.length > 0 && acc[acc.length - 1]?.page && page > (acc[acc.length - 1]?.page || 0) + 1) {
                      acc.push({ type: 'ellipsis', key: `ellipsis-start-${page}` });
                    }
                    acc.push({ type: 'page', page, key: page });
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                     if (acc.length > 0 && acc[acc.length - 1]?.page && page > (acc[acc.length -1]?.page || 0) + 1 && acc[acc.length -1]?.type !== 'ellipsis') {
                         acc.push({ type: 'ellipsis', key: `ellipsis-cond-${page}` });
                     }
                  }
                  return acc;
                }, [] as Array<{ type: 'page' | 'ellipsis'; page?: number; key: string | number }>)
                .map((item) =>
                  item.type === 'ellipsis' ? (
                    <span key={item.key} className="flex items-center justify-center w-8 h-8 text-gray-400">...</span>
                  ) : (
                    <button
                      key={item.key}
                      onClick={() => setCurrentPage(item.page!)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                        currentPage === item.page
                          ? 'bg-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {item.page}
                    </button>
                  )
                )}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Business Owner Modal will be implemented later */}
      <AddOwnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleOwnerAdded}
      />
    </div>
  );
} 