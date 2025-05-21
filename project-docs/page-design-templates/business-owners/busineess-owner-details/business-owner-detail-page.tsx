'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, Avatar, Card, Badge, Button } from 'keep-react';
import { 
  ArrowLeft, 
  User, 
  Documents, 
  CheckCircle, 
  Warning, 
  Clock, 
  X,
  CalendarCheck
} from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ErrorState from '@/components/common/ErrorState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import OverviewTab from '@/components/features/business-owners/OverviewTab';
import DocumentsTab from '@/components/features/business-owners/DocumentsTab';
import BusinessOwnerVerificationWizard from '@/components/features/business-owners/verification/BusinessOwnerVerificationWizard';

// Define status configuration with icon, color, and action button text
const statusConfig = {
  VERIFIED: { 
    color: 'success', 
    icon: <CheckCircle size={16} weight="fill" className="mr-1" />,
    actionText: 'Already Verified',
    actionDisabled: true,
    badgeText: 'Verified',
    description: 'This business owner has been verified and can operate within the platform.'
  },
  UNVERIFIED: { 
    color: 'gray', 
    icon: null,
    actionText: 'Start Verification',
    actionDisabled: false,
    badgeText: 'Unverified',
    description: 'This business owner needs to be verified before they can operate fully.'
  },
  PENDING_VERIFICATION: { 
    color: 'warning', 
    icon: <Clock size={16} weight="fill" className="mr-1" />,
    actionText: 'Continue Verification',
    actionDisabled: false,
    badgeText: 'Pending Verification',
    description: 'Verification process has been started but is not complete.'
  },
  REJECTED: { 
    color: 'error', 
    icon: <X size={16} weight="fill" className="mr-1" />,
    actionText: 'Restart Verification',
    actionDisabled: false,
    badgeText: 'Rejected',
    description: 'Verification was rejected. Please review and restart the process.'
  },
  NEEDS_INFO: { 
    color: 'warning', 
    icon: <Warning size={16} weight="fill" className="mr-1" />,
    actionText: 'Provide Information',
    actionDisabled: false,
    badgeText: 'Needs Information',
    description: 'Additional information is required to complete verification.'
  }
};

export default function BusinessOwnerDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [certificateId, setCertificateId] = useState(null);
  
  // Fetch owner details
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/business-owners/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch business owner details');
        }
        
        const data = await response.json();
        setOwner(data);
        
        // Check if the owner has a verification certificate
        if (data.verificationStatus === 'VERIFIED' && data.certificateId) {
          setCertificateId(data.certificateId);
        }
      } catch (err) {
        console.error('Error fetching business owner:', err);
        setError(err.message || 'An error occurred while fetching business owner details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerDetails();
  }, [id]);
  
  const handleBack = () => {
    router.push('/business-owners');
  };
  
  const handleStartVerification = () => {
    setIsWizardOpen(true);
  };
  
  const handleVerificationComplete = (data) => {
    // Update the owner data with the verification result
    setOwner(prev => ({
      ...prev,
      verificationStatus: data.finalDecision.status,
      lastVerifiedAt: data.finalDecision.status === 'VERIFIED' ? new Date().toISOString() : null,
      certificateId: data.certificateId || null
    }));
    
    if (data.certificateId) {
      setCertificateId(data.certificateId);
    }
    
    setIsWizardOpen(false);
  };
  
  const handleViewCertificate = () => {
    if (certificateId) {
      window.open(`/api/business-owners/${id}/verification/certificate?id=${certificateId}`, '_blank');
    }
  };
  
  // Variants for motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return <LoadingSkeleton type="businessOwnerDetail" />;
  }
  
  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={() => router.refresh()} />;
  }
  
  // If owner not found
  if (!owner) {
    return (
      <motion.div 
        className="text-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Business Owner Not Found</h2>
        <p className="text-gray-400 mb-6">The business owner you're looking for doesn't exist or has been removed.</p>
        <Button
          size="md"
          onClick={handleBack}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Business Owners
        </Button>
      </motion.div>
    );
  }
  
  // Get status configuration based on verification status
  const status = statusConfig[owner.verificationStatus] || statusConfig.UNVERIFIED;
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.div variants={itemVariants} className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Business Owners</span>
        </button>
      </motion.div>
      
      {/* Owner profile card */}
      <motion.div variants={itemVariants}>
        <Card className="card-glass overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Profile info */}
              <div className="flex items-center">
                <Avatar 
                  shape="circle" 
                  size="xl"
                  className="bg-primary/20 text-primary mr-6"
                >
                  {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                </Avatar>
                
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary">
                    {`${owner.firstName} ${owner.lastName}`}
                  </h1>
                  <p className="text-text-secondary">{owner.email}</p>
                  
                  <div className="mt-2 flex items-center">
                    <Badge 
                      colorType="light" 
                      color={status.color}
                      size="sm"
                    >
                      <span className="flex items-center">
                        {status.icon}
                        {status.badgeText}
                      </span>
                    </Badge>
                    
                    {owner.lastVerifiedAt && (
                      <div className="ml-3 flex items-center text-gray-400 text-xs">
                        <CalendarCheck size={14} className="mr-1" />
                        Verified on {new Date(owner.lastVerifiedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="md"
                  color={owner.verificationStatus === 'VERIFIED' ? 'gray' : 'primary'}
                  onClick={handleStartVerification}
                  disabled={status.actionDisabled}
                >
                  {status.actionText}
                </Button>
                
                {certificateId && (
                  <Button
                    size="md"
                    color="success"
                    variant="outline"
                    onClick={handleViewCertificate}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    View Certificate
                  </Button>
                )}
              </div>
            </div>
            
            {/* Status description */}
            {status.description && (
              <div className={`mt-4 p-3 rounded-md bg-${status.color === 'success' ? 'green' : status.color === 'warning' ? 'yellow' : status.color === 'error' ? 'red' : 'blue'}-900/20`}>
                <p className={`text-sm text-${status.color === 'success' ? 'green' : status.color === 'warning' ? 'yellow' : status.color === 'error' ? 'red' : 'blue'}-400`}>
                  {status.description}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
      
      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs 
          className="bg-surface/60 backdrop-blur-sm border border-white/10 rounded-xl"
          activeTabClassName="border-primary text-primary"
          tabClassName="text-gray-400 hover:text-gray-300"
          value={activeTab}
          onTabChange={setActiveTab}
        >
          <Tabs.List className="border-b border-gray-700 p-1">
            <Tabs.Tab 
              value="overview"
              icon={<User size={18} />}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab 
              value="documents"
              icon={<Documents size={18} />}
            >
              Documents
            </Tabs.Tab>
          </Tabs.List>
          
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Tabs.Content value="overview" className="p-6">
                  <OverviewTab 
                    owner={owner} 
                    onUpdate={(updatedOwner) => setOwner(updatedOwner)} 
                    isReadOnly={owner.verificationStatus === 'VERIFIED'}
                  />
                </Tabs.Content>
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
                <Tabs.Content value="documents" className="p-6">
                  <DocumentsTab 
                    ownerId={id} 
                    documents={owner.documents || []}
                    verificationStatus={owner.verificationStatus}
                  />
                </Tabs.Content>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
      
      {/* Business Owner Verification Wizard */}
      <BusinessOwnerVerificationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        ownerId={id}
        ownerData={owner}
        onVerificationComplete={handleVerificationComplete}
      />
    </motion.div>
  );
}