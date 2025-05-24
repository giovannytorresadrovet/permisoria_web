'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  IdentificationCard, 
  Buildings, 
  File, 
  ClockCounterClockwise, 
  CheckCircle, 
  RocketLaunch,
  Medal
} from 'phosphor-react';
import StatusBadge from '@/components/features/business-owners/StatusBadge';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ErrorMessage from '@/components/common/ErrorMessage';
import OverviewTab from '@/components/features/business-owners/OverviewTab';
import DocumentsTab from '@/components/features/business-owners/DocumentsTab';
import ActivityLogTab from '@/components/features/business-owners/ActivityLogTab';
import BusinessesTab from '@/components/features/business-owners/BusinessesTab';

interface BusinessOwnerDetailProps {
  params: {
    id: string;
  };
}

// Define the DetailedBusinessOwner interface with a different name to avoid collision
interface DetailedBusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  maternalLastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  taxId?: string;
  idType?: string;
  idLicenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  addressCountry?: string;
  verificationStatus: string;
  lastVerifiedAt?: string | null;
  certificateId?: string | null;
  createdAt: string;
  documents?: any[];
  _count: {
    businesses: number;
    documents: number;
    activityLogs: number;
  };
}

// Status configuration for action buttons and descriptions
const statusConfig: Record<string, {
  color: string;
  actionText: string;
  actionDisabled: boolean;
  actionIcon: React.ReactNode;
  description?: string;
}> = {
  VERIFIED: { 
    color: 'success', 
    actionText: 'View Certificate', 
    actionDisabled: false, 
    actionIcon: <Medal size={18} className="mr-2" />,
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
  }
};

