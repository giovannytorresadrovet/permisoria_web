"use client";

import React, { useState } from 'react';
import { Dropdown, Avatar } from 'keep-react';
import { 
  UserCircle,
  Gear,
  CreditCard,
  SignOut,
  User,
  Moon,
  Sun,
  Globe,
  ShieldCheck
} from 'phosphor-react';

const UserMenuDropdown: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  
  return (
    <Dropdown
      label={
        <div className="flex items-center gap-2">
          <Avatar 
            shape="circle" 
            size="sm" 
            status="online"
            img="/api/placeholder/32/32"
          />
          <span className="hidden md:inline">Marcos Rodriguez</span>
        </div>
      }
      size="md"
      arrowIcon={false}
      dismissOnClick={true}
      className="w-64 bg-gray-800 border border-gray-700 shadow-xl"
    >
      {/* User info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar 
            shape="circle" 
            size="md" 
            status="online"
            img="/api/placeholder/40/40"
          />
          <div>
            <p className="text-white font-medium">Marcos Rodriguez</p>
            <p className="text-xs text-gray-400">Permit Manager (Business Tier)</p>
            <p className="text-xs text-indigo-400 mt-0.5">PR-PM-2475</p>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
      <div className="py-2">
        <Dropdown.Item
          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
        >
          <UserCircle size={18} className="text-gray-300" />
          <span className="text-gray-200">View Profile</span>
        </Dropdown.Item>
        
        <Dropdown.Item
          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
        >
          <Gear size={18} className="text-gray-300" />
          <span className="text-gray-200">Settings</span>
        </Dropdown.Item>
        
        <Dropdown.Item
          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
        >
          <CreditCard size={18} className="text-gray-300" />
          <span className="text-gray-200">Subscription</span>
        </Dropdown.Item>
      </div>
      
      {/* Preferences */}
      <div className="py-2 border-t border-gray-700">
        <Dropdown.Item
          className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-700"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon size={18} className="text-gray-300" />
            ) : (
              <Sun size={18} className="text-gray-300" />
            )}
            <span className="text-gray-200">Theme</span>
          </div>
          <span className="text-xs text-gray-400">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </Dropdown.Item>
        
        <Dropdown.Item
          className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-700"
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        >
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-gray-300" />
            <span className="text-gray-200">Language</span>
          </div>
          <span className="text-xs text-gray-400">
            {language === 'en' ? 'English' : 'Español'}
          </span>
        </Dropdown.Item>
      </div>
      
      {/* Sign out */}
      <div className="py-2 border-t border-gray-700">
        <Dropdown.Item
          className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-gray-700"
        >
          <SignOut size={18} />
          <span>Sign Out</span>
        </Dropdown.Item>
      </div>
    </Dropdown>
  );
};

export default UserMenuDropdown;
