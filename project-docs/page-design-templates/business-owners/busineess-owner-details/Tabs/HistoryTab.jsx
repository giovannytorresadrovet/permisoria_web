'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Tabs } from 'keep-react';
import { motion } from 'framer-motion';
import { 
  ClockClockwise, 
  CalendarBlank, 
  User, 
  ArrowRight, 
  PencilSimple, 
  CheckCircle, 
  XCircle, 
  WarningCircle, 
  CaretDoubleRight,
  FileDocument,
  Buildings,
  CaretDown,
  CaretUp
} from 'phosphor-react';
import { format } from 'date-fns';

// Components
import ErrorMessage from '@/components/auth/ErrorMessage';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';

// Action type icons and colors
const actionConfig = {
  PROFILE_UPDATE: {
    icon: <PencilSimple size={16} />,
    color: 'blue',
    text: 'Profile Updated'
  },
  VERIFICATION_STARTED: {
    icon: <CaretDoubleRight size={16} />,
    color: 'gray',
    text: 'Verification Started'
  },
  VERIFICATION_VERIFIED: {
    icon: <CheckCircle size={16} weight="fill" />,
    color: 'success',
    text: 'Verification Approved'
  },
  VERIFICATION_REJECTED: {
    icon: <XCircle size={16} weight="fill" />,
    color: 'error',
    text: 'Verification Rejected'
  },
  VERIFICATION_NEEDS_INFO: {
    icon: <WarningCircle size={16} weight="fill" />,
    color: 'warning',
    text: 'Verification Needs Info'
  },
  DOCUMENT_UPLOADED: {
    icon: <FileDocument size={16} />,
    color: 'purple',
    text: 'Document Uploaded'
  },
  BUSINESS_LINKED: {
    icon: <Buildings size={16} />,
    color: 'green',
    text: 'Business Linked'
  },
  BUSINESS_UNLINKED: {
    icon: <Buildings size={16} />,
    color: 'red',
    text: 'Business Unlinked'
  }
};

