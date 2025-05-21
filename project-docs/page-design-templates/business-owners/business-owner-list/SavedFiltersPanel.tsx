// src/components/features/business-owners/SavedFiltersPanel.tsx
'use client';

import { useState } from 'react';
import { Button, Dropdown } from 'keep-react';
import { FunnelSimple, CaretDown, Bookmark, BookmarkSimple, DotsThree, Trash } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the filter criteria type
export interface FilterCriteria {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Define the saved filter type
export interface SavedFilter {
  id: string;
  name: string;
  criteria: FilterCriteria;
}

interface SavedFiltersPanelProps {
  currentFilter: FilterCriteria;
  savedFilters: SavedFilter[];
  onApplyFilter: (filter: FilterCriteria) => void;
  onSaveCurrentFilter: () => void;
  onDeleteFilter: (id: string) => void;
}

export default function SavedFiltersPanel({
  currentFilter,
  savedFilters,
  onApplyFilter,
  onSaveCurrentFilter,
  onDeleteFilter
}: SavedFiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  
  // Handle saving current filter
  const handleSaveFilter = () => {
    if (filterName.trim()) {
      onSaveCurrentFilter();
      setFilterName('');
      setShowSaveDialog(false);
    }
  };
  
  return (
    <div className="relative">
      <Button
        size="sm"
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
      >
        <FunnelSimple size={16} className="mr-2" />
        Saved Filters
        <CaretDown size={14} className="ml-2" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 w-64 bg-gray-800 rounded-md shadow-lg border border-gray-700 overflow-hidden"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs uppercase text-gray-400 font-medium">
                Saved Filters
              </div>
              
              {savedFilters.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {savedFilters.map((filter) => (
                    <div 
                      key={filter.id}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer group"
                      onClick={() => onApplyFilter(filter.criteria)}
                    >
                      <div className="flex items-center">
                        <BookmarkSimple size={16} className="text-blue-400 mr-2" />
                        <span className="text-sm text-gray-300">{filter.name}</span>
                      </div>
                      <Button
                        size="xs"
                        type="button"
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFilter(filter.id);
                        }}
                      >
                        <Trash size={14} className="text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-sm text-gray-400">
                  No saved filters yet
                </div>
              )}
              
              <div className="mt-2 pt-2 border-t border-gray-700">
                <button
                  className="w-full text-left px-3 py-2 text-blue-400 hover:bg-gray-700 rounded-md text-sm flex items-center"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Bookmark size={16} className="mr-2" />
                  Save Current Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Save Filter Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 w-96"
            >
              <h3 className="text-lg font-medium text-gray-200 mb-4">Save Current Filter</h3>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter filter name"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim()}
                >
                  Save Filter
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}