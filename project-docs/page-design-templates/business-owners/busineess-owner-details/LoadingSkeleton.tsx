'use client';

import React from 'react';
import { Card } from 'keep-react';
import { motion } from 'framer-motion';

// Loading skeleton types for different content
const skeletonTypes = {
  businessOwnerDetail: () => (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center mb-6">
        <div className="h-10 w-24 bg-gray-700 rounded"></div>
      </div>
      
      <div className="h-36 md:h-40 bg-gray-700 rounded-xl"></div>
      
      <div className="h-10 w-64 bg-gray-700 rounded"></div>
      
      <div className="h-64 bg-gray-700 rounded-xl"></div>
    </div>
  ),
  documentGrid: ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="bg-gray-700/40 border-gray-700/50 h-32">
          <div className="p-4 animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="h-5 bg-gray-600 rounded w-20"></div>
              <div className="h-5 bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  ),
  table: ({ rows = 5, cols = 4 }) => (
    <div className="overflow-hidden rounded-md border border-gray-700 animate-pulse">
      <div className="bg-gray-800 p-3">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
      <div className="bg-gray-750 p-1">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-2 border-b border-gray-700 last:border-0">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(cols)].map((_, j) => (
                <div key={j} className="h-8 bg-gray-700 rounded" style={{ opacity: 0.7 + (5 - i) * 0.05 }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default function LoadingSkeleton({ type = 'businessOwnerDetail', count, rows, cols }) {
  // Get the appropriate skeleton based on type
  const SkeletonComponent = skeletonTypes[type] || skeletonTypes.businessOwnerDetail;
  
  return <SkeletonComponent count={count} rows={rows} cols={cols} />;
}