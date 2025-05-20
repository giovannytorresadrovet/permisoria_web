'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'keep-react';

type DiagnosticsResult = {
  environment: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceKey: string;
    databaseUrl: string;
    nodeEnv: string;
  };
  authClientStatus: string;
  serviceClientStatus: string;
  summary: string;
  errors: Array<{ source: string; message: string }>;
};

type ServiceRoleTestResult = {
  status: string;
  message: string;
  results?: Array<{
    test: string;
    status: string;
    error: string | null;
  }>;
  error?: string;
};

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null);
  const [serviceRoleTest, setServiceRoleTest] = useState<ServiceRoleTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceRoleLoading, setServiceRoleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    async function fetchDiagnostics() {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
        
        const response = await fetch(`/api/supabase-diagnostics?t=${timestamp}`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (mounted) {
          setDiagnostics(data);
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError('Request timed out after 15 seconds. The API endpoint may be unresponsive.');
          } else {
            setError(`Error: ${err.message}`);
          }
        } else {
          setError('An unknown error occurred');
        }
        
        setLoading(false);
      }
    }

    fetchDiagnostics();
    
    return () => {
      mounted = false;
    };
  }, [retryCount]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    setDiagnostics(null);
    setServiceRoleTest(null);
    setRetryCount(prev => prev + 1);
  };
  
  const testServiceRole = async () => {
    setServiceRoleLoading(true);
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/supabase-service-test?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setServiceRoleTest(data);
    } catch (err) {
      setServiceRoleTest({
        status: 'error',
        message: 'Failed to test service role',
        error: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setServiceRoleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl mb-6">Loading diagnostic information...</div>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        <div className="mt-4 text-gray-400">This may take up to 15 seconds...</div>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 text-blue-500 underline"
        >
          Cancel and return to home
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-xl mb-6">Error: {error}</div>
        <div className="mb-6 text-gray-400 max-w-2xl mx-auto">
          This could be due to missing Supabase environment variables, 
          connectivity issues, or a problem with the API endpoint.
        </div>
        <button 
          onClick={retryFetch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Retry
        </button>
        <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!diagnostics) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl mb-6">No diagnostic information available</div>
        <button 
          onClick={retryFetch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Retry
        </button>
        <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  // Determine status color
  const statusColor = {
    success: 'text-green-500',
    partial: 'text-yellow-500',
    failure: 'text-red-500',
  }[diagnostics.summary.toLowerCase().startsWith('success') ? 'success' : 
    diagnostics.summary.toLowerCase().startsWith('partial') ? 'partial' : 'failure'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Permisoria Diagnostics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/diagnostics/auth-flow" className="block">          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">            <h2 className="text-xl font-semibold mb-2">Authentication Test</h2>            <p className="text-gray-300 mb-4">              Run end-to-end tests for authentication flow including sign-up, login, password reset, and session management.            </p>            <Button               size="sm"               type="button"               variant="default"            >              Run Authentication Tests            </Button>          </div>        </Link>
        
        <Link href="/api/supabase-diagnostics" target="_blank" className="block">
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Supabase Diagnostics</h2>
            <p className="text-gray-300 mb-4">
              Check Supabase connection status, environment variables, and service roles.
            </p>
            <Button 
              size="sm" 
              type="button" 
              variant="default"
            >
              Run API Diagnostics
            </Button>
          </div>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Environment Check</h2>
        <p className="text-gray-300 mb-4">
          Verify that your environment variables are properly configured for authentication.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-700 rounded-md">
            <p className="font-medium mb-1">Required Variables:</p>
            <ul className="list-disc list-inside text-sm text-gray-300">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY (for admin functions)</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-700 rounded-md">
            <p className="font-medium mb-1">Expected Format:</p>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
{`# .env.local example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 