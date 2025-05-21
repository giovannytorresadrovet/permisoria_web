// src/components/features/business-owners/verification/components/DocumentViewer.jsx
import React, { useState } from 'react';
import { Card, Button } from 'keep-react';
import { MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowClockwise, DownloadSimple } from 'phosphor-react';
import { motion } from 'framer-motion';

const DocumentViewer = ({ document }) => {
  const [zoom, setZoom] = useState(100);
  
  if (!document) return null;
  
  // Determine if document is an image or PDF
  const isPdf = document.contentType === 'application/pdf' || 
                document.name?.toLowerCase().endsWith('.pdf');
  
  const handleZoom = (action) => {
    if (action === 'in') {
      setZoom(prev => Math.min(prev + 25, 200));
    } else if (action === 'out') {
      setZoom(prev => Math.max(prev - 25, 50));
    } else {
      setZoom(100);
    }
  };
  
  return (
    <Card className="bg-gray-800 border border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h4 className="font-medium text-white">{document.name}</h4>
          <p className="text-xs text-gray-400">{document.type}</p>
        </div>
        <div className="flex space-x-2">
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
        </div>
      </div>
      
      <div className="p-4 h-64 flex items-center justify-center bg-gray-900">
        {isPdf ? (
          // Embed PDF viewer
          <iframe 
            src={document.url} 
            title={document.name}
            className="w-full h-full"
            style={{ transform: `scale(${zoom/100})`, transformOrigin: 'center' }}
          />
        ) : (
          // Display image
          <motion.img 
            src={document.url || document.thumbnailUrl} 
            alt={document.name}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              transform: `scale(${zoom/100})`,
              transition: 'transform 0.2s ease-out'
            }}
            className="object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      <div className="p-3 border-t border-gray-700 flex justify-end">
        <Button 
          size="xs" 
          color="metal"
          onClick={() => window.open(document.url, '_blank')}
        >
          <DownloadSimple size={16} className="mr-1.5" />
          Download
        </Button>
      </div>
    </Card>
  );
};

export default DocumentViewer;