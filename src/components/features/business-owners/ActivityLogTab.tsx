'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CaretDown, 
  CaretUp, 
  ClockCounterClockwise,
  User,
  Pencil,
  Files,
  Article,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Calendar
} from 'phosphor-react';

interface ActivityLog {
  id: string;
  type: 'DOCUMENT_UPLOAD' | 'DOCUMENT_VERIFY' | 'PROFILE_UPDATE' | 'STATUS_CHANGE' | 'VERIFICATION_STEP' | 'NOTE_ADDED' | 'BUSINESS_ADDED';
  description: string;
  createdAt: string;
  createdBy?: string;
  metadata?: any;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}

interface ActivityLogTabProps {
  ownerId: string;
}

// Activity Type Icon Mapping
const getActivityIcon = (type: string, severity?: string) => {
  switch (type) {
    case 'DOCUMENT_UPLOAD':
      return <Files size={16} className="text-blue-400" />;
    case 'DOCUMENT_VERIFY':
      return severity === 'ERROR' 
        ? <XCircle size={16} className="text-red-400" /> 
        : <CheckCircle size={16} className="text-green-400" />;
    case 'PROFILE_UPDATE':
      return <Pencil size={16} className="text-yellow-400" />;
    case 'STATUS_CHANGE':
      return severity === 'ERROR' 
        ? <XCircle size={16} className="text-red-400" /> 
        : severity === 'WARNING' 
          ? <Warning size={16} className="text-orange-400" /> 
          : <CheckCircle size={16} className="text-green-400" />;
    case 'VERIFICATION_STEP':
      return <ClockCounterClockwise size={16} className="text-purple-400" />;
    case 'NOTE_ADDED':
      return <Article size={16} className="text-gray-400" />;
    case 'BUSINESS_ADDED':
      return <Calendar size={16} className="text-indigo-400" />;
    default:
      return <Info size={16} className="text-blue-400" />;
  }
};

// Activity Severity Background
const getSeverityBackground = (severity?: string) => {
  switch (severity) {
    case 'ERROR':
      return 'bg-red-400/10';
    case 'WARNING':
      return 'bg-orange-400/10';
    case 'SUCCESS':
      return 'bg-green-400/10';
    case 'INFO':
    default:
      return 'bg-blue-400/10';
  }
};

