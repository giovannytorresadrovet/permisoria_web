// src/components/features/business-owners/verification/components/ContextualHelp.jsx
import React from 'react';
import { Tooltip } from 'keep-react';
import { Info } from 'phosphor-react';

const ContextualHelp = ({ content, placement = 'top' }) => {
  return (
    <Tooltip
      content={content}
      trigger="hover"
      placement={placement}
      animation="duration-300"
      style="dark"
    >
      <button 
        className="ml-1.5 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
        aria-label="Help information"
      >
        <Info size={16} weight="bold" />
      </button>
    </Tooltip>
  );
};

export default ContextualHelp;