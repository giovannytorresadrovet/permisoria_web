// src/components/features/business-owners/verification/steps/BusinessAffiliationStep/ClaimExistingBusiness.jsx
import React, { useState } from 'react';
import { Card, TextInput, Button, Select, Badge } from 'keep-react';
import { MagnifyingGlass, Building, Buildings, Tag, Percent, UserFocus, Warning } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextualHelp from '../../components/ContextualHelp';

// Sample business roles
const businessRoles = [
  { value: 'owner', label: 'Owner' },
  { value: 'partner', label: 'Partner' },
  { value: 'director', label: 'Director' },
  { value: 'officer', label: 'Corporate Officer' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'member', label: 'LLC Member' },
  { value: 'manager', label: 'LLC Manager' },
  { value: 'president', label: 'President' },
  { value: 'ceo', label: 'CEO' },
  { value: 'other', label: 'Other' }
];

// Mock API call for business search - in real implementation, this would be an API call
const searchBusinesses = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock results
  if (!query || query.length < 3) return [];
  
  return [
    {
      id: 'BIZ-1001',
      legalName: 'Sol Cafe LLC',
      dba: 'Sol Cafe',
      type: 'Restaurant',
      city: 'San Juan',
      state: 'PR',
      status: 'ACTIVE'
    },
    {
      id: 'BIZ-1002',
      legalName: 'Rodriguez Import/Export Inc.',
      dba: '',
      type: 'Trade',
      city: 'San Juan',
      state: 'PR',
      status: 'ACTIVE'
    },
    {
      id: 'BIZ-1003',
      legalName: 'Sunrise Bakery Corp.',
      dba: 'Sol Panaderia',
      type: 'Food Production',
      city: 'Ponce',
      state: 'PR',
      status: 'ACTIVE'
    }
  ].filter(biz => 
    biz.legalName.toLowerCase().includes(query.toLowerCase()) || 
    (biz.dba && biz.dba.toLowerCase().includes(query.toLowerCase())) ||
    biz.id.toLowerCase().includes(query.toLowerCase())
  );
};

const ClaimExistingBusiness = ({ data, onChange }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  const handleSearch = async () => {
    if (!data.searchTerm || data.searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchBusinesses(data.searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Show error message
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectBusiness = (business) => {
    onChange({
      ...data,
      selectedBusiness: business,
      searchResults: []
    });
  };
  
  const handleClearSelection = () => {
    onChange({
      ...data,
      selectedBusiness: null
    });
  };
  
  return (
    <div className="space-y-4">
      {!data.selectedBusiness ? (
        // Search and select business
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <h4 className="font-medium">Search Existing Business</h4>
              <ContextualHelp content="Search for an existing business that the owner claims to be associated with. You can search by business ID, legal name, or DBA." />
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <TextInput
                    placeholder="Enter Business ID, Legal Name, or DBA"
                    value={data.searchTerm || ''}
                    onChange={(e) => handleChange('searchTerm', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    addon={<MagnifyingGlass size={16} color="#9CA3AF" />}
                  />
                </div>
                <Button
                  size="md"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!data.searchTerm || data.searchTerm.length < 3 || isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlass size={16} className="mr-1.5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <p className="text-gray-400 text-sm">
                      {searchResults.length} business(es) found. Select one to proceed:
                    </p>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {searchResults.map(business => (
                        <div 
                          key={business.id}
                          className="p-3 bg-gray-750 border border-gray-700 hover:border-blue-500 rounded-md cursor-pointer transition-all"
                          onClick={() => handleSelectBusiness(business)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{business.legalName}</h5>
                              {business.dba && (
                                <p className="text-gray-400 text-xs">DBA: {business.dba}</p>
                              )}
                              <p className="text-gray-400 text-xs mt-1">
                                {business.type} • {business.city}, {business.state}
                              </p>
                            </div>
                            <Badge 
                              color={business.status === 'ACTIVE' ? 'success' : 'warning'}
                              size="sm"
                            >
                              {business.status}
                            </Badge>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{business.id}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {data.searchTerm && data.searchTerm.length >= 3 && searchResults.length === 0 && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-gray-750 border border-gray-700 rounded-md"
                  >
                    <div className="flex items-center">
                      <Warning size={18} className="text-yellow-500 mr-2" />
                      <p className="text-gray-300">
                        No businesses found matching "{data.searchTerm}". 
                        Try a different search term or consider using the "New Business Intent" option.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      ) : (
        // Selected business details and claim form
        <>
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-3">
                  <h4 className="font-medium">Selected Business</h4>
                  <ContextualHelp content="This is the business that the owner claims to be affiliated with. The information shown is publicly available." />
                </div>
                <Button 
                  size="xs" 
                  color="metal"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </Button>
              </div>
              
              <div className="p-3 bg-gray-750 border border-gray-700 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{data.selectedBusiness.legalName}</h5>
                    {data.selectedBusiness.dba && (
                      <p className="text-gray-400 text-xs">DBA: {data.selectedBusiness.dba}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {data.selectedBusiness.type} • {data.selectedBusiness.city}, {data.selectedBusiness.state}
                    </p>
                  </div>
                  <Badge 
                    color={data.selectedBusiness.status === 'ACTIVE' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {data.selectedBusiness.status}
                  </Badge>
                </div>
                <p className="text-gray-500 text-xs mt-1">{data.selectedBusiness.id}</p>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-800 rounded-md">
                <div className="flex items-start">
                  <Warning size={18} className="text-yellow-500 mt-0.5 mr-2" />
                  <p className="text-yellow-400 text-sm">
                    The information shown is publicly available. Review the claimant's documents to verify their specific affiliation before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <h4 className="font-medium">Claim Details</h4>
                <ContextualHelp content="Specify the details of the owner's claim to this business, including ownership percentage and role." />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="ownershipPercentage" className="block text-sm text-gray-400 mb-1">
                    Ownership Percentage Claimed
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <TextInput
                    id="ownershipPercentage"
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    placeholder="Enter percentage (0.01-100)"
                    value={data.ownershipPercentage || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value <= 0 || value > 100) {
                        // Invalid input
                        handleChange('ownershipPercentage', e.target.value);
                      } else {
                        handleChange('ownershipPercentage', value.toString());
                      }
                    }}
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    addon={<Percent size={16} color="#9CA3AF" />}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Note: The sum of all ownership percentages cannot exceed 100%. 
                    Claims of less than 50% ownership will require confirmation from 
                    majority owners.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="roleInBusiness" className="block text-sm text-gray-400 mb-1">
                    Role in Business
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select
                    id="roleInBusiness"
                    value={data.roleInBusiness || ''}
                    onValueChange={(value) => handleChange('roleInBusiness', value)}
                    placeholder="Select role in business"
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    addon={<UserFocus size={16} color="#9CA3AF" />}
                    required
                  >
                    {businessRoles.map(role => (
                      <Select.Option key={role.value} value={role.value}>
                        {role.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-yellow-700">
            <div className="p-4">
              <div className="flex items-start">
                <Warning size={20} className="text-yellow-500 mt-0.5 mr-3" />
                <div>
                  <h5 className="font-medium text-yellow-400 mb-1">Important Notice</h5>
                  <p className="text-yellow-300 text-sm">
                    This business is already registered. Upon submission of this verification with a claim, 
                    the existing verified owner(s) <strong>and their designated Permit Manager(s) (if any, and if different from you)</strong> will 
                    be notified to review and confirm this new affiliation. The association will be 'Pending External Confirmation' 
                    until approved by them.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ClaimExistingBusiness;