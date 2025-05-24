'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'keep-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PencilSimple, 
  FloppyDisk, 
  X, 
  User, 
  Phone, 
  Envelope, 
  MapPinLine, 
  IdentificationCard,
  CalendarBlank,
  Eye,
  EyeSlash
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Components
import { Input } from '@/components/common/Input';
import ErrorMessage from '@/components/common/ErrorMessage';

// Types
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  maternalLastName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  taxId?: string;
  idLicenseNumber?: string;
  idType?: string;
  idIssuingCountry?: string;
  idIssuingState?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  addressCountry?: string;
  verificationStatus: string;
  createdAt?: string;
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
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  taxId: z.string().optional().or(z.literal('')),
  
  // ID Fields
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
const InfoItem = ({ icon, label, value, sensitive = false, showSensitive, onToggleSensitive }: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  sensitive?: boolean;
  showSensitive?: boolean;
  onToggleSensitive?: () => void;
}) => {
  if (!value && value !== '0') return null;

  const displayValue = sensitive ? (showSensitive ? value : '••••••••') : value;
  const IconComponent = icon;

  return (
    <div className="flex items-start py-2">
      <IconComponent size={18} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
      <div className="flex-grow">
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block text-sm text-gray-200">{displayValue}</span>
      </div>
      {sensitive && onToggleSensitive && (
        <button onClick={onToggleSensitive} className="ml-2 p-1 rounded text-gray-400 hover:text-primary">
          {showSensitive ? <EyeSlash size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default function OverviewTab({ owner, onUpdate, isReadOnly = false }: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showTaxId, setShowTaxId] = useState(false);
  const [showIdNumber, setShowIdNumber] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {},
  });

  // Populate form with owner data when owner changes or edit mode starts
  useEffect(() => {
    if (owner) {
      const defaultVals: OverviewFormValues = {
        firstName: owner.firstName || '',
        lastName: owner.lastName || '',
        maternalLastName: owner.maternalLastName || '',
        email: owner.email || '',
        phone: owner.phone || '',
        dateOfBirth: owner.dateOfBirth ? owner.dateOfBirth.split('T')[0] : '',
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
    reset();
    setIsEditing(false);
    setApiError('');
  };

  const onSubmit = async (data: OverviewFormValues) => {
    if (isReadOnly) return;
    if (!isDirty) {
      setIsEditing(false);
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // Transform data for API
      const transformedData = { ...data };
      
      // In a real app, this would be an API call
      // const response = await fetch(`/api/business-owners/${owner.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(transformedData),
      // });
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the owner data with the form values
      const updatedOwner = {
        ...owner,
        ...transformedData
      };
      
      onUpdate(updatedOwner);
      setIsEditing(false);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update business owner');
    } finally {
      setIsLoading(false);
    }
  };

  // Render sections
  const renderSection = (title: string, icon: React.ElementType, fields: JSX.Element, sectionKey: string) => (
    <motion.div 
      key={sectionKey}
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 * parseInt(sectionKey.split('-')[1]) }}
      className="p-6 rounded-lg shadow bg-gray-800 border border-gray-700"
    >
      <div className="flex items-center mb-4">
        {React.createElement(icon, { size: 20, className: "mr-3 text-primary" })}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {fields}
    </motion.div>
  );

  const personalInfoFields = isEditing ? (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="First Name*" 
          id="firstName" 
          registration={register('firstName')} 
          error={errors.firstName?.message}
        />
        <Input 
          label="Last Name*" 
          id="lastName" 
          registration={register('lastName')} 
          error={errors.lastName?.message}
        />
      </div>
      <Input 
        label="Maternal Last Name" 
        id="maternalLastName" 
        registration={register('maternalLastName')} 
        error={errors.maternalLastName?.message}
      />
      <Input 
        label="Email Address*" 
        id="email" 
        type="email" 
        registration={register('email')} 
        error={errors.email?.message} 
        disabled={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Phone Number" 
          id="phone" 
          type="tel" 
          registration={register('phone')} 
          error={errors.phone?.message}
        />
        <Input 
          label="Date of Birth" 
          id="dateOfBirth" 
          type="date" 
          registration={register('dateOfBirth')} 
          error={errors.dateOfBirth?.message}
        />
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
      <InfoItem 
        icon={User} 
        label="Full Name" 
        value={`${owner.firstName} ${owner.lastName}${owner.maternalLastName ? ' ' + owner.maternalLastName : ''}`.trim()}
      />
      <InfoItem icon={Envelope} label="Email" value={owner.email} />
      <InfoItem icon={Phone} label="Phone" value={owner.phone || 'Not provided'} />
      <InfoItem 
        icon={CalendarBlank} 
        label="Date of Birth" 
        value={owner.dateOfBirth ? new Date(owner.dateOfBirth).toLocaleDateString() : 'Not provided'} 
      />
    </div>
  );

  const identificationFields = isEditing ? (
    <div className="space-y-4">
      <Input 
        label="Tax ID (e.g., SSN, EIN)" 
        id="taxId" 
        registration={register('taxId')} 
        error={errors.taxId?.message}
      />
      <Input 
        label="ID/License Number" 
        id="idLicenseNumber" 
        registration={register('idLicenseNumber')} 
        error={errors.idLicenseNumber?.message}
      />
      <Input 
        label="ID Type" 
        id="idType" 
        registration={register('idType')} 
        error={errors.idType?.message}
      />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
      <InfoItem 
        icon={IdentificationCard} 
        label="Tax ID" 
        value={owner.taxId || 'Not provided'} 
        sensitive={!!owner.taxId} 
        showSensitive={showTaxId} 
        onToggleSensitive={() => setShowTaxId(!showTaxId)}
      />
      <InfoItem 
        icon={IdentificationCard} 
        label="ID/License Number" 
        value={owner.idLicenseNumber || 'Not provided'} 
        sensitive={!!owner.idLicenseNumber} 
        showSensitive={showIdNumber} 
        onToggleSensitive={() => setShowIdNumber(!showIdNumber)}
      />
      <InfoItem icon={IdentificationCard} label="ID Type" value={owner.idType || 'Not provided'} />
    </div>
  );

  const addressFields = isEditing ? (
    <div className="space-y-4">
      <Input 
        label="Address Line 1" 
        id="addressLine1" 
        registration={register('addressLine1')} 
        error={errors.addressLine1?.message}
      />
      <Input 
        label="Address Line 2" 
        id="addressLine2" 
        registration={register('addressLine2')} 
        error={errors.addressLine2?.message}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input 
          label="City" 
          id="city" 
          registration={register('city')} 
          error={errors.city?.message}
        />
        <Input 
          label="State/Province" 
          id="state" 
          registration={register('state')} 
          error={errors.state?.message}
        />
        <Input 
          label="ZIP/Postal Code" 
          id="zipCode" 
          registration={register('zipCode')} 
          error={errors.zipCode?.message}
        />
      </div>
      <Input 
        label="Country" 
        id="addressCountry" 
        registration={register('addressCountry')} 
        error={errors.addressCountry?.message}
      />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
      <InfoItem 
        icon={MapPinLine} 
        label="Address" 
        value={
          [owner.addressLine1, owner.addressLine2]
            .filter(Boolean)
            .join(', ') || 'Not provided'
        } 
      />
      <InfoItem 
        icon={MapPinLine} 
        label="City, State, ZIP" 
        value={
          [owner.city, owner.state, owner.zipCode]
            .filter(Boolean)
            .join(', ') || 'Not provided'
        } 
      />
      <InfoItem icon={MapPinLine} label="Country" value={owner.addressCountry || 'Not provided'} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && <ErrorMessage message={apiError} type="error" />}
      
      {!isReadOnly && (
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                size="md" 
                type="button" 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                className="border-gray-600 text-gray-300"
              >
                <X size={18} className="mr-1" /> Cancel
              </Button>
              <Button 
                size="md" 
                type="submit" 
                disabled={isLoading || !isDirty}
                className={`bg-primary hover:bg-primary-dark text-white ${isLoading || !isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FloppyDisk size={18} className="mr-1" /> {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button 
              size="md" 
              type="button" 
              variant="outline" 
              onClick={handleEdit}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <PencilSimple size={18} className="mr-1" /> Edit Profile
            </Button>
          )}
        </div>
      )}

      {renderSection("Personal Information", User, personalInfoFields, "section-1")}
      {renderSection("Identification", IdentificationCard, identificationFields, "section-2")}
      {renderSection("Address Information", MapPinLine, addressFields, "section-3")}
    </form>
  );
} 