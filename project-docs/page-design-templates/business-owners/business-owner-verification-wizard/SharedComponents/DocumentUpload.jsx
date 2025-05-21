// src/components/features/business-owners/verification/components/DocumentUpload.jsx
import React, { useState } from 'react';
import { Button, Card } from 'keep-react';
import { Upload, Check, X, WarningCircle } from 'phosphor-react';
import { motion } from 'framer-motion';

const DocumentUpload = ({ 
  documentType = "Identity", 
  onUploadComplete,
  maxSizeMB = 5, // Default 5MB limit
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] 
}) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setSuccess(false);
    
    if (!selectedFile) return;
    
    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Invalid file type. Please upload a ${allowedTypes.map(t => t.split('/')[1]).join(', ')}.`);
      return;
    }
    
    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      // Mock API call - replace with actual upload
      await new Promise(resolve => setTimeout(resolve, 2500));
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock successful upload with a document object
      const uploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: documentType,
        contentType: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // This would be the actual URL from backend
        uploadedAt: new Date().toISOString()
      };
      
      setSuccess(true);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(uploadedDocument);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-4">
        <h4 className="font-medium mb-3 text-white">Upload {documentType} Document</h4>
        
        <div className="space-y-4">
          {/* File input */}
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
              error ? 'border-red-500 bg-red-900/20' : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className={error ? 'text-red-400' : 'text-gray-400'} />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} (Max {maxSizeMB}MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept={allowedTypes.join(',')}
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
          
          {/* Selected file info */}
          {file && (
            <motion.div 
              className={`p-3 rounded-md ${error ? 'bg-red-900/20' : 'bg-gray-700/30'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="truncate max-w-xs">
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-400 focus:outline-none"
                  disabled={isUploading}
                  aria-label="Remove file"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Upload progress */}
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Error message */}
          {error && (
            <motion.div
              className="flex items-start p-3 rounded-md bg-red-900/20 text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WarningCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
          
          {/* Success message */}
          {success && (
            <motion.div
              className="flex items-start p-3 rounded-md bg-green-900/20 text-green-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">Document uploaded successfully!</p>
            </motion.div>
          )}
          
          {/* Upload button */}
          <Button
            size="sm"
            color="primary"
            className="w-full"
            onClick={handleUpload}
            disabled={!file || isUploading || success}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : success ? (
              <>
                <Check size={16} className="mr-1.5" />
                Uploaded
              </>
            ) : (
              <>
                <Upload size={16} className="mr-1.5" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DocumentUpload;