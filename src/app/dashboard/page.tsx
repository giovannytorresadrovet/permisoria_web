'use client';

import { Card } from 'keep-react';
import { Buildings, Users, FilePlus, SignOut, User } from 'phosphor-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Get and display user data when component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || null);
          setUserMetadata(user.user_metadata || {});
          // Store user in global state
          useAuthStore.getState().setUserSession(user, null);
        } else {
          // If no user is found, redirect to login
          console.log('No user found, redirecting to login');
          router.push('/auth/login');
          return;
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        // Don't redirect on error, let the middleware handle it
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      // Clear user from global state
      useAuthStore.getState().clearUser();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateToBusinessOwners = () => {
    router.push('/dashboard/business-owners');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton type="ownerDetail" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to your Dashboard!</h1>
          {userEmail && (
            <p className="text-text-secondary mb-1">
              Logged in as: <span className="text-primary font-medium">{userEmail}</span>
            </p>
          )}
          <p className="text-text-secondary">Manage your permits and licenses in one place.</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 
                  hover:bg-red-600/20 transition-colors flex items-center"
        >
          <SignOut size={20} className="mr-2" />
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
      
      {/* User info card */}
      <Card className="card-glass mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600/10 p-3 rounded-full mr-4">
              <User size={28} className="text-blue-500" weight="duotone" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">Account Information</h2>
              <p className="text-text-secondary text-sm">Your authentication details</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 overflow-hidden overflow-x-auto">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
              {JSON.stringify({ 
                email: userEmail,
                metadata: userMetadata,
                auth_status: "Successfully Authenticated",
                emailVerified: userMetadata?.email_verified === true
              }, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-glass">
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Buildings size={32} className="text-primary" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Businesses</h2>
            <p className="text-text-secondary text-center">Manage your business entities</p>
          </div>
        </Card>

        <Card className="card-glass cursor-pointer hover:bg-gray-800/50 transition-colors" onClick={navigateToBusinessOwners}>
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-secondary/10 p-3 rounded-full">
                <Users size={32} className="text-secondary" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Business Owners</h2>
            <p className="text-text-secondary text-center">Manage business owner profiles</p>
          </div>
        </Card>

        <Card className="card-glass">
          <div className="p-6">
            <div className="mb-4 flex justify-center">
              <div className="bg-accent/10 p-3 rounded-full">
                <FilePlus size={32} className="text-accent" weight="duotone" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-text-primary text-center mb-2">Permits</h2>
            <p className="text-text-secondary text-center">Manage business permits</p>
          </div>
        </Card>
      </div>
    </>
  );
} 