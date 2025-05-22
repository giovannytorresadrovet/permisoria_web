# Sprint 3.1: Business Owner Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Business Owners. This includes creating a responsive list page to display owners, an enhanced "Add Owner" modal for initial creation, and a comprehensive detail page with tabs for viewing/editing owner profiles and managing their documents (including uploads). This sprint will consume the APIs built in Sprint 3.0 and lay the foundation for the Verification Wizard in Sprint 3.2.

**Key Documents Referenced:**
* `sprint_3.0.md` (API Endpoints)
* `ui_ux_design_specifications.md` (relevant sections for Business Owner module)
* `frontend_guidelines_document.md`

---

## Task 1: Business Owner List Page UI & Functionality
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending]
* **Ref:** `ui_ux_design_specifications.md` (Owner List Page), `sprint_3.0.md` (GET /api/business-owners)

### Subtask 1.1: Create Enhanced Business Owner List Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/page.tsx` (Client Component: 'use client';)
* **Action:** Implement the main page component for listing Business Owners, incorporating header, search, filters, view toggle (grid/table), pagination, and modal trigger.
* **Purpose:** To provide a comprehensive and interactive user interface for viewing, searching, and managing a list of business owners.
* **AI Action:** Generate the `BusinessOwnersPage` component structure with state management for search, filters, pagination, view mode, and modal visibility. Include placeholders for API calls and rendering of sub-components.
* **Guidance for AI/Developer:** Utilize `keep-react` components and `framer-motion` for animations. Ensure the layout is responsive (mobile-first). Implement ARIA attributes and keyboard navigation for accessibility.
* **Validation Command:** Run `npm run dev`, navigate to the `/business-owners` page. Check for console errors. Inspect UI elements for responsiveness and basic interactivity (state changes).
* **Expected Output:** The Business Owners list page renders with all UI controls (search, filters, toggles, pagination). "Add Owner" button is present. Basic states (loading, empty, error) are handled visually.
* **Outcome:** [Pending]
* **Ref:** `ui_ux_design_specifications.md` (Owner List Page Layout), `keep-react` documentation

**Implementation Details:**

Implement a comprehensive, responsive page structure with:
```tsx
'use client';

import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useRouter } from 'next/navigation';
// import { Card, Avatar, Badge, Button } from 'keep-react'; // Card, Avatar, Badge directly used in sub-components
import { Button } from 'keep-react'; // Keep Button
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Plus, Filter, ArrowsDownUp, GridFour, Rows, Users } from 'phosphor-react'; // Added GridFour, Rows, Users
import { useDebounce } from '@/hooks/useDebounce'; // Corrected path if necessary

// Components
import StatusBadge from '@/components/features/business-owners/StatusBadge';
import ErrorMessage from '@/components/common/ErrorMessage'; // Assuming ErrorMessage is a common component
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import AddOwnerModal from '@/components/features/business-owners/AddOwnerModal';
import SavedFiltersPanel from '@/components/features/business-owners/SavedFiltersPanel';
import OwnerGrid from '@/components/features/business-owners/OwnerGrid'; // Added
import OwnerTable from '@/components/features/business-owners/OwnerTable'; // Added
import React from 'react'; // Added for React.Fragment

// Types (assuming a type definition file exists)
// import { BusinessOwner } from '@/types/business-owner';

export default function BusinessOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<any[]>([]); // Replace 'any' with BusinessOwner type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // Default view mode
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default items per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalOwners, setTotalOwners] = useState(0);

  const [sortBy, setSortBy] = useState<string | null>(null); // For table sort
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // For table sort

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch owners API call
  useEffect(() => {
    const fetchOwners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          search: debouncedSearchQuery,
          status: statusFilter,
        });
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const response = await fetch(`/api/business-owners?${params.toString()}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to fetch business owners');
        }
        const data = await response.json();
        setOwners(data.owners);
        setTotalOwners(data.totalOwners);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwners();
  }, [currentPage, limit, debouncedSearchQuery, statusFilter, sortBy, sortOrder]);

  const handleViewOwner = (ownerId: string) => {
    router.push(`/business-owners/${ownerId}`);
  };

  const handleOwnerAdded = (newOwner: any) => { // Replace 'any' with BusinessOwner type
    // Optimistic update or refetch
    setOwners(prev => [newOwner, ...prev]); // Simple optimistic update
    setTotalOwners(prev => prev + 1);
    // Or trigger a refetch:
    // setCurrentPage(1); // To go to first page if new item should be there
    // Note: A full refetch might be better for consistency if sorting/filtering is active
  };
  
  const handleApplyFilter = (filter: { search: string; status: string }) => {
    setSearchQuery(filter.search);
    setStatusFilter(filter.status);
    setCurrentPage(1); // Reset to first page when filters change
    setIsFiltersOpen(false);
  };

  const handleSaveCurrentFilter = () => {
    // Logic to interact with SavedFiltersPanel to save, perhaps via a toast message
    console.log("Current filter saved signal received.");
  };

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-900 min-h-screen text-white"> {/* Basic theming */}
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
          className="bg-primary hover:bg-primary-dark text-white" // Example class
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
            className="bg-gray-800 rounded-lg shadow-xl" // Added panel styling
          >
            <SavedFiltersPanel
              onApplyFilter={handleApplyFilter}
              onSaveCurrentFilter={handleSaveCurrentFilter}
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
          icon={<Users size={48} className="text-primary" weight="light" />} // Increased icon size
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
              variant="outline" // Assuming keep-react has variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-300 border-gray-600 hover:bg-gray-700" // Example class
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex gap-1 items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .reduce((acc, page, index, array) => {
                  // Logic for ellipsis (simplified for brevity, consider a more robust pagination component/hook)
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    if (acc.length > 0 && page > acc[acc.length - 1].page + 1) {
                      acc.push({ type: 'ellipsis', key: `ellipsis-start-${page}` });
                    }
                    acc.push({ type: 'page', page, key: page });
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                     if (acc.length > 0 && page > acc[acc.length - 1].page + 1 && acc[acc.length -1].type !== 'ellipsis') {
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
              className="text-gray-300 border-gray-600 hover:bg-gray-700" // Example class
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Business Owner Modal */}
      <AddOwnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleOwnerAdded}
      />
    </div>
  );
}
Create a mobile-first design with separate card and table views based on viewport size
Use framer-motion animations for smooth transitions and micro-interactions
Implement all required states (loading, empty, error, populated)
Add proper ARIA attributes and keyboard navigation for accessibility

Subtask 1.2: Fetch and Display Business Owners with Enhanced Visualization
Status: [Pending]
Progress: 0%
Action: Develop OwnerGrid and OwnerTable components to display fetched business owner data, including visual elements like avatars and status badges.
Purpose: To present business owner information in a clear, visually appealing, and responsive manner, catering to different user preferences for data consumption (grid vs. table).
AI Action: Generate the OwnerGrid.tsx and OwnerTable.tsx components. OwnerGrid should use Card components for each owner. OwnerTable should structure data in a sortable table. Both should integrate StatusBadge and Avatar.
Guidance for AI/Developer: Implement framer-motion for item animations in the grid. Table columns should be sortable, with visual indicators for the active sort key and order. Ensure both components are responsive.
Validation Command: View the /business-owners page with mock data passed to OwnerGrid and OwnerTable. Verify responsiveness, animations (grid), and sort functionality (table).
Expected Output: Business owners are displayed correctly in both grid and table views. Grid items have animations. Table columns are sortable. Statuses are visually distinct.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Owner Card, Owner Table Layout), StatusBadge.tsx
Implementation Details:

Create separate grid and table components for displaying business owners:

TypeScript

// ./src/components/features/business-owners/OwnerGrid.tsx (Example)
import { motion } from 'framer-motion';
import { Card, Avatar } from 'keep-react';
import StatusBadge from './StatusBadge';
import { Phone, MapPin } from 'phosphor-react'; // Assuming these icons are used

// Define OwnerType or import it
interface OwnerType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  verificationStatus: string;
  _count?: { businesses?: number }; // Assuming _count is optional
}

