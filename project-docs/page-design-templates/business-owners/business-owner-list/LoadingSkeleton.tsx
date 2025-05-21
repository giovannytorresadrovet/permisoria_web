// src/components/features/business-owners/LoadingSkeleton.tsx
'use client';

import React from 'react';
import { Card } from 'keep-react';

export default function LoadingSkeleton() {
  // Array of column widths for more realistic appearance
  const columnWidths = [
    ['w-3/4', 'w-2/3', 'w-1/2', 'w-2/5', 'w-1/4'], // Row 1
    ['w-4/5', 'w-3/5', 'w-2/5', 'w-1/2', 'w-1/3'], // Row 2
    ['w-2/3', 'w-1/2', 'w-3/5', 'w-3/5', 'w-2/5'], // Row 3
    ['w-3/4', 'w-2/5', 'w-3/5', 'w-2/5', 'w-1/4'], // Row 4
    ['w-4/5', 'w-1/2', 'w-2/5', 'w-1/2', 'w-1/3'], // Row 5
  ];

  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-700/70 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gray-700 rounded-md animate-pulse"></div>
      </div>
      
      {/* Search and filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 w-full sm:w-64 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-full sm:w-48 bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      {/* Table/cards skeleton */}
      <Card className="overflow-hidden border border-white/10 bg-surface/60 backdrop-blur-sm p-4">
        <div className="space-y-6">
          {/* Table header skeleton */}
          <div className="grid grid-cols-5 gap-4 pb-4 border-b border-gray-700">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className={`h-6 bg-gray-700 rounded animate-pulse`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
          
          {/* Table rows skeleton */}
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 py-4 border-b border-gray-700 last:border-0">
              {[...Array(5)].map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`h-6 bg-gray-700 rounded animate-pulse ${columnWidths[rowIndex][colIndex]}`}
                  style={{ 
                    animationDelay: `${(rowIndex * 0.1 + colIndex * 0.05)}s`,
                    animationDuration: '1.8s',
                    opacity: 0.7 + (5 - rowIndex) * 0.05 
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </Card>
      
      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-64 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}