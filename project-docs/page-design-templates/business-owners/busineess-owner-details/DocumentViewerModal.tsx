'use client';

import { useState } from 'react';
import { Modal, Button, Badge } from 'keep-react';
import { 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowClockwise, 
  DownloadSimple,
  Check,
  X,
  File,
  Calendar,
  FileImage,
  FilePdf
} from 'phosphor-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Status configuration
const statusConfig = {
  UPLOADED: { color: 'gray', text: 'Uploaded', icon: <File size={14} className="mr-1" /> },
  VERIFIED: { color: 'success', text: 'Verified', icon: <Check size={14} className="mr-1" weight="fill" /> },
  REJECTED: { color: 'error', text: 'Rejected', icon: <X size={14} className="mr-1" weight="fill" /> },
  PENDING: { color: 'warning', text: 'Pending Review', icon: <File size={14} className="mr-1" /> },
};

// Get file icon based on type
const getFileIcon = (fileType) => {
  const type = fileType?.toLowerCase();
  if (type?.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
  if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => type?.includes(ext))) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  return <File size={24} className="text-gray-400" />;
};

export default function DocumentViewerModal({ 
  isOpen, 
  onClose, 
  document, 
  isReadOnly = false 
}) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Reset state when document changes
  React.useEffect(() => {
    if (document) {
      setStatus(document.status || 'UPLOADED');
      setNotes(document.notes || '');
      setZoom(100);
      setRotation(0);
    }
  }, [document]);
  
  if (!document) return null;
  
  // Handle zoom controls
  const handleZoom = (action) => {
    if (action === 'in') {
      setZoom(prev => Math.min(prev + 25, 200));
    } else if (action === 'out') {
      setZoom(prev => Math.max(prev - 25, 50));
    } else {
      setZoom(100);
    }
  };
  
  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  // Handle document download
  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };
  
  // Handle status update
  const handleUpdateStatus = async () => {
    if (isReadOnly) return;
    
    setIsUpdating(true);
    
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated API call
      
      // Update success handling
      onClose();
    } catch (error) {
      console.error('Error updating document status:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Determine if document is an image or PDF
  const isPdf = document.contentType === 'application/pdf' || 
                document.fileType?.includes('pdf') ||
                document.name?.toLowerCase().endsWith('.pdf');
  
  return (
    <Modal
      size="3xl"
      show={isOpen}
      onClose={onClose}
      className="bg-surface border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden"
    >
      <Modal.Header className="border-b border-gray-700">
        <div className="flex items-center">
          <div className="mr-3">
            {getFileIcon(document.fileType)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary">
              {document.filename || document.name}
            </h3>
            <div className="text-sm text-gray-400 flex items-center mt-1">
              <span className="capitalize">{document.category || 'Uncategorized'}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {format(new Date(document.uploadedAt || document.createdAt), 'MMMM d, yyyy')}
              </span>
              {document.fileSize && (
                <>
                  <span className="mx-2">•</span>
                  <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Document viewer */}
          <div className="flex-grow md:border-r border-gray-700 bg-gray-800 flex flex-col">
            {/* Toolbar */}
            <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <div>
                <Badge
                  colorType="light"
                  color={statusConfig[document.status]?.color || 'gray'}
                >
                  <span className="flex items-center">
                    {statusConfig[document.status]?.icon}
                    {statusConfig[document.status]?.text || document.status || 'Uploaded'}
                  </span>
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="xs" 
                  circle={true} 
                  color="metal" 
                  onClick={() => handleZoom('out')}
                  aria-label="Zoom out"
                >
                  <MagnifyingGlassMinus size={16} />
                </Button>
                <Button 
                  size="xs" 
                  circle={true} 
                  color="metal" 
                  onClick={() => handleZoom('reset')}
                  aria-label="Reset zoom"
                >
                  <ArrowClockwise size={16} />
                </Button>
                <Button 
                  size="xs" 
                  circle={true} 
                  color="metal" 
                  onClick={() => handleZoom('in')}
                  aria-label="Zoom in"
                >
                  <MagnifyingGlassPlus size={16} />
                </Button>
                <Button 
                  size="xs" 
                  circle={true} 
                  color="metal" 
                  onClick={handleRotate}
                  aria-label="Rotate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* Document display */}
            <div className="flex-grow p-4 flex items-center justify-center overflow-auto">
              {isPdf ? (
                // Embed PDF viewer
                <div className="w-full h-full">
                  <iframe 
                    src={document.url} 
                    title={document.name}
                    className="w-full h-full border-0"
                    style={{ 
                      transform: `scale(${zoom/100}) rotate(${rotation}deg)`, 
                      transformOrigin: 'center' 
                    }}
                  />
                </div>
              ) : (
                // Display image
                <div className="flex items-center justify-center h-full">
                  <motion.img 
                    src={document.url || document.thumbnailUrl} 
                    alt={document.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-out'
                    }}
                    className="object-contain"
                    layoutId={`document-${document.id}`}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Document details and actions */}
          {!isReadOnly && (
            <div className="md:w-80 p-4 bg-gray-750 flex flex-col h-full">
              <h4 className="font-medium mb-3">Document Details</h4>
              
              {/* Status selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white"
                >
                  {Object.entries(statusConfig).map(([key, value]) => (
                    <option key={key} value={key}>{value.text}</option>
                  ))}
                </select>
              </div>
              
              {/* Notes */}
              <div className="mb-6 flex-grow">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-40 rounded-md bg-gray-700 border-gray-600 text-white p-2 resize-none"
                  placeholder="Add notes about this document..."
                />
              </div>
              
              {/* Action buttons */}
              <div className="mt-auto space-y-3">
                <Button
                  size="sm"
                  color="primary"
                  className="w-full"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Document'}
                </Button>
                
                <Button
                  size="sm"
                  color="metal"
                  className="w-full"
                  onClick={handleDownload}
                >
                  <DownloadSimple size={16} className="mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}