// src/components/features/business-owners/verification/steps/BusinessAffiliationStep/NewBusinessIntent.jsx
import React from 'react';
import { Card, TextInput, Select } from 'keep-react';
import { Building, Buildings, Tag } from 'phosphor-react';
import ContextualHelp from '../../components/ContextualHelp';

// Business type options
const businessTypes = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'service', label: 'Service' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'construction', label: 'Construction' },
  { value: 'professional', label: 'Professional Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'tourism', label: 'Tourism' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'other', label: 'Other' }
];

const NewBusinessIntent = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <h4 className="font-medium">New Business Intent</h4>
            <ContextualHelp content="This information will be used to associate the owner with a new business they intend to create in the system." />
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="legalName" className="block text-sm text-gray-400 mb-1">
                Intended Company Name (Legal Name)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <TextInput
                id="legalName"
                placeholder="Enter legal business name"
                value={data.legalName || ''}
                onChange={(e) => handleChange('legalName', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full"
                addon={<Building size={16} color="#9CA3AF" />}
                required
              />
            </div>
            
            <div>
              <label htmlFor="dba" className="block text-sm text-gray-400 mb-1">
                Doing Business As (DBA) - If Different from Legal Name
              </label>
              <TextInput
                id="dba"
                placeholder="Enter DBA name (if applicable)"
                value={data.dba || ''}
                onChange={(e) => handleChange('dba', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full"
                addon={<Tag size={16} color="#9CA3AF" />}
              />
            </div>
            
            <div>
              <label htmlFor="businessType" className="block text-sm text-gray-400 mb-1">
                Business Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                id="businessType"
                value={data.businessType || ''}
                onValueChange={(value) => handleChange('businessType', value)}
                placeholder="Select business type"
                className="bg-gray-700 border-gray-600 text-white w-full"
                addon={<Buildings size={16} color="#9CA3AF" />}
                required
              >
                {businessTypes.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-4">
          <div className="flex items-start">
            <div className="bg-blue-600/20 text-blue-400 p-2 rounded-full mr-3 mt-1">
              <Buildings size={20} />
            </div>
            <div>
              <h5 className="font-medium mb-1">Next Steps After Verification</h5>
              <p className="text-gray-400 text-sm">
                If this Business Owner is verified, they can then be designated as the primary owner when you formally create the new Business record in the 'Businesses' section. A Business record cannot be created in Permisoria without at least one primary verified owner associated during its creation. This intended business will be noted on their profile as 'Pending Creation'.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewBusinessIntent;