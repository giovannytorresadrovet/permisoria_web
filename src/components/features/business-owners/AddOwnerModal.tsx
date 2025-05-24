'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from 'keep-react';
import {
  X,
  User,
  IdentificationCard,
  MapPinLine,
  CheckCircle,
  FloppyDisk,
} from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the Input component
import { Input } from '@/components/common/Input';

// Define the form schema with Zod - simplified version
const ownerFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  
  // Optional fields for enhanced version
  maternalLastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  idType: z.string().optional(),
  idLicenseNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  zipCode: z.string().optional(),
});

type OwnerFormValues = z.infer<typeof ownerFormSchema>;

interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  verificationStatus: string;
  createdAt?: string;
  _count?: { businesses?: number };
  maternalLastName?: string;
  dateOfBirth?: string;
  idType?: string;
  idLicenseNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
}

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOwner: BusinessOwner) => void;
}

export default function AddOwnerModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: AddOwnerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      maternalLastName: '',
      dateOfBirth: '',
      idType: '',
      idLicenseNumber: '',
      addressLine1: '',
      addressLine2: '',
      zipCode: '',
    }
  });

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow animation to complete before resetting form
      const timer = setTimeout(() => {
        reset();
        setError(null);
        setShowSuccess(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  const onSubmit = (data: OwnerFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Mock response for development
      const newOwner: BusinessOwner = {
        id: crypto.randomUUID(),
        ...data,
        verificationStatus: 'UNVERIFIED',
        createdAt: new Date().toISOString(),
        _count: { businesses: 0 }
      };
      
      // Show success state
      setShowSuccess(true);
      
      // Call the success callback with the new owner after a delay
      setTimeout(() => {
        onSuccess(newOwner);
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the business owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    setError(null);
    setShowSuccess(false);
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <AnimatePresence mode="wait">
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-700 p-4 bg-gray-800 rounded-t-lg">
              <h3 className="text-lg font-medium text-white">
                {showSuccess ? 'Business Owner Created' : 'Add New Business Owner'}
              </h3>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-gray-800 text-gray-300 space-y-6 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {showSuccess ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={48} weight="bold" className="text-green-400" />
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">Successfully Created!</h4>
                  <p className="text-gray-400">The new business owner has been added to the system.</p>
                </motion.div>
              ) : (
                <form id="owner-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information Section */}
                  <section>
                    <div className="flex items-center mb-4 text-primary">
                      <User size={24} className="mr-3" />
                      <h4 className="text-lg font-semibold text-white">Personal Information</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="First Name*" 
                          id="firstName" 
                          placeholder="Enter first name"
                          registration={register('firstName')} 
                          error={errors.firstName?.message}
                        />
                        
                        <Input 
                          label="Last Name*" 
                          id="lastName" 
                          placeholder="Enter last name"
                          registration={register('lastName')} 
                          error={errors.lastName?.message}
                        />
                      </div>
                      
                      <Input 
                        label="Maternal Last Name" 
                        id="maternalLastName" 
                        placeholder="Enter maternal last name"
                        registration={register('maternalLastName')} 
                        error={errors.maternalLastName?.message}
                      />
                      
                      <Input 
                        label="Email Address*" 
                        id="email" 
                        type="email"
                        placeholder="Enter email address"
                        registration={register('email')} 
                        error={errors.email?.message}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="Phone Number" 
                          id="phone" 
                          type="tel"
                          placeholder="Enter phone number"
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
                  </section>
                  
                  {/* Identification Section */}
                  <section>
                    <div className="flex items-center mb-4 text-purple-400">
                      <IdentificationCard size={24} className="mr-3" />
                      <h4 className="text-lg font-semibold text-white">Identification</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="ID Type" 
                          id="idType" 
                          placeholder="Select ID Type"
                          registration={register('idType')} 
                          error={errors.idType?.message}
                        />
                        
                        <Input 
                          label="ID/License Number" 
                          id="idLicenseNumber" 
                          placeholder="Enter ID or license number"
                          registration={register('idLicenseNumber')} 
                          error={errors.idLicenseNumber?.message}
                        />
                      </div>
                    </div>
                  </section>
                  
                  {/* Address Information Section */}
                  <section>
                    <div className="flex items-center mb-4 text-blue-400">
                      <MapPinLine size={24} className="mr-3" />
                      <h4 className="text-lg font-semibold text-white">Address Information</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <Input 
                        label="Address Line 1" 
                        id="addressLine1" 
                        placeholder="Street address, P.O. box"
                        registration={register('addressLine1')} 
                        error={errors.addressLine1?.message}
                      />
                      
                      <Input 
                        label="Address Line 2" 
                        id="addressLine2" 
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        registration={register('addressLine2')} 
                        error={errors.addressLine2?.message}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="City" 
                          id="city" 
                          placeholder="Enter city"
                          registration={register('city')} 
                          error={errors.city?.message}
                        />
                        
                        <Input 
                          label="State/Province/Territory" 
                          id="state" 
                          placeholder="Select State/Territory"
                          registration={register('state')} 
                          error={errors.state?.message}
                        />
                      </div>
                      
                      <Input 
                        label="ZIP/Postal Code" 
                        id="zipCode" 
                        placeholder="Enter ZIP/postal code"
                        registration={register('zipCode')} 
                        error={errors.zipCode?.message}
                      />
                    </div>
                  </section>
                </form>
              )}
            </div>
            
            {/* Footer */}
            {!showSuccess && (
              <div className="border-t border-gray-700 p-4 bg-gray-800 rounded-b-lg flex justify-end gap-3">
                <Button
                  size="md"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-300 border-gray-500 hover:bg-gray-700"
                >
                  <X size={18} className="mr-2" /> Cancel
                </Button>
                
                <Button
                  size="md"
                  type="submit"
                  form="owner-form"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  <FloppyDisk size={18} className="mr-2" /> {isSubmitting ? 'Creating...' : 'Create Owner'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 