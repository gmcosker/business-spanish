/**
 * Check if environment variables are properly configured
 */
export function checkFirebaseConfig() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = requiredVars.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName] === 'your-api-key'
  );

  if (missing.length > 0) {
    console.warn('Firebase not configured. Missing environment variables:', missing);
    return false;
  }

  return true;
}

export function isProduction() {
  return import.meta.env.MODE === 'production';
}




