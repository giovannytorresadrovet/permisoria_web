'use client';

interface LoadingSkeletonProps {
  type: 'ownerGrid' | 'ownerTable' | 'ownerDetail';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 4 }: LoadingSkeletonProps) {
  // Common skeleton pulse animation class
  const pulseClass = "animate-pulse bg-gray-700";
  
  // Owner Grid Loading Skeleton
  if (type === 'ownerGrid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-full shadow-lg">
            <div className="flex items-center mb-4">
              <div className={`${pulseClass} rounded-full h-10 w-10 mr-3`}></div>
              <div className="flex-1">
                <div className={`${pulseClass} h-4 rounded w-3/4 mb-2`}></div>
                <div className={`${pulseClass} h-3 rounded w-1/2`}></div>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <div className={`${pulseClass} h-3 rounded w-1/3`}></div>
              <div className={`${pulseClass} h-3 rounded w-1/3`}></div>
            </div>
            
            <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
              <div className={`${pulseClass} h-6 rounded w-20`}></div>
              <div className={`${pulseClass} h-4 rounded w-16`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Owner Table Loading Skeleton
  if (type === 'ownerTable') {
    return (
      <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Added</th>
            </tr>
          </thead>
          <tbody className="bg-gray-750 divide-y divide-gray-700">
            {Array.from({ length: count }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`${pulseClass} rounded-full h-8 w-8 mr-3`}></div>
                    <div>
                      <div className={`${pulseClass} h-4 rounded w-24 mb-1`}></div>
                      <div className={`${pulseClass} h-3 rounded w-16`}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`${pulseClass} h-4 rounded w-32`}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`${pulseClass} h-4 rounded w-24`}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`${pulseClass} h-6 rounded w-16`}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`${pulseClass} h-4 rounded w-20 ml-auto`}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  // Owner Detail Loading Skeleton
  if (type === 'ownerDetail') {
    return (
      <div className="space-y-6 p-4 md:p-6 bg-gray-900">
        {/* Back button skeleton */}
        <div className={`${pulseClass} h-10 w-40 rounded-md`}></div>
        
        {/* Profile card skeleton */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className={`${pulseClass} rounded-full h-16 w-16 mr-6`}></div>
              <div>
                <div className={`${pulseClass} h-6 rounded w-48 mb-2`}></div>
                <div className={`${pulseClass} h-4 rounded w-32 mb-2`}></div>
                <div className={`${pulseClass} h-6 rounded-md w-24`}></div>
              </div>
            </div>
            <div className={`${pulseClass} h-10 w-32 rounded-md`}></div>
          </div>
        </div>
        
        {/* Tabs skeleton */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`p-4 ${index === 0 ? 'border-b-2 border-primary' : ''}`}>
                <div className={`${pulseClass} h-4 w-24 rounded`}></div>
              </div>
            ))}
          </div>
          
          <div className="p-6">
            <div className={`${pulseClass} h-6 w-40 rounded mb-6`}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
                <div className={`${pulseClass} h-4 w-32 rounded mb-4`}></div>
                
                <div className="space-y-4">
                  <div>
                    <div className={`${pulseClass} h-3 w-16 rounded mb-1`}></div>
                    <div className={`${pulseClass} h-4 w-48 rounded`}></div>
                  </div>
                  
                  <div>
                    <div className={`${pulseClass} h-3 w-16 rounded mb-1`}></div>
                    <div className={`${pulseClass} h-4 w-32 rounded`}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
                <div className={`${pulseClass} h-4 w-24 rounded mb-4`}></div>
                
                <div className="space-y-4">
                  <div>
                    <div className={`${pulseClass} h-3 w-16 rounded mb-1`}></div>
                    <div className={`${pulseClass} h-4 w-24 rounded`}></div>
                  </div>
                  
                  <div>
                    <div className={`${pulseClass} h-3 w-16 rounded mb-1`}></div>
                    <div className={`${pulseClass} h-4 w-24 rounded`}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-750 border border-gray-700 rounded-lg p-4">
              <div className={`${pulseClass} h-4 w-48 rounded mb-4`}></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className={`${pulseClass} h-3 w-8 rounded mb-1`}></div>
                  <div className={`${pulseClass} h-4 w-32 rounded`}></div>
                </div>
                
                <div>
                  <div className={`${pulseClass} h-3 w-16 rounded mb-1`}></div>
                  <div className={`${pulseClass} h-4 w-32 rounded`}></div>
                </div>
                
                <div>
                  <div className={`${pulseClass} h-3 w-32 rounded mb-1`}></div>
                  <div className={`${pulseClass} h-6 w-24 rounded`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="flex justify-center items-center p-10">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 