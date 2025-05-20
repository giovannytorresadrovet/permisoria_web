"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Button } from 'keep-react';
import { 
  List, 
  Bell, 
  MagnifyingGlass,
  UserCircle
} from 'phosphor-react';
import UserMenuDropdown from './UserMenuDropdown';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  onNotificationsToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  onMenuToggle, 
  onNotificationsToggle 
}) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <Button
          size="sm"
          type="outline"
          circle={true}
          className="mr-3 text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
          onClick={onMenuToggle}
        >
          <List size={24} weight="bold" />
        </Button>
        
        <div className="text-white font-semibold text-lg">Permisoria</div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          type="outline"
          circle={true}
          className="text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
          onClick={() => {}}
        >
          <MagnifyingGlass size={20} weight="bold" />
        </Button>
        
        <div className="relative">
          <Button
            size="sm"
            type="outline"
            circle={true}
            className="text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
            onClick={onNotificationsToggle}
          >
            <Bell size={20} weight="bold" />
          </Button>
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </div>
        
        <div className="relative">
          <Avatar 
            shape="circle" 
            size="sm" 
            status="online"
            img="/api/placeholder/32/32"
            className="cursor-pointer"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default MobileHeader;
