'use client';

import { useState, useEffect } from 'react';

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

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiagnostics() {
      try {
        const response = await fetch('/api/supabase-diagnostics');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setDiagnostics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchDiagnostics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading diagnostic information...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!diagnostics) {
    return <div className="p-8 text-center">No diagnostic information available</div>;
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
        </div>
      </div>
      
      {diagnostics.errors.length > 0 && (
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-xl font-bold mb-3 text-red-500">Errors</h2>
          <ul className="space-y-2">
            {diagnostics.errors.map((err, index) => (
              <li key={index} className="border-l-4 border-red-500 pl-3 py-1">
                <span className="font-semibold">{err.source}:</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Rerun Diagnostics
        </button>
      </div>
    </div>
  );
} 