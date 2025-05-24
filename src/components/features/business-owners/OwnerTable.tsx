'use client';

import { Avatar } from 'keep-react';
import StatusBadge from './StatusBadge';
import { ArrowsDownUp } from 'phosphor-react';

// Define OwnerType
interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  verificationStatus: string;
  createdAt?: string;
  _count?: { businesses?: number };
}

type SortByType = string | null;
type SortOrderType = 'asc' | 'desc';

interface OwnerTableProps {
  owners: BusinessOwner[];
  onViewOwner: (id: string) => void;
  onSort: (columnKey: string) => void;
  sortBy: SortByType;
  sortOrder: SortOrderType;
}

// Helper for sort icon
const SortIcon = ({ active, order }: { active: boolean; order: SortOrderType }) => {
  if (!active) return <ArrowsDownUp size={14} className="ml-1 text-gray-500" />;
  return order === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
};

export default function OwnerTable({ owners, onViewOwner, onSort, sortBy, sortOrder }: OwnerTableProps) {
  const tableHeaders = [
    { key: 'lastName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'verificationStatus', label: 'Status' },
    { key: 'createdAt', label: 'Added', alignRight: true },
  ];

  return (
    <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {tableHeaders.map(header => (
              <th 
                key={header.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${header.alignRight ? 'text-right' : ''}`}
              >
                <button 
                  className="flex items-center focus:outline-none hover:text-gray-200 w-full"
                  onClick={() => onSort(header.key)}
                  style={{ justifyContent: header.alignRight ? 'flex-end' : 'flex-start' }}
                >
                  {header.label}
                  <SortIcon active={sortBy === header.key} order={sortOrder} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-750 divide-y divide-gray-700">
          {owners.map((owner) => (
            <tr 
              key={owner.id}
              className="hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onViewOwner(owner.id)}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onViewOwner(owner.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-primary/20 text-primary rounded-full mr-3 flex items-center justify-center" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                    {`${owner.firstName?.charAt(0) || ''}${owner.lastName?.charAt(0) || ''}`}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {`${owner.firstName} ${owner.lastName}`}
                    </div>
                    {(owner.city || owner.state) && (
                      <div className="text-xs text-gray-400">
                        {[owner.city, owner.state].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{owner.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{owner.phone || '—'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={owner.verificationStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="text-gray-400">
                  {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : '—'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 