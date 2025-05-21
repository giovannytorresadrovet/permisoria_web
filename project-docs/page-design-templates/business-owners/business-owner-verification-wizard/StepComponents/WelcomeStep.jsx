// src/components/features/business-owners/verification/steps/WelcomeStep.jsx
import React from 'react';
import { Card, Avatar } from 'keep-react';
import { IdentificationCard, MapPin, Buildings, CheckCircle, Info } from 'phosphor-react';
import { motion } from 'framer-motion';

const WelcomeStep = ({ ownerData }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Avatar 
            shape="circle"
            size="xl"
            className="bg-blue-600 text-white text-2xl"
          >
            {getInitials(ownerData?.firstName, ownerData?.lastName)}
          </Avatar>
        </div>
        <h2 className="text-xl font-bold mb-1">
          {ownerData?.firstName} {ownerData?.lastName}
        </h2>
        <p className="text-gray-400 text-sm">{ownerData?.id || ''}</p>
      </div>

      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Verification Process</h3>
          <p className="text-gray-300 mb-4">
            You are about to verify this business owner's identity and information.
            This process includes the following steps:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <IdentificationCard size={18} />
              </div>
              <div>
                <h4 className="font-medium">Identity Verification</h4>
                <p className="text-sm text-gray-400">Verify personal ID documents and information</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-medium">Address Verification</h4>
                <p className="text-sm text-gray-400">Confirm residential address details</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <Buildings size={18} />
              </div>
              <div>
                <h4 className="font-medium">Business Connection</h4>
                <p className="text-sm text-gray-400">Validate relationship to associated businesses</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 className="font-medium">Final Verification</h4>
                <p className="text-sm text-gray-400">Review and complete the verification process</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="bg-blue-900/30 border border-blue-800 rounded-md p-4">
        <div className="flex items-start">
          <Info size={20} className="text-blue-400 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-300 text-sm">
              This verification is required before the owner can be associated with 
              any businesses or apply for permits. Please review all documents carefully 
              and ensure all information is consistent and valid.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeStep;