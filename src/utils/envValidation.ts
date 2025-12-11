/**
 * Environment Variable Validation
 * Checks for required environment variables on app startup
 */

const REQUIRED_ENV_VARS = {
  development: [
    // Optional in dev, but warn if missing
  ],
  production: [
    // Add any required production vars here
    // 'VITE_FIREBASE_API_KEY',
    // 'VITE_STRIPE_PUBLISHABLE_KEY',
  ],
};

const OPTIONAL_ENV_VARS = [
  'VITE_GA_MEASUREMENT_ID',
  'VITE_STRIPE_PUBLISHABLE_KEY',
];

export function validateEnvironment() {
  const isDev = import.meta.env.DEV;
  const env = isDev ? 'development' : 'production';
  const required = REQUIRED_ENV_VARS[env as keyof typeof REQUIRED_ENV_VARS] || [];
  
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required vars
  required.forEach((varName) => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional vars and warn if missing
  OPTIONAL_ENV_VARS.forEach((varName) => {
    if (!import.meta.env[varName]) {
      warnings.push(varName);
    }
  });

  // Log errors for missing required vars
  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please add these to your .env file or Vercel environment variables.`
    );
    
    if (!isDev) {
      // In production, this is critical
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  // Log warnings for missing optional vars
  if (warnings.length > 0 && isDev) {
    console.warn(
      `⚠️  Optional environment variables not set:\n${warnings.join('\n')}\n\n` +
      `These features may not work until these are configured.`
    );
  }

  // Log success
  if (missing.length === 0 && warnings.length === 0) {
    console.log('✅ All environment variables configured');
  } else if (missing.length === 0) {
    console.log(`✅ Required environment variables configured (${warnings.length} optional missing)`);
  }
}

