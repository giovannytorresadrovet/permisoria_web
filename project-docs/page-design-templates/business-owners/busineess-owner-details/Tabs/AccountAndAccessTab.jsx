'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'keep-react';
import { motion } from 'framer-motion';
import { 
  IdentificationBadge, 
  EnvelopeSimple, 
  Lock, 
  CalendarBlank, 
  Clock, 
  UserCirclePlus, 
  Prohibit, 
  ArrowsClockwise,
  Shield
} from 'phosphor-react';
import { format } from 'date-fns';

// Components
import ErrorMessage from '@/components/auth/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

// Status configuration for user account
const accountStatusConfig = {
  ACTIVE: { 
    color: 'success', 
    icon: <Shield size={16} weight="fill" />,
    text: 'Active'
  },
  SUSPENDED: { 
    color: 'error', 
    icon: <Prohibit size={16} weight="fill" />,
    text: 'Suspended'
  },
  EMAIL_UNVERIFIED: { 
    color: 'warning', 
    icon: <EnvelopeSimple size={16} weight="fill" />,
    text: 'Email Not Verified'
  },
  LOCKED: { 
    color: 'error', 
    icon: <Lock size={16} weight="fill" />,
    text: 'Account Locked'
  },
};

// MFA status configuration
const mfaStatusConfig = {
  ENABLED: {
    color: 'success',
    text: 'Enabled'
  },
  DISABLED: {
    color: 'gray',
    text: 'Not Enabled'
  }
};

