// src/app/(dashboard)/business-owners/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Card, Avatar, Button, Pagination, Select } from 'keep-react';
import { MagnifyingGlass, Plus, ArrowsDownUp, CaretDown, CaretUp, DotsThreeOutline } from 'phosphor-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce'; // Needs to be created 
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

// Import our custom components
import AddOwnerModal from '@/components/features/business-owners/AddOwnerModal';
import LoadingSkeleton from '@/components/features/business-owners/LoadingSkeleton';
import EmptyState from '@/components/features/business-owners/EmptyState';
import ErrorState from '@/components/features/business-owners/ErrorState';
import StatusBadge from '@/components/features/business-owners/StatusBadge';
import SavedFiltersPanel, { SavedFilter, FilterCriteria } from '@/components/features/business-owners/SavedFiltersPanel';

// Define the business owner type
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verificationStatus: string;
  businessCount?: number;
  location?: string;
  createdAt?: string;
}

// Define sort by options
const sortOptions = [
  { value: 'lastName', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'verificationStatus', label: 'Verification Status' },
  { value: 'businessCount', label: 'Business Count' },
  { value: 'createdAt', label: 'Date Added' },
];

export default function BusinessOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<BusinessOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedOwnerId, setFocusedOwnerId] = useState<string | null>(null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  
  // Refs for keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Check viewport width on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Current filter criteria
  const currentFilter: FilterCriteria = {
    search: debouncedSearchQuery,
    status: statusFilter,
    sortBy,
    sortOrder
  };

  // Load saved filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFiltersString = localStorage.getItem('businessOwnersSavedFilters');
      if (savedFiltersString) {
        const parsedFilters = JSON.parse(savedFiltersString);
        if (Array.isArray(parsedFilters)) {
          setSavedFilters(parsedFilters);
        }
      }
    } catch (e) {
      console.error('Error loading saved filters:', e);
    }
  }, []);

  // Save filters to localStorage when they change
  useEffect(() => {
    if (savedFilters.length > 0) {
      localStorage.setItem('businessOwnersSavedFilters', JSON.stringify(savedFilters));
    }
  }, [savedFilters]);

  // Fetch business owners data
  const fetchOwners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct the API URL with all filter parameters
      const url = new URL('/api/business-owners', window.location.origin);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', '10'); // Default page size
      
      if (debouncedSearchQuery) {
        url.searchParams.append('search', debouncedSearchQuery);
      }
      
      if (statusFilter) {
        url.searchParams.append('status', statusFilter);
      }
      
      url.searchParams.append('sortBy', sortBy);
      url.searchParams.append('sortOrder', sortOrder);
      
      // Fetch data from the API
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update state with the fetched data
      setOwners(data.owners || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords || 0);
    } catch (err) {
      console.error('Error fetching business owners:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching business owners');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, statusFilter, sortBy, sortOrder]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // Handle sort toggle when clicking a column header
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // If already sorting by this field, toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort field, default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get sort indicator for column header
  const getSortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    
    return sortOrder === 'asc' 
      ? <CaretUp size={14} className="ml-1 inline-block" /> 
      : <CaretDown size={14} className="ml-1 inline-block" />;
  };

  // Navigate to owner detail page
  const handleViewOwner = (ownerId: string) => {
    router.push(`/business-owners/${ownerId}`);
  };
  
  // Handle adding a new owner
  const handleAddOwnerSuccess = (newOwner: BusinessOwner) => {
    // Optimistically update the list
    setOwners(prev => [newOwner, ...prev]);
    setIsAddModalOpen(false);
    
    // Then refresh from the server
    fetchOwners();
  };
  
  // Apply a saved filter
  const handleApplyFilter = (criteria: FilterCriteria) => {
    if (criteria.search !== undefined) setSearchQuery(criteria.search);
    if (criteria.status !== undefined) setStatusFilter(criteria.status);
    if (criteria.sortBy !== undefined) setSortBy(criteria.sortBy);
    if (criteria.sortOrder !== undefined) setSortOrder(criteria.sortOrder as 'asc' | 'desc');
    setCurrentPage(1); // Reset to first page
  };
  
  // Save current filter
  const handleSaveCurrentFilter = (name: string) => {
    const newFilter: SavedFilter = {
      id: uuidv4(),
      name,
      criteria: currentFilter
    };
    setSavedFilters(prev => [...prev, newFilter]);
  };
  
  // Delete a saved filter
  const handleDeleteFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedOwnerId) return;
      
      const currentIndex = owners.findIndex(owner => owner.id === focusedOwnerId);
      if (currentIndex === -1) return;
      
      switch (e.key) {
        case 'ArrowDown':
          if (currentIndex < owners.length - 1) {
            setFocusedOwnerId(owners[currentIndex + 1].id);
            // Find and focus the next row
            const nextRow = tableRef.current?.querySelectorAll('tbody tr')[currentIndex + 1];
            if (nextRow) (nextRow as HTMLElement).focus();
          }
          break;
        case 'ArrowUp':
          if (currentIndex > 0) {
            setFocusedOwnerId(owners[currentIndex - 1].id);
            // Find and focus the previous row
            const prevRow = tableRef.current?.querySelectorAll('tbody tr')[currentIndex - 1];
            if (prevRow) (prevRow as HTMLElement).focus();
          }
          break;
        case 'Enter':
          if (focusedOwnerId) handleViewOwner(focusedOwnerId);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedOwnerId, owners]);

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

  // Show loading skeleton when initially loading
  if (isLoading && owners.length === 0) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchOwners} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Business Owners</h1>
          <p className="text-text-secondary mt-1">
            {totalRecords > 0 
              ? `Showing ${((currentPage - 1) * 10) + 1}-${Math.min(currentPage * 10, totalRecords)} of ${totalRecords} owners`
              : 'No owners found'
            }
          </p>
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
            aria-label="Search business owners"
          />
        </div>
        
        {/* Status filter */}
        <div className="relative w-full sm:w-40">
          <select
            className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="PENDING_VERIFICATION">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CaretDown size={16} className="text-gray-400" />
          </div>
        </div>
        
        {/* Sort dropdown */}
        <div className="relative w-full sm:w-40">
          <select
            className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by field"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ArrowsDownUp size={16} className="text-gray-400" />
          </div>
        </div>
        
        {/* Order toggle */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Button 
            size="md"
            type="button"
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? (
              <CaretUp size={20} className="mr-2" />
            ) : (
              <CaretDown size={20} className="mr-2" />
            )}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
        
        {/* Saved filters */}
        <div className="sm:ml-auto">
          <SavedFiltersPanel
            currentFilter={currentFilter}
            savedFilters={savedFilters}
            onApplyFilter={handleApplyFilter}
            onSaveCurrentFilter={handleSaveCurrentFilter}
            onDeleteFilter={handleDeleteFilter}
          />
        </div>
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
                    className="card-glass hover:bg-surface/80 transition-colors cursor-pointer overflow-hidden"
                    onClick={() => handleViewOwner(owner.id)}
                  >
                    {/* Status indicator as top border */}
                    <div 
                      className={`h-1 w-full 
                        ${owner.verificationStatus === 'VERIFIED' ? 'bg-green-500' : 
                          owner.verificationStatus === 'PENDING_VERIFICATION' ? 'bg-yellow-500' : 
                          owner.verificationStatus === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'}`
                      }
                    />
                    
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
                          <StatusBadge status={owner.verificationStatus} size="sm" />
                        </div>
                        
                        {owner.businessCount !== undefined && (
                          <>
                            <div>
                              <span className="text-text-secondary">Businesses:</span>
                            </div>
                            <div className="text-text-primary">
                              {owner.businessCount || 0}
                            </div>
                          </>
                        )}
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
              <Table ref={tableRef}>
                <Table.Head>
                  <Table.HeadCell 
                    className="bg-gray-800 text-gray-300 cursor-pointer"
                    onClick={() => handleSort('lastName')}
                    aria-sort={sortBy === 'lastName' ? sortOrder : 'none'}
                  >
                    Name {getSortIndicator('lastName')}
                  </Table.HeadCell>
                  
                  <Table.HeadCell 
                    className="bg-gray-800 text-gray-300 cursor-pointer"
                    onClick={() => handleSort('email')}
                    aria-sort={sortBy === 'email' ? sortOrder : 'none'}
                  >
                    Email {getSortIndicator('email')}
                  </Table.HeadCell>
                  
                  <Table.HeadCell className="bg-gray-800 text-gray-300">
                    Phone
                  </Table.HeadCell>
                  
                  <Table.HeadCell 
                    className="bg-gray-800 text-gray-300 cursor-pointer"
                    onClick={() => handleSort('verificationStatus')}
                    aria-sort={sortBy === 'verificationStatus' ? sortOrder : 'none'}
                  >
                    Status {getSortIndicator('verificationStatus')}
                  </Table.HeadCell>
                  
                  <Table.HeadCell 
                    className="bg-gray-800 text-gray-300 cursor-pointer"
                    onClick={() => handleSort('businessCount')}
                    aria-sort={sortBy === 'businessCount' ? sortOrder : 'none'}
                  >
                    Businesses {getSortIndicator('businessCount')}
                  </Table.HeadCell>
                  
                  <Table.HeadCell className="bg-gray-800 text-gray-300">
                    Actions
                  </Table.HeadCell>
                </Table.Head>
                
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {owners.map((owner) => (
                    <motion.tr 
                      key={owner.id} 
                      className={`border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer 
                        ${focusedOwnerId === owner.id ? 'bg-gray-700/50 ring-2 ring-primary ring-opacity-50' : ''}`}
                      onClick={() => handleViewOwner(owner.id)}
                      variants={itemVariants}
                      tabIndex={0}
                      role="row"
                      aria-selected={focusedOwnerId === owner.id}
                      onFocus={() => setFocusedOwnerId(owner.id)}
                      onBlur={() => setFocusedOwnerId(null)}
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
                        <StatusBadge status={owner.verificationStatus} />
                      </Table.Cell>
                      <Table.Cell className="text-text-secondary">
                        {owner.businessCount !== undefined ? (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                            {owner.businessCount}
                          </span>
                        ) : 'N/A'}
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
                          aria-label="More actions"
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
        onSuccess={handleAddOwnerSuccess}
      />
    </div>
  );
}