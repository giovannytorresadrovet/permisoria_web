'use client';

import { useState, useRef } from 'react';
import { Card, Avatar, Badge, Button } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePlus, FileImage, FilePdf, File, ArrowUpRight, Trash, UploadSimple, CheckSquare, XSquare } from 'phosphor-react';
import { format } from 'date-fns';
import DocumentUploadModal from '@/components/features/business-owners/DocumentUploadModal';
import ErrorMessage from '@/components/auth/ErrorMessage';
import GlassCard from '@/components/auth/GlassCard';

// Map file extensions to icons
const getFileIcon = (fileType) => {
  const type = fileType?.toLowerCase();
  if (type?.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
  if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => type?.includes(ext))) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  return <File size={24} className="text-gray-400" />;
};

// Status badge mapping
const statusBadges = {
  UPLOADED: { color: 'gray', text: 'Uploaded' },
  VERIFIED: { color: 'success', text: 'Verified' },
  REJECTED: { color: 'error', text: 'Rejected' },
  PENDING: { color: 'warning', text: 'Pending Review' },
};

interface DocumentsTabProps {
  ownerId: string;
  documents: any[];
}

export default function DocumentsTab({ ownerId, documents = [] }: DocumentsTabProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentsList, setDocumentsList] = useState(documents);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Fetch documents if needed
  const refreshDocuments = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/business-owners/${ownerId}/documents`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      setDocumentsList(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDocumentUploaded = (newDocument) => {
    setDocumentsList([...documentsList, newDocument]);
  };
  
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    // For a real implementation, this would open a modal or redirect to the document viewer
    window.open(document.url, '_blank');
  };
  
  // Empty state when there are no documents
  if (documentsList.length === 0 && !isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Owner Documents</h2>
          
          <Button
            size="sm"
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadSimple size={18} className="mr-2" />
            Upload Document
          </Button>
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        <GlassCard className="text-center py-10">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FilePlus size={36} className="text-primary" weight="light" />
          </div>
          
          <h3 className="text-xl font-medium text-text-primary mb-2">No Documents Yet</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Upload identification documents or proof of address to proceed with verification.
          </p>
          
          <Button
            size="md"
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadSimple size={20} className="mr-2" />
            Upload First Document
          </Button>
        </GlassCard>
        
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          ownerId={ownerId}
          onSuccess={handleDocumentUploaded}
        />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Owner Documents</h2>
        
        <Button
          size="sm"
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <UploadSimple size={18} className="mr-2" />
          Upload Document
        </Button>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800/50 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {documentsList.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="card-glass hover:bg-surface/80 transition-colors"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar
                          shape="circle"
                          size="md"
                          className="bg-gray-700 mr-3"
                        >
                          {getFileIcon(doc.fileType)}
                        </Avatar>
                        
                        <div>
                          <h3 className="font-medium text-text-primary mb-1">{doc.filename || `Document ${doc.id.substring(0, 8)}`}</h3>
                          <div className="flex items-center text-sm text-text-secondary">
                            <span className="capitalize">{doc.category || 'Uncategorized'}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(doc.uploadedAt || doc.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge
                        size="sm"
                        colorType="light"
                        color={statusBadges[doc.status]?.color || 'gray'}
                      >
                        {statusBadges[doc.status]?.text || doc.status || 'Uploaded'}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-text-secondary">
                        {doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDocument(doc);
                          }}
                        >
                          <ArrowUpRight size={18} />
                        </button>
                        
                        {/* In a real implementation, we'd add document actions like delete */}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        ownerId={ownerId}
        onSuccess={handleDocumentUploaded}
      />
    </div>
  );
}