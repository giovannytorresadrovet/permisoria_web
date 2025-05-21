'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadSimple, 
  File, 
  FilePdf, 
  ImageSquare, 
  X, 
  Check, 
  Warning 
} from 'phosphor-react';
import { Button } from 'keep-react';

interface DocumentUploadProps {
  documentType?: string;
  onUploadComplete: (document: any) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  ownerId: string;
}

export default function DocumentUpload({
  documentType = "Identity",
  onUploadComplete,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  ownerId
}: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
      setSelectedFile(null);
      return;
    }
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB`);
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };
  
  // Trigger file input click
  const handleBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !ownerId) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Mock upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 20);
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);
      
      // TODO: In a real implementation, you would call your actual file upload API here
      // For this template, we'll simulate an upload with a timeout
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Construct a fake document object for now
      const uploadedDocument = {
        id: `doc-${Date.now()}`,
        ownerId: ownerId,
        documentType: documentType,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(selectedFile) // In a real app, this would be the URL returned by the upload API
      };
      
      // Notify parent component
      onUploadComplete(uploadedDocument);
      
      // Reset state
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
      setIsUploading(false);
    }
  };
  
  // Clear selected file
  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Get icon based on file type
  const getFileIcon = () => {
    if (!selectedFile) return <File size={24} className="text-gray-400" />;
    
    if (selectedFile.type.includes('pdf')) {
      return <FilePdf size={24} className="text-red-400" />;
    } else if (selectedFile.type.includes('image')) {
      return <ImageSquare size={24} className="text-blue-400" />;
    }
    
    return <File size={24} className="text-gray-400" />;
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700">
      <h3 className="text-gray-200 font-medium mb-3">{documentType} Document Upload</h3>
      
      {/* Hidden file input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
      />
      
      {!selectedFile ? (
        // Upload area when no file is selected
        <div 
          onClick={handleBrowse}
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <UploadSimple size={36} className="text-gray-400 mb-3" />
          <p className="text-gray-300 mb-1">Click to browse or drop a file here</p>
          <p className="text-xs text-gray-500">
            Allowed types: {allowedTypes.map(t => t.split('/')[1]).join(', ')} (Max {maxSizeMB}MB)
          </p>
          
          {error && (
            <div className="mt-3 flex items-center text-red-400 text-sm">
              <Warning size={16} className="mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        // Selected file details
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getFileIcon()}
              <div className="ml-3 overflow-hidden">
                <p className="text-gray-200 truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-400"
              disabled={isUploading}
            >
              <X size={20} />
            </button>
          </div>
          
          {isUploading ? (
            // Upload progress bar
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Uploading...</span>
                <span className="text-xs text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {uploadProgress === 100 && (
                <div className="mt-2 flex items-center text-green-400 text-sm">
                  <Check size={16} className="mr-1" />
                  <span>Upload complete!</span>
                </div>
              )}
            </div>
          ) : (
            // Upload button
            <Button
              size="sm"
              variant="default"
              onClick={handleUpload}
              className="mt-4 w-full"
            >
              <UploadSimple size={18} className="mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 