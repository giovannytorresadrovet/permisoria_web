'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'keep-react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthFlowTest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [testResults, setTestResults] = useState<{[key: string]: {status: 'pending'|'success'|'failed'|'skipped'; notes?: string}}>({
    'env': { status: 'pending' },
    'signup': { status: 'pending' },
    'login': { status: 'pending' },
    'protected-route': { status: 'pending' },
    'forgot-password': { status: 'pending' },
    'middleware': { status: 'pending' },
  });
  
  const { user, signOut } = useAuth();
  
  const updateTestResult = (key: string, result: {status: 'pending'|'success'|'failed'|'skipped'; notes?: string}) => {
    setTestResults(prev => ({
      ...prev,
      [key]: result
    }));
  };
  
  const steps = [
    {
      title: "Verify Supabase Configuration",
      description: "First, let's verify that your Supabase environment variables are correctly configured.",
      instructions: [
        "Check that you have a proper .env.local file with the following variables:",
        "- NEXT_PUBLIC_SUPABASE_URL",
        "- NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "- SUPABASE_SERVICE_ROLE_KEY (for admin operations)",
        "Visit /api/supabase-diagnostics to verify your Supabase connection status."
      ],
      testKey: 'env',
      actions: [
        {
          label: "Run Supabase Diagnostics",
          onClick: async () => {
            window.open('/api/supabase-diagnostics', '_blank');
          }
        },
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('env', { status: 'success' });
            setCurrentStep(2);
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('env', { status: 'failed' });
          }
        }
      ]
    },
    {
      title: "Test User Registration",
      description: "Let's test the user registration flow.",
      instructions: [
        "Navigate to /auth/register",
        "Fill out the registration form with a valid email and password",
        "Select a role (e.g., 'Business Owner')",
        "Submit the form and verify that the registration succeeds",
        "Check for proper validation and error messages by trying invalid inputs"
      ],
      testKey: 'signup',
      actions: [
        {
          label: "Open Registration Page",
          onClick: () => {
            window.open('/auth/register?test_mode=true', '_blank');
          }
        },
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('signup', { status: 'success' });
            setCurrentStep(3);
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('signup', { status: 'failed' });
          }
        }
      ]
    },
    {
      title: "Test User Login",
      description: "Now, let's test the login functionality.",
      instructions: [
        "Navigate to /auth/login",
        "Enter the email and password you used for registration",
        "Submit the form and verify that login succeeds",
        "Verify you are redirected to the dashboard after login",
        "Test error handling by entering invalid credentials"
      ],
      testKey: 'login',
      actions: [
        {
          label: "Open Login Page",
          onClick: () => {
            window.open('/auth/login?test_mode=true', '_blank');
          }
        },
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('login', { status: 'success' });
            setCurrentStep(4);
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('login', { status: 'failed' });
          }
        }
      ]
    },
    {
      title: "Test Protected Route Access",
      description: "Verify that protected routes require authentication.",
      instructions: [
        "Sign out if you're currently logged in",
        "Try to access a protected route like the dashboard",
        "Verify you're redirected to the login page",
        "Log in and verify you can access the protected route after authentication"
      ],
      testKey: 'protected-route',
      actions: [
        {
          label: "Sign Out (if needed)",
          onClick: () => {
            // This is just a link to manually sign out
            window.open('/', '_blank');
          }
        },
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('protected-route', { status: 'success' });
            setCurrentStep(5);
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('protected-route', { status: 'failed' });
          }
        }
      ]
    },
    {
      title: "Test Password Reset",
      description: "Let's test the forgot password functionality.",
      instructions: [
        "Navigate to /auth/forgot-password",
        "Enter the email address you used for registration",
        "Submit the form and verify you get a success message",
        "Check your email for a password reset link (in production)"
      ],
      testKey: 'forgot-password',
      actions: [
        {
          label: "Open Forgot Password Page",
          onClick: () => {
            window.open('/auth/forgot-password?test_mode=true', '_blank');
          }
        },
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('forgot-password', { status: 'success' });
            setCurrentStep(6);
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('forgot-password', { status: 'failed' });
          }
        }
      ]
    },
    {
      title: "Test Middleware Authentication",
      description: "Verify that the middleware correctly handles authentication and redirects.",
      instructions: [
        "When logged in, try to access /auth/login and verify you're redirected to the dashboard",
        "When logged out, try to access a protected route and verify you're redirected to login",
        "Verify that public routes are accessible without authentication"
      ],
      testKey: 'middleware',
      actions: [
        {
          label: "Mark as Successful",
          onClick: () => {
            updateTestResult('middleware', { status: 'success' });
            finishTests();
          }
        },
        {
          label: "Mark as Failed",
          onClick: () => {
            updateTestResult('middleware', { status: 'failed' });
          }
        }
      ]
    }
  ];
  
  const finishTests = () => {
    const allSuccess = Object.values(testResults).every(r => r.status === 'success');
    // In a real app, this might send a report or update the status
    console.log('All tests completed. Success: ', allSuccess);
  };
  
  const activeStep = steps[currentStep - 1];
  
  const getStatusBadge = (status: 'pending'|'success'|'failed'|'skipped') => {
    switch(status) {
      case 'success':
        return <span className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded-full">Passed</span>;
      case 'failed':
        return <span className="px-2 py-0.5 text-xs bg-red-900/30 text-red-400 rounded-full">Failed</span>;
      case 'skipped':
        return <span className="px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-400 rounded-full">Skipped</span>;
      default:
        return <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-full">Pending</span>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
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
          
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p className="text-sm text-yellow-300 mb-1">Testing Tip:</p>
            <p className="text-xs text-gray-400">
              For testing auth pages while logged in, use the <span className="bg-gray-700 px-1 rounded">?test_mode=true</span> URL parameter. 
              This will bypass middleware redirects and allow you to access auth pages even when logged in.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with steps */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Test Steps</h2>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li 
                  key={index}
                  className={`
                    flex justify-between items-center p-2 rounded cursor-pointer
                    ${currentStep === index + 1 ? 'bg-gray-700' : 'hover:bg-gray-700/50'}
                  `}
                  onClick={() => setCurrentStep(index + 1)}
                >
                  <div className="flex items-center">
                    <span className={`
                      flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs
                      ${currentStep > index + 1 ? 'bg-green-600' : 
                        currentStep === index + 1 ? 'bg-blue-600' : 'bg-gray-600'}
                    `}>
                      {currentStep > index + 1 ? '✓' : index + 1}
                    </span>
                    <span className="text-sm">{step.title}</span>
                  </div>
                  {getStatusBadge(testResults[step.testKey].status)}
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{activeStep.title}</h2>
            <p className="text-gray-300 mb-4">{activeStep.description}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-300">
                {activeStep.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ol>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {activeStep.actions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  type="button"
                  variant={i === 0 ? 'default' : i === 1 ? 'default' : 'outline'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold mb-3">Test Results</h2>
            <div className="space-y-2">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="flex justify-between items-center p-2 border-b border-gray-700">
                  <span className="capitalize">{key.replace('-', ' ')}</span>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm">
                  {Object.values(testResults).filter(r => r.status === 'success').length} of {Object.keys(testResults).length} passed
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${(Object.values(testResults).filter(r => r.status === 'success').length / Object.keys(testResults).length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 