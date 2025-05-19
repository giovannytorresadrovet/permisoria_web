// Helper functions for environment variables

/**
 * Validate required environment variables
 * @returns Object containing validation results
 */
export function validateEnv() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  const optional = [
    'DATABASE_URL',
  ];
  
  const results = {
    valid: true,
    missing: [] as string[],
    configured: [] as string[],
    optional: {} as Record<string, boolean>,
  };
  
  // Check required vars
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      results.valid = false;
      results.missing.push(varName);
    } else {
      results.configured.push(varName);
    }
  }
  
  // Check optional vars
  for (const varName of optional) {
    results.optional[varName] = !!process.env[varName];
  }
  
  return results;
}

/**
 * Get environment configuration status for diagnostics
 * (Securely - doesn't expose actual values)
 */
export function getEnvStatus() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing',
    databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    validationResults: validateEnv(),
  };
}

/**
 * Check if we're in a production environment
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in a development environment
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Ensure required env vars are present, or throw an error
 * Use this in initialization code to prevent app from starting without
 * required environment variables
 */
export function assertRequiredEnv() {
  const validation = validateEnv();
  
  if (!validation.valid) {
    throw new Error(
      `Missing required environment variables: ${validation.missing.join(', ')}`
    );
  }
  
  return true;
} 