'use client';

import { useState } from 'react';
import { Button } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FilePdf, 
  FileImage, 
  FileDoc, 
  FileXls, 
  File, 
  GridFour, 
  Rows, 
  ArrowUpRight, 
  Trash, 
  CloudArrowUp 
} from 'phosphor-react';
import StatusBadge from './StatusBadge';

// Document Upload Modal (will be implemented in a separate component)
import DocumentUploadModal from './DocumentUploadModal';

interface Document {
  id: string;
  filename: string;
  fileType: string;
  category?: string;
  uploadedAt: string;
  status: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'PENDING' | 'EXPIRED';
  url?: string;
  notes?: string;
}

interface DocumentsTabProps {
  ownerId: string;
  ownerDocuments: Document[];
  verificationStatus: string;
  onDocumentsUpdate: (documents: Document[]) => void;
}

// Get file icon based on type
const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return <FilePdf size={24} className="text-red-400" />;
  if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => type.includes(ext))) {
    return <FileImage size={24} className="text-blue-400" />;
  }
  if (type.includes('doc') || type.includes('word')) return <FileDoc size={24} className="text-sky-400" />;
  if (type.includes('xls') || type.includes('excel')) return <FileXls size={24} className="text-green-400" />;
  return <File size={24} className="text-gray-400" />;
};

// Status configuration for documents
const docStatusConfig: Record<string, { color: string; text: string }> = {
  UPLOADED: { color: 'gray', text: 'Uploaded' },
  VERIFIED: { color: 'success', text: 'Verified' },
  REJECTED: { color: 'error', text: 'Rejected' },
  PENDING: { color: 'warning', text: 'Pending Review' },
  EXPIRED: { color: 'error', text: 'Expired' }
};

export default function DocumentsTab({ ownerId, ownerDocuments, verificationStatus, onDocumentsUpdate }: DocumentsTabProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<Document[]>(ownerDocuments || []);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Readonly mode if owner is verified
  const isReadOnly = verificationStatus === 'VERIFIED';

  // Handle document upload
  const handleDocumentUploaded = (newDocument: Document) => {
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    onDocumentsUpdate(updatedDocuments);
  };

  // Handle document view/preview
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewModalOpen(true);
    // In a real app, this would open a preview modal or navigate to a document viewer
    window.open(document.url, '_blank');
  };

  // Handle document delete
  const handleDeleteDocument = (documentId: string) => {
    // In a real app, this would call an API to delete the document
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    onDocumentsUpdate(updatedDocuments);
  };

  // Filter documents by category if filter is active
  const filteredDocuments = categoryFilter 
    ? documents.filter(doc => doc.category === categoryFilter)
    : documents;

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(documents.map(doc => doc.category).filter(Boolean)));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-white">Documents</h2>
          <p className="text-gray-400 text-sm mt-1">
            {documents.length === 0 
              ? 'No documents uploaded yet.' 
              : `${documents.length} document${documents.length !== 1 ? 's' : ''} uploaded.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 text-white rounded-md py-2 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}

          {/* View toggle */}
          <div className="bg-gray-700 rounded-md p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
              aria-label="Grid view"
            >
              <GridFour size={18} />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'}`}
              aria-label="List view"
            >
              <Rows size={18} />
            </button>
          </div>

          {/* Upload button */}
          {!isReadOnly && (
            <Button
              size="md"
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <CloudArrowUp size={18} className="mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <File size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {categoryFilter ? 'No documents in this category' : 'No documents uploaded yet'}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {categoryFilter 
              ? `There are no documents in the "${categoryFilter}" category. Try selecting a different category or upload a new document.`
              : 'Upload documents to keep track of important files related to this business owner.'}
          </p>
          {!isReadOnly && (
            <Button
              size="md"
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Plus size={18} className="mr-2" />
              Upload First Document
            </Button>
          )}
        </div>
      )}

      {/* Documents grid view */}
      {filteredDocuments.length > 0 && viewMode === 'grid' && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredDocuments.map((document) => (
              <motion.div
                key={document.id}
                variants={itemVariants}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => handleViewDocument(document)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full p-2 mr-3">
                        {getFileIcon(document.fileType)}
                      </div>
                      
                      <div className="overflow-hidden">
                        <h3 className="font-medium text-white text-sm truncate mb-1" title={document.filename}>
                          {document.filename}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="capitalize">{document.category || 'Uncategorized'}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <StatusBadge status={document.status} />
                    
                    <div className="flex gap-1">
                      <button
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDocument(document);
                        }}
                        aria-label="View document"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                      
                      {!isReadOnly && (
                        <button
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(document.id);
                          }}
                          aria-label="Delete document"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Documents list view */}
      {filteredDocuments.length > 0 && viewMode === 'list' && (
        <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-750 divide-y divide-gray-700">
              {filteredDocuments.map((document) => (
                <tr 
                  key={document.id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full p-1 mr-3">
                        {getFileIcon(document.fileType)}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {document.filename}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{document.category || 'Uncategorized'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={document.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{new Date(document.uploadedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                        onClick={() => handleViewDocument(document)}
                        aria-label="View document"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                      
                      {!isReadOnly && (
                        <button
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                          onClick={() => handleDeleteDocument(document.id)}
                          aria-label="Delete document"
                        >
                          <Trash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Upload Modal */}
      {!isReadOnly && (
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          ownerId={ownerId}
          onSuccess={handleDocumentUploaded}
        />
      )}
    </div>
  );
} 