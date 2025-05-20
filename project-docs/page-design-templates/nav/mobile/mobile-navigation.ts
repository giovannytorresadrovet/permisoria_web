"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'keep-react';
import { 
  House,
  Briefcase,
  Users,
  Note, 
  Bell
} from 'phosphor-react';

const MobileNavigation: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', href: '/app/dashboard', icon: House },
    { name: 'Businesses', href: '/app/businesses', icon: Briefcase },
    { name: 'Owners', href: '/app/business-owners', icon: Users },
    { name: 'Permits', href: '/app/permits', icon: Note },
    { name: 'Notifications', href: '/app/notifications', icon: Bell },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 z-20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full max-w-screen-lg mx-auto px-2">
        <ul className="h-full flex items-center justify-around">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 text-gray-300 hover:text-indigo-400 transition-colors"
                >
                  <item.icon size={20} weight="bold" />
                </motion.div>
                <span className="text-xs mt-0.5 text-gray-400 font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default MobileNavigation;