export default function ActivityLogTab({ ownerId }: ActivityLogTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // Fetch activity logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/business-owners/${ownerId}/activity-logs?type=${typeFilter}&startDate=${startDate || ''}&endDate=${endDate || ''}`);
        // const data = await response.json();
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockLogs: ActivityLog[] = [
          {
            id: '1',
            type: 'PROFILE_UPDATE',
            description: 'Profile information updated',
            createdAt: new Date(2023, 6, 15, 9, 30).toISOString(),
            createdBy: 'John Admin',
            severity: 'INFO',
            metadata: {
              changedFields: ['phone', 'address']
            }
          },
          {
            id: '2',
            type: 'DOCUMENT_UPLOAD',
            description: 'Uploaded ID document: drivers_license.pdf',
            createdAt: new Date(2023, 6, 14, 15, 45).toISOString(),
            createdBy: 'System',
            severity: 'INFO'
          },
          {
            id: '3',
            type: 'DOCUMENT_VERIFY',
            description: 'ID document verified successfully',
            createdAt: new Date(2023, 6, 14, 16, 20).toISOString(),
            createdBy: 'Maria Verifier',
            severity: 'SUCCESS'
          },
          {
            id: '4',
            type: 'STATUS_CHANGE',
            description: 'Status changed from UNVERIFIED to PENDING_VERIFICATION',
            createdAt: new Date(2023, 6, 13, 11, 10).toISOString(),
            createdBy: 'System',
            severity: 'INFO'
          },
          {
            id: '5',
            type: 'DOCUMENT_UPLOAD',
            description: 'Uploaded business permit: permit_2023.jpg',
            createdAt: new Date(2023, 6, 12, 14, 25).toISOString(),
            createdBy: 'System',
            severity: 'INFO'
          },
          {
            id: '6',
            type: 'DOCUMENT_VERIFY',
            description: 'Business permit rejected: Document expired',
            createdAt: new Date(2023, 6, 12, 16, 40).toISOString(),
            createdBy: 'Maria Verifier',
            severity: 'ERROR',
            metadata: {
              reason: 'Document expired',
              requiredAction: 'Upload a valid, non-expired permit'
            }
          },
          {
            id: '7',
            type: 'NOTE_ADDED',
            description: 'Added note: Customer called about verification status',
            createdAt: new Date(2023, 6, 11, 10, 15).toISOString(),
            createdBy: 'Support Team',
            severity: 'INFO'
          },
          {
            id: '8',
            type: 'BUSINESS_ADDED',
            description: 'New business associated: ABC Corporation',
            createdAt: new Date(2023, 6, 10, 9, 0).toISOString(),
            createdBy: 'John Admin',
            severity: 'INFO'
          }
        ];
        
        // Filter by type if specified
        const filteredLogs = typeFilter 
          ? mockLogs.filter(log => log.type === typeFilter)
          : mockLogs;
          
        // Filter by date range if specified
        const dateFilteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.createdAt);
          
          if (startDate && endDate) {
            return logDate >= new Date(startDate) && logDate <= new Date(endDate);
          }
          
          if (startDate) {
            return logDate >= new Date(startDate);
          }
          
          if (endDate) {
            return logDate <= new Date(endDate);
          }
          
          return true;
        });
        
        setActivityLogs(dateFilteredLogs);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch activity logs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, [ownerId, typeFilter, startDate, endDate]);
  
  const handleLogClick = (logId: string) => {
    setSelectedLog(prev => prev === logId ? null : logId);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Group activity logs by date
  const groupedLogs = activityLogs.reduce((groups, log) => {
    const date = new Date(log.createdAt).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ActivityLog[]>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-white">Activity Log</h2>
          <p className="text-gray-400 text-sm mt-1">
            History of all actions and changes for this business owner
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Date filters */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value || null)}
              className="bg-gray-700 text-white rounded-md py-1.5 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Start Date"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value || null)}
              className="bg-gray-700 text-white rounded-md py-1.5 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="End Date"
            />
          </div>
          
          {/* Activity type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">All Activities</option>
            <option value="DOCUMENT_UPLOAD">Document Uploads</option>
            <option value="DOCUMENT_VERIFY">Document Verifications</option>
            <option value="PROFILE_UPDATE">Profile Updates</option>
            <option value="STATUS_CHANGE">Status Changes</option>
            <option value="VERIFICATION_STEP">Verification Steps</option>
            <option value="NOTE_ADDED">Notes</option>
            <option value="BUSINESS_ADDED">Business Additions</option>
          </select>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-700 rounded-full h-8 w-8"></div>
                <div className="flex-1">
                  <div className="bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 w-1/4 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
          <p className="font-medium mb-1">Error loading activity logs</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && activityLogs.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <ClockCounterClockwise size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No activity found</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {typeFilter || startDate || endDate 
              ? 'No activity logs match your current filters. Try adjusting your filters to see more results.'
              : 'There is no activity recorded for this business owner yet.'}
          </p>
          {(typeFilter || startDate || endDate) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setStartDate(null);
                setEndDate(null);
              }}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
      
      {/* Activity logs */}
      {!isLoading && !error && activityLogs.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {sortedDates.map(date => (
            <motion.div key={date} variants={itemVariants} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 pl-2 border-l-2 border-primary">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              
              <div className="space-y-2">
                {groupedLogs[date].map(log => (
                  <motion.div 
                    key={log.id}
                    variants={itemVariants}
                    className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${
                      selectedLog === log.id ? 'shadow-lg' : 'hover:bg-gray-750'
                    }`}
                  >
                    <button
                      onClick={() => handleLogClick(log.id)}
                      className="w-full text-left p-4 flex items-start justify-between"
                    >
                      <div className="flex items-start">
                        <div className={`rounded-full p-2 mr-3 ${getSeverityBackground(log.severity)}`}>
                          {getActivityIcon(log.type, log.severity)}
                        </div>
                        
                        <div>
                          <p className="text-white text-sm font-medium">{log.description}</p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span>{formatDate(log.createdAt)}</span>
                            {log.createdBy && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                                  <User size={12} className="mr-1" />
                                  {log.createdBy}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {log.metadata && (
                        <div className="ml-2 text-gray-400">
                          {selectedLog === log.id ? (
                            <CaretUp size={16} />
                          ) : (
                            <CaretDown size={16} />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {selectedLog === log.id && log.metadata && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-gray-750 rounded-md p-3 text-sm text-gray-300">
                          <h4 className="text-xs uppercase text-gray-400 mb-2">Details</h4>
                          <dl className="grid grid-cols-1 gap-2">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key}>
                                <dt className="text-xs text-gray-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</dt>
                                <dd className="text-sm text-gray-300">
                                  {Array.isArray(value) 
                                    ? value.join(', ')
                                    : typeof value === 'object'
                                      ? JSON.stringify(value)
                                      : String(value)
                                  }
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 