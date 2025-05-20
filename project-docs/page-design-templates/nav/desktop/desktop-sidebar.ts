"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'keep-react';
import { 
  House,
  Briefcase,
  Users,
  Note,
  Bell,
  Gear,
  CreditCard,
  CaretLeft,
  CaretRight,
  SignOut,
  ChartPie
} from 'phosphor-react';

const DesktopSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const mainNavItems = [
    { name: 'Dashboard', href: '/app/dashboard', icon: House },
    { name: 'Businesses', href: '/app/businesses', icon: Briefcase },
    { name: 'Business Owners', href: '/app/business-owners', icon: Users },
    { name: 'Permits', href: '/app/permits', icon: Note },
    { name: 'Analytics', href: '/app/analytics', icon: ChartPie },
  ];
  
  const secondaryNavItems = [
    { name: 'Notifications', href: '/app/notifications', icon: Bell },
    { name: 'Subscription', href: '/app/subscription', icon: CreditCard },
    { name: 'Settings', href: '/app/settings', icon: Gear },
    { name: 'Sign Out', href: '/auth/signout', icon: SignOut },
  ];

  return (
    <motion.aside
      className={`bg-gray-900 border-r border-gray-800 h-screen relative transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapse toggle button */}
      <button
        className="absolute -right-3 top-20 bg-gray-800 border border-gray-700 text-gray-300 p-1 rounded-full shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
      </button>
      
      {/* Logo area */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-center">
        {isCollapsed ? (
          <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        ) : (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Permisoria
          </h1>
        )}
      </div>
      
      {/* Navigation */}
      <div className="p-4">
        <nav>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={20} weight="bold" />
                  </motion.div>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className={`my-6 border-t border-gray-800 ${isCollapsed ? 'mx-2' : 'mx-0'}`}></div>
          
          <ul className="space-y-1">
            {secondaryNavItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon size={20} weight="bold" />
                  </motion.div>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Profile area */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
              MR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Marcos Rodriguez</p>
              <p className="text-xs text-gray-400 truncate">Business Tier</p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default DesktopSidebar;
