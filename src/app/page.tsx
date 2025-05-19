import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Permisoria</h1>
      <p className="text-xl mb-8">Permit Management Platform</p>
      
      <div className="flex flex-col gap-4">
        <Link 
          href="/diagnostics" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Supabase Connection Diagnostics
        </Link>
      </div>
    </main>
  );
} 