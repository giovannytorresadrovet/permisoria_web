'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { FilePlus, TrashSimple, Spinner, Check, X, Info, Warning } from 'phosphor-react';

interface DocumentUploadProps {
  /**
   * Function to handle a successful document upload
   */
  onUploadSuccess: (result: {
    id: string;
    filename: string;
    contentType: string;
    fileType: string;
    fileSize: number;
    contentHash: string;
    storagePath: string;
    url: string;
  }) => void;
  
  /**
   * Function to handle upload errors
   */
  onUploadError?: (error: Error) => void;
  
  /**
   * The business owner ID to associate with the document
   */
  ownerId: string;
  
  /**
   * The document category (e.g., 'identification', 'address_proof')
   */
  category: string;
  
  /**
   * Max file size in bytes (defaults to 5MB)
   */
  maxFileSize?: number;
  
  /**
   * Allowed file types (array of mime types)
   */
  allowedFileTypes?: string[];
  
  /**
   * Text to display when hovering over the upload area
   */
  hoverText?: string;
  
  /**
   * Initial state text
   */
  placeholderText?: string;
  
  /**
   * Whether the control is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * A component for uploading documents in the verification process
 */
export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  ownerId,
  category,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/heif'
  ],
  hoverText = 'Drop file here',
  placeholderText = 'Drag and drop a file or click to select',
  disabled = false,
  className = ''
}) => {
  // Refs and state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Handle file selection via click
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };
  
  // Validate and upload the file
  const validateAndUploadFile = (file: File) => {
    // Reset previous errors
    setError(null);
    
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      const error = `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`;
      setError(error);
      if (onUploadError) onUploadError(new Error(error));
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      const error = `File too large. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`;
      setError(error);
      if (onUploadError) onUploadError(new Error(error));
      return;
    }
    
    // Set file as selected before upload
    setUploadedFile(file);
    
    // Upload the file
    uploadFile(file);
  };
  
  // Upload the file to the server
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      // Upload the file with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Listen for completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          onUploadSuccess(response);
        } else {
          const errorMsg = `Upload failed with status: ${xhr.status}`;
          setError(errorMsg);
          setUploadedFile(null);
          if (onUploadError) onUploadError(new Error(errorMsg));
        }
        setIsUploading(false);
      });
      
      // Listen for errors
      xhr.addEventListener('error', () => {
        const errorMsg = 'Network error occurred during upload';
        setError(errorMsg);
        setUploadedFile(null);
        if (onUploadError) onUploadError(new Error(errorMsg));
        setIsUploading(false);
      });
      
      // Open and send the request
      xhr.open('POST', `/api/business-owners/${ownerId}/documents`);
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred during upload');
      setUploadedFile(null);
      if (onUploadError) onUploadError(err);
      setIsUploading(false);
    }
  };
  
  // Cancel the upload
  const cancelUpload = () => {
    setUploadedFile(null);
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Format the file size in a readable way
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };
  
  return (
    <div className={`${className}`}>
      {/* File drop area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
          isDragging ? 'bg-blue-500/10 border-blue-500' : 
          error ? 'bg-red-500/10 border-red-500' : 
          isUploading ? 'bg-amber-500/10 border-amber-500' : 
          uploadedFile ? 'bg-green-500/10 border-green-500' : 
          'bg-gray-800 border-gray-600 hover:border-gray-500'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={allowedFileTypes.join(',')}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        {/* Display states */}
        {isUploading ? (
          // Uploading state
          <div className="text-center">
            <Spinner size={32} weight="bold" className="text-amber-500 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-1">Uploading file...</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-amber-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">{uploadProgress}% complete</p>
            
            {/* Cancel button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cancelUpload();
              }}
              className="mt-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : uploadedFile ? (
          // Uploaded file state
          <div className="text-center">
            <Check size={32} weight="bold" className="text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-1">File uploaded successfully</p>
            <p className="text-xs text-gray-400 mb-2">{uploadedFile.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center">
            <X size={32} weight="bold" className="text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-1">Upload failed</p>
            <p className="text-xs text-red-400 mb-3">{error}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : isDragging ? (
          // Drag hover state
          <div className="text-center">
            <FilePlus size={32} weight="bold" className="text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-400">{hoverText}</p>
          </div>
        ) : (
          // Initial state
          <div className="text-center">
            <FilePlus size={32} weight="bold" className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{placeholderText}</p>
            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: {allowedFileTypes.map(t => t.split('/')[1]).join(', ')}
            </p>
            <p className="text-xs text-gray-500">
              Max size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        )}
      </div>
      
      {/* Information about required documents */}
      <div className="mt-3 flex items-start text-xs">
        <Info size={16} className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-gray-400">
          Document must be clear and legible. Make sure all information is visible and not cropped.
        </p>
      </div>
      
      {/* Warnings based on category */}
      {category === 'identification' && (
        <div className="mt-2 flex items-start text-xs">
          <Warning size={16} className="text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-gray-400">
            ID must not be expired and must show your full name, photo, date of birth, and ID number.
          </p>
        </div>
      )}
      
      {category === 'address_proof' && (
        <div className="mt-2 flex items-start text-xs">
          <Warning size={16} className="text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-gray-400">
            Document must be recent (within the last 3 months) and clearly show your full name and address.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload; 