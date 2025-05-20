"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Button } from 'keep-react';
import { Link } from 'keep-react';
import { 
  House,
  Briefcase,
  Users,
  Note,
  Bell,
  Gear,
  CreditCard
} from 'phosphor-react';

interface MobileSidebarProps {
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/app/dashboard', icon: House },
  { name: 'Businesses', href: '/app/businesses', icon: Briefcase },
  { name: 'Business Owners', href: '/app/business-owners', icon: Users },
  { name: 'Permits', href: '/app/permits', icon: Note },
  { name: 'Notifications', href: '/app/notifications', icon: Bell },
  { name: 'Subscription', href: '/app/subscription', icon: CreditCard },
  { name: 'Settings', href: '/app/settings', icon: Gear },
];

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  return (
    <>
      {/* Dark overlay */}
      <motion.div 
        className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar 
                shape="circle" 
                size="md" 
                status="online"
                img="/api/placeholder/40/40"
              />
              <div>
                <h2 className="font-medium text-white">Marcos Rodriguez</h2>
                <p className="text-sm text-gray-400">Permit Manager</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <item.icon size={20} weight="bold" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <Button 
              size="md" 
              variant="outline"
              className="w-full justify-center text-gray-300 border-gray-700 hover:bg-gray-800"
              onClick={onClose}
            >
              Close Menu
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default MobileSidebar;
