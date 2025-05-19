import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
  }, { status: 200 });
} 