export default function AccountAccessTab({ ownerId }) {
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isTogglingSuspension, setIsTogglingSuspension] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  
  // Fetch account data
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would be an API call
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Example: business owner is linked to a user account
        const mockAccountData = {
          isLinked: true,
          userId: 'user-123',
          email: 'maria.rodriguez@example.com',
          status: 'ACTIVE', // ACTIVE, SUSPENDED, EMAIL_UNVERIFIED, LOCKED
          lastLogin: new Date(2025, 4, 15).toISOString(),
          createdAt: new Date(2024, 9, 20).toISOString(),
          mfaStatus: 'DISABLED', // ENABLED, DISABLED
        };
        
        // Uncomment to test unlinked account
        // const mockAccountData = {
        //   isLinked: false
        // };
        
        setAccountData(mockAccountData);
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError(err.message || 'Failed to load account information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountData();
  }, [ownerId]);
  
  // Handle password reset
  const handleResetPassword = async () => {
    setIsResettingPassword(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast or handle success in UI
      console.log('Password reset initiated successfully');
    } catch (err) {
      console.error('Error initiating password reset:', err);
      setError(err.message || 'Failed to initiate password reset');
    } finally {
      setIsResettingPassword(false);
      setShowConfirmationModal(false);
      setConfirmationAction(null);
    }
  };
  
  // Handle resend verification email
  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast or handle success in UI
      console.log('Verification email resent successfully');
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
      setShowConfirmationModal(false);
      setConfirmationAction(null);
    }
  };
  
  // Handle toggle suspension
  const handleToggleSuspension = async () => {
    setIsTogglingSuspension(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update account status
      setAccountData(prev => ({
        ...prev,
        status: prev.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
      }));
      
      // Show success toast or handle success in UI
      console.log(`Account ${accountData.status === 'SUSPENDED' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      console.error('Error toggling account suspension:', err);
      setError(err.message || 'Failed to update account status');
    } finally {
      setIsTogglingSuspension(false);
      setShowConfirmationModal(false);
      setConfirmationAction(null);
    }
  };
  
  // Show confirmation modal for sensitive actions
  const showConfirmation = (action) => {
    setConfirmationAction(action);
    setShowConfirmationModal(true);
  };
  
  // Handle invite
  const handleInvite = async () => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast or handle success in UI
      console.log('Invitation sent successfully');
      
      // Update account data to show pending invitation
      setAccountData({
        isLinked: false,
        invitePending: true
      });
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err.message || 'Failed to send invitation');
    }
  };
  
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="accountAccess" />;
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Account & Access</h2>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  // Account not linked state
  if (!accountData?.isLinked) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Account & Access</h2>
        
        <EmptyState
          icon={<UserCirclePlus size={36} className="text-primary" weight="light" />}
          title="No Account Linked"
          description={
            accountData?.invitePending
              ? "An invitation has been sent to the business owner. They'll be able to access the platform once they accept and create an account."
              : "This business owner doesn't have an account on the platform yet. Invite them to create an account and access their profile."
          }
          actionLabel={accountData?.invitePending ? null : "Send Invitation"}
          onAction={accountData?.invitePending ? null : handleInvite}
        />
      </div>
    );
  }
  
  // Account linked state
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Account & Access</h2>
        
        <Badge
          colorType="light"
          color={accountStatusConfig[accountData.status]?.color || 'gray'}
          size="md"
        >
          <span className="flex items-center">
            {accountStatusConfig[accountData.status]?.icon}
            <span className="ml-1">{accountStatusConfig[accountData.status]?.text || accountData.status}</span>
          </span>
        </Badge>
      </div>
      
      {/* Account Information Card */}
      <Card className="card-glass">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-500/10 rounded-full mr-3">
              <IdentificationBadge size={20} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-medium text-text-primary">Account Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-sm font-medium text-gray-400">User ID</p>
              <p className="text-white font-mono">{accountData.userId}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400">Email</p>
              <p className="text-white flex items-center">
                <EnvelopeSimple size={16} className="mr-2 text-gray-400" />
                {accountData.email}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400">Account Created</p>
              <p className="text-white flex items-center">
                <CalendarBlank size={16} className="mr-2 text-gray-400" />
                {format(new Date(accountData.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400">Last Login</p>
              <p className="text-white flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                {format(new Date(accountData.lastLogin), 'MMMM d, yyyy')}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400">Multi-Factor Authentication</p>
              <Badge
                colorType="light"
                color={mfaStatusConfig[accountData.mfaStatus]?.color || 'gray'}
                size="sm"
              >
                {mfaStatusConfig[accountData.mfaStatus]?.text || accountData.mfaStatus}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Account Management Card */}
      <Card className="card-glass">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-500/10 rounded-full mr-3">
              <Shield size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-text-primary">Account Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-750 rounded-md">
              <h4 className="font-medium text-white mb-2">Security Options</h4>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  color="gray"
                  onClick={() => showConfirmation('reset-password')}
                  disabled={isResettingPassword}
                >
                  <Lock size={16} className="mr-2" />
                  {isResettingPassword ? 'Processing...' : 'Force Password Reset'}
                </Button>
                
                {accountData.status === 'EMAIL_UNVERIFIED' && (
                  <Button
                    size="sm"
                    color="warning"
                    onClick={() => showConfirmation('resend-email')}
                    disabled={isResendingEmail}
                  >
                    <EnvelopeSimple size={16} className="mr-2" />
                    {isResendingEmail ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-750 rounded-md">
              <h4 className="font-medium text-white mb-2">Account Status</h4>
              
              <div className="flex flex-wrap gap-3">
                {accountData.status === 'SUSPENDED' ? (
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => showConfirmation('activate-account')}
                    disabled={isTogglingSuspension}
                  >
                    <ArrowsClockwise size={16} className="mr-2" />
                    {isTogglingSuspension ? 'Processing...' : 'Reactivate Account'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => showConfirmation('suspend-account')}
                    disabled={isTogglingSuspension}
                  >
                    <Prohibit size={16} className="mr-2" />
                    {isTogglingSuspension ? 'Processing...' : 'Suspend Account'}
                  </Button>
                )}
              </div>
              
              <div className="mt-4 text-xs text-amber-400 bg-amber-400/10 p-3 rounded">
                <strong>Note:</strong> Suspending an account prevents the user from logging in but preserves all their data. Suspension can be reversed at any time.
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-white mb-4">
              {confirmationAction === 'reset-password' && 'Confirm Password Reset'}
              {confirmationAction === 'resend-email' && 'Confirm Resend Verification Email'}
              {confirmationAction === 'suspend-account' && 'Confirm Account Suspension'}
              {confirmationAction === 'activate-account' && 'Confirm Account Reactivation'}
            </h3>
            
            <p className="text-gray-300 mb-6">
              {confirmationAction === 'reset-password' && 
                'This will force the user to reset their password on next login. Are you sure you want to proceed?'}
              {confirmationAction === 'resend-email' && 
                'This will send a new verification email to the user. Are you sure you want to proceed?'}
              {confirmationAction === 'suspend-account' && 
                'This will prevent the user from accessing their account until you reactivate it. Are you sure you want to suspend this account?'}
              {confirmationAction === 'activate-account' && 
                'This will restore user access to their account. Are you sure you want to reactivate this account?'}
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                color="metal"
                onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationAction(null);
                }}
              >
                Cancel
              </Button>
              
              <Button
                color={confirmationAction === 'suspend-account' ? 'danger' : 'primary'}
                onClick={() => {
                  if (confirmationAction === 'reset-password') {
                    handleResetPassword();
                  } else if (confirmationAction === 'resend-email') {
                    handleResendEmail();
                  } else if (confirmationAction === 'suspend-account' || confirmationAction === 'activate-account') {
                    handleToggleSuspension();
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}