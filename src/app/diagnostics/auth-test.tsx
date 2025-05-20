'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from 'keep-react';
import Link from 'next/link';

export default function AuthTest() {
  const [testResults, setTestResults] = useState<Array<{name: string; status: string; message?: string}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  
  const { signUp, signInWithPassword, signOut, resetPasswordForEmail, user, session, isLoading, error } = useAuth();
  
  const addResult = (name: string, status: string, message?: string) => {
    setTestResults(prev => [...prev, { name, status, message }]);
  };
  
  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Environment variables
      addResult('Supabase Environment Variables', 'Running', 'Checking configuration...');
      const envCheck = await fetch('/api/supabase-diagnostics');
      const envData = await envCheck.json();
      
      if (envData.summary.includes('SUCCESS')) {
        addResult('Supabase Environment Variables', 'Passed', 'All Supabase connections are working properly');
      } else {
        addResult('Supabase Environment Variables', 'Failed', envData.summary);
      }
      
      // Test 2: Sign out if already signed in
      if (user) {
        addResult('Pre-test Sign Out', 'Running', 'Signing out current user...');
        const { error: signOutError } = await signOut();
        if (signOutError) {
          addResult('Pre-test Sign Out', 'Failed', signOutError.message);
        } else {
          addResult('Pre-test Sign Out', 'Passed', 'Successfully signed out');
        }
      }
      
      // Test 3: Sign Up
      addResult('Sign Up', 'Running', `Attempting to sign up with ${email}...`);
      const { data: signUpData, error: signUpError } = await signUp(email, password, {
        data: {
          role: 'business_owner',
        }
      });
      
      if (signUpError) {
        // Check if error is "User already registered"
        if (signUpError.message.includes('already registered')) {
          addResult('Sign Up', 'Skipped', 'User already exists, continuing with sign in test');
        } else {
          addResult('Sign Up', 'Failed', signUpError.message);
        }
      } else {
        addResult('Sign Up', 'Passed', 'Successfully signed up');
      }
      
      // Test 4: Sign Out again to prepare for sign in
      addResult('Intermediate Sign Out', 'Running', 'Signing out before sign in test...');
      const { error: intermediateSignOutError } = await signOut();
      if (intermediateSignOutError) {
        addResult('Intermediate Sign Out', 'Failed', intermediateSignOutError.message);
      } else {
        addResult('Intermediate Sign Out', 'Passed', 'Successfully signed out');
      }
      
      // Test 5: Sign In
      addResult('Sign In', 'Running', `Attempting to sign in with ${email}...`);
      const { data: signInData, error: signInError } = await signInWithPassword(email, password);
      
      if (signInError) {
        addResult('Sign In', 'Failed', signInError.message);
      } else {
        addResult('Sign In', 'Passed', 'Successfully signed in');
      }
      
      // Test 6: Check User Session
      addResult('User Session', 'Running', 'Checking if session is properly stored...');
      if (session && user) {
        addResult('User Session', 'Passed', `User authenticated as ${user.email} with role: ${user.user_metadata?.role || 'unknown'}`);
      } else {
        addResult('User Session', 'Failed', 'Session not properly stored after sign in');
      }
      
      // Test 7: Password Reset Request
      addResult('Password Reset', 'Running', `Attempting to request password reset for ${email}...`);
      const { data: resetData, error: resetError } = await resetPasswordForEmail(email);
      
      if (resetError) {
        addResult('Password Reset', 'Failed', resetError.message);
      } else {
        addResult('Password Reset', 'Passed', 'Password reset email request sent successfully');
      }
      
      // Test 8: Final Sign Out
      addResult('Final Sign Out', 'Running', 'Signing out at end of tests...');
      const { error: finalSignOutError } = await signOut();
      if (finalSignOutError) {
        addResult('Final Sign Out', 'Failed', finalSignOutError.message);
      } else {
        addResult('Final Sign Out', 'Passed', 'Successfully signed out');
      }
      
      // Test 9: Middleware Redirect Test
      addResult('Middleware Redirect', 'Info', 'To test middleware redirects: (1) Sign in and try to access /auth/login, (2) Sign out and try to access a protected route');
      
    } catch (error) {
      addResult('Test Error', 'Error', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Authentication Flow Test</h1>
        <Link href="/diagnostics">
          <Button
            size="xs"
            type="button"
            variant="outline"
          >
            Back to Diagnostics
          </Button>
        </Link>
      </div>
      
      {/* Session Management Panel */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Session Management</h2>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm mb-1">Current Authentication Status:</p>
            <div className="flex items-center gap-2">
              {user ? (
                <span className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded-full">
                  Logged in as {user.email} ({user.user_metadata?.role || 'No role'})
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-red-900/30 text-red-400 rounded-full">
                  Not logged in
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {user && (
              <Button
                size="xs"
                type="button"
                variant="default"
                onClick={async () => {
                  await signOut();
                  window.location.reload();
                }}
              >
                Sign Out
              </Button>
            )}
            
            <Button
              size="xs"
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
      
      {/* Direct access to auth pages in test mode */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Direct Auth Page Access</h2>
        <p className="text-sm text-gray-300 mb-3">
          These links include <code className="bg-gray-700 px-1 rounded">?test_mode=true</code> to bypass middleware redirects, 
          allowing you to access auth pages even when logged in.
        </p>
        <div className="flex flex-wrap gap-2">
          <a 
            href="/auth/register?test_mode=true" 
            target="_blank" 
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            Registration Page
          </a>
          <a 
            href="/auth/login?test_mode=true" 
            target="_blank"
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            Login Page
          </a>
          <a 
            href="/auth/forgot-password?test_mode=true" 
            target="_blank"
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            Forgot Password Page
          </a>
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
              disabled={isRunning}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Test Password</label>
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 border-gray-600 text-white"
              disabled={isRunning}
            />
          </div>
        </div>
        <Button
          size="md"
          type="button"
          variant="default"
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? 'Running Tests...' : 'Run Authentication Tests'}
        </Button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Auth State</h2>
        <div className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-60">
          <pre className="text-sm whitespace-pre-wrap">
            {isLoading 
              ? 'Loading...' 
              : JSON.stringify({ 
                  user: user ? {
                    id: user.id,
                    email: user.email,
                    role: user.user_metadata?.role,
                    created_at: user.created_at,
                  } : null,
                  session: session ? {
                    expires_at: session.expires_at,
                  } : null,
                  error: error?.message,
                }, null, 2)
            }
          </pre>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
        {testResults.length === 0 && !isRunning ? (
          <p className="text-gray-400">No tests have been run yet.</p>
        ) : (
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`
                  p-3 ${index !== testResults.length - 1 ? 'border-b border-gray-700' : ''}
                  ${result.status === 'Passed' ? 'bg-green-800/20' : 
                    result.status === 'Failed' ? 'bg-red-800/20' : 
                    result.status === 'Skipped' ? 'bg-yellow-800/20' : 
                    result.status === 'Info' ? 'bg-blue-800/20' : 'bg-gray-700'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{result.name}</div>
                  <span 
                    className={`
                      ml-2 px-2 py-0.5 text-xs rounded-full
                      ${result.status === 'Passed' ? 'bg-green-500/30 text-green-300' : 
                        result.status === 'Failed' ? 'bg-red-500/30 text-red-300' : 
                        result.status === 'Running' ? 'bg-blue-500/30 text-blue-300' :
                        result.status === 'Skipped' ? 'bg-yellow-500/30 text-yellow-300' : 
                        result.status === 'Info' ? 'bg-blue-500/30 text-blue-300' :
                        'bg-gray-500/30 text-gray-300'}
                    `}
                  >
                    {result.status}
                  </span>
                </div>
                {result.message && (
                  <div className="mt-1 text-sm text-gray-300">{result.message}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 