export default function BusinessOwnerDetail({ params }: BusinessOwnerDetailProps) {
  const router = useRouter();
  const [owner, setOwner] = useState<DetailedBusinessOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Fetch owner data
  useEffect(() => {
    const fetchOwner = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would be an API call
        const mockOwner: DetailedBusinessOwner = {
          id: params.id,
          firstName: 'John',
          lastName: 'Doe',
          maternalLastName: 'Smith',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          dateOfBirth: '1985-06-15',
          taxId: '123-45-6789',
          idType: 'Driver\'s License',
          idLicenseNumber: 'DL12345678',
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          addressCountry: 'US',
          verificationStatus: 'UNVERIFIED',
          lastVerifiedAt: null,
          certificateId: null,
          createdAt: new Date(2023, 3, 15).toISOString(),
          documents: [
            {
              id: '1',
              filename: 'drivers_license.pdf',
              fileType: 'application/pdf',
              category: 'identification',
              uploadedAt: new Date(2023, 3, 16).toISOString(),
              status: 'UPLOADED',
              url: '#'
            },
            {
              id: '2',
              filename: 'business_permit.jpg',
              fileType: 'image/jpeg',
              category: 'permits',
              uploadedAt: new Date(2023, 3, 17).toISOString(),
              status: 'VERIFIED',
              url: '#'
            }
          ],
          _count: { 
            businesses: 3,
            documents: 2,
            activityLogs: 12 
          }
        };
        
        setOwner(mockOwner);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch business owner details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwner();
  }, [params.id]);
  
  const handleBack = () => {
    router.push('/dashboard/business-owners');
  };
  
  const handleOwnerUpdate = (updatedOwner: any) => {
    setOwner(prevOwner => {
      if (!prevOwner) return null;
      
      return {
        ...prevOwner,
        ...updatedOwner,
        _count: prevOwner._count,
        documents: prevOwner.documents,
        lastVerifiedAt: prevOwner.lastVerifiedAt,
        certificateId: prevOwner.certificateId
      };
    });
  };
  
  const handleDocumentsUpdate = (updatedDocuments: any[]) => {
    setOwner((prev: DetailedBusinessOwner | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: updatedDocuments,
        _count: {
          ...prev._count,
          documents: updatedDocuments.length
        }
      };
    });
  };
  
  const handleVerificationAction = () => {
    if (owner?.verificationStatus === 'VERIFIED' && owner?.certificateId) {
      // View certificate action
      console.log('View certificate', owner.certificateId);
      return;
    }
    
    // Open verification wizard
    setIsWizardOpen(true);
    console.log('Open verification wizard for owner', params.id);
  };
  
  const handleVerificationComplete = (updatedData: Partial<DetailedBusinessOwner>) => {
    // Update owner data with verification results
    setOwner((prev: DetailedBusinessOwner | null) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updatedData
      };
    });
    
    setIsWizardOpen(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
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
  
  if (isLoading) {
    return <LoadingSkeleton type="ownerDetail" />;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <Button size="md" onClick={handleBack} className="mb-4 text-gray-300 hover:text-white">
          <ArrowLeft size={18} className="mr-1" /> Back
        </Button>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (!owner) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <Button size="md" onClick={handleBack} className="mb-4 text-gray-300 hover:text-white">
          <ArrowLeft size={18} className="mr-1" /> Back
        </Button>
        <ErrorMessage message="Business owner not found" type="info" />
      </div>
    );
  }
  
  const status = statusConfig[owner.verificationStatus] || statusConfig.UNVERIFIED;
  
  return (
    <motion.div 
      className="space-y-6 p-4 md:p-6 bg-gray-900 min-h-screen text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.div variants={itemVariants}>
        <Button
          size="md"
          onClick={handleBack}
          variant="outline"
          className="flex items-center text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Business Owners</span>
        </Button>
      </motion.div>
      
      {/* Owner profile card */}
      <motion.div variants={itemVariants}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-primary/20 text-primary rounded-full mr-6 flex items-center justify-center" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
                {`${owner.firstName.charAt(0)}${owner.lastName.charAt(0)}`}
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">
                  {`${owner.firstName} ${owner.lastName}`}
                </h1>
                <p className="text-gray-400 mb-3">{owner.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={owner.verificationStatus} size="md" />
                  
                  {owner.verificationStatus === 'VERIFIED' && owner.lastVerifiedAt && (
                    <div className="flex items-center text-gray-400 text-xs">
                      <CheckCircle size={14} className="mr-1 text-green-400" />
                      Verified on {new Date(owner.lastVerifiedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              size="md"
              onClick={handleVerificationAction}
              className={`${owner.verificationStatus === 'VERIFIED' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-dark'} text-white`}
            >
              {status.actionIcon}
              {status.actionText}
            </Button>
          </div>
          
          {/* Status description */}
          {status.description && (
            <motion.div 
              variants={itemVariants}
              className={`mt-4 p-3 rounded-md bg-${status.color}-500/10 border border-${status.color}-500/30`}
            >
              <p className={`text-sm text-${status.color === 'success' ? 'green' : status.color}-300`}>
                {status.description}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        {/* Custom tabs navigation */}
        <div className="flex border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`p-4 flex items-center whitespace-nowrap ${
              activeTab === 'details' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <IdentificationCard size={18} className="mr-2" />
            Details
          </button>
          
          <button
            onClick={() => setActiveTab('businesses')}
            className={`p-4 flex items-center whitespace-nowrap ${
              activeTab === 'businesses' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Buildings size={18} className="mr-2" />
            Businesses ({owner._count?.businesses || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('documents')}
            className={`p-4 flex items-center whitespace-nowrap ${
              activeTab === 'documents' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <File size={18} className="mr-2" />
            Documents ({owner._count?.documents || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('activity')}
            className={`p-4 flex items-center whitespace-nowrap ${
              activeTab === 'activity' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <ClockCounterClockwise size={18} className="mr-2" />
            Activity ({owner._count?.activityLogs || 0})
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OverviewTab 
                  owner={owner} 
                  onUpdate={handleOwnerUpdate} 
                  isReadOnly={owner.verificationStatus === 'VERIFIED'}
                />
              </motion.div>
            )}
            
            {activeTab === 'businesses' && (
              <motion.div
                key="businesses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BusinessesTab ownerId={owner.id} ownerName={`${owner.firstName} ${owner.lastName}`} />
              </motion.div>
            )}
            
            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentsTab
                  ownerId={owner.id}
                  ownerDocuments={owner.documents || []}
                  verificationStatus={owner.verificationStatus}
                  onDocumentsUpdate={handleDocumentsUpdate}
                />
              </motion.div>
            )}
            
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ActivityLogTab ownerId={owner.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Verification Wizard placeholder - will be implemented in Sprint 3.2 */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-medium text-white mb-4">Business Owner Verification</h2>
            <p className="text-gray-400 mb-6">
              This verification wizard will be implemented in Sprint 3.2. For now, this is a placeholder.
            </p>
            <div className="flex justify-end">
              <Button
                size="md"
                onClick={() => setIsWizardOpen(false)}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 