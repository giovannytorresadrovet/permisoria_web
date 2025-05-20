'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, Avatar, Card, Badge } from 'keep-react';
import { ArrowLeft, User, PencilSimple, CheckCircle, Documents, Warning } from 'phosphor-react';
import { motion } from 'framer-motion';
import ErrorState from '@/components/common/ErrorState';
import AuthButton from '@/components/auth/AuthButton';
import DocumentsTab from '@/components/features/business-owners/DocumentsTab';
import OverviewTab from '@/components/features/business-owners/OverviewTab';

// Badge variants based on verification status
const statusVariants = {
  VERIFIED: { color: 'success', icon: <CheckCircle size={16} weight="fill" className="mr-1" /> },
  UNVERIFIED: { color: 'gray', icon: null },
  PENDING_VERIFICATION: { color: 'warning', icon: <Warning size={16} weight="fill" className="mr-1" /> },
  REJECTED: { color: 'error', icon: <Warning size={16} weight="fill" className="mr-1" /> }
};

export default function BusinessOwnerDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
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
    // This will be implemented in a future sprint
    alert('Verification workflow will be implemented in a future sprint');
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="h-10 w-24 bg-gray-700 rounded"></div>
        </div>
        
        <div className="h-40 bg-gray-700 rounded-xl"></div>
        
        <div className="h-10 bg-gray-700 rounded"></div>
        
        <div className="h-64 bg-gray-700 rounded-xl"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={() => router.refresh()} />;
  }
  
  // If owner not found
  if (!owner) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Business Owner Not Found</h2>
        <p className="text-gray-400 mb-6">The business owner you're looking for doesn't exist or has been removed.</p>
        <AuthButton variant="primary" onClick={handleBack}>
          Back to Business Owners
        </AuthButton>
      </div>
    );
  }
  
  // Get status variant
  const statusVariant = statusVariants[owner.verificationStatus] || statusVariants.UNVERIFIED;
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Business Owners</span>
        </button>
      </div>
      
      {/* Owner profile card */}
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
                
                <div className="mt-2">
                  <Badge 
                    colorType="light" 
                    color={statusVariant.color}
                    className="capitalize"
                  >
                    <span className="flex items-center">
                      {statusVariant.icon}
                      {owner.verificationStatus?.toLowerCase().replace('_', ' ') || 'Unverified'}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AuthButton
                variant={owner.verificationStatus === 'VERIFIED' ? 'secondary' : 'primary'}
                onClick={handleStartVerification}
                disabled={owner.verificationStatus === 'VERIFIED'}
              >
                {owner.verificationStatus === 'VERIFIED' 
                  ? 'Already Verified' 
                  : owner.verificationStatus === 'PENDING_VERIFICATION'
                  ? 'Continue Verification'
                  : 'Start Verification'}
              </AuthButton>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
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
        
        <Tabs.Content value="overview" className="p-6">
          <OverviewTab 
            owner={owner} 
            onUpdate={(updatedOwner) => setOwner(updatedOwner)} 
          />
        </Tabs.Content>
        
        <Tabs.Content value="documents" className="p-6">
          <DocumentsTab 
            ownerId={id} 
            documents={owner.documents || []}
          />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}