'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Buildings, ArrowRight } from 'phosphor-react';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Check auth status and redirect accordingly
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        router.push('/dashboard');
      }
    };
    
    checkUser();
  }, [router, supabase.auth]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-950 text-white">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center">
            <Buildings size={48} className="text-blue-500" weight="duotone" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Permisoria</h1>
        <p className="text-xl text-gray-400 mb-8">Streamlined Permit Management Platform</p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-900/30 
                    text-lg font-medium group"
          >
            Sign In to Dashboard
            <ArrowRight size={20} className="ml-2 group-hover:ml-3 transition-all duration-200" />
          </Link>
          
          <p className="text-gray-500">
            New to Permisoria?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        
        <div className="mt-12 text-gray-600 text-sm">
          <Link 
            href="/diagnostics" 
            className="px-4 py-2 rounded-md hover:bg-gray-800 transition-colors inline-flex items-center"
          >
            System Diagnostics
          </Link>
        </div>
      </div>
    </main>
  );
} 