// History item component for list view
const HistoryItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const config = actionConfig[item.actionType] || {
    icon: <ClockClockwise size={16} />,
    color: 'gray',
    text: item.actionType
  };
  
  return (
    <div className="border-b border-gray-700 last:border-0 py-3">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${config.color}-500/20 text-${config.color}-400`}>
          {config.icon}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-white flex items-center">
                <span>{config.text}</span>
                
                {/* Show action details if available */}
                {item.details?.field && (
                  <span className="ml-1 text-gray-400">
                    : {item.details.field}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-400 flex items-center mt-1">
                <User size={14} className="mr-1" />
                <span>{item.actorName}</span>
                <span className="mx-1">•</span>
                <CalendarBlank size={14} className="mr-1" />
                <span>{format(new Date(item.timestamp), 'MMM d, yyyy, h:mm a')}</span>
              </div>
            </div>
            
            {/* Expand/collapse button if details exist */}
            {(item.details?.from || item.details?.to || item.details?.notes) && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={expanded ? "Collapse details" : "Expand details"}
              >
                {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </button>
            )}
          </div>
          
          {/* Expandable details */}
          {expanded && (
            <div className="mt-2 text-sm">
              {item.details?.notes && (
                <div className="bg-gray-750 p-2 rounded-md mt-1 text-gray-300">
                  <strong className="text-white">Notes:</strong> {item.details.notes}
                </div>
              )}
              
              {(item.details?.from || item.details?.to) && (
                <div className="flex items-center mt-2 text-gray-400">
                  {item.details?.from && (
                    <span className="bg-gray-750 px-2 py-1 rounded">
                      {item.details.from}
                    </span>
                  )}
                  
                  {item.details?.from && item.details?.to && (
                    <ArrowRight size={14} className="mx-2" />
                  )}
                  
                  {item.details?.to && (
                    <span className="bg-gray-750 px-2 py-1 rounded text-white">
                      {item.details.to}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Timeline component for timeline view
const TimelineView = ({ historyItems }) => {
  return (
    <div className="relative pl-8">
      {/* Vertical timeline line */}
      <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-700" />
      
      {historyItems.map((item, index) => {
        const config = actionConfig[item.actionType] || {
          icon: <ClockClockwise size={16} />,
          color: 'gray',
          text: item.actionType
        };
        
        return (
          <div key={item.id} className="mb-6 last:mb-0 relative">
            {/* Timeline dot */}
            <div className={`absolute left-0 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-gray-800 flex items-center justify-center bg-${config.color}-500/20 text-${config.color}-400 z-10`}>
              {config.icon}
            </div>
            
            {/* Timeline content */}
            <Card className="card-glass ml-4">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-white flex items-center">
                      <span>{config.text}</span>
                      
                      {/* Show action details if available */}
                      {item.details?.field && (
                        <span className="ml-1 text-gray-400">
                          : {item.details.field}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-400 flex items-center mt-1">
                      <User size={14} className="mr-1" />
                      <span>{item.actorName}</span>
                      <span className="mx-1">•</span>
                      <CalendarBlank size={14} className="mr-1" />
                      <span>{format(new Date(item.timestamp), 'MMM d, yyyy, h:mm a')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                {(item.details?.from || item.details?.to || item.details?.notes) && (
                  <div className="mt-3 text-sm">
                    {item.details?.notes && (
                      <div className="bg-gray-750 p-2 rounded-md text-gray-300">
                        <strong className="text-white">Notes:</strong> {item.details.notes}
                      </div>
                    )}
                    
                    {(item.details?.from || item.details?.to) && (
                      <div className="flex items-center mt-2 text-gray-400">
                        {item.details?.from && (
                          <span className="bg-gray-750 px-2 py-1 rounded">
                            {item.details.from}
                          </span>
                        )}
                        
                        {item.details?.from && item.details?.to && (
                          <ArrowRight size={14} className="mx-2" />
                        )}
                        
                        {item.details?.to && (
                          <span className="bg-gray-750 px-2 py-1 rounded text-white">
                            {item.details.to}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default function HistoryTab({ ownerId }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'
  const [filterOptions, setFilterOptions] = useState({
    actionType: 'all',
    actor: 'all',
    dateRange: 'all'
  });
  
  // Mock user list (in a real app, this would be fetched from the backend)
  const actors = [
    { id: 'user-1', name: 'Jane Smith' },
    { id: 'user-2', name: 'Alex Johnson' },
    { id: 'user-3', name: 'Sam Williams' }
  ];
  
  // Fetch history items
  useEffect(() => {
    const fetchHistoryItems = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would be an API call
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockHistoryItems = [
          {
            id: '1',
            actionType: 'VERIFICATION_VERIFIED',
            actorId: 'user-1',
            actorName: 'Jane Smith',
            timestamp: new Date(2025, 4, 20, 14, 30).toISOString(),
            details: {
              notes: 'All documents verified successfully. Identity and address verified.'
            }
          },
          {
            id: '2',
            actionType: 'DOCUMENT_UPLOADED',
            actorId: 'user-3',
            actorName: 'Sam Williams',
            timestamp: new Date(2025, 4, 15, 10, 45).toISOString(),
            details: {
              field: 'Utility Bill',
              notes: 'Address proof document uploaded'
            }
          },
          {
            id: '3',
            actionType: 'VERIFICATION_STARTED',
            actorId: 'user-1',
            actorName: 'Jane Smith',
            timestamp: new Date(2025, 4, 15, 9, 20).toISOString()
          },
          {
            id: '4',
            actionType: 'PROFILE_UPDATE',
            actorId: 'user-2',
            actorName: 'Alex Johnson',
            timestamp: new Date(2025, 4, 10, 16, 15).toISOString(),
            details: {
              field: 'Phone Number',
              from: '+1 (555) 555-1234',
              to: '+1 (555) 123-4567'
            }
          },
          {
            id: '5',
            actionType: 'DOCUMENT_UPLOADED',
            actorId: 'user-2',
            actorName: 'Alex Johnson',
            timestamp: new Date(2025, 4, 5, 11, 30).toISOString(),
            details: {
              field: 'Driver\'s License',
              notes: 'Identity document uploaded'
            }
          },
          {
            id: '6',
            actionType: 'PROFILE_UPDATE',
            actorId: 'user-2',
            actorName: 'Alex Johnson',
            timestamp: new Date(2025, 4, 1, 10, 0).toISOString(),
            details: {
              field: 'Email',
              from: 'old.email@example.com',
              to: 'maria.rodriguez@example.com'
            }
          }
        ];
        
        setHistoryItems(mockHistoryItems);
        setFilteredItems(mockHistoryItems);
      } catch (err) {
        console.error('Error fetching history items:', err);
        setError(err.message || 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistoryItems();
  }, [ownerId]);
  
  // Filter history items based on filter options
  useEffect(() => {
    let filtered = [...historyItems];
    
    // Filter by action type
    if (filterOptions.actionType !== 'all') {
      filtered = filtered.filter(item => item.actionType === filterOptions.actionType);
    }
    
    // Filter by actor
    if (filterOptions.actor !== 'all') {
      filtered = filtered.filter(item => item.actorId === filterOptions.actor);
    }
    
    // Filter by date range
    if (filterOptions.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filterOptions.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(item => new Date(item.timestamp) >= startDate);
      }
    }
    
    setFilteredItems(filtered);
  }, [historyItems, filterOptions]);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="historyList" rows={5} />;
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">History</h2>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  // Empty state
  if (historyItems.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">History</h2>
        
        <EmptyState
          icon={<ClockClockwise size={36} className="text-primary" weight="light" />}
          title="No History Available"
          description="There are no history records available for this business owner yet. Actions like profile updates, verifications, and document uploads will be recorded here."
        />
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-text-primary">History</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Action type filter */}
          <select
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterOptions.actionType}
            onChange={(e) => handleFilterChange('actionType', e.target.value)}
          >
            <option value="all">All Actions</option>
            {Object.entries(actionConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.text}
              </option>
            ))}
          </select>
          
          {/* Actor filter */}
          <select
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterOptions.actor}
            onChange={(e) => handleFilterChange('actor', e.target.value)}
          >
            <option value="all">All Users</option>
            {actors.map(actor => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
          
          {/* Date range filter */}
          <select
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterOptions.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          
          {/* View toggle */}
          <div className="flex bg-gray-700 rounded-md p-0.5 border border-gray-600">
            <button
              className={`px-2 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              List
            </button>
            <button
              className={`px-2 py-1 rounded-md text-sm ${viewMode === 'timeline' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('timeline')}
              aria-label="Timeline View"
            >
              Timeline
            </button>
          </div>
        </div>
      </div>
      
      {/* Display results count */}
      <div className="text-sm text-gray-400">
        Showing {filteredItems.length} of {historyItems.length} events
      </div>
      
      {/* History content */}
      <Card className="card-glass overflow-hidden">
        <div className="p-5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No records match your filter criteria.
            </div>
          ) : (
            viewMode === 'list' ? (
              <div className="divide-y divide-gray-700">
                {filteredItems.map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <TimelineView historyItems={filteredItems} />
            )
          )}
        </div>
      </Card>
    </motion.div>
  );
}