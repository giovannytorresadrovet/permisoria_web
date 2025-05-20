'use client';

import { useState } from 'react';
import { Card, Button } from 'keep-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PencilSimple, Check, X, User, Phone, Envelope, MapPin, IdentificationCard } from 'phosphor-react';
import { Input } from '@/components/common/Input';
import ErrorMessage from '@/components/auth/ErrorMessage';

// Define the form validation schema
const ownerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  idLicenseNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

interface OverviewTabProps {
  owner: any;
  onUpdate: (updatedOwner: any) => void;
}

export default function OverviewTab({ owner, onUpdate }: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form with owner data
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: owner.firstName || '',
      lastName: owner.lastName || '',
      email: owner.email || '',
      phone: owner.phone || '',
      taxId: owner.taxId || '',
      idLicenseNumber: owner.idLicenseNumber || '',
      addressLine1: owner.addressLine1 || '',
      addressLine2: owner.addressLine2 || '',
      city: owner.city || '',
      zipCode: owner.zipCode || '',
    }
  });
  
  // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Cancel edit
  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setError('');
  };
  
  // Submit form
  const onSubmit = async (data: OwnerFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/business-owners/${owner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update business owner');
      }
      
      // Update owner in parent component
      onUpdate({
        ...owner,
        ...data
      });
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the business owner');
      console.error('Error updating business owner:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Owner Information</h2>
        
        {!isEditing ? (
          <Button
            size="sm"
            type="button"
            onClick={handleEdit}
          >
            <PencilSimple size={18} className="mr-2" />
            Edit Details
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            
            <Button
              size="sm"
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <form className={!isEditing ? 'pointer-events-none' : ''}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card className="card-glass">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full mr-3">
                  <User size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    id="firstName"
                    placeholder="Enter first name"
                    registration={register('firstName')}
                    error={errors.firstName?.message}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Last Name"
                    id="lastName"
                    placeholder="Enter last name"
                    registration={register('lastName')}
                    error={errors.lastName?.message}
                    disabled={!isEditing}
                  />
                </div>
                
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  registration={register('email')}
                  error={errors.email?.message}
                  icon={<Envelope size={20} className="text-gray-400" />}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Phone Number"
                  id="phone"
                  placeholder="Enter phone number"
                  registration={register('phone')}
                  error={errors.phone?.message}
                  icon={<Phone size={20} className="text-gray-400" />}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>
          
          {/* Identification Card */}
          <Card className="card-glass">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/10 rounded-full mr-3">
                  <IdentificationCard size={20} className="text-purple-500" />
                </div>
                <h3 className="text-lg font-medium text-text-primary">Identification</h3>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Tax ID (Masked)"
                  id="taxId"
                  placeholder="Enter tax ID"
                  registration={register('taxId')}
                  error={errors.taxId?.message}
                  disabled={!isEditing}
                />
                
                <Input
                  label="ID/License Number"
                  id="idLicenseNumber"
                  placeholder="Enter ID or license number"
                  registration={register('idLicenseNumber')}
                  error={errors.idLicenseNumber?.message}
                  disabled={!isEditing}
                />
                
                <div className="text-xs text-amber-400 bg-amber-400/10 p-3 rounded">
                  <strong>Note:</strong> Sensitive information like Tax IDs are stored securely and only the last 4 digits are visible to authorized users.
                </div>
              </div>
            </div>
          </Card>
          
          {/* Address Card */}
          <Card className="card-glass md:col-span-2">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500/10 rounded-full mr-3">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-text-primary">Address Information</h3>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Address Line 1"
                  id="addressLine1"
                  placeholder="Enter street address"
                  registration={register('addressLine1')}
                  error={errors.addressLine1?.message}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Address Line 2 (Optional)"
                  id="addressLine2"
                  placeholder="Enter apt, suite, unit, etc."
                  registration={register('addressLine2')}
                  error={errors.addressLine2?.message}
                  disabled={!isEditing}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    id="city"
                    placeholder="Enter city"
                    registration={register('city')}
                    error={errors.city?.message}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="ZIP/Postal Code"
                    id="zipCode"
                    placeholder="Enter ZIP/postal code"
                    registration={register('zipCode')}
                    error={errors.zipCode?.message}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}