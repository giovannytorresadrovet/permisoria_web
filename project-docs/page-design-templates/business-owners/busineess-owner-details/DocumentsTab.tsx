'use client';

import { useState, useEffect } from 'react';
import { Card, Avatar, Badge, Button } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilePlus, 
  FileImage, 
  FilePdf, 
  File, 
  ArrowUpRight, 
  Trash, 
  UploadSimple, 
  CheckSquare, 
  XSquare,
  WarningCircle,
  DotsThreeVertical
} from 'phosphor-react';
import { format } from 'date-fns';

// Components
import DocumentUploadModal from '@/components/features/business-owners/DocumentUploadModal';
import DocumentViewerModal from '@/components/features/business-owners/DocumentViewerModal';
import ErrorMessage from '@/components/auth/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

// Helper functions
const getFileIcon = (fileType) => {
  const type = fileType?.toLowerCase();
  if (type?.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
  if (type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => type?.includes(ext))) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  return <File size={24} className="text-gray-400" />;
};

// Status configuration
const statusConfig = {
  UPLOADED: { color: 'gray', text: 'Uploaded', icon: <File size={14} className="mr-1" /> },
  VERIFIED: { color: 'success', text: 'Verified', icon: <CheckSquare size={14} className="mr-1" weight="fill" /> },
  REJECTED: { color: 'error', text: 'Rejected', icon: <XSquare size={14} className="mr-1" weight="fill" /> },
  PENDING: { color: 'warning', text: 'Pending Review', icon: <WarningCircle size={14} className="mr-1" /> },
  EXPIRED: { color: 'error', text: 'Expired', icon: <WarningCircle size={14} className="mr-1" /> },
};

export default function DocumentsTab({ ownerId, documents = [], verificationStatus }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentsList, setDocumentsList] = useState(documents);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const isReadOnly = verificationStatus === 'VERIFIED';
  
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
  
  // Filter documents by category
  const filteredDocuments = categoryFilter === 'all' 
    ? documentsList 
    : documentsList.filter(doc => doc.category === categoryFilter);
  
  const handleDocumentUploaded = (newDocument) => {
    setDocumentsList(prev => [...prev, newDocument]);
  };
  
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewerModalOpen(true);
  };
  
  const handleDeleteClick = (document, e) => {
    e.stopPropagation();
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/business-owners/${ownerId}/documents/${documentToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      
      // Remove document from list
      setDocumentsList(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get document categories for filter
  const categories = [
    {value: 'all', label: 'All Documents'},
    ...Array.from(
      new Set(documentsList.map(doc => doc.category))
    ).map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
    }))
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Empty state when there are no documents
  if (filteredDocuments.length === 0 && !isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Owner Documents</h2>
          
          {!isReadOnly && (
            <Button
              size="sm"
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <UploadSimple size={18} className="mr-2" />
              Upload Document
            </Button>
          )}
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        <EmptyState
          icon={<FilePlus size={36} className="text-primary" weight="light" />}
          title="No Documents Yet"
          description={categoryFilter !== 'all' 
            ? `No ${categories.find(c => c.value === categoryFilter)?.label.toLowerCase()} documents found. Try changing the filter or upload a new document.`
            : "Upload identification documents or proof of address to proceed with verification."
          }
          actionLabel={isReadOnly ? undefined : "Upload First Document"}
          onAction={isReadOnly ? undefined : () => setIsUploadModalOpen(true)}
        />
        
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Owner Documents</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Category filter dropdown */}
          <select
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          
          {/* View mode toggle */}
          <div className="flex bg-gray-700 rounded-md p-0.5 border border-gray-600">
            <button
              className={`px-2 py-1 rounded-md text-sm ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3z"/>
              </svg>
            </button>
            <button
              className={`px-2 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </button>
          </div>
          
          {!isReadOnly && (
            <Button
              size="sm"
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <UploadSimple size={18} className="mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      {isLoading ? (
        <LoadingSkeleton type="documentGrid" count={4} />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    variants={itemVariants}
                  >
                    <Card 
                      className="card-glass h-full hover:bg-surface/80 transition-colors cursor-pointer"
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
                              <h3 className="font-medium text-text-primary mb-1 truncate">{doc.filename || doc.name || `Document ${doc.id.substring(0, 8)}`}</h3>
                              <div className="flex items-center text-sm text-text-secondary">
                                <span className="capitalize">{doc.category || 'Uncategorized'}</span>
                                <span className="mx-2">•</span>
                                <span>{format(new Date(doc.uploadedAt || doc.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <Badge
                            size="sm"
                            colorType="light"
                            color={statusConfig[doc.status]?.color || 'gray'}
                          >
                            <span className="flex items-center">
                              {statusConfig[doc.status]?.icon}
                              {statusConfig[doc.status]?.text || doc.status || 'Uploaded'}
                            </span>
                          </Badge>
                          
                          <div className="flex gap-1">
                            <button
                              className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDocument(doc);
                              }}
                              aria-label="View document"
                            >
                              <ArrowUpRight size={18} />
                            </button>
                            
                            {!isReadOnly && (
                              <button
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                                onClick={(e) => handleDeleteClick(doc, e)}
                                aria-label="Delete document"
                              >
                                <Trash size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="overflow-hidden rounded-md border border-gray-700"
            >
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-750 divide-y divide-gray-700">
                  {filteredDocuments.map((doc) => (
                    <motion.tr 
                      key={doc.id}
                      variants={itemVariants}
                      className="hover:bg-gray-700/50 cursor-pointer transition-colors"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-700 rounded-full">
                            {getFileIcon(doc.fileType)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white truncate max-w-xs">
                              {doc.filename || doc.name || `Document ${doc.id.substring(0, 8)}`}
                            </div>
                            <div className="text-sm text-gray-400">
                              {doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300 capitalize">{doc.category || 'Uncategorized'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{format(new Date(doc.uploadedAt || doc.createdAt), 'MMM d, yyyy')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          size="sm"
                          colorType="light"
                          color={statusConfig[doc.status]?.color || 'gray'}
                        >
                          <span className="flex items-center">
                            {statusConfig[doc.status]?.icon}
                            {statusConfig[doc.status]?.text || doc.status || 'Uploaded'}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1">
                          <button
                            className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(doc);
                            }}
                            aria-label="View document"
                          >
                            <ArrowUpRight size={18} />
                          </button>
                          
                          {!isReadOnly && (
                            <button
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                              onClick={(e) => handleDeleteClick(doc, e)}
                              aria-label="Delete document"
                            >
                              <Trash size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}
      
      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        ownerId={ownerId}
        onSuccess={handleDocumentUploaded}
      />
      
      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
        document={selectedDocument}
        isReadOnly={isReadOnly}
      />
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-gray-700 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-3">Confirm Deletion</h3>
                <p className="text-gray-300 mb-5">
                  Are you sure you want to delete this document? This action cannot be undone.
                </p>
                
                {documentToDelete && (
                  <div className="p-3 bg-gray-700 rounded-md mb-5 flex items-center">
                    <div className="mr-3">
                      {getFileIcon(documentToDelete.fileType)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{documentToDelete.filename || documentToDelete.name}</p>
                      <p className="text-sm text-gray-400">{documentToDelete.category}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <Button
                    size="sm"
                    color="gray"
                    variant="outline"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDocumentToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    size="sm"
                    color="error"
                    onClick={handleDeleteDocument}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete Document'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}