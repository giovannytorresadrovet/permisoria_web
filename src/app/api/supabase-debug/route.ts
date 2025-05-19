import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we have the service role key configured
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    return NextResponse.json({
      hasServiceKey: serviceKey.length > 0,
      serviceKeyLength: serviceKey.length,
      // First and last few characters for verification without exposing the full key
      serviceKeyPrefix: serviceKey.substring(0, 10) + '...',
      serviceKeySuffix: '...' + serviceKey.substring(serviceKey.length - 10),
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 