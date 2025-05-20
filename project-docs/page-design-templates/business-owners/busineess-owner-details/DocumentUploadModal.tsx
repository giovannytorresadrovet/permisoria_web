'use client';

import { useState, useRef } from 'react';
import { Modal } from 'keep-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { UploadSimple, FileImage, FilePdf, File, CheckCircle, X, ClipboardText } from 'phosphor-react';
import AuthButton from '@/components/auth/AuthButton';
import { Input } from '@/components/common/Input';
import ErrorMessage from '@/components/auth/ErrorMessage';

// Define the form validation schema
const documentSchema = z.object({
  category: z.string().min(1, 'Document category is required'),
  notes: z.string().optional(),
  // File is handled separately
});

type DocumentFormValues = z.infer<typeof documentSchema>;

// Available document categories
const documentCategories = [
  { value: 'identification', label: 'Identification Document' },
  { value: 'proof_of_address', label: 'Proof of Address' },
  { value: 'business_license', label: 'Business License' },
  { value: 'tax_document', label: 'Tax Document' },
  { value: 'other', label: 'Other' },
];

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  onSuccess: (newDocument: any) => void;
}

export default function DocumentUploadModal({ 
  isOpen, 
  onClose, 
  ownerId,
  onSuccess
}: DocumentUploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      category: '',
      notes: '',
    }
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, or PDF file.');
        return;
      }
      
      // Validate file size (5MB for MVP)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };
  
  // Trigger file input click
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (!selectedFile) return <UploadSimple size={24} />;
    
    const type = selectedFile.type.toLowerCase();
    if (type.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
    if (type.includes('image')) return <FileImage size={24} className="text-blue-400" />;
    return <File size={24} className="text-gray-400" />;
  };
  
  // Submit form
  const onSubmit = async (data: DocumentFormValues) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setUploadProgress(0);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', data.category);
      if (data.notes) formData.append('notes', data.notes);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const nextProgress = Math.min(prev + 10, 95);
          return nextProgress;
        });
      }, 300);
      
      // API call to upload document
      const response = await fetch(`/api/business-owners/${ownerId}/documents`, {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }
      
      const result = await response.json();
      
      // Show success state
      setSuccess(true);
      
      // Notify parent of success
      onSuccess(result);
      
      // Reset form after a delay
      setTimeout(() => {
        reset();
        setSelectedFile(null);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading the document');
      console.error('Error uploading document:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      reset();
      setSelectedFile(null);
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal
      size="md"
      show={isOpen}
      onClose={handleClose}
      className="bg-surface border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden"
    >
      <Modal.Header className="border-b border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary">
          {success ? 'Document Uploaded' : 'Upload Document'}
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
              Document Successfully Uploaded
            </h4>
            
            <p className="text-text-secondary mb-6">
              Your document has been uploaded and is ready for review.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* File upload area */}
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-gray-600 hover:border-gray-500'}
                  transition-colors
                `}
                onClick={handleSelectFile}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-700/50 rounded-full mb-4">
                  {getFileIcon()}
                </div>
                
                {selectedFile ? (
                  <div>
                    <p className="text-primary font-medium mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-text-secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      className="mt-3 text-sm text-red-400 hover:text-red-300 flex items-center justify-center mx-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <X size={14} className="mr-1" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-text-primary font-medium mb-1">Drag and drop or click to upload</p>
                    <p className="text-sm text-text-secondary mb-2">
                      JPG, PNG, or PDF (max 5MB)
                    </p>
                    <AuthButton
                      variant="outline"
                      size="sm"
                      type="button"
                      disabled={isLoading}
                      className="mx-auto"
                      onClick={handleSelectFile}
                    >
                      <UploadSimple size={16} className="mr-2" />
                      Select File
                    </AuthButton>
                  </div>
                )}
              </div>
              
              {/* Document category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Document Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('category')}
                  disabled={isLoading}
                >
                  <option value="">Select document type</option>
                  {documentCategories.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>
                )}
              </div>
              
              {/* Notes (optional) */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  placeholder="Add any relevant notes about this document"
                  className="bg-gray-700 text-white rounded-md py-2 px-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  {...register('notes')}
                  disabled={isLoading}
                />
              </div>
              
              {/* Progress bar (shown during upload) */}
              {isLoading && (
                <div className="mt-4">
                  <p className="text-sm text-text-secondary mb-2">Uploading: {uploadProgress}%</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
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
                  disabled={!selectedFile}
                >
                  Upload Document
                </AuthButton>
              </div>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}