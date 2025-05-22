'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Button, Timeline } from 'keep-react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  XSquare, 
  Clock, 
  CalendarCheck, 
  Download,
  WarningCircle,
  CaretRight,
  QrCode,
  Article,
  Certificate
} from 'phosphor-react';
import { format } from 'date-fns';

// Components
import ErrorMessage from '@/components/auth/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

// Status configuration for verification attempts
const statusConfig = {
  VERIFIED: { 
    color: 'success', 
    icon: <CheckSquare size={16} weight="fill" />,
    text: 'Verified'
  },
  REJECTED: { 
    color: 'error', 
    icon: <XSquare size={16} weight="fill" />,
    text: 'Rejected'
  },
  NEEDS_INFO: { 
    color: 'warning', 
    icon: <WarningCircle size={16} weight="fill" />,
    text: 'Needs Information'
  },
  PENDING: { 
    color: 'gray', 
    icon: <Clock size={16} weight="fill" />,
    text: 'Pending Review'
  },
};

// Component for individual verification item
const VerificationItemRow = ({ item, onViewDocument }) => {
  return (
    <div className="p-3 border-b border-gray-700 last:border-0 hover:bg-gray-700/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-text-primary">{item.name}</h4>
            {item.documentId && (
              <Button
                size="xs"
                variant="text"
                onClick={() => onViewDocument(item.documentId)}
                className="ml-2 text-primary hover:text-primary/80"
              >
                <CaretRight size={14} className="mr-1" />
                View Document
              </Button>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1">{item.category}</p>
        </div>
        <Badge
          size="xs"
          colorType="light"
          color={statusConfig[item.status]?.color || 'gray'}
        >
          <span className="flex items-center">
            {statusConfig[item.status]?.icon}
            <span className="ml-1">{statusConfig[item.status]?.text || item.status}</span>
          </span>
        </Badge>
      </div>
      
      {item.notes && (
        <div className="mt-2 text-xs bg-gray-800 p-2 rounded-md text-gray-300">
          <strong>Verifier Notes:</strong> {item.notes}
        </div>
      )}
    </div>
  );
};

// Component for verification attempt summary
const VerificationAttemptSummaryCard = ({ attempt, onViewDetails }) => {
  return (
    <Card className="card-glass mb-4 hover:bg-surface/80 transition-colors cursor-pointer" onClick={onViewDetails}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <Badge
                size="sm"
                colorType="light"
                color={statusConfig[attempt.decision]?.color || 'gray'}
              >
                <span className="flex items-center">
                  {statusConfig[attempt.decision]?.icon}
                  <span className="ml-1">{statusConfig[attempt.decision]?.text || attempt.decision}</span>
                </span>
              </Badge>
              <span className="text-sm text-gray-400 ml-2">
                {format(new Date(attempt.completedAt || attempt.initiatedAt), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-sm text-text-primary mt-1">
              {attempt.completedAt ? 'Completed by' : 'Initiated by'}: {attempt.initiatedByName || 'Permit Manager'}
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(attempt.id);
            }}
          >
            View Details
          </Button>
        </div>
        
        {attempt.decisionReason && (
          <div className="mt-2 text-xs bg-gray-800 p-2 rounded-md text-gray-300">
            <strong>Reason:</strong> {attempt.decisionReason}
          </div>
        )}
      </div>
    </Card>
  );
};

// Component for certificate display
const CertificateDisplay = ({ certificateId, ownerId, onDownload }) => {
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCertificateInfo = async () => {
      if (!certificateId || !ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/business-owners/${ownerId}/verification/certificate?id=${certificateId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch certificate information');
        }
        
        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.message || 'Failed to load certificate information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCertificateInfo();
  }, [certificateId, ownerId]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="h-10 bg-gray-700 rounded w-32 mt-4"></div>
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (!certificate) {
    return <div className="text-gray-400 italic">Certificate information not available</div>;
  }
  
  return (
    <Card className="card-glass">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Certificate size={24} className="text-green-400 mr-2" />
          <h3 className="text-lg font-medium text-text-primary">Verification Certificate</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-400">Certificate ID</p>
            <p className="text-white">{certificate.id}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-400">Issued Date</p>
            <p className="text-white flex items-center">
              <CalendarCheck size={16} className="mr-2 text-gray-400" />
              {format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-400">Expiry Date</p>
            <p className="text-white flex items-center">
              <CalendarCheck size={16} className="mr-2 text-gray-400" />
              {format(new Date(certificate.expiresAt), 'MMMM d, yyyy')}
            </p>
          </div>
          
          {certificate.verificationHash && (
            <div>
              <p className="text-sm font-medium text-gray-400">Verification Hash</p>
              <p className="text-white font-mono text-xs bg-gray-700 p-2 rounded-md mt-1 truncate">
                {certificate.verificationHash}
              </p>
            </div>
          )}
          
          <div className="flex space-x-3 mt-6">
            <Button
              size="sm"
              onClick={onDownload}
            >
              <Download size={18} className="mr-2" />
              Download Certificate
            </Button>
            
            {certificate.validationUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(certificate.validationUrl, '_blank')}
              >
                <QrCode size={18} className="mr-2" />
                Validate Certificate
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function VerificationDetailsTab({ 
  ownerId, 
  verificationStatus, 
  lastVerifiedAt, 
  verificationExpiresAt, 
  certificateId,
  onStartVerification 
}) {
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [activeVerificationId, setActiveVerificationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch verification details
  useEffect(() => {
    const fetchVerificationDetails = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch verification details
        const response = await fetch(`/api/business-owners/${ownerId}/verification`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch verification details');
        }
        
        const data = await response.json();
        setVerificationDetails(data.currentVerification || null);
        setVerificationHistory(data.verificationHistory || []);
        
        // Set active verification to most recent one
        if (data.verificationHistory?.length > 0) {
          setActiveVerificationId(data.verificationHistory[0].id);
        }
      } catch (err) {
        console.error('Error fetching verification details:', err);
        setError(err.message || 'Failed to load verification details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVerificationDetails();
  }, [ownerId]);
  
  const handleViewDocument = (documentId) => {
    // Logic to open document viewer modal
    console.log('View document:', documentId);
  };
  
  const handleViewVerificationDetails = (verificationId) => {
    setActiveVerificationId(verificationId);
  };
  
  const handleDownloadCertificate = () => {
    if (certificateId) {
      window.open(`/api/business-owners/${ownerId}/verification/certificate?id=${certificateId}&download=true`, '_blank');
    }
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
  
  // If loading
  if (isLoading) {
    return <LoadingSkeleton type="verificationDetails" />;
  }
  
  // If no verification attempts have been made
  if (!verificationDetails && verificationHistory.length === 0 && !error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Verification Details</h2>
        
        <EmptyState
          icon={<CheckSquare size={36} className="text-primary" weight="light" />}
          title="No Verification Attempts"
          description="This business owner has not undergone any verification processes yet. Start the verification process to establish their identity and address."
          actionLabel="Start Verification"
          onAction={onStartVerification}
        />
      </div>
    );
  }
  
  // If error occurred
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Verification Details</h2>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  // Current verification status
  const currentStatus = {
    status: verificationStatus,
    lastVerifiedAt,
    expiresAt: verificationExpiresAt,
  };
  
  // Active verification details (for detailed view)
  const activeVerification = verificationHistory.find(v => v.id === activeVerificationId) || null;
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Verification Details</h2>
        
        {verificationStatus !== 'VERIFIED' && (
          <Button
            size="sm"
            onClick={onStartVerification}
          >
            {verificationStatus === 'UNVERIFIED' ? 'Start Verification' : 'Continue Verification'}
          </Button>
        )}
      </div>
      
      {/* Current verification status summary */}
      <motion.div variants={itemVariants}>
        <Card className="card-glass">
          <div className="p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Current Status</h3>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStatus.status === 'VERIFIED' ? 'bg-green-500/20' :
                  currentStatus.status === 'REJECTED' ? 'bg-red-500/20' :
                  currentStatus.status === 'NEEDS_INFO' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                }`}>
                  {statusConfig[currentStatus.status]?.icon || <Clock size={24} className="text-gray-400" />}
                </div>
                
                <div className="ml-4">
                  <div className="flex items-center">
                    <Badge
                      size="sm"
                      colorType="light"
                      color={statusConfig[currentStatus.status]?.color || 'gray'}
                    >
                      <span className="flex items-center">
                        {statusConfig[currentStatus.status]?.text || currentStatus.status}
                      </span>
                    </Badge>
                  </div>
                  
                  {currentStatus.lastVerifiedAt && (
                    <div className="text-sm text-gray-400 mt-1">
                      Last verified on {format(new Date(currentStatus.lastVerifiedAt), 'MMMM d, yyyy')}
                    </div>
                  )}
                  
                  {currentStatus.expiresAt && (
                    <div className="text-sm text-gray-400 mt-1">
                      Expires on {format(new Date(currentStatus.expiresAt), 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>
              
              {currentStatus.status === 'VERIFIED' && certificateId && (
                <Button
                  size="sm"
                  color="success"
                  variant="outline"
                  onClick={handleDownloadCertificate}
                >
                  <Download size={18} className="mr-2" />
                  Certificate
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Verification certificate (if verified) */}
      {currentStatus.status === 'VERIFIED' && certificateId && (
        <motion.div variants={itemVariants}>
          <CertificateDisplay 
            certificateId={certificateId} 
            ownerId={ownerId} 
            onDownload={handleDownloadCertificate} 
          />
        </motion.div>
      )}
      
      {/* Verification attempts history */}
      {verificationHistory.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verification attempts list */}
          <div className="md:col-span-1">
            <Card className="card-glass h-full">
              <div className="p-4">
                <h3 className="text-base font-medium text-text-primary mb-3">Verification Attempts</h3>
                
                <div className="max-h-[400px] overflow-y-auto pr-1 space-y-1">
                  {verificationHistory.map((attempt) => (
                    <div 
                      key={attempt.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        activeVerificationId === attempt.id ? 'bg-primary/20 border border-primary/50' : 'hover:bg-gray-700/50'
                      }`}
                      onClick={() => handleViewVerificationDetails(attempt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            attempt.decision === 'VERIFIED' ? 'bg-green-500/20' :
                            attempt.decision === 'REJECTED' ? 'bg-red-500/20' :
                            attempt.decision === 'NEEDS_INFO' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                          }`}>
                            {statusConfig[attempt.decision]?.icon || <Clock size={16} className="text-gray-400" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {statusConfig[attempt.decision]?.text || attempt.decision || 'Attempt'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {format(new Date(attempt.completedAt || attempt.initiatedAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Active verification details */}
          <div className="md:col-span-2">
            {activeVerification ? (
              <Card className="card-glass h-full">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-text-primary flex items-center">
                      <Article size={18} className="mr-2" />
                      Verification Details
                    </h3>
                    <Badge
                      size="sm"
                      colorType="light"
                      color={statusConfig[activeVerification.decision]?.color || 'gray'}
                    >
                      {statusConfig[activeVerification.decision]?.text || activeVerification.decision}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Verification ID</p>
                        <p className="text-white text-sm font-mono">{activeVerification.id.substring(0, 12)}...</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-400">Initiated By</p>
                        <p className="text-white">{activeVerification.initiatedByName || 'Permit Manager'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-400">Initiated On</p>
                        <p className="text-white">{format(new Date(activeVerification.initiatedAt), 'MMMM d, yyyy')}</p>
                      </div>
                      
                      {activeVerification.completedAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-400">Completed On</p>
                          <p className="text-white">{format(new Date(activeVerification.completedAt), 'MMMM d, yyyy')}</p>
                        </div>
                      )}
                    </div>
                    
                    {activeVerification.decisionReason && (
                      <div>
                        <p className="text-sm font-medium text-gray-400">Decision Reason</p>
                        <div className="mt-1 p-3 bg-gray-800 rounded-md text-sm text-gray-300">
                          {activeVerification.decisionReason}
                        </div>
                      </div>
                    )}
                    
                    {/* Verification sections */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Verification Items</h4>
                      
                      <div className="border border-gray-700 rounded-md overflow-hidden">
                        {/* Identity section */}
                        <div className="border-b border-gray-700 p-3 bg-gray-800">
                          <h5 className="font-medium text-white">Identity Verification</h5>
                        </div>
                        
                        {activeVerification.identityItems?.map((item, index) => (
                          <VerificationItemRow 
                            key={`identity-${index}`} 
                            item={item} 
                            onViewDocument={handleViewDocument}
                          />
                        )) || (
                          <div className="p-3 text-gray-400 italic">No identity items</div>
                        )}
                        
                        {/* Address section */}
                        <div className="border-b border-gray-700 p-3 bg-gray-800">
                          <h5 className="font-medium text-white">Address Verification</h5>
                        </div>
                        
                        {activeVerification.addressItems?.map((item, index) => (
                          <VerificationItemRow 
                            key={`address-${index}`} 
                            item={item} 
                            onViewDocument={handleViewDocument}
                          />
                        )) || (
                          <div className="p-3 text-gray-400 italic">No address items</div>
                        )}
                        
                        {/* Business affiliation section */}
                        <div className="border-b border-gray-700 p-3 bg-gray-800">
                          <h5 className="font-medium text-white">Business Affiliation</h5>
                        </div>
                        
                        {activeVerification.affiliationItems?.map((item, index) => (
                          <VerificationItemRow 
                            key={`affiliation-${index}`} 
                            item={item} 
                            onViewDocument={handleViewDocument}
                          />
                        )) || (
                          <div className="p-3 text-gray-400 italic">No affiliation items</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="card-glass h-full flex items-center justify-center">
                <div className="p-8 text-center">
                  <p className="text-gray-400">Select a verification attempt to view details</p>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}