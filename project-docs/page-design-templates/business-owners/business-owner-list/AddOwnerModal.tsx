'use client';

import { useState, useEffect } from 'react';
import { Modal } from 'keep-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  User, 
  Envelope, 
  Phone, 
  IdentificationCard, 
  CalendarBlank, 
  MapPin 
} from 'phosphor-react';

// Import our reusable components
import AuthButton from '@/components/auth/AuthButton';
import { Input } from '@/components/common/Input';
import ErrorMessage from '@/components/auth/ErrorMessage';

// Import our location data and services
import { LocationOption } from '@/types/location';
import IDENTITY_TYPES from '@/data/identity-types';
import COUNTRIES from '@/data/countries';
import { getChildLocationsForCountry } from '@/services/locationService';

// Calculate the date for 18 years ago
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

// Define the form validation schema
const ownerSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters'),
  paternalLastName: z.string().min(2, 'Paternal last name must be at least 2 characters').max(50, 'Paternal last name cannot exceed 50 characters'),
  maternalLastName: z.string().max(50, 'Maternal last name cannot exceed 50 characters').optional(),
  dateOfBirth: z.date()
    .refine(date => date <= eighteenYearsAgo, { 
      message: 'Business owner must be at least 18 years old'
    }),
  
  // Contact Information
  phoneNumber: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  
  // Identification Information
  identityType: z.string().min(1, 'Please select an identity document type'),
  idNumber: z.string().min(1, 'ID number is required'),
  idCountry: z.string().min(1, 'Please select the issuing country'),
  idIssuingLocation: z.string().min(1, 'Please select the issuing state/municipality'),
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddOwnerModal({ isOpen, onClose, onSuccess }: AddOwnerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<LocationOption[]>([]);
  
  // Initialize form
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      phoneNumber: '',
      email: '',
      identityType: '',
      idNumber: '',
      idCountry: '',
      idIssuingLocation: '',
    }
  });

  // Watch idCountry to update the available locations
  const idCountry = watch('idCountry');
  
  // Update available locations when country changes
  useEffect(() => {
    if (idCountry) {
      // Use our locationService to get the appropriate locations
      const locations = getChildLocationsForCountry(idCountry);
      setAvailableLocations(locations);
      
      // Reset the issuing location when country changes
      setValue('idIssuingLocation', '');
    } else {
      setAvailableLocations([]);
    }
  }, [idCountry, setValue]);
  
  // Submit form
  const onSubmit = async (data: OwnerFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Transform the form data to match the API expectations
      const apiData = {
        firstName: data.firstName,
        lastName: data.paternalLastName, // Map to API's lastName field
        maternalLastName: data.maternalLastName,
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
        phone: data.phoneNumber,
        email: data.email,
        identityType: data.identityType,
        idLicenseNumber: data.idNumber,
        idCountry: data.idCountry,
        idIssuingLocation: data.idIssuingLocation
      };
      
      // API call to create business owner
      const response = await fetch('/api/business-owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Handle specific API errors
        if (response.status === 409) {
          throw new Error('An owner with this email already exists');
        }
        throw new Error(result.error || 'Failed to create business owner');
      }
      
      // Save the new owner ID for redirecting
      setNewOwnerId(result.id);
      setSuccess(true);
      
      // Reset form
      reset();
      
      // Notify parent of success
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the business owner');
      console.error('Error creating business owner:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      // Reset form and state
      reset();
      setError('');
      setSuccess(false);
      setNewOwnerId(null);
      onClose();
    }
  };
  
  // Handle view details of newly created owner
  const handleViewDetails = () => {
    if (newOwnerId) {
      window.location.href = `/business-owners/${newOwnerId}`;
    }
    handleClose();
  };

  // The modal content layout
  return (
    <Modal
      size="xl" // Increased size to accommodate more fields
      show={isOpen}
      onClose={handleClose}
      className="bg-surface border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden"
    >
      <Modal.Header className="border-b border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary">
          {success ? 'Business Owner Created' : 'Add New Business Owner'}
        </h3>
      </Modal.Header>
      
      <Modal.Body className="p-6">
        {error && <ErrorMessage message={error} />}
        
        {success ? (
          <motion.div 
            className="text-center py-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={40} weight="bold" className="text-green-400" />
            </div>
            
            <h4 className="text-lg font-medium text-text-primary mb-2">
              Business Owner Successfully Created
            </h4>
            
            <p className="text-text-secondary mb-6">
              You can now add more details or upload documents for this business owner.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <AuthButton
                onClick={handleViewDetails}
                variant="primary"
                size="md"
              >
                View Owner Details
              </AuthButton>
              
              <AuthButton
                onClick={handleClose}
                variant="outline"
                size="md"
              >
                Add Another Owner
              </AuthButton>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h4 className="font-medium text-lg text-text-primary mb-4 flex items-center">
                <User size={20} className="text-primary mr-2" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="First Name"
                  id="firstName"
                  placeholder="Enter first name"
                  registration={register('firstName')}
                  error={errors.firstName?.message}
                />
                
                <Input
                  label="Paternal Last Name"
                  id="paternalLastName"
                  placeholder="Enter paternal last name"
                  registration={register('paternalLastName')}
                  error={errors.paternalLastName?.message}
                />
                
                <Input
                  label="Maternal Last Name (Optional)"
                  id="maternalLastName"
                  placeholder="Enter maternal last name"
                  registration={register('maternalLastName')}
                  error={errors.maternalLastName?.message}
                />
                
                {/* Date Picker for DOB */}
                <div className="sm:col-span-2 md:col-span-3">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <div className="relative">
                        <input
                          type="date"
                          id="dateOfBirth"
                          className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                          max={eighteenYearsAgo.toISOString().split('T')[0]}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            field.onChange(date);
                          }}
                        />
                        <CalendarBlank 
                          size={20} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                        />
                      </div>
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-red-400">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div>
              <h4 className="font-medium text-lg text-text-primary mb-4 flex items-center">
                <Envelope size={20} className="text-green-500 mr-2" />
                Contact Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  id="phoneNumber"
                  placeholder="Enter phone number (e.g., +1234567890)"
                  registration={register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  icon={<Phone size={20} className="text-gray-400" />}
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
              </div>
            </div>
            
            {/* Identification Information Section */}
            <div>
              <h4 className="font-medium text-lg text-text-primary mb-4 flex items-center">
                <IdentificationCard size={20} className="text-blue-500 mr-2" />
                Identification Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Identity Document Type */}
                <div>
                  <label htmlFor="identityType" className="block text-sm font-medium text-gray-300 mb-1">
                    Type of Identity Document
                  </label>
                  <select
                    id="identityType"
                    className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    {...register('identityType')}
                  >
                    <option value="">Select document type</option>
                    {IDENTITY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.identityType && (
                    <p className="mt-1 text-xs text-red-400">{errors.identityType.message}</p>
                  )}
                </div>
                
                {/* ID Number */}
                <Input
                  label="ID Number"
                  id="idNumber"
                  placeholder="Enter ID number"
                  registration={register('idNumber')}
                  error={errors.idNumber?.message}
                />
                
                {/* ID Issuing Country */}
                <div>
                  <label htmlFor="idCountry" className="block text-sm font-medium text-gray-300 mb-1">
                    ID Issuing Country
                  </label>
                  <select
                    id="idCountry"
                    className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    {...register('idCountry')}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </select>
                  {errors.idCountry && (
                    <p className="mt-1 text-xs text-red-400">{errors.idCountry.message}</p>
                  )}
                </div>
                
                {/* ID Issuing State/Municipality - Dynamic based on country */}
                <div>
                  <label htmlFor="idIssuingLocation" className="block text-sm font-medium text-gray-300 mb-1">
                    ID Issuing State/Municipality
                  </label>
                  <select
                    id="idIssuingLocation"
                    className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                    {...register('idIssuingLocation')}
                    disabled={!idCountry}
                  >
                    <option value="">{idCountry ? 'Select state/municipality' : 'Select country first'}</option>
                    {availableLocations.map((location) => (
                      <option key={location.value} value={location.value}>{location.label}</option>
                    ))}
                  </select>
                  {errors.idIssuingLocation && (
                    <p className="mt-1 text-xs text-red-400">{errors.idIssuingLocation.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <AuthButton
                onClick={handleClose}
                variant="outline"
                size="md"
                disabled={isLoading}
              >
                Cancel
              </AuthButton>
              
              <AuthButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
              >
                Add Business Owner
              </AuthButton>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}