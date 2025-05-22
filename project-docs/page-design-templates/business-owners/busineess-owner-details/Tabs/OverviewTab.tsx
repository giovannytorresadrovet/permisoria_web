'use client';

import { useState } from 'react';
import { Card, Button } from 'keep-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PencilSimple, 
  Check, 
  X, 
  User, 
  Phone, 
  Envelope, 
  MapPin, 
  IdentificationCard,
  Calendar
} from 'phosphor-react';
import { motion } from 'framer-motion';

// Components
import { Input } from '@/components/common/Input';
import ErrorMessage from '@/components/auth/ErrorMessage';

// Define the form validation schema
const ownerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  maternalLastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  taxId: z.string().optional(),
  idLicenseNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export default function OverviewTab({ owner, onUpdate, isReadOnly = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  
  // Initialize form with owner data
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: owner.firstName || '',
      lastName: owner.lastName || '',
      maternalLastName: owner.maternalLastName || '',
      email: owner.email || '',
      phone: owner.phone || '',
      dateOfBirth: owner.dateOfBirth || '',
      taxId: owner.taxId || '',
      idLicenseNumber: owner.idLicenseNumber || '',
      addressLine1: owner.addressLine1 || '',
      addressLine2: owner.addressLine2 || '',
      city: owner.city || '',
      state: owner.state || '',
      zipCode: owner.zipCode || '',
    }
  });
  
  // Mask sensitive information (e.g., Tax ID)
  const maskSensitiveInfo = (text) => {
    if (!text) return '';
    if (showSensitiveInfo) return text;
    
    const visibleLength = Math.min(4, text.length);
    const maskedLength = text.length - visibleLength;
    return '•'.repeat(maskedLength) + text.slice(-visibleLength);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
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
  
  // Toggle sensitive info visibility
  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo);
  };
  
  // Submit form
  const onSubmit = async (data) => {
    if (isReadOnly) return;
    if (!isDirty) {
      setIsEditing(false);
      return;
    }
    
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
    } catch (err) {
      setError(err.message || 'An error occurred while updating the business owner');
      console.error('Error updating business owner:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Owner Information</h2>
        
        {!isEditing && !isReadOnly && (
          <Button
            size="sm"
            type="button"
            onClick={handleEdit}
          >
            <PencilSimple size={18} className="mr-2" />
            Edit Details
          </Button>
        )}
        
        {isEditing && (
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
              disabled={isLoading || !isDirty}
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
      
      <form className={!isEditing ? 'pointer-events-none' : ''} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="card-glass h-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <User size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
                </div>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      {/* Editable fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          id="firstName"
                          placeholder="Enter first name"
                          registration={register('firstName')}
                          error={errors.firstName?.message}
                        />
                        
                        <Input
                          label="Last Name"
                          id="lastName"
                          placeholder="Enter last name"
                          registration={register('lastName')}
                          error={errors.lastName?.message}
                        />
                      </div>
                      
                      <Input
                        label="Maternal Last Name (Optional)"
                        id="maternalLastName"
                        placeholder="Enter maternal last name"
                        registration={register('maternalLastName')}
                        error={errors.maternalLastName?.message}
                      />
                      
                      <Input
                        label="Date of Birth"
                        id="dateOfBirth"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        registration={register('dateOfBirth')}
                        error={errors.dateOfBirth?.message}
                        icon={<Calendar size={20} className="text-gray-400" />}
                      />
                      
                      <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        registration={register('email')}
                        error={errors.email?.message}
                        icon={<Envelope size={20} className="text-gray-400" />}
                      />
                      
                      <Input
                        label="Phone Number"
                        id="phone"
                        placeholder="Enter phone number"
                        registration={register('phone')}
                        error={errors.phone?.message}
                        icon={<Phone size={20} className="text-gray-400" />}
                      />
                    </>
                  ) : (
                    <>
                      {/* Read-only display */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400">First Name</p>
                          <p className="text-white">{owner.firstName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-400">Last Name</p>
                          <p className="text-white">{owner.lastName}</p>
                        </div>
                        
                        {owner.maternalLastName && (
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-400">Maternal Last Name</p>
                            <p className="text-white">{owner.maternalLastName}</p>
                          </div>
                        )}
                        
                        {owner.dateOfBirth && (
                          <div>
                            <p className="text-sm font-medium text-gray-400">Date of Birth</p>
                            <p className="text-white flex items-center">
                              <Calendar size={16} className="mr-2 text-gray-400" />
                              {formatDate(owner.dateOfBirth)}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium text-gray-400">Email Address</p>
                          <p className="text-white flex items-center">
                            <Envelope size={16} className="mr-2 text-gray-400" />
                            {owner.email}
                          </p>
                        </div>
                        
                        {owner.phone && (
                          <div>
                            <p className="text-sm font-medium text-gray-400">Phone Number</p>
                            <p className="text-white flex items-center">
                              <Phone size={16} className="mr-2 text-gray-400" />
                              {owner.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Identification Card */}
          <motion.div 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.1 }}
          >
            <Card className="card-glass h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/10 rounded-full mr-3">
                      <IdentificationCard size={20} className="text-purple-500" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">Identification</h3>
                  </div>
                  
                  {!isEditing && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={toggleSensitiveInfo}
                    >
                      {showSensitiveInfo ? 'Hide' : 'Show'} Sensitive Info
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="Tax ID"
                        id="taxId"
                        placeholder="Enter tax ID"
                        registration={register('taxId')}
                        error={errors.taxId?.message}
                      />
                      
                      <Input
                        label="ID/License Number"
                        id="idLicenseNumber"
                        placeholder="Enter ID or license number"
                        registration={register('idLicenseNumber')}
                        error={errors.idLicenseNumber?.message}
                      />
                    </>
                  ) : (
                    <div className="grid gap-y-4">
                      {owner.taxId && (
                        <div>
                          <p className="text-sm font-medium text-gray-400">Tax ID</p>
                          <p className="text-white">{maskSensitiveInfo(owner.taxId)}</p>
                        </div>
                      )}
                      
                      {owner.idLicenseNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-400">ID/License Number</p>
                          <p className="text-white">{maskSensitiveInfo(owner.idLicenseNumber)}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-amber-400 bg-amber-400/10 p-3 rounded">
                    <strong>Note:</strong> Sensitive information like Tax IDs are stored securely and only the last 4 digits are visible to authorized users.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Address Card */}
          <motion.div 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="card-glass">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-full mr-3">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">Address Information</h3>
                </div>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="Address Line 1"
                        id="addressLine1"
                        placeholder="Enter street address"
                        registration={register('addressLine1')}
                        error={errors.addressLine1?.message}
                      />
                      
                      <Input
                        label="Address Line 2 (Optional)"
                        id="addressLine2"
                        placeholder="Enter apt, suite, unit, etc."
                        registration={register('addressLine2')}
                        error={errors.addressLine2?.message}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                          label="City"
                          id="city"
                          placeholder="Enter city"
                          registration={register('city')}
                          error={errors.city?.message}
                        />
                        
                        <Input
                          label="State/Province"
                          id="state"
                          placeholder="Enter state"
                          registration={register('state')}
                          error={errors.state?.message}
                        />
                        
                        <Input
                          label="ZIP/Postal Code"
                          id="zipCode"
                          placeholder="Enter ZIP/postal code"
                          registration={register('zipCode')}
                          error={errors.zipCode?.message}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {owner.addressLine1 ? (
                        <div className="grid gap-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-400">Address</p>
                            <p className="text-white">{owner.addressLine1}</p>
                            {owner.addressLine2 && <p className="text-white">{owner.addressLine2}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {owner.city && (
                              <div>
                                <p className="text-sm font-medium text-gray-400">City</p>
                                <p className="text-white">{owner.city}</p>
                              </div>
                            )}
                            
                            {owner.state && (
                              <div>
                                <p className="text-sm font-medium text-gray-400">State/Province</p>
                                <p className="text-white">{owner.state}</p>
                              </div>
                            )}
                            
                            {owner.zipCode && (
                              <div>
                                <p className="text-sm font-medium text-gray-400">ZIP/Postal Code</p>
                                <p className="text-white">{owner.zipCode}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">
                          No address information available.
                        </div>
                      )}
                      
                      {/* Map Preview (for address visualization) */}
                      {owner.addressLine1 && owner.city && (
                        <div className="mt-4 bg-gray-700 rounded-md overflow-hidden h-48 relative">
                          {/* This would be replaced with an actual map component in production */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin size={32} className="text-blue-500 animate-bounce" />
                            <p className="text-sm text-gray-400 absolute bottom-4">
                              {owner.addressLine1}, {owner.city}, {owner.state} {owner.zipCode}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </form>
    </div>
  );
}