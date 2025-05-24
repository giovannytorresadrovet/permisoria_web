'use client';

import { useState, useEffect } from 'react';
import { Button } from 'keep-react';
import { X, Bookmark, Check } from 'phosphor-react';

interface Filter {
  search: string;
  status: string;
}

interface SavedFiltersProps {
  onApplyFilter: (filter: Filter) => void;
  currentFilter: Filter;
}

interface SavedFilter extends Filter {
  id: string;
  name: string;
}

export default function SavedFiltersPanel({ onApplyFilter, currentFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load saved filters from localStorage
  useEffect(() => {
    try {
      const storedFilters = localStorage.getItem('owner_saved_filters');
      if (storedFilters) {
        setSavedFilters(JSON.parse(storedFilters));
      } else {
        // Add some default filters for demo
        const defaultFilters: SavedFilter[] = [
          { id: '1', name: 'Unverified Owners', search: '', status: 'UNVERIFIED' },
          { id: '2', name: 'Pending Verification', search: '', status: 'PENDING_VERIFICATION' },
        ];
        setSavedFilters(defaultFilters);
        localStorage.setItem('owner_saved_filters', JSON.stringify(defaultFilters));
      }
    } catch (err) {
      console.error('Error loading saved filters', err);
    }
  }, []);
  
  // Save current selection to localStorage
  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      setError('Please enter a name for your filter');
      return;
    }
    
    if (savedFilters.some(filter => filter.name === filterName.trim())) {
      setError('A filter with this name already exists');
      return;
    }
    
    const newFilter: SavedFilter = {
      id: crypto.randomUUID(),
      name: filterName.trim(),
      ...currentFilter
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    setFilterName('');
    setError(null);
    
    try {
      localStorage.setItem('owner_saved_filters', JSON.stringify(updatedFilters));
    } catch (err) {
      console.error('Error saving filters', err);
    }
  };
  
  const handleDeleteFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== id);
    setSavedFilters(updatedFilters);
    
    if (selected === id) {
      setSelected(null);
    }
    
    try {
      localStorage.setItem('owner_saved_filters', JSON.stringify(updatedFilters));
    } catch (err) {
      console.error('Error saving filters', err);
    }
  };
  
  const handleSelectFilter = (filter: SavedFilter) => {
    setSelected(filter.id);
    onApplyFilter(filter);
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-white font-medium">Saved Filters</h3>
        
        <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
          <input
            type="text"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setError(null);
            }}
            placeholder="Name this filter"
            className="bg-gray-700 text-white rounded-md py-2 px-3 border-0 focus:outline-none focus:ring-2 focus:ring-primary flex-1"
          />
          
          <Button
            size="sm"
            onClick={handleSaveFilter}
            className="bg-primary hover:bg-primary-dark text-white whitespace-nowrap"
          >
            <Bookmark size={16} className="mr-1" /> Save
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 p-2 rounded">
          {error}
        </div>
      )}
      
      {savedFilters.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p>No saved filters yet. Save your current filter for quick access later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedFilters.map((filter) => (
            <div 
              key={filter.id}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                selected === filter.id 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-gray-750 border-gray-700 hover:bg-gray-700'
              }`}
              onClick={() => handleSelectFilter(filter)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{filter.name}</h4>
                  
                  <div className="text-sm text-gray-400 space-y-1">
                    {filter.search && (
                      <div>Search: &ldquo;{filter.search}&rdquo;</div>
                    )}
                    {filter.status && (
                      <div>Status: {filter.status.replace(/_/g, ' ').toLowerCase()}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {selected === filter.id && (
                    <span className="text-primary">
                      <Check size={18} weight="bold" />
                    </span>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFilter(filter.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete filter"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 