"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Button, Input, Dropdown } from 'keep-react';
import { 
  MagnifyingGlass, 
  Bell, 
  CaretDown,
  UserCircle,
  Gear,
  SignOut,
  Question
} from 'phosphor-react';
import UserMenuDropdown from './UserMenuDropdown';

interface DesktopHeaderProps {
  onNotificationsToggle: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onNotificationsToggle }) => {
  return (
    <motion.header 
      className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search */}
      <div className="w-96">
        <div className="relative">
          <Input 
            placeholder="Search..." 
            sizing="md"
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Help */}
        <Button
          size="sm"
          type="outline"
          circle={true}
          className="text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
          onClick={() => {}}
        >
          <Question size={20} />
        </Button>
        
        {/* Notifications */}
        <div className="relative">
          <Button
            size="sm"
            type="outline"
            circle={true}
            className="text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
            onClick={onNotificationsToggle}
          >
            <Bell size={20} />
          </Button>
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </div>
        
        {/* User menu */}
        <Dropdown
          trigger={
            <Button
              size="xs"
              type="outline"
              className="!px-3 !py-2 text-gray-300 hover:text-white border-transparent hover:bg-gray-800 flex items-center gap-2"
            >
              <Avatar 
                shape="circle" 
                size="sm" 
                status="online"
                img="/api/placeholder/32/32"
              />
              <span>Marcos Rodriguez</span>
              <CaretDown size={14} weight="bold" />
            </Button>
          }
          className="bg-gray-800 border border-gray-700 text-white"
        >
          <Dropdown.Item className="hover:bg-gray-700">
            <UserCircle size={20} className="text-gray-300" />
            <span>My Profile</span>
          </Dropdown.Item>
          <Dropdown.Item className="hover:bg-gray-700">
            <Gear size={20} className="text-gray-300" />
            <span>Settings</span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="text-red-400 hover:bg-gray-700">
            <SignOut size={20} />
            <span>Sign Out</span>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </motion.header>
  );
};

export default DesktopHeader;
