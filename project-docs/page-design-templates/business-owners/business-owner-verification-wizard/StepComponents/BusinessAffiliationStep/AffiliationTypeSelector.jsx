// src/components/features/business-owners/verification/steps/BusinessAffiliationStep/AffiliationTypeSelector.jsx
import React from 'react';
import { Card } from 'keep-react';
import { Buildings, Plus, Link } from 'phosphor-react';
import { motion } from 'framer-motion';

const AffiliationTypeSelector = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <p className="text-gray-300 mb-4">
        Please select the type of business affiliation for this owner:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className="bg-gray-800 border border-gray-700 hover:border-blue-500 cursor-pointer h-full"
            onClick={() => onSelect('NEW_INTENT')}
          >
            <div className="p-5 flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                <Plus size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">New Business Intent</h3>
              <p className="text-gray-400 text-sm mb-4">
                Owner intends to create a new business that doesn't exist in the system yet.
              </p>
              <div className="mt-auto pt-4">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('NEW_INTENT');
                  }}
                >
                  Select New Business Intent
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className="bg-gray-800 border border-gray-700 hover:border-blue-500 cursor-pointer h-full"
            onClick={() => onSelect('EXISTING_CLAIM')}
          >
            <div className="p-5 flex flex-col items-center text-center h-full">
              <div className="w-14 h-14 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                <Link size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Claim Existing Business</h3>
              <p className="text-gray-400 text-sm mb-4">
                Owner claims association with a business that already exists in the system.
              </p>
              <div className="mt-auto pt-4">
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('EXISTING_CLAIM');
                  }}
                >
                  Select Claim Existing Business
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AffiliationTypeSelector;