interface OwnerGridProps {
  owners: OwnerType[];
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" // Added xl
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {owners.map((owner) => (
        <motion.div
          key={owner.id}
          variants={itemVariants}
          onClick={() => onViewOwner(owner.id)}
          className="cursor-pointer h-full" // Ensure motion.div takes full height for card
        >
          <Card className="card-glass hover:bg-gray-700/60 transition-colors h-full shadow-lg border border-gray-700"> {/* Theming and h-full */}
            <div className="p-4 flex flex-col justify-between h-full"> {/* Flex column for layout */}
              <div>
                <div className="flex items-center mb-4">
                  <Avatar
                    shape="circle"
                    size="md"
                    className="bg-primary/20 text-primary mr-3"
                  >
                    {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-text-primary text-white"> {/* Theming */}
                      {`${owner.firstName} ${owner.lastName}`}
                    </h3>
                    <p className="text-sm text-text-secondary text-gray-400"> {/* Theming */}
                      {owner.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-y-2 justify-between mb-3 text-sm text-gray-400"> {/* Theming */}
                  {owner.phone && (
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-primary" /> {/* Theming */}
                      {owner.phone}
                    </div>
                  )}
                  
                  {(owner.city || owner.state) && (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-primary" /> {/* Theming */}
                      {[owner.city, owner.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center"> {/* Theming */}
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

// ./src/components/features/business-owners/OwnerTable.tsx (Example)
import { Avatar } from 'keep-react'; // Already imported if merged
// import StatusBadge from './StatusBadge'; // Already imported if merged
import { ArrowsDownUp } from 'phosphor-react'; // For sort icons, or use custom like ↑ ↓

// Define OwnerType or import it (same as above)
// Define SortByType and SortOrderType if not globally defined
type SortByType = string | null;
type SortOrderType = 'asc' | 'desc';

interface OwnerTableProps {
  owners: OwnerType[];
  onViewOwner: (id: string) => void;
  onSort: (columnKey: string) => void;
  sortBy: SortByType;
  sortOrder: SortOrderType;
}

// Helper for sort icon
const SortIcon = ({ active, order }: { active: boolean; order: SortOrderType }) => {
  if (!active) return <ArrowsDownUp size={14} className="ml-1 text-gray-500" />;
  return order === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
};

export default function OwnerTable({ owners, onViewOwner, onSort, sortBy, sortOrder }: OwnerTableProps) {
  const tableHeaders = [
    { key: 'lastName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'verificationStatus', label: 'Status' },
    { key: 'createdAt', label: 'Added', alignRight: true },
  ];

  return (
    <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg"> {/* Theming and overflow-x-auto */}
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800"> {/* Theming */}
          <tr>
            {tableHeaders.map(header => (
              <th 
                key={header.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${header.alignRight ? 'text-right' : ''}`}
              >
                <button 
                  className="flex items-center focus:outline-none hover:text-gray-200 w-full"  // Added w-full for right align
                  onClick={() => onSort(header.key)}
                  style={{ justifyContent: header.alignRight ? 'flex-end' : 'flex-start' }} // Ensure text and icon align correctly
                >
                  {header.label}
                  <SortIcon active={sortBy === header.key} order={sortOrder} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-750 divide-y divide-gray-700"> {/* Theming */}
          {owners.map((owner) => (
            <tr 
              key={owner.id}
              className="hover:bg-gray-700 cursor-pointer transition-colors" // Theming
              onClick={() => onViewOwner(owner.id)}
              tabIndex={0} // For accessibility
              onKeyPress={(e) => e.key === 'Enter' && onViewOwner(owner.id)} // For accessibility
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar
                    shape="circle"
                    size="sm" // Consistent size
                    className="bg-primary/20 text-primary mr-3"
                  >
                    {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">
                      {`${owner.firstName} ${owner.lastName}`}
                    </div>
                    {(owner.city || owner.state) && (
                      <div className="text-xs text-gray-400">
                        {[owner.city, owner.state].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{owner.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{owner.phone || '—'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={owner.verificationStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="text-gray-400">
                  {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : '—'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
Implement API data fetching with loading, error, and success states
Add debounced search functionality to prevent excessive API calls
Create responsive layouts for different screen sizes
Implement status badges with contextual colors and icons
Add sortable columns with visual indicators

Subtask 1.3: Implement "Add Business Owner" Modal Trigger
Status: [Pending]
Progress: 0%
Action: Integrate and trigger the AddOwnerModal component from the Business Owner list page.
Purpose: To allow users to open the modal for creating a new business owner.
AI Action: In BusinessOwnersPage.tsx, implement the state and handler to control the visibility of AddOwnerModal. Ensure the "Add Business Owner" button correctly toggles this state.
Guidance for AI/Developer: Pass necessary props to AddOwnerModal (e.g., isOpen, onClose, onSuccess). The onSuccess callback should handle updating the list page optimistically or by re-fetching data. Ensure proper focus management when the modal opens and closes.
Validation Command: Click the "Add Business Owner" button on the list page. Verify the modal opens. Close the modal and verify it disappears.
Expected Output: "Add Business Owner" modal opens and closes correctly. Focus is managed appropriately for accessibility.
Outcome: [Pending]
Ref: AddOwnerModal.tsx
Implementation Details:

Add "Add Business Owner" button in the header section that triggers the modal
Set visibility state with useState(false) and toggle with click handler
Update page state optimistically after successful creation
Implement proper focus management for accessibility

Subtask 1.4: Enhanced Pagination with Server-Side Integration
Status: [Pending]
Progress: 0%
Action: Implement client-side pagination controls that interact with server-side pagination provided by the API.
Purpose: To allow users to navigate through large sets of business owner data efficiently.
AI Action: In BusinessOwnersPage.tsx, manage state for currentPage, limit, totalPages, and totalOwners. Implement handlers for page changes that refetch data from the API with new pagination parameters.
Guidance for AI/Developer: Display "Showing X-Y of Z" information. Implement a page selector that handles a large number of pages gracefully (e.g., showing first, last, current, and adjacent pages with ellipses).
Validation Command: Navigate through pages using pagination controls. Verify the correct subset of data is displayed and the "Showing X-Y of Z" indicator is accurate. Test with different "items per page" settings.
Expected Output: Pagination controls allow navigation. Data updates according to the selected page and limit. Page information is displayed correctly.
Outcome: [Pending]
Ref: sprint_3.0.md (API Pagination Details), keep-react Pagination component (if used)
Implementation Details:

Integrate keep-react Pagination component with API-based pagination
Add state variables for pagination:

TypeScript

const [currentPage, setCurrentPage] = useState(1);
const [limit, setLimit] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [totalOwners, setTotalOwners] = useState(0);
Create handlers for page changes that update API request parameters
Display "Showing X-Y of Z" indication for better context
Add optimized page selector for larger datasets that shows current page, neighbors, first and last

Subtask 1.5: Implement Enhanced Status Badge Component
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/StatusBadge.tsx
Action: Create a reusable StatusBadge component to visually represent different verification statuses.
Purpose: To provide clear, at-a-glance information about a business owner's verification status using consistent styling.
AI Action: Generate the StatusBadge.tsx component. It should accept a status prop and map it to specific colors, icons (from phosphor-react), and text.
Guidance for AI/Developer: Use keep-react's Badge component as a base. Implement different sizes and an optional animation prop for status changes. Ensure all documented verification statuses are covered.
Validation Command: Render the StatusBadge component with all possible status props. Verify correct color, icon, and text for each status. Test different sizes and animation.
Expected Output: StatusBadge component displays distinct visual cues for each verification status, supports different sizes, and can animate on change.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Status Indicators)
Implementation Details:

Create a reusable status badge component with contextual icons:

TypeScript

'use client';

import { Badge } from 'keep-react';
import { CheckCircle, Warning, Clock, XCircle, Info } from 'phosphor-react'; // Changed X to XCircle for fillable, Info for Needs Info
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string; // Define specific status types: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'NEEDS_INFO';
  size?: 'xs'| 'sm' | 'md'; // Added 'xs'
  animate?: boolean;
  className?: string; // Allow custom styling
}

// Status configuration
const statusConfig: Record<string, { color: 'success' | 'gray' | 'warning' | 'error' | 'info'; icon?: JSX.Element; text: string }> = { // Added 'info' color
  VERIFIED: { 
    color: 'success', 
    icon: <CheckCircle size={14} weight="fill" className="mr-1" />,
    text: 'Verified'
  },
  UNVERIFIED: { 
    color: 'gray', 
    icon: undefined, // Explicitly undefined if no icon
    text: 'Unverified'
  },
  PENDING_VERIFICATION: { 
    color: 'warning', 
    icon: <Clock size={14} weight="fill" className="mr-1" />,
    text: 'Pending'
  },
  REJECTED: { 
    color: 'error', 
    icon: <XCircle size={14} weight="fill" className="mr-1" />, // Changed to XCircle
    text: 'Rejected'
  },
  NEEDS_INFO: { 
    color: 'info', // Changed to 'info' for better distinction from pending if warning is yellow
    icon: <Info size={14} weight="fill" className="mr-1" />, // Changed to Info
    text: 'Needs Info'
  },
  // Default fallback
  DEFAULT: {
    color: 'gray',
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
    colorType: "light" as "light", // Explicitly cast for KeepReact Badge
    color: config.color,
    className: `capitalize ${className}` // Ensure text like "Needs Info" is capitalized if needed by design
  };

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-block" // Ensure motion div doesn't break layout
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
Map verification statuses to appropriate colors and icons
Add support for different sizes for flexibility
Include optional animation for status changes

Subtask 1.6: Create Saved Filters Functionality
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/SavedFiltersPanel.tsx
Action: Develop a SavedFiltersPanel component that allows users to save, apply, and delete filter presets.
Purpose: To improve user efficiency by allowing them to quickly re-apply common search and filter combinations.
AI Action: Generate the SavedFiltersPanel.tsx component. Implement state for saved filters and new filter name. Use localStorage for persistence. Include UI for listing, applying, deleting, and saving current filters.
Guidance for AI/Developer: Ensure the panel is well-styled and provides clear visual feedback for actions. The onApplyFilter prop should communicate the selected filter back to the parent page.
Validation Command: Interact with the Saved Filters panel: save a filter, apply it, delete it. Verify persistence by reloading the page.
Expected Output: Users can save, load, and delete filter configurations. Filters are persisted in localStorage. Applying a saved filter updates the list page.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Filter Panel)
Implementation Details:

Build a dropdown panel to manage and apply saved filters:

TypeScript

'use client';

import React, { useState, useEffect } from 'react'; // Added React
import { Card, Button } from 'keep-react';
// import { motion } from 'framer-motion'; // Not used in this snippet directly, but panel itself is animated by parent
import { Trash, FloppyDisk, CheckSquareOffset } from 'phosphor-react'; // Changed Check to CheckSquareOffset for apply

interface SavedFilter {
  id: string;
  name: string;
  search: string;
  status: string;
}

interface SavedFiltersPanelProps {
  onApplyFilter: (filter: Omit<SavedFilter, 'id' | 'name'>) => void;
  onSaveCurrentFilter: () => void; // This prop might be better as a trigger from parent, or removed if panel handles save internally
  currentFilter: {
    search: string;
    status: string;
  };
}

export default function SavedFiltersPanel({
  onApplyFilter,
  // onSaveCurrentFilter, // Removed, as panel can call a general "filter saved" notification.
  currentFilter
}: SavedFiltersPanelProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [newFilterName, setNewFilterName] = useState('');
  
  // Load saved filters from localStorage
  useEffect(() => {
    const storedFilters = localStorage.getItem('businessOwnerFilters');
    if (storedFilters) {
      try {
        const parsedFilters = JSON.parse(storedFilters);
        if (Array.isArray(parsedFilters)) { // Basic validation
            setSavedFilters(parsedFilters);
        } else {
            localStorage.removeItem('businessOwnerFilters'); // Clear invalid data
        }
      } catch (error) {
        console.error('Error parsing saved filters:', error);
        localStorage.removeItem('businessOwnerFilters'); // Clear invalid data
      }
    }
  }, []);
  
  // Save filters to localStorage
  const updateAndPersistFilters = (filters: SavedFilter[]) => {
    localStorage.setItem('businessOwnerFilters', JSON.stringify(filters));
    setSavedFilters(filters);
  };
  
  // Save current filter
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return; // Add validation for filter name (e.g., toast)
    if (!currentFilter.search && !currentFilter.status) {
        // Add validation: cannot save an empty filter (e.g., toast)
        console.warn("Cannot save an empty filter.");
        return;
    }
    
    const newFilter: SavedFilter = {
      id: crypto.randomUUID(),
      name: newFilterName.trim(),
      search: currentFilter.search,
      status: currentFilter.status
    };
    
    updateAndPersistFilters([...savedFilters, newFilter]);
    setNewFilterName('');
    // onSaveCurrentFilter(); // Signal that a filter was saved, parent might show a toast
    // Example: alert('Filter saved!'); 
  };
  
  // Delete a saved filter
  const handleDeleteFilter = (id: string) => {
    updateAndPersistFilters(savedFilters.filter(filter => filter.id !== id));
  };
  
  // Apply a saved filter
  const handleApplySavedFilter = (filter: SavedFilter) => { // Renamed to avoid conflict
    onApplyFilter({
      search: filter.search,
      status: filter.status
    });
  };
  
  return (
    // Card is provided by the AnimatePresence wrapper in the parent component for consistent styling.
    // This component will render its content directly.
    <div className="p-5 text-white"> {/* Theming */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Saved filters */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-3 text-white">Saved Filters</h3> {/* Theming */}
          
          {savedFilters.length === 0 ? (
            <p className="text-gray-400 text-sm">No saved filters yet. Save your current filters for quick access.</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Added max-height and scroll */}
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-md shadow" /* Theming */
                >
                  <div className="flex-grow overflow-hidden mr-2"> {/* Ensure text truncates */}
                    <p className="font-medium text-text-primary truncate text-white">{filter.name}</p> {/* Theming & truncate */}
                    <div className="flex flex-wrap gap-1 mt-1"> {/* Reduced gap */}
                      {filter.search && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded break-all"> {/* Break-all & padding */}
                          Search: {filter.search}
                        </span>
                      )}
                      
                      {filter.status && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded"> {/* Padding */}
                          Status: {filter.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0"> {/* Flex shrink */}
                    <Button
                      size="xs"
                      variant="outline" // Assuming keep-react has this variant
                      onClick={() => handleApplySavedFilter(filter)}
                      className="text-primary border-primary hover:bg-primary/10" /* Theming */
                    >
                      <CheckSquareOffset size={14} className="mr-1" />
                      Apply
                    </Button>
                    
                    <Button
                      size="xs"
                      variant="outline" // Assuming keep-react has this variant
                      color="error" // Assuming keep-react has this color
                      onClick={() => handleDeleteFilter(filter.id)}
                      className="text-error border-error hover:bg-error/10" /* Theming */
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Save current filter */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-3 text-white">Save Current Filter</h3> {/* Theming */}
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-2 bg-gray-700 rounded"> {/* Added background to current filter display */}
              {currentFilter.search && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                  Search: {currentFilter.search}
                </span>
              )}
              
              {currentFilter.status && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                  Status: {currentFilter.status.replace('_', ' ')}
                </span>
              )}
              
              {!currentFilter.search && !currentFilter.status && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                  No filters applied
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter name"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                className="bg-gray-700 text-white rounded-md py-2 px-3 flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              <Button
                size="sm" // keep-react uses 'sm'
                onClick={handleSaveFilter}
                disabled={!newFilterName.trim() || (!currentFilter.search && !currentFilter.status)} // Disable if no name or no active filter
                className="bg-primary hover:bg-primary-dark text-white disabled:bg-gray-500" // Theming
              >
                <FloppyDisk size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Implement local storage persistence for filter presets
Add functionality to create, apply, and delete saved filters
Create visual chips to display filter criteria

Subtask 1.7: Implement Custom Debounce Hook
Status: [Pending]
Progress: 0%
File Path: ./src/hooks/useDebounce.ts
Action: Create a generic useDebounce hook to delay execution of a function (e.g., API call for search).
Purpose: To optimize performance by reducing the number of API calls made while a user is typing in a search field.
AI Action: Generate the useDebounce.ts hook. It should take a value and delay as arguments and return the debounced value.
Guidance for AI/Developer: Ensure the hook is type-safe using generics. Implement a cleanup function in useEffect to clear the timer.
Validation Command: Integrate the hook with the search input on the Business Owners list page. Verify that API calls for search are delayed and not made on every keystroke.
Expected Output: useDebounce hook correctly delays value updates. Search functionality on the list page uses debouncing effectively.
Outcome: [Pending]
Ref: React documentation (useEffect cleanup)
Implementation Details:

Create a type-safe debounce hook for search input optimization:

TypeScript

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes
  
  return debouncedValue;
}
Implement clean-up function to prevent memory leaks
Add configurable delay parameter for flexibility
Use generics to maintain type safety

Task 2: "Add Business Owner" Modal Implementation
Status: [Pending]
Progress: 0%
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Add Owner Modal), sprint_3.0.md (POST /api/business-owners)
Subtask 2.1: Create Location Data Structure and Files
Status: [Pending]
Progress: 0%
Action: Define TypeScript interfaces for location data (Country, State, Municipality, IdentityDocumentType) and create corresponding data files.
Purpose: To provide structured and easily accessible location data for use in forms, particularly the "Add Business Owner" modal.
AI Action: Generate TypeScript interfaces in src/types/location.ts. Create data files like src/data/countries.ts, src/data/us-states.ts, src/data/pr-municipalities.ts, and src/data/identity-types.ts populated with sample data.
Guidance for AI/Developer: Ensure data structures are comprehensive and allow for easy filtering (e.g., get states for a selected country). Populate with accurate data for US states and Puerto Rico municipalities as a starting point.
Validation Command: Review generated type definitions and data files for correctness and completeness. Write a small test script to filter states by country.
Expected Output: Location data types are defined. Data files for countries, states, municipalities, and ID types are created and populated. Utility functions for data retrieval are available.
Outcome: [Pending]
Ref: Government sources for country/state/municipality codes.
Implementation Details:

Create TypeScript interfaces for all location-related data structures:

TypeScript

// ./src/types/location.ts
export interface Country {
  code: string;
  name: string;
  hasStates: boolean; // Indicates if the country has a list of states/provinces/territories relevant to the app
}

export interface State { // Can also represent Province, Territory, or Municipality for countries like PR
  code: string;
  name: string;
  countryCode: string;
}

// Municipality is effectively a State type for PR, but can be separate if structure differs significantly
// export interface Municipality {
//   code: string;
//   name:string;
//   stateCode: string; // This would imply PR is a 'state' containing municipalities, adjust as needed
// }

export interface IdentityDocumentType {
  value: string;
  label: string;
  requiresCountry?: boolean; // Optional: if some ID types are country-agnostic
  requiresState?: boolean;   // Optional: if some ID types are state-agnostic or country provides enough context
}
Implement data files for countries, states, and municipalities:

TypeScript

// ./src/data/countries.ts
import { Country } from '@/types/location';

export const countries: Country[] = [
  { code: 'US', name: 'United States', hasStates: true },
  { code: 'PR', name: 'Puerto Rico', hasStates: true }, // PR municipalities will be treated as 'states' for this structure
  { code: 'MX', name: 'Mexico', hasStates: true },
  // Additional countries...
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

// ./src/data/identity-types.ts
import { IdentityDocumentType } from '@/types/location';
export const identityDocumentTypes: IdentityDocumentType[] = [
    { value: 'drivers_license', label: 'Driver\'s License', requiresCountry: true, requiresState: true },
    { value: 'passport', label: 'Passport', requiresCountry: true, requiresState: false },
    { value: 'state_id', label: 'State ID', requiresCountry: true, requiresState: true },
    { value: 'national_id', label: 'National ID', requiresCountry: true, requiresState: false },
    // ... other types
];

// ./src/data/us-states.ts
import { State } from '@/types/location';
export const usStates: State[] = [
    { code: 'AL', name: 'Alabama', countryCode: 'US' },
    { code: 'AK', name: 'Alaska', countryCode: 'US' },
    // ... all US states
    { code: 'WY', name: 'Wyoming', countryCode: 'US' },
];

// ./src/data/pr-municipalities.ts (Treated as 'States' of country 'PR')
import { State } from '@/types/location';
export const prMunicipalities: State[] = [
    { code: 'ADJ', name: 'Adjuntas', countryCode: 'PR' },
    { code: 'AGU', name: 'Aguada', countryCode: 'PR' },
    // ... all PR municipalities
    { code: 'YAU', name: 'Yauco', countryCode: 'PR' },
];

// Utility in a relevant service or helper file e.g. /src/lib/locationUtils.ts
import { usStates } from '@/data/us-states';
import { prMunicipalities } from '@/data/pr-municipalities';
import { State } from '@/types/location';

export function getStatesForCountry(countryCode: string | undefined): State[] {
    if (countryCode === 'US') return usStates;
    if (countryCode === 'PR') return prMunicipalities;
    // Add more country-specific state/province lists here
    // if (countryCode === 'MX') return mxStates; 
    return [];
}

Add utility functions for filtering locations by country
Implement comprehensive data for US states and Puerto Rico municipalities

Subtask 2.2: Enhanced Add Business Owner Modal Component
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/AddOwnerModal.tsx
Action: Develop the AddOwnerModal component with sections for Personal, Identification, and Address information, using react-hook-form and zod for validation.
Purpose: To provide a user-friendly and robust interface for creating new business owners with comprehensive data input and validation.
AI Action: Generate the AddOwnerModal.tsx component. Set up react-hook-form with zodResolver using the ownerSchema. Implement the three sections with input fields and dynamic dropdowns for location data.
Guidance for AI/Developer: Style the modal using keep-react's Modal. Ensure section headers have icons from phosphor-react. Implement a success state display after successful submission. Pay attention to responsive design and accessibility.
Validation Command: Open the "Add Business Owner" modal. Test form validation by submitting empty and invalid data. Fill and submit the form with valid data.
Expected Output: Modal displays correctly with all sections and fields. Form validation works as expected. Dynamic dropdowns for country/state function correctly. Success state is shown on successful submission.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Add Owner Modal Layout), react-hook-form documentation, zod documentation
Implementation Details:

Create a comprehensive modal with three clearly defined sections:

TypeScript

'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { Modal, Button as KeepButton } from 'keep-react'; // Renamed Button to KeepButton to avoid conflict if any
import { useForm, Controller } from 'react-hook-form'; // Added Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  User, 
  IdentificationCard, 
  MapPinLine, // Changed MapPin to MapPinLine for more distinct look
  CheckCircle,
  FloppyDisk, // For save button
  X // For cancel button
} from 'phosphor-react';

// Components
import { Input } from '@/components/common/Input'; // Reusable Input component
// import AuthButton from '@/components/auth/AuthButton'; // Using KeepButton or a custom form button
import FormButton from '@/components/common/FormButton'; // Example custom button
import ErrorMessageDisplay from '@/components/common/ErrorMessage'; // Renamed ErrorMessage to avoid conflict

// Data and Types
import { Country, State, IdentityDocumentType } from '@/types/location';
import { countries, getCountryByCode } from '@/data/countries';
import { identityDocumentTypes } from '@/data/identity-types';
import { getStatesForCountry } from '@/lib/locationUtils'; // Utility function

// Schema definition using zod
const ownerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  maternalLastName: z.string().optional().or(z.literal('')), // Allow empty string
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')), // Consider date validation z.coerce.date() if sending Date object
  
  idType: z.string().optional().or(z.literal('')),
  idLicenseNumber: z.string().optional().or(z.literal('')),
  idIssuingCountry: z.string().optional().or(z.literal('')),
  idIssuingState: z.string().optional().or(z.literal('')),
  
  addressLine1: z.string().optional().or(z.literal('')),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')), // This is for the owner's address state, distinct from ID issuing state
  zipCode: z.string().optional().or(z.literal('')),
  addressCountry: z.string().min(1, 'Address country is required').default('US'), // Default address country
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOwner: any) => void; // Replace 'any' with actual owner type from API
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export default function AddOwnerModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: AddOwnerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(''); // Renamed error to apiError
  const [showSuccess, setShowSuccess] = useState(false); // Renamed success to showSuccess
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control, // Added control for <Controller>
    setValue
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { // Ensure all fields are initialized
      firstName: '', lastName: '', maternalLastName: '', email: '', phone: '', dateOfBirth: '',
      idType: '', idLicenseNumber: '', idIssuingCountry: '', idIssuingState: '',
      addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', addressCountry: 'US',
    }
  });
  
  const selectedIdIssuingCountry = watch('idIssuingCountry');
  const selectedIdType = watch('idType');
  const idDocTypeDetails = identityDocumentTypes.find(doc => doc.value === selectedIdType);

  const availableIdIssuingStates = getStatesForCountry(selectedIdIssuingCountry);

  const selectedAddressCountry = watch('addressCountry');
  const availableAddressStates = getStatesForCountry(selectedAddressCountry);

  useEffect(() => { // Reset dependent fields when their parent changes
    if (selectedIdIssuingCountry) {
      setValue('idIssuingState', '');
    }
  }, [selectedIdIssuingCountry, setValue]);

  useEffect(() => {
    if (selectedAddressCountry) {
      setValue('state', '');
    }
  }, [selectedAddressCountry, setValue]);


  const handleActualClose = () => { // Renamed handleClose to handleActualClose
    if (!isLoading) {
      reset();
      setApiError('');
      setShowSuccess(false);
      onClose();
    }
  };
  
  const onSubmit = async (data: OwnerFormValues) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      // Transform dates to ISO format if needed by API and not handled by Zod coerce
      const transformedData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined
      };

      const response = await fetch('/api/business-owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create business owner');
      }
      
      setShowSuccess(true);
      onSuccess(result.owner); // Assuming API returns { owner: ... }
      
      setTimeout(() => {
        handleActualClose();
      }, 2000);
    } catch (err: any) {
      setApiError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <Modal
      size="2xl" // Increased size for more content
      show={isOpen}
      onClose={handleActualClose}
      // className="bg-surface border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden" // Custom styling if needed, or rely on KeepReact
      position="center" // KeepReact modal position
    >
      <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
        <Modal.Header className="border-b border-gray-700 bg-gray-800 text-white rounded-t-lg"> {/* Theming */}
          {showSuccess ? 'Business Owner Created' : 'Add New Business Owner'}
        </Modal.Header>
        
        <Modal.Body className="p-6 bg-gray-800 text-gray-300 space-y-6"> {/* Theming & space */}
          {apiError && <ErrorMessageDisplay message={apiError} type="error"/>} {/* Theming */}
          
          {showSuccess ? (
            <motion.div 
              className="text-center py-8" // Increased padding
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={48} weight="bold" className="text-green-400" /> {/* Increased icon size */}
              </div>
              <h4 className="text-xl font-medium text-white mb-2">Successfully Created!</h4> {/* Theming */}
              <p className="text-gray-400">The new business owner has been added to the system.</p> {/* Theming */}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <section>
                <div className="flex items-center mb-4 text-primary"> {/* Theming */}
                  <User size={24} className="mr-3" /> {/* Increased icon size */}
                  <h4 className="text-lg font-semibold text-white">Personal Information</h4> {/* Theming */}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name*" id="firstName" placeholder="Enter first name" registration={register('firstName')} error={errors.firstName?.message} theme="dark" />
                    <Input label="Last Name*" id="lastName" placeholder="Enter last name" registration={register('lastName')} error={errors.lastName?.message} theme="dark" />
                  </div>
                  <Input label="Maternal Last Name" id="maternalLastName" placeholder="Enter maternal last name" registration={register('maternalLastName')} error={errors.maternalLastName?.message} theme="dark" />
                  <Input label="Email Address*" id="email" type="email" placeholder="Enter email address" registration={register('email')} error={errors.email?.message} theme="dark" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Phone Number" id="phone" type="tel" placeholder="Enter phone number" registration={register('phone')} error={errors.phone?.message} theme="dark" />
                    <Input label="Date of Birth" id="dateOfBirth" type="date" registration={register('dateOfBirth')} error={errors.dateOfBirth?.message} theme="dark" />
                  </div>
                </div>
              </section>
              
              {/* Identification Information */}
              <section>
                <div className="flex items-center mb-4 text-purple-400"> {/* Theming */}
                  <IdentificationCard size={24} className="mr-3" /> {/* Increased icon size */}
                  <h4 className="text-lg font-semibold text-white">Identification</h4> {/* Theming */}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="ID Type" id="idType" selectOptions={identityDocumentTypes} useController={true} control={control} name="idType" placeholder="Select ID Type" error={errors.idType?.message} theme="dark" />
                    <Input label="ID/License Number" id="idLicenseNumber" placeholder="Enter ID or license number" registration={register('idLicenseNumber')} error={errors.idLicenseNumber?.message} theme="dark" />
                  </div>
                  {(idDocTypeDetails?.requiresCountry || selectedIdType) && ( // Show if type selected or if any type generally requires it
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Issuing Country" id="idIssuingCountry" selectOptions={countries.map(c => ({value: c.code, label: c.name}))} useController={true} control={control} name="idIssuingCountry" placeholder="Select Country" error={errors.idIssuingCountry?.message} theme="dark" />
                        {(idDocTypeDetails?.requiresState || availableIdIssuingStates.length > 0) && selectedIdIssuingCountry && ( // Show if type selected and requires state OR states available for country
                            <Input label="Issuing State/Territory" id="idIssuingState" selectOptions={availableIdIssuingStates.map(s => ({value: s.code, label: s.name}))} useController={true} control={control} name="idIssuingState" placeholder="Select State/Territory" error={errors.idIssuingState?.message} theme="dark" disabled={availableIdIssuingStates.length === 0} />
                        )}
                     </div>
                  )}
                </div>
              </section>
              
              {/* Address Information */}
              <section>
                <div className="flex items-center mb-4 text-blue-400"> {/* Theming */}
                  <MapPinLine size={24} className="mr-3" /> {/* Increased icon size */}
                  <h4 className="text-lg font-semibold text-white">Address Information</h4> {/* Theming */}
                </div>
                <div className="space-y-4">
                  <Input label="Address Line 1" id="addressLine1" placeholder="Street address, P.O. box" registration={register('addressLine1')} error={errors.addressLine1?.message} theme="dark" />
                  <Input label="Address Line 2" id="addressLine2" placeholder="Apartment, suite, unit, building, floor, etc." registration={register('addressLine2')} error={errors.addressLine2?.message} theme="dark" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="City" id="city" placeholder="Enter city" registration={register('city')} error={errors.city?.message} theme="dark" />
                    <Input label="ZIP/Postal Code" id="zipCode" placeholder="Enter ZIP/postal code" registration={register('zipCode')} error={errors.zipCode?.message} theme="dark" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Country*" id="addressCountry" selectOptions={countries.map(c => ({value: c.code, label: c.name}))} useController={true} control={control} name="addressCountry" placeholder="Select Country" error={errors.addressCountry?.message} theme="dark" />
                    {selectedAddressCountry && getCountryByCode(selectedAddressCountry)?.hasStates && (
                        <Input label="State/Province/Territory" id="state" selectOptions={availableAddressStates.map(s => ({value: s.code, label: s.name}))} useController={true} control={control} name="state" placeholder="Select State/Territory" error={errors.state?.message} theme="dark" disabled={availableAddressStates.length === 0}/>
                    )}
                  </div>
                </div>
              </section>
            </form>
          )}
        </Modal.Body>

        {!showSuccess && (
        <Modal.Footer className="border-t border-gray-700 flex justify-end gap-3 p-4 bg-gray-800 rounded-b-lg"> {/* Theming */}
            <KeepButton
                size="md"
                type="button" // Important: type="button" for cancel
                variant="outline" // KeepReact prop
                onClick={handleActualClose}
                disabled={isLoading}
                className="text-gray-300 border-gray-500 hover:bg-gray-700" // Theming
            >
                <X size={18} className="mr-2" /> Cancel
            </KeepButton>
            <KeepButton
                size="md"
                type="submit" // Will trigger form onSubmit
                onClick={handleSubmit(onSubmit)} // Connect to form submission
                disabled={isLoading}
                className="bg-primary hover:bg-primary-dark text-white" // Theming
            >
                <FloppyDisk size={18} className="mr-2" /> {isLoading ? 'Creating...' : 'Create Owner'}
            </KeepButton>
        </Modal.Footer>
        )}
      </motion.div>
    </Modal>
  );
}
Create section headers with appropriate iconography from phosphor-react
Implement all required form fields with proper layout and responsive design
Create success state with completion message and clear next-step options
Implement proper focus management and keyboard navigation
Add visual polish with subtle animations and improved form layout

Subtask 2.3: Comprehensive Form Handling and Submission
Status: [Pending]
Progress: 0%
Action: Implement form submission logic, including data transformation to match API expectations, API call, loading states, and error handling.
Purpose: To ensure reliable and user-friendly creation of business owners through the modal form.
AI Action: In AddOwnerModal.tsx, write the onSubmit function. This function should transform form data (e.g., date formatting), make a POST request to /api/business-owners, and handle success/error responses.
Guidance for AI/Developer: Manage isLoading state to provide visual feedback during submission. Display API errors clearly. On success, call the onSuccess prop and potentially reset the form. Consider optimistic UI updates.
Validation Command: Submit the "Add Business Owner" form. Verify the API call is made correctly. Check for appropriate loading and error/success messages. Confirm data is saved correctly in the backend.
Expected Output: Form submits data to the API. Loading states are shown. Errors from the API are displayed to the user. On success, the modal updates and informs the user.
Outcome: [Pending]
Ref: sprint_3.0.md (POST /api/business-owners endpoint details)
Implementation Details:

Implement form state and validation with react-hook-form and zod schema:

TypeScript

// Schema definition using zod (already provided in Subtask 2.2)
const ownerSchema = z.object({ /* ... */ });
Create dynamic dependent dropdowns for country and state/municipality selection
Add comprehensive field validation with clear error messages
Create data transformation layer to match API expectations:

TypeScript

const onSubmit = async (data: OwnerFormValues) => {
  setIsLoading(true);
  // setError(''); // Renamed to setApiError
  setApiError('');
  
  try {
    // Transform dates to ISO format if needed
    const transformedData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined // Format YYYY-MM-DD
    };
    
    const response = await fetch('/api/business-owners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      if (response.status === 409) { // Conflict, e.g., email already exists
        // setApiError('A business owner with this email already exists. Please use a different email.');
        throw new Error(result.error || 'A business owner with this email already exists.'); // More specific error
      }
      throw new Error(result.error || 'Failed to create business owner');
    }
    
    // setShowSuccess(true); // Renamed success to showSuccess
    setShowSuccess(true);
    
    // onSuccess(result); // Pass the created owner data back to parent
    onSuccess(result.owner); // Assuming API returns { owner: ... }
    
    setTimeout(() => {
      // reset(); // Reset is part of handleActualClose
      // setShowSuccess(false);
      // onClose(); // Close is part of handleActualClose
      handleActualClose(); // Call the consolidated close handler
    }, 2000);
  } catch (err: any) {
    // setApiError(err.message || 'An error occurred while creating the business owner');
    setApiError(err.message); // Simplified
    console.error('Error creating business owner:', err);
  } finally {
    setIsLoading(false);
  }
};
Implement proper loading states and error handling
Create optimistic UI updates for better user experience

Task 3: Business Owner Detail Page UI Structure
Status: [Pending]
Progress: 0%
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Owner Detail Page), sprint_3.0.md (GET /api/business-owners/[id])
Subtask 3.1: Create Business Owner Detail Page Component
Status: [Pending]
Progress: 0%
File Path: ./src/app/(dashboard)/business-owners/[id]/page.tsx (Client Component: 'use client';)
Action: Develop the main page component for displaying business owner details, including a profile card, tabs for Overview and Documents, and a back button.
Purpose: To provide a centralized view for all information and actions related to a specific business owner.
AI Action: Generate the BusinessOwnerDetailPage.tsx component. Implement logic to extract owner ID from URL params and fetch owner data. Set up Tabs from keep-react for "Overview" and "Documents".
Guidance for AI/Developer: Display owner's avatar, name, email, and verification status prominently. Use framer-motion for tab transitions. Handle loading, error, and not-found states.
Validation Command: Navigate to a business owner's detail page (e.g., /business-owners/some-id). Verify data is fetched and displayed. Test tab navigation. Check loading/error states.
Expected Output: Detail page renders with owner's profile information. Tabs for Overview and Documents are functional. Loading, error, and not-found states are handled correctly.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Detail Page Layout), keep-react Tabs documentation
Implementation Details:

Extract owner ID from URL params and implement data fetching:

TypeScript

'use client';

import React, { useState, useEffect } from 'react'; // Added React
import { useParams, useRouter } from 'next/navigation';
import { Tabs, Avatar, Card, Button as KeepButton, Spinner } from 'keep-react'; // Added Spinner, Renamed Button
import { 
  ArrowLeft, 
  User as UserIcon, // Renamed to avoid conflict with User type if any
  Files as DocumentsIcon, // Changed to Files for filled icon to match UserIcon
  CheckCircle, 
  Warning, 
  Clock, 
  XCircle, // Changed from X to XCircle
  CalendarCheck,
  Certificate, // For View Certificate button
  RocketLaunch // For Start/Continue Verification
} from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
// import ErrorState from '@/components/common/ErrorState'; // Using ErrorMessageDisplay
import ErrorMessageDisplay from '@/components/common/ErrorMessage'; // Replaced ErrorState
import LoadingSkeleton from '@/components/common/LoadingSkeleton'; // Generic skeleton
import OverviewTab from '@/components/features/business-owners/OverviewTab';
import DocumentsTab from '@/components/features/business-owners/DocumentsTab';
import BusinessOwnerVerificationWizard from '@/components/features/business-owners/verification/BusinessOwnerVerificationWizard';
import StatusBadge from '@/components/features/business-owners/StatusBadge'; // Using the enhanced status badge

// Types - Assuming types are defined elsewhere
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'NEEDS_INFO';
  lastVerifiedAt?: string | null;
  certificateId?: string | null;
  documents?: any[]; // Replace 'any' with DocumentType
  // ... other fields from your API
  taxId?: string; // for OverviewTab
  phone?: string;
  dateOfBirth?: string;
  idLicenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string; // address state
  zipCode?: string;
  addressCountry?: string;
  maternalLastName?: string;
}


// Status configuration for action buttons and descriptions
const pageStatusConfig: Record<string, {
  color: 'success' | 'gray' | 'warning' | 'error' | 'info';
  icon?: JSX.Element; // For badge, already handled by StatusBadge component
  actionText: string;
  actionDisabled: boolean;
  actionIcon?: JSX.Element;
  description?: string;
}> = {
  VERIFIED: { 
    color: 'success', 
    actionText: 'View Certificate', // Primary action for verified might be viewing certificate
    actionDisabled: false, // Assuming certificate is always viewable if VERIFIED
    actionIcon: <Certificate size={18} className="mr-2" />,
    description: 'This business owner has been successfully verified.'
  },
  UNVERIFIED: { 
    color: 'gray', 
    actionText: 'Start Verification',
    actionDisabled: false,
    actionIcon: <RocketLaunch size={18} className="mr-2" />,
    description: 'This business owner has not started the verification process.'
  },
  PENDING_VERIFICATION: { 
    color: 'warning', 
    actionText: 'Continue Verification',
    actionDisabled: false,
    actionIcon: <RocketLaunch size={18} className="mr-2" />,
    description: 'The verification process is currently pending.'
  },
  REJECTED: { 
    color: 'error', 
    actionText: 'Restart Verification',
    actionDisabled: false,
    actionIcon: <RocketLaunch size={18} className="mr-2" />,
    description: 'The verification was rejected. Please review the details and restart if necessary.'
  },
  NEEDS_INFO: { 
    color: 'info', 
    actionText: 'Provide Information',
    actionDisabled: false,
    actionIcon: <RocketLaunch size={18} className="mr-2" />,
    description: 'Additional information is required to complete the verification.'
  },
  DEFAULT: {
    color: 'gray',
    actionText: 'Verification Status Unknown',
    actionDisabled: true,
    description: 'The verification status of this owner is unknown.'
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};


export default function BusinessOwnerDetailPage() {
  const router = useRouter();
  const params = useParams(); // Use useParams to get route parameters
  const id = params?.id as string; // Extract id, ensure it's a string

  const [owner, setOwner] = useState<BusinessOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  // const [certificateId, setCertificateId] = useState<string | null>(null); // Handled by owner.certificateId

  const fetchOwnerDetails = async () => { // Made it a callable function
    if (!id) {
      setError("Business Owner ID is missing.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/business-owners/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Business owner not found.');
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch business owner details');
      }
      const data: BusinessOwner = await response.json();
      setOwner(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOwnerDetails();
  }, [id]);

  const handleBack = () => router.push('/business-owners');

  const handleVerificationAction = () => {
    // If VERIFIED and has certificate, could be view certificate action
    // Otherwise, open wizard
    if (owner?.verificationStatus === 'VERIFIED' && owner?.certificateId) {
        // Logic to view certificate (e.g., open modal or navigate)
        alert(`Viewing certificate ID: ${owner.certificateId}`);
        return;
    }
    setIsWizardOpen(true);
  };
  
  const handleVerificationComplete = (updatedOwnerData: Partial<BusinessOwner>) => {
    // This callback is triggered when the wizard completes a verification step or the whole process.
    // It should provide enough data to update the owner's status and potentially other fields.
    setOwner(prevOwner => prevOwner ? { ...prevOwner, ...updatedOwnerData } : null);
    setIsWizardOpen(false);
    // Optionally, re-fetch all owner data for absolute consistency,
    // though the wizard should ideally return the most up-to-date state.
    // fetchOwnerDetails(); 
  };

  const handleOwnerUpdate = (updatedOwner: BusinessOwner) => {
    setOwner(updatedOwner);
  };


  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <LoadingSkeleton type="ownerDetail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <KeepButton size="md" onClick={handleBack} className="mb-4 text-gray-300 hover:text-white">
          <ArrowLeft size={18} className="mr-1" /> Back
        </KeepButton>
        <ErrorMessageDisplay message={error} type="error" />
      </div>
    );
  }

  if (!owner) {
     return ( // Fallback if owner is null after loading and no error (should ideally be caught by error state)
      <div className="p-6 bg-gray-900 min-h-screen">
        <KeepButton size="md" onClick={handleBack} className="mb-4 text-gray-300 hover:text-white">
          <ArrowLeft size={18} className="mr-1" /> Back
        </KeepButton>
        <ErrorMessageDisplay message="Business owner data could not be loaded." type="info" />
      </div>
    );
  }

  const statusDetails = pageStatusConfig[owner.verificationStatus] || pageStatusConfig.DEFAULT;

  return (
    <motion.div 
      className="space-y-6 p-4 md:p-6 bg-gray-900 min-h-screen text-white" // Theming
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.div variants={itemVariants} className="mb-4">
        <KeepButton
          size="md" // KeepReact size
          onClick={handleBack}
          variant="outline" // Assuming KeepReact has outline variant
          className="flex items-center text-gray-300 hover:text-white border-gray-600 hover:border-gray-500" // Theming
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Business Owners</span>
        </KeepButton>
      </motion.div>
      
      {/* Owner profile card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-800 shadow-xl border border-gray-700 overflow-hidden"> {/* Theming */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Profile info */}
              <div className="flex items-center">
                <Avatar 
                  shape="circle" 
                  size="xl" // KeepReact size
                  className="bg-primary/20 text-primary mr-6 flex-shrink-0" // Theming
                >
                  {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                </Avatar>
                
                <div>
                  <h1 className="text-2xl font-semibold text-white"> {/* Theming */}
                    {`${owner.firstName} ${owner.lastName}`}
                  </h1>
                  <p className="text-gray-400">{owner.email}</p> {/* Theming */}
                  
                  <div className="mt-2 flex items-center gap-2 flex-wrap"> {/* Gap and wrap for badges */}
                    <StatusBadge status={owner.verificationStatus} size="sm" />
                    
                    {owner.verificationStatus === 'VERIFIED' && owner.lastVerifiedAt && (
                      <div className="flex items-center text-gray-400 text-xs"> {/* Theming */}
                        <CalendarCheck size={14} className="mr-1 text-green-400" /> {/* Theming */}
                        Verified on {new Date(owner.lastVerifiedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-shrink-0"> {/* Flex shrink */}
                <KeepButton
                  size="md"
                  color={owner.verificationStatus === 'VERIFIED' && owner.certificateId ? 'success' : 'primary'} // Different color for view cert
                  onClick={handleVerificationAction}
                  disabled={owner.verificationStatus === 'VERIFIED' && !owner.certificateId && statusDetails.actionDisabled} // Disable if verified but no cert and action is disabled
                  className={`min-w-[180px] ${ (owner.verificationStatus === 'VERIFIED' && owner.certificateId) ? 'bg-success-500 hover:bg-success-600' : 'bg-primary hover:bg-primary-dark' } text-white`} // Theming
                >
                  {statusDetails.actionIcon}
                  {statusDetails.actionText}
                </KeepButton>
              </div>
            </div>
            
            {/* Status description */}
            {statusDetails.description && (
              <motion.div 
                variants={itemVariants}
                className={`mt-4 p-3 rounded-md bg-${statusDetails.color}-500/10 border border-${statusDetails.color}-500/30`} // Theming with alpha
              >
                <p className={`text-sm text-${statusDetails.color}-300`}> {/* Theming */}
                  {statusDetails.description}
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
      
      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs 
          // className="bg-surface/60 backdrop-blur-sm border border-white/10 rounded-xl" // Custom class
          // activeTabClassName="border-primary text-primary" // Custom class
          // tabClassName="text-gray-400 hover:text-gray-300" // Custom class
          // value={activeTab} // KeepReact uses activeItem not value
          // onTabChange={setActiveTab} // KeepReact uses onActiveItemChange
          style="underline" // KeepReact Tabs style
          borderPosition="bottom"
          activeLabel={activeTab} // KeepReact prop
          onActiveLabelChange={setActiveTab} // KeepReact prop
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg" // Theming
        >
          <Tabs.List className="border-b border-gray-700 px-2"> {/* Theming */}
            <Tabs.Item 
              label="overview" // KeepReact prop
              icon={<UserIcon size={18} />}
              className={activeTab === 'overview' ? 'text-primary border-primary' : 'text-gray-400 hover:text-gray-200'} // Theming
            >
              Overview
            </Tabs.Item>
            <Tabs.Item 
              label="documents" // KeepReact prop
              icon={<DocumentsIcon size={18} />}
              className={activeTab === 'documents' ? 'text-primary border-primary' : 'text-gray-400 hover:text-gray-200'} // Theming
            >
              Documents
            </Tabs.Item>
          </Tabs.List>
          
          <div className="p-6"> {/* Content padding moved here for all tabs */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <Tabs.Content value="overview" className="p-6"> Removed p-6 from here */}
                  <OverviewTab 
                    owner={owner} 
                    onUpdate={handleOwnerUpdate} 
                    isReadOnly={owner.verificationStatus === 'VERIFIED'} // Or other business logic for read-only
                  />
                  {/* </Tabs.Content> */}
                </motion.div>
              )}
              
              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* <Tabs.Content value="documents" className="p-6"> Removed p-6 from here */}
                  <DocumentsTab 
                    ownerId={id} 
                    ownerDocuments={owner.documents || []} // Prop renamed for clarity
                    verificationStatus={owner.verificationStatus}
                    onDocumentsUpdate={(updatedDocs) => setOwner(prev => prev ? ({...prev, documents: updatedDocs}) : null)} // Callback to update documents on parent
                  />
                  {/* </Tabs.Content> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
      
      {/* Business Owner Verification Wizard */}
      {owner && ( // Ensure owner data is available before rendering wizard
        <BusinessOwnerVerificationWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          ownerId={id}
          ownerData={owner} // Pass full owner data
          onVerificationUpdate={handleVerificationComplete} // Renamed callback
        />
      )}
    </motion.div>
  );
}
Add enhanced status badge component for verification status display
Implement loading, error, and not-found states for robust user experience
Add motion animations for tab transitions and content loading

Subtask 3.2: Implement "Overview" Tab with Enhanced Editing
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/OverviewTab.tsx
Action: Develop the OverviewTab component to display and allow inline editing of owner profile information, divided into sections.
Purpose: To allow users to view and update detailed profile information of a business owner directly on the detail page.
AI Action: Generate OverviewTab.tsx. Use react-hook-form for managing editable fields. Implement edit/view toggle. Display data in sections (Personal, Identification, Address).
Guidance for AI/Developer: Mask sensitive fields like Tax ID, with an option to reveal. Submit updates via PUT request to /api/business-owners/[id]. Handle loading and error states for updates.
Validation Command: In the Overview tab, toggle edit mode. Modify and save data. Verify changes are persisted and displayed correctly. Check masking of sensitive fields.
Expected Output: Overview tab displays all owner information. Inline editing allows updates to fields. Sensitive information is masked by default.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Overview Tab Layout), sprint_3.0.md (PUT /api/business-owners/[id])
Implementation Details:

Create comprehensive display of all owner profile information:

TypeScript

'use client';

import React, { useState, useEffect } from 'react'; // Added React, useEffect
import { Button as KeepButton } from 'keep-react'; // Renamed Button
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PencilSimple, 
  FloppyDisk, // Changed Check to FloppyDisk for save
  X, 
  User, 
  Phone, 
  Envelope, 
  MapPinLine, // Changed from MapPin
  IdentificationCard,
  CalendarBlank, // Changed from Calendar
  Eye, // For show sensitive info
  EyeSlash // For hide sensitive info
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Components
import { Input } from '@/components/common/Input'; // Assuming a reusable Input component
import ErrorMessageDisplay from '@/components/common/ErrorMessage'; // Reusable ErrorMessage
// Types - Assuming BusinessOwner type is defined and imported
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  maternalLastName?: string | null;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null; // Expecting YYYY-MM-DD string
  taxId?: string | null;
  idLicenseNumber?: string | null; // Assuming this is part of the owner details
  // ID Type, Issuing Country, Issuing State for ID might be separate fields or part of a structured object
  idType?: string | null;
  idIssuingCountry?: string | null;
  idIssuingState?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null; // Address state
  zipCode?: string | null;
  addressCountry?: string | null; // Address country
  // ... other owner fields
}

interface OverviewTabProps {
  owner: BusinessOwner;
  onUpdate: (updatedOwner: BusinessOwner) => void;
  isReadOnly?: boolean;
}

// Schema definition with Zod for editable fields
const overviewSchema = z.object({
  firstName: z.string().min(2, 'First name is required (min 2 chars)'),
  lastName: z.string().min(2, 'Last name is required (min 2 chars)'),
  maternalLastName: z.string().optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address'), // Usually not editable or needs careful handling
  phone: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')), // YYYY-MM-DD, consider z.coerce.date() if Date object
  taxId: z.string().optional().or(z.literal('')), // Example: SSN or EIN
  
  // ID Fields (example, might need more detailed structure if these are editable)
  idType: z.string().optional().or(z.literal('')),
  idLicenseNumber: z.string().optional().or(z.literal('')),
  idIssuingCountry: z.string().optional().or(z.literal('')),
  idIssuingState: z.string().optional().or(z.literal('')),

  // Address Fields
  addressLine1: z.string().optional().or(z.literal('')),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  addressCountry: z.string().optional().or(z.literal('')),
});

type OverviewFormValues = z.infer<typeof overviewSchema>;

// Helper to display info item
const InfoItem = ({ icon, label, value, sensitive = false, showSensitive, onToggleSensitive, theme = "dark" }: any) => {
  if (!value && value !== 0) return null; // Don't render if no value, unless value is 0

  const displayValue = sensitive ? (showSensitive ? value : '••••••••') : value;
  const IconComponent = icon;

  return (
    <div className="flex items-start py-2">
      <IconComponent size={18} className={`mr-3 mt-1 flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
      <div className="flex-grow">
        <span className={`block text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{label}</span>
        <span className={`block text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>{displayValue}</span>
      </div>
      {sensitive && (
        <button onClick={onToggleSensitive} className={`ml-2 p-1 rounded ${theme === "dark" ? "text-gray-400 hover:text-primary" : "text-gray-500 hover:text-primary-500" }`}>
          {showSensitive ? <EyeSlash size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};


export default function OverviewTab({ owner, onUpdate, isReadOnly = false }: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(''); // Renamed error to apiError
  const [showTaxId, setShowTaxId] = useState(false);
  const [showIdNumber, setShowIdNumber] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control // For controlled components if using <Controller> for selects
  } = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {}, // Will be set by reset(owner)
  });

  // Populate form with owner data when owner changes or edit mode starts
  useEffect(() => {
    if (owner) {
      const defaultVals: OverviewFormValues = {
        firstName: owner.firstName || '',
        lastName: owner.lastName || '',
        maternalLastName: owner.maternalLastName || '',
        email: owner.email || '', // Usually not editable without verification
        phone: owner.phone || '',
        dateOfBirth: owner.dateOfBirth ? owner.dateOfBirth.split('T')[0] : '', // Assuming ISO string from API
        taxId: owner.taxId || '',
        idType: owner.idType || '',
        idLicenseNumber: owner.idLicenseNumber || '',
        idIssuingCountry: owner.idIssuingCountry || '',
        idIssuingState: owner.idIssuingState || '',
        addressLine1: owner.addressLine1 || '',
        addressLine2: owner.addressLine2 || '',
        city: owner.city || '',
        state: owner.state || '',
        zipCode: owner.zipCode || '',
        addressCountry: owner.addressCountry || '',
      };
      reset(defaultVals);
    }
  }, [owner, isEditing, reset]);
  
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    reset(); // Reset to original owner data passed in props
    setIsEditing(false);
    setApiError('');
  };

  const onSubmit = async (data: OverviewFormValues) => {
    if (isReadOnly) return;
    if (!isDirty) { // No changes made
      setIsEditing(false);
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // API might expect date in YYYY-MM-DD format
      const transformedData = { ...data };
      if (transformedData.dateOfBirth === '') transformedData.dateOfBirth = undefined;


      const response = await fetch(`/api/business-owners/${owner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
      });
      
      const result = await response.json(); // Expect updated owner or success message
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update business owner');
      }
      
      onUpdate(result.owner); // Assuming API returns the updated owner object { owner: ... }
      setIsEditing(false);
      // Optionally show a success toast/message
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const theme = "dark"; // Central theme control

  // Render sections
  const renderSection = (title: string, icon: React.ElementType, fields: JSX.Element, sectionKey: string) => (
    <motion.div 
        key={sectionKey}
        initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.1 * parseInt(sectionKey.split('-')[1])}}
        className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border"}`}
    >
      <div className="flex items-center mb-4">
        {React.createElement(icon, { size: 20, className: `mr-3 ${theme === "dark" ? "text-primary" : "text-primary-500"}` })}
        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{title}</h3>
      </div>
      {fields}
    </motion.div>
  );

  const personalInfoFields = isEditing ? (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name*" id="firstName" registration={register('firstName')} error={errors.firstName?.message} theme={theme}/>
        <Input label="Last Name*" id="lastName" registration={register('lastName')} error={errors.lastName?.message} theme={theme}/>
      </div>
      <Input label="Maternal Last Name" id="maternalLastName" registration={register('maternalLastName')} error={errors.maternalLastName?.message} theme={theme}/>
      <Input label="Email Address*" id="email" type="email" registration={register('email')} error={errors.email?.message} theme={theme} disabled={true} /* Email usually not editable or needs verification */ />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Phone Number" id="phone" type="tel" registration={register('phone')} error={errors.phone?.message} theme={theme}/>
        <Input label="Date of Birth" id="dateOfBirth" type="date" registration={register('dateOfBirth')} error={errors.dateOfBirth?.message} theme={theme}/>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
      <InfoItem icon={User} label="Full Name" value={`${owner.firstName} ${owner.lastName} ${owner.maternalLastName || ''}`.trim()} theme={theme}/>
      <InfoItem icon={Envelope} label="Email" value={owner.email} theme={theme}/>
      <InfoItem icon={Phone} label="Phone" value={owner.phone} theme={theme}/>
      <InfoItem icon={CalendarBlank} label="Date of Birth" value={owner.dateOfBirth ? new Date(owner.dateOfBirth).toLocaleDateString() : 'N/A'} theme={theme}/>
    </div>
  );

  const identificationFields = isEditing ? (
     <div className="space-y-4">
        <Input label="Tax ID (e.g., SSN, EIN)" id="taxId" registration={register('taxId')} error={errors.taxId?.message} theme={theme}/>
        {/* Add more editable ID fields as needed, e.g., ID Type, Number, Country, State - these often come from dedicated Document models though */}
        <Input label="ID/License Number" id="idLicenseNumber" registration={register('idLicenseNumber')} error={errors.idLicenseNumber?.message} theme={theme}/>
     </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <InfoItem icon={IdentificationCard} label="Tax ID" value={owner.taxId} sensitive={true} showSensitive={showTaxId} onToggleSensitive={() => setShowTaxId(!showTaxId)} theme={theme}/>
        <InfoItem icon={IdentificationCard} label="ID/License Number" value={owner.idLicenseNumber} sensitive={true} showSensitive={showIdNumber} onToggleSensitive={() => setShowIdNumber(!showIdNumber)} theme={theme}/>
        {/* Display other non-editable ID fields if they exist directly on owner model */}
    </div>
  );

  const addressFields = isEditing ? (
    <div className="space-y-4">
        <Input label="Address Line 1" id="addressLine1" registration={register('addressLine1')} error={errors.addressLine1?.message} theme={theme}/>
        <Input label="Address Line 2" id="addressLine2" registration={register('addressLine2')} error={errors.addressLine2?.message} theme={theme}/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="City" id="city" registration={register('city')} error={errors.city?.message} theme={theme}/>
            <Input label="State/Province" id="state" registration={register('state')} error={errors.state?.message} theme={theme}/>
            <Input label="ZIP/Postal Code" id="zipCode" registration={register('zipCode')} error={errors.zipCode?.message} theme={theme}/>
        </div>
        <Input label="Country" id="addressCountry" registration={register('addressCountry')} error={errors.addressCountry?.message} theme={theme}/>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        <InfoItem icon={MapPinLine} label="Address" value={`${owner.addressLine1 || ''}${owner.addressLine2 ? `, ${owner.addressLine2}` : ''}`.trim() || 'N/A'} theme={theme}/>
        <InfoItem icon={MapPinLine} label="City, State, ZIP" value={`${owner.city || ''}${owner.state ? `, ${owner.state}` : ''} ${owner.zipCode || ''}`.trim() || 'N/A'} theme={theme}/>
        <InfoItem icon={MapPinLine} label="Country" value={owner.addressCountry || 'N/A'} theme={theme}/>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && <ErrorMessageDisplay message={apiError} type="error" />}
      
      {!isReadOnly && (
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <div className="flex gap-2">
              <KeepButton size="md" type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className={`border-${theme === "dark" ? "gray-600 text-gray-300" : "gray-300 text-gray-700"}`}>
                <X size={18} className="mr-1" /> Cancel
              </KeepButton>
              <KeepButton size="md" type="submit" disabled={isLoading || !isDirty} className={`bg-primary hover:bg-primary-dark text-white ${isLoading || !isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <FloppyDisk size={18} className="mr-1" /> {isLoading ? 'Saving...' : 'Save Changes'}
              </KeepButton>
            </div>
          ) : (
            <KeepButton size="md" type="button" variant="outline" onClick={handleEdit} className={`border-primary text-primary hover:bg-primary/10`}>
              <PencilSimple size={18} className="mr-1" /> Edit Profile
            </KeepButton>
          )}
        </div>
      )}

      {renderSection("Personal Information", User, personalInfoFields, "section-1")}
      {renderSection("Identification", IdentificationCard, identificationFields, "section-2")}
      {renderSection("Address Information", MapPinLine, addressFields, "section-3")}

    </form>
  );
}
Implement inline editing functionality with edit/view toggle
Add masking for sensitive fields (Tax ID)
Create separate sections for Personal Information, Identification, and Address Information

Task 4: "Documents" Tab UI & Functionality on Detail Page
Status: [Pending]
Progress: 0%
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Documents Tab Layout), sprint_3.0.md (Document Management API Endpoints)
Subtask 4.1: Implement "Documents" Tab Structure
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/DocumentsTab.tsx (initial structure)
Action: Create the basic layout for the "Documents" tab, including a section title, "Upload Document" button, and placeholders for document list/grid and views.
Purpose: To establish the foundational UI for managing a business owner's documents.
AI Action: Generate the DocumentsTab.tsx component with a header, an "Upload Document" button that will trigger a modal, and an area for displaying documents.
Guidance for AI/Developer: Implement a responsive layout. Include an empty state message for when no documents are present. The "Upload Document" button should manage state for an upload modal.
Validation Command: View the "Documents" tab on the owner detail page. Verify the "Upload Document" button is present and the empty state displays correctly if no documents exist.
Expected Output: Documents tab structure is in place. "Upload Document" button is functional (opens modal placeholder). Empty state is handled.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Documents Tab Layout)
Implementation Details:

Create a well-structured documents tab with section title and controls
Add "Upload Document" button with proper positioning and styling
Implement responsive layout for document list/grid display
Add proper empty state for when no documents exist

Subtask 4.2: Display Owner's Documents with Enhanced Visualization
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/DocumentsTab.tsx (continued)
Action: Fetch and display the owner's documents in both grid and list views within the "Documents" tab.
Purpose: To allow users to easily view and identify uploaded documents, with clear indicators for document type and status.
AI Action: Enhance DocumentsTab.tsx to fetch documents (or receive them as props). Create DocumentGridItem and DocumentListItem (or similar) components. Implement view toggle logic.
Guidance for AI/Developer: Use icons to represent different file types (PDF, image, etc.). Display document status using the StatusBadge component. Implement document preview functionality (e.g., in a modal).
Validation Command: Upload various document types for an owner. Verify they are displayed correctly in both grid and list views in the "Documents" tab. Test document preview.
Expected Output: Documents are listed with correct icons, names, and statuses. Grid and list views are responsive. Document preview is functional.
Outcome: [Pending]
Ref: StatusBadge.tsx, sprint_3.0.md (GET /api/business-owners/[ownerId]/documents)
Implementation Details:

Implement document list populated from owner data fetch
Create both grid and list views with responsive design:

TypeScript

// In DocumentsTab.tsx
// {viewMode === 'grid' ? (
//   <motion.div 
//     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//     variants={containerVariants} // Assuming variants are defined
//     initial="hidden"
//     animate="visible"
//   >
//     <AnimatePresence>
//       {filteredDocuments.map((doc) => ( // Assuming filteredDocuments exist
//         <motion.div
//           key={doc.id}
//           variants={itemVariants} // Assuming variants are defined
//         >
//           <Card 
//             className="card-glass h-full hover:bg-surface/80 transition-colors cursor-pointer" // Styles from sprint_3.1.md
//             onClick={() => handleViewDocument(doc)} // Assuming handleViewDocument exists
//           >
//             <div className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Avatar
//                     shape="circle"
//                     size="md"
//                     className="bg-gray-700 mr-3" // Styles from sprint_3.1.md
//                   >
//                     {getFileIcon(doc.fileType)} {/* getFileIcon defined below */}
//                   </Avatar>
                  
//                   <div>
//                     <h3 className="font-medium text-text-primary mb-1 truncate">{doc.filename || doc.name || `Document ${doc.id.substring(0, 8)}`}</h3>
//                     <div className="flex items-center text-sm text-text-secondary">
//                       <span className="capitalize">{doc.category || 'Uncategorized'}</span>
//                       <span className="mx-2">•</span>
//                       <span>{format(new Date(doc.uploadedAt || doc.createdAt), 'MMM d, yyyy')}</span> {/* Using date-fns format */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-3 flex justify-between items-center">
//                 <Badge
//                   size="sm"
//                   colorType="light"
//                   color={docStatusConfig[doc.status]?.color || 'gray'} // docStatusConfig defined below
//                 >
//                   <span className="flex items-center">
//                     {docStatusConfig[doc.status]?.icon}
//                     {docStatusConfig[doc.status]?.text || doc.status || 'Uploaded'}
//                   </span>
//                 </Badge>
                
//                 <div className="flex gap-1">
//                   <button
//                     className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleViewDocument(doc);
//                     }}
//                     aria-label="View document"
//                   >
//                     <ArrowUpRight size={18} />
//                   </button>
                  
//                   {!isReadOnly && ( // Assuming isReadOnly state exists
//                     <button
//                       className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
//                       onClick={(e) => handleDeleteClick(doc, e)} // Assuming handleDeleteClick exists
//                       aria-label="Delete document"
//                     >
//                       <Trash size={18} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </motion.div>
//       ))}
//     </AnimatePresence>
//   </motion.div>
// ) : (
//   // Table view...
// )
// Assume this code is part of DocumentsTab.tsx or a similar component
Add visual indicators for different document types and statuses:

TypeScript

// Helper function and config within DocumentsTab.tsx or imported
import { FilePdf, FileImage, File, CheckSquare, XSquare, WarningCircle, ArrowUpRight, Trash } from 'phosphor-react';
import { format } from 'date-fns'; // For date formatting
// import { Badge, Avatar, Card } from 'keep-react'; // Assuming these are used within the render logic

// Define DocumentType or import it
interface DocumentType {
  id: string;
  filename?: string; // Original filename
  name?: string; // User-defined name or same as filename
  fileType?: string; // MIME type
  category?: string;
  uploadedAt?: string | Date; // ISO string or Date object
  createdAt: string | Date; // Fallback if uploadedAt not present
  status: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'PENDING' | 'EXPIRED' | string; // Allow other strings for flexibility
  url?: string; // Presigned URL for viewing/downloading
}


// Get file icon based on type
const getFileIcon = (fileType?: string) => {
  const type = fileType?.toLowerCase() || '';
  if (type.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
  if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => type.includes(ext))) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  if (type.includes('doc') || type.includes('word')) return <FileDoc size={24} className="text-sky-400" />; // Added FileDoc example
  if (type.includes('xls') || type.includes('excel')) return <FileXls size={24} className="text-green-400" />; // Added FileXls example
  return <File size={24} className="text-gray-400" />;
};

// Status configuration for documents
const docStatusConfig: Record<string, { color: 'gray' | 'success' | 'error' | 'warning'; text: string; icon?: JSX.Element }> = {
  UPLOADED: { color: 'gray', text: 'Uploaded', icon: <File size={14} className="mr-1" /> },
  VERIFIED: { color: 'success', text: 'Verified', icon: <CheckSquare size={14} className="mr-1" weight="fill" /> },
  REJECTED: { color: 'error', text: 'Rejected', icon: <XSquare size={14} className="mr-1" weight="fill" /> },
  PENDING: { color: 'warning', text: 'Pending Review', icon: <WarningCircle size={14} className="mr-1" /> },
  EXPIRED: { color: 'error', text: 'Expired', icon: <WarningCircle size={14} className="mr-1" /> }, // Example for expired
  DEFAULT: { color: 'gray', text: 'Unknown', icon: <File size={14} className="mr-1" />}
};

// Example usage within a map function:
// documents.map(doc => {
//   const statusDetails = docStatusConfig[doc.status] || docStatusConfig.DEFAULT;
//   // ... render using statusDetails.color, statusDetails.text, statusDetails.icon
// });
Implement document preview functionality with modal viewer

Subtask 4.3: Implement Document Upload UI within "Documents" Tab
Status: [Pending]
Progress: 0%
File Path: ./src/components/features/business-owners/DocumentUploadModal.tsx
Action: Develop a DocumentUploadModal component with file input (including drag-and-drop), category selection, and notes.
Purpose: To allow users to upload new documents for a business owner with relevant metadata.
AI Action: Generate DocumentUploadModal.tsx. Implement form handling for file and metadata. Use FormData for submission to /api/business-owners/[ownerId]/documents.
Guidance for AI/Developer: Implement file type and size validation (potentially based on subscription tier later). Show upload progress. Handle success and error states clearly.
Validation Command: In the "Documents" tab, click "Upload Document". Test modal functionality: select/drop file, enter category, submit. Verify API call and success/error handling.
Expected Output: Document upload modal allows file selection/drop and metadata input. Validation works. Upload progress is shown. API interaction is correct.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Document Upload Modal), sprint_3.0.md (POST /api/business-owners/[ownerId]/documents)
Implementation Details:

Create document upload modal with file input and category selection:

TypeScript

// In DocumentUploadModal.tsx
// export default function DocumentUploadModal({ 
//   isOpen, 
//   onClose, 
//   ownerId,
//   onSuccess
// }: DocumentUploadModalProps) { // Props from sprint_3.1.md
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Initialize form (assuming react-hook-form and zod are set up as in sprint_3.1.md)
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch
//   } = useForm<DocumentFormValues>({ /* ... */ }); // DocumentFormValues and documentSchema from sprint_3.1.md
  
//   // Handle file selection (from sprint_3.1.md)
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  
//   // Submit form (from sprint_3.1.md)
//   const onSubmit = async (data: DocumentFormValues) => { /* ... */ };

//   // Modal JSX structure (simplified, refer to sprint_3.1.md for full structure)
//   // return (
//   //   <Modal show={isOpen} onClose={onClose}>
//   //     <Modal.Header>{success ? 'Document Uploaded' : 'Upload New Document'}</Modal.Header>
//   //     <Modal.Body>
//   //       {/* Form with file input, category, notes, progress bar */}
//   //     </Modal.Body>
//   //     <Modal.Footer>
//   //       {/* Cancel and Submit buttons */}
//   //     </Modal.Footer>
//   //   </Modal>
//   // );
// }
// Full component code is in sprint_3.1.md for this subtask.
Add drag-and-drop file upload with visual feedback
Add file type and size validation per subscription tier
Create FormData preparation with API integration
Add success/error handling with visual feedback

Task 5: Verification Workflow Trigger Implementation
Status: [Pending]
Progress: 0%
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Verification Trigger Points), BusinessOwnerVerificationWizard.tsx (to be developed in Sprint 3.2)
Subtask 5.1: Add "Start Verification" Button & Functionality
Status: [Pending]
Progress: 0%
File Path: ./src/app/(dashboard)/business-owners/[id]/page.tsx
Action: Add a "Start/Continue/Restart Verification" button on the Business Owner Detail Page, conditionally rendered based on the owner's current verification status.
Purpose: To provide a clear call to action for initiating or continuing the verification process for a business owner.
AI Action: In BusinessOwnerDetailPage.tsx, implement the button with conditional text and disabled states based on owner.verificationStatus. The button's onClick handler should open the verification wizard.
Guidance for AI/Developer: Style the button according to its importance and the owner's status. Ensure it's prominently placed.
Validation Command: View detail pages for owners with different verification statuses. Verify the button text, enabled/disabled state, and action are correct for each status.
Expected Output: Verification button displays correct text and state based on owner's status. Clicking it (when enabled) triggers the visibility of the verification wizard.
Outcome: [Pending]
Ref: ui_ux_design_specifications.md (Detail Page - Verification Action)
Implementation Details:

Add prominently placed "Start Verification Process" button near status display:

TypeScript

// In BusinessOwnerDetailPage.tsx
// <KeepButton
//   size="md"
//   color={owner.verificationStatus === 'VERIFIED' ? 'gray' : 'primary'} // Example conditional color
//   onClick={handleStartVerification} // Assuming handleStartVerification exists
//   disabled={status.actionDisabled} // status comes from pageStatusConfig
// >
//   {status.actionText} {/* status comes from pageStatusConfig */}
// </KeepButton>
// Full component code is in sprint_3.1.md for this subtask.
Implement conditional rendering based on verification status:

"Start Verification Process" for UNVERIFIED or REJECTED status
"Continue Verification" for NEEDS_INFO status
Disabled button with "Already Verified" text for VERIFIED status
Add visual styling consistent with action importance
Implement handler to open verification wizard:

TypeScript

// In BusinessOwnerDetailPage.tsx
// const handleStartVerification = () => {
//   setIsWizardOpen(true); // Assuming setIsWizardOpen state controls wizard visibility
// };
// Full component code is in sprint_3.1.md for this subtask.
Subtask 5.2: Create Integration Point for Verification Wizard
Status: [Pending]
Progress: 0%
Action: Integrate a placeholder for the BusinessOwnerVerificationWizard component into the Detail Page and manage its visibility and completion callback.
Purpose: To prepare the Detail Page for the full integration of the verification wizard in the next sprint.
AI Action: In BusinessOwnerDetailPage.tsx, add state for isWizardOpen. Render the <BusinessOwnerVerificationWizard /> component conditionally based on this state. Implement onClose and onVerificationComplete handlers.
Guidance for AI/Developer: The onVerificationComplete callback should update the owner's data on the detail page (e.g., verification status) or trigger a re-fetch.
Validation Command: Trigger the verification wizard from the detail page. Verify the placeholder wizard opens and closes. Simulate the onVerificationComplete callback and check if owner data is updated.
Expected Output: Verification wizard (placeholder) can be opened and closed. onVerificationComplete callback updates UI or triggers data refetch.
Outcome: [Pending]
Ref: BusinessOwnerVerificationWizard.tsx (Interface definition for props)
Implementation Details:

Implement state for tracking wizard modal visibility:

TypeScript

// In BusinessOwnerDetailPage.tsx
// const [isWizardOpen, setIsWizardOpen] = useState(false);
// Full component code is in sprint_3.1.md for this subtask.
Add function to handle verification completion callback:

TypeScript

// In BusinessOwnerDetailPage.tsx
// const handleVerificationComplete = (data) => {
//   // Update the owner data with the verification result
//   setOwner(prev => ({
//     ...prev,
//     verificationStatus: data.finalDecision.status, // Example data structure
//     lastVerifiedAt: data.finalDecision.status === 'VERIFIED' ? new Date().toISOString() : null,
//     certificateId: data.certificateId || null
//   }));
  
//   if (data.certificateId) {
//     // setCertificateId(data.certificateId); // No longer separate state, part of owner object
//   }
  
//   setIsWizardOpen(false);
// };
// Full component code is in sprint_3.1.md for this subtask.
Add re-fetch logic after verification is completed to ensure data consistency
Create placeholder for the wizard component integration:

TypeScript

// In BusinessOwnerDetailPage.tsx
{/* <BusinessOwnerVerificationWizard
  isOpen={isWizardOpen}
  onClose={() => setIsWizardOpen(false)}
  ownerId={id} // owner's ID
  ownerData={owner} // current owner data
  onVerificationComplete={handleVerificationComplete} // callback
/> */}
// Full component code is in sprint_3.1.md for this subtask.
Task 6: Git Commit for Sprint 3.1
Status: [Pending]
Progress: 0%
Action: Add all new/modified frontend files to Git staging and commit the changes with a descriptive message.
Purpose: To save the completed work for Sprint 3.1 to version control.
AI Action: [Manual Task] Provide the git commands.
Guidance for AI/Developer: Ensure all relevant files are staged. Use a conventional commit message format.
Validation Command: git status (to check staged files), git log -1 (to verify commit).
Expected Output: All Sprint 3.1 frontend files are committed to the repository with the message "feat(sprint-3.1): implement frontend core UI for business owners module".
Outcome: [Pending]
Ref: Git documentation, Conventional Commits specification.
Implementation Details:

Add all new/modified frontend files to Git staging
Commit the changes with a descriptive message:

Bash

git add .
git commit -m "feat(sprint-3.1): implement frontend core UI for business owners module"
Implementation Notes and Technical Debt
Performance Considerations:

The enhanced Business Owners List has sophisticated filtering and sorting that may require performance optimization as data volume grows.
Consider implementing virtualization for large lists in future sprints.
Monitor API response times for complex filter combinations.
Technical Enhancements for Next Sprint:

Complete the full verification wizard integration in Sprint 3.2.
Consider adding export functionality for filtered business owner lists.
Enhance the verification completion experience with more detailed feedback.
Accessibility Validation:

Conduct a dedicated WCAG 2.1 AA audit on all completed components.
Test with screen readers to ensure proper ARIA implementation.
Verify keyboard navigation flows, especially for modal interactions.