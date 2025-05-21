// src/app/(dashboard)/business-owners/[id]/page.jsx - Integration Example
import React, { useState, useEffect } from 'react';
import { Button, Card, Badge } from 'keep-react';
import { CheckCircle, IdentificationCard, MapPin, Buildings, Clock, XCircle } from 'phosphor-react';
import BusinessOwnerVerificationWizard from '../../../../components/features/business-owners/verification/BusinessOwnerVerificationWizard';

// This is a simplified example of integration
export default function BusinessOwnerDetailPage({ params }) {
  const { id } = params;
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock fetch owner data - in a real app, this would be an API call
  useEffect(() => {
    const fetchOwnerData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setOwnerData({
          id: id || 'BO-123456',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          email: 'maria.rodriguez@example.com',
          phone: '+1 (555) 123-4567',
          addressLine1: '123 Calle Sol',
          addressLine2: 'Apt 4B',
          city: 'San Juan',
          zipCode: '00901',
          verificationStatus: 'PENDING'
        });
      } catch (error) {
        console.error('Error fetching owner data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerData();
  }, [id]);
  
  const handleVerificationComplete = (data) => {
    console.log('Verification completed with data:', data);
    // In a real app, you would call your API to update the owner's status
    
    // For demo purposes, update the local state
    setOwnerData(prev => ({
      ...prev,
      verificationStatus: data.finalDecision.status
    }));
    
    setIsWizardOpen(false);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-800 border border-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-800 border border-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  // If no data found
  if (!ownerData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Business Owner Not Found</h1>
        <p className="text-gray-400">The owner with ID {id} could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with Name and Verification Status */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {ownerData.firstName} {ownerData.lastName}
          </h1>
          <p className="text-gray-400">{ownerData.id}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            color={getStatusColor(ownerData.verificationStatus)} 
            size="md"
            icon={getStatusIcon(ownerData.verificationStatus)}
          >
            {getStatusLabel(ownerData.verificationStatus)}
          </Badge>
          
          <Button
            size="md"
            color="primary"
            onClick={() => setIsWizardOpen(true)}
            disabled={ownerData.verificationStatus === 'VERIFIED'}
          >
            <CheckCircle size={18} className="mr-2" />
            {ownerData.verificationStatus === 'VERIFIED' 
              ? 'Verified' 
              : (ownerData.verificationStatus === 'NEEDS_INFO' 
                ? 'Continue Verification'
                : 'Start Verification Process')}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-5">
            <div className="flex items-center mb-4">
              <IdentificationCard size={20} className="text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="font-medium">{ownerData.firstName} {ownerData.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p>{ownerData.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p>{ownerData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ID/License Number</p>
                  <p>••••••••8976</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Address Information */}
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-5">
            <div className="flex items-center mb-4">
              <MapPin size={20} className="text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold">Address Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Street Address</p>
                <p className="font-medium">{ownerData.addressLine1}</p>
                {ownerData.addressLine2 && <p>{ownerData.addressLine2}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">City</p>
                  <p>{ownerData.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Zip Code</p>
                  <p>{ownerData.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Additional cards for Businesses, Documents, etc. would go here */}
      </div>
      
      {/* Verification Wizard Modal */}
      <BusinessOwnerVerificationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        ownerId={ownerData.id}
        ownerData={ownerData}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

// Utility functions for status display
const getStatusColor = (status) => {
  switch(status) {
    case "VERIFIED": return "success";
    case "REJECTED": return "error";
    case "NEEDS_INFO": return "warning";
    case "PENDING":
    default: return "warning";
  }
};

const getStatusIcon = (status) => {
  switch(status) {
    case "VERIFIED": 
      return <CheckCircle size={14} weight="fill" />;
    case "REJECTED":
      return <XCircle size={14} weight="fill" />;
    case "NEEDS_INFO":
    case "PENDING":
    default:
      return <Clock size={14} weight="fill" />;
  }
};

const getStatusLabel = (status) => {
  switch(status) {
    case "VERIFIED": return "Verified";
    case "REJECTED": return "Rejected";
    case "NEEDS_INFO": return "Needs Information";
    case "PENDING":
    default: return "Pending Verification";
  }
};