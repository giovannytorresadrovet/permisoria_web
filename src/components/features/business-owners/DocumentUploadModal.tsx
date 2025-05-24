'use client';

import { useState, useRef } from 'react';
import { Button } from 'keep-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CloudArrowUp, 
  CheckCircle, 
  FileArrowUp, 
  File, 
  FilePdf, 
  FileImage, 
  FileDoc, 
  FileXls 
} from 'phosphor-react';
import { Input } from '@/components/common/Input';

// Define document categories
const DOCUMENT_CATEGORIES = [
  { value: 'identification', label: 'Identification' },
  { value: 'business', label: 'Business Documents' },
  { value: 'financial', label: 'Financial Records' },
  { value: 'permits', label: 'Permits & Licenses' },
  { value: 'tax', label: 'Tax Documents' },
  { value: 'other', label: 'Other' }
];

// Define document schema with Zod
const documentSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  onSuccess: (document: any) => void;
}

export default function DocumentUploadModal({ 
  isOpen, 
  onClose, 
  ownerId, 
  onSuccess 
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      category: '',
      notes: ''
    }
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };
  
  // Prevent default behavior for drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.includes('pdf')) return <FilePdf size={32} className="text-red-400" />;
    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => file.name.toLowerCase().includes(ext))) {
      return <FileImage size={32} className="text-blue-400" />;
    }
    if (type.includes('doc') || type.includes('word')) return <FileDoc size={32} className="text-sky-400" />;
    if (type.includes('xls') || type.includes('excel')) return <FileXls size={32} className="text-green-400" />;
    return <File size={32} className="text-gray-400" />;
  };
  
  // Handle form submission
  const onSubmit = async (data: DocumentFormValues) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    // Check file size (5MB limit for example)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds the 5MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)`);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // In a real app, this would be an API call to upload the file
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('category', data.category);
      // formData.append('notes', data.notes || '');
      // formData.append('ownerId', ownerId);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate API response delay
          setTimeout(() => {
            // Mock document response
            const newDocument = {
              id: crypto.randomUUID(),
              filename: selectedFile.name,
              fileType: selectedFile.type,
              category: data.category,
              notes: data.notes,
              uploadedAt: new Date().toISOString(),
              status: 'UPLOADED',
              url: URL.createObjectURL(selectedFile) // In a real app, this would be a server URL
            };
            
            setShowSuccess(true);
            
            // Call success callback after a delay
            setTimeout(() => {
              onSuccess(newDocument);
              handleClose();
            }, 1500);
          }, 500);
        }
      }, 200);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading the document');
      setIsUploading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    if (isUploading) return;
    
    setSelectedFile(null);
    setError(null);
    setShowSuccess(false);
    setUploadProgress(0);
    reset();
    onClose();
  };
  
  // Animation variants
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
            className="bg-gray-800 text-white border border-gray-700 rounded-lg shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-700 p-4 bg-gray-800 rounded-t-lg">
              <h3 className="text-lg font-medium text-white">
                {showSuccess ? 'Document Uploaded' : 'Upload Document'}
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
                  <h4 className="text-xl font-medium text-white mb-2">Upload Complete!</h4>
                  <p className="text-gray-400">The document has been successfully uploaded.</p>
                </motion.div>
              ) : (
                <form id="document-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* File Upload Area */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      selectedFile ? 'border-primary/50 bg-primary/5' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-700 rounded-full p-3 mb-3">
                          {getFileIcon(selectedFile)}
                        </div>
                        <p className="font-medium text-white mb-1">{selectedFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          type="button"
                          className="mt-3 text-sm text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                        >
                          Change file
                        </button>
                      </div>
                    ) : (
                      <div className="cursor-pointer">
                        <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                          <FileArrowUp size={24} className="text-gray-400" />
                        </div>
                        <p className="font-medium text-white mb-1">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-sm text-gray-400 mb-2">
                          PDF, Word, Excel, or image files (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Document Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                      Document Category*
                    </label>
                    <select
                      id="category"
                      {...register('category')}
                      className={`bg-gray-700 text-white rounded-md py-2 px-3 w-full border-0 focus:outline-none focus:ring-2 ${
                        errors.category ? 'focus:ring-red-500' : 'focus:ring-primary'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {DOCUMENT_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      rows={3}
                      className="bg-gray-700 text-white rounded-md py-2 px-3 w-full border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Add any notes about this document..."
                    />
                  </div>
                  
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
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
                  disabled={isUploading}
                  className="text-gray-300 border-gray-500 hover:bg-gray-700"
                >
                  <X size={18} className="mr-2" /> Cancel
                </Button>
                
                <Button
                  size="md"
                  type="submit"
                  form="document-form"
                  disabled={isUploading || !selectedFile}
                  className={`bg-primary hover:bg-primary-dark text-white ${
                    (isUploading || !selectedFile) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CloudArrowUp size={18} className="mr-2" /> 
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 