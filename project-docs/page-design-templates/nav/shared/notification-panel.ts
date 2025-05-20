"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, Tabs, Button } from 'keep-react';
import { 
  X, 
  Bell, 
  Clock,
  CheckCircle,
  WarningCircle,
  Info,
  ArchiveBox
} from 'phosphor-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  // Sample notification data - would come from API in real app
  const notifications = [
    {
      id: '1',
      type: 'permit_expiring',
      title: 'Permit Expiring Soon',
      message: 'Restaurant Operation Permit #A2589 expires in 15 days',
      time: '2 hours ago',
      read: false,
      business: 'El Meson Sandwiches',
      icon: Clock,
      iconBg: 'bg-amber-500'
    },
    {
      id: '2',
      type: 'verification_complete',
      title: 'Verification Complete',
      message: 'Business Owner "Carlos Mendez" has been verified successfully',
      time: '5 hours ago',
      read: false,
      business: null,
      icon: CheckCircle,
      iconBg: 'bg-green-500'
    },
    {
      id: '3',
      type: 'document_rejected',
      title: 'Document Rejected',
      message: 'Business registration document for "Cafetería Mallorca" was rejected',
      time: 'Yesterday',
      read: true,
      business: 'Cafetería Mallorca',
      icon: WarningCircle,
      iconBg: 'bg-red-500'
    },
    {
      id: '4',
      type: 'system_update',
      title: 'System Update',
      message: 'Permisoria has been updated with new permit workflow features',
      time: '3 days ago',
      read: true,
      business: null,
      icon: Info,
      iconBg: 'bg-blue-500'
    }
  ];

  // Animation variants for the panel
  const panelVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  };

  return (
    <>
      {/* Dark overlay */}
      <motion.div 
        className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Notification panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-gray-900 border-l border-gray-800 shadow-xl z-40 overflow-hidden flex flex-col"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-indigo-400" />
            <h2 className="text-lg font-medium text-white">Notifications</h2>
          </div>
          <Button
            size="sm"
            type="outline"
            circle={true}
            className="text-gray-300 hover:text-white border-transparent hover:bg-gray-800"
            onClick={onClose}
          >
            <X size={18} weight="bold" />
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs className="px-4 pt-4">
          <Tabs.Item title="All" active>
            <div className="h-[calc(100vh-146px)] overflow-y-auto">
              {notifications.length > 0 ? (
                <ul className="space-y-2 p-2">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'
                      } hover:bg-gray-800 transition-colors cursor-pointer`}
                    >
                      <div className="flex gap-3">
                        <div className={`h-10 w-10 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <notification.icon size={20} weight="fill" className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${notification.read ? 'text-gray-200' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.business && (
                            <p className="text-xs text-indigo-400 mt-1">
                              {notification.business}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <ArchiveBox size={32} className="text-gray-500" />
                  </div>
                  <p className="text-gray-300 font-medium">No notifications</p>
                  <p className="text-gray-500 text-sm mt-1">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Unread">
            <div className="h-[calc(100vh-146px)] overflow-y-auto">
              {/* Unread notifications would go here */}
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-gray-500" />
                </div>
                <p className="text-gray-300 font-medium">No unread notifications</p>
                <p className="text-gray-500 text-sm mt-1">
                  You've read all your notifications!
                </p>
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
        
        {/* Footer with actions */}
        <div className="mt-auto p-4 border-t border-gray-800 bg-gray-900">
          <div className="flex justify-between">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 mr-2 justify-center text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              Mark All Read
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 ml-2 justify-center text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              Settings
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationPanel;
