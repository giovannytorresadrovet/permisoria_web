'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MagnifyingGlassPlus, 
  MagnifyingGlassMinus, 
  ArrowsClockwise, 
  DownloadSimple, 
  FileText, 
  FilePdf, 
  ImageSquare,
  X,
  Warning
} from 'phosphor-react';
import { Button } from 'keep-react';
import { motion } from 'framer-motion';

interface DocumentViewerProps {
  documentUrl: string;
  documentType?: 'pdf' | 'image' | 'unknown';
  fileName?: string;
  onClose?: () => void;
  isFullScreen?: boolean;
}

export default function DocumentViewer({
  documentUrl,
  documentType = 'unknown',
  fileName = 'Document',
  onClose,
  isFullScreen = false
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);
  
  // Determine document type by extension if not provided
  const resolveDocumentType = () => {
    if (documentType !== 'unknown') return documentType;
    
    if (documentUrl.toLowerCase().endsWith('.pdf')) return 'pdf';
    if (/\.(jpe?g|png|gif|webp|bmp)$/i.test(documentUrl)) return 'image';
    return 'unknown';
  };
  
  const actualDocType = resolveDocumentType();
  
  // Handle zoom in/out
  const handleZoom = (action: 'in' | 'out' | 'reset') => {
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
  
  // Get icon based on document type
  const getDocumentIcon = () => {
    switch (actualDocType) {
      case 'pdf':
        return <FilePdf size={24} className="text-red-400" />;
      case 'image':
        return <ImageSquare size={24} className="text-blue-400" />;
      default:
        return <FileText size={24} className="text-gray-400" />;
    }
  };
  
  // Handle download
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = documentUrl;
    a.download = fileName || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div 
      className={`bg-gray-900 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative rounded-lg overflow-hidden'}`}
    >
      {/* Header with controls */}
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {getDocumentIcon()}
          <span className="text-gray-200 font-medium truncate max-w-xs">{fileName}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <Button 
            size="xs"
            variant="outline"
            onClick={() => handleZoom('out')}
            className="border-gray-700 text-gray-300"
          >
            <MagnifyingGlassMinus size={16} />
          </Button>
          <span className="text-xs text-gray-400 w-12 text-center">{zoom}%</span>
          <Button 
            size="xs"
            variant="outline"
            onClick={() => handleZoom('in')}
            className="border-gray-700 text-gray-300"
          >
            <MagnifyingGlassPlus size={16} />
          </Button>
          
          {/* Reset zoom */}
          <Button 
            size="xs"
            variant="outline"
            onClick={() => handleZoom('reset')}
            className="border-gray-700 text-gray-300"
          >
            1:1
          </Button>
          
          {/* Rotate */}
          <Button 
            size="xs"
            variant="outline"
            onClick={handleRotate}
            className="border-gray-700 text-gray-300"
          >
            <ArrowsClockwise size={16} />
          </Button>
          
          {/* Download */}
          <Button 
            size="xs"
            variant="outline"
            onClick={handleDownload}
            className="border-gray-700 text-gray-300"
          >
            <DownloadSimple size={16} />
          </Button>
          
          {/* Close (if fullscreen) */}
          {isFullScreen && (
            <Button 
              size="xs"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Document content */}
      <div className="p-4 flex items-center justify-center overflow-auto h-[calc(100%-4rem)]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <motion.div
              className="w-10 h-10 border-2 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-gray-400">Loading document...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Warning size={48} className="text-red-500 mb-4" />
            <p className="text-red-400 mb-2">Failed to load document</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}
        
        {actualDocType === 'pdf' ? (
          <object
            data={documentUrl}
            type="application/pdf"
            className="w-full h-full"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-out'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Unable to load PDF document');
            }}
            aria-label={`PDF document: ${fileName}`}
          >
            <p className="text-red-400">
              Your browser doesn&apos;t support PDF viewing. <a href={documentUrl} className="text-blue-400 underline">Download</a> instead.
            </p>
          </object>
        ) : actualDocType === 'image' ? (
          <div 
            className="flex items-center justify-center"
            style={{ 
              height: '100%',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-out',
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: '800px',
                maxHeight: '600px'
              }}
            >
              <Image
                src={documentUrl}
                alt={fileName || 'Document image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'contain' }}
                priority
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Unable to load image');
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText size={64} className="text-gray-500 mb-4" />
            <p className="text-gray-300 mb-2">Unsupported file type</p>
            <p className="text-gray-500 text-sm">Please download this file to view it</p>
            <Button 
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="mt-4 border-gray-700 text-blue-400"
            >
              <DownloadSimple size={20} className="mr-2" />
              Download File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 