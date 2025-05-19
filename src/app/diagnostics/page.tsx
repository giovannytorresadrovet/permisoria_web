'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Diagnostics</h1>
      
      <div className={`text-xl font-semibold mb-6 ${statusColor}`}>
        {diagnostics.summary}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-xl font-bold mb-3">Environment</h2>
          <dl>
            {Object.entries(diagnostics.environment).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 mb-2">
                <dt className="font-medium">{key}:</dt>
                <dd className={value === 'Missing' ? 'text-red-500' : 'text-green-500'}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-xl font-bold mb-3">Connection Status</h2>
          <dl>
            <div className="grid grid-cols-2 mb-2">
              <dt className="font-medium">Auth Client:</dt>
              <dd className={diagnostics.authClientStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}>
                {diagnostics.authClientStatus}
              </dd>
            </div>
            <div className="grid grid-cols-2 mb-2">
              <dt className="font-medium">Service Role Client:</dt>
              <dd className={diagnostics.serviceClientStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}>
                {diagnostics.serviceClientStatus}
              </dd>
            </div>
          </dl>
          
          {/* Add button to test service role with advanced checks */}
          <div className="mt-3">
            <button
              onClick={testServiceRole}
              disabled={serviceRoleLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded"
            >
              {serviceRoleLoading ? 'Testing...' : 'Run Advanced Service Role Tests'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Display service role test results if available */}
      {serviceRoleTest && (
        <div className="bg-gray-800 rounded p-4 mb-8">
          <h2 className="text-xl font-bold mb-3">Advanced Service Role Tests</h2>
          <div className={`mb-3 ${serviceRoleTest.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {serviceRoleTest.message}
          </div>
          
          {serviceRoleTest.results && (
            <div className="mt-3">
              <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
              <div className="grid grid-cols-1 gap-2">
                {serviceRoleTest.results.map((result, index) => (
                  <div key={index} className="border border-gray-700 p-2 rounded">
                    <div className="grid grid-cols-2">
                      <span className="font-medium">{result.test}:</span>
                      <span className={result.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                        {result.status}
                      </span>
                    </div>
                    {result.error && (
                      <div className="text-red-400 text-sm mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {serviceRoleTest.error && (
            <div className="text-red-500 mt-2">
              Error: {serviceRoleTest.error}
            </div>
          )}
        </div>
      )}
      
      {diagnostics.errors.length > 0 && (
        <div className="bg-gray-800 rounded p-4 mb-8">
          <h2 className="text-xl font-bold mb-3 text-red-500">Errors</h2>
          <ul className="space-y-2">
            {diagnostics.errors.map((err, index) => (
              <li key={index} className="border-l-4 border-red-500 pl-3 py-1">
                <span className="font-semibold">{err.source}:</span> {err.message}
              </li>
            ))}
          </ul>
          
          {diagnostics.errors.some(e => e.message.includes("Auth session missing")) && (
            <div className="mt-3 p-3 bg-gray-700 rounded text-sm">
              <p className="font-semibold text-yellow-400">About "Auth session missing" errors:</p>
              <p className="mt-1">
                This error often occurs when using service role credentials with auth methods. 
                The service role doesn't need authentication and should be used for database operations
                rather than authentication operations.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button 
          onClick={retryFetch} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Rerun Diagnostics
        </button>
        
        <Link 
          href="/" 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 