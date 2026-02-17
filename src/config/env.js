/**
 * Environment Configuration
 * Centralized access to environment variables with validation
 */

const getEnvVar = (key, defaultValue = '') => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    // Only warn for required variables in development
    if (import.meta.env.DEV && !key.includes('ANALYTICS') && !key.includes('SENTRY')) {
      console.warn(`Environment variable ${key} is not set`);
    }
  }
  return value || defaultValue;
};

export const ENV = {
  // Firebase
  FIREBASE: {
    API_KEY: getEnvVar('VITE_FIREBASE_API_KEY'),
    AUTH_DOMAIN: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    PROJECT_ID: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    STORAGE_BUCKET: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    MESSAGING_SENDER_ID: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    APP_ID: getEnvVar('VITE_FIREBASE_APP_ID'),
  },

  // Analytics
  ANALYTICS: {
    ENABLED: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
    GA_ID: getEnvVar('VITE_GOOGLE_ANALYTICS_ID', ''),
  },

  // Error Tracking
  SENTRY: {
    DSN: getEnvVar('VITE_SENTRY_DSN', ''),
    ENABLED: getEnvVar('VITE_ENABLE_ERROR_REPORTING', 'false') === 'true',
  },

  // API
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  API_TIMEOUT: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000'), 10),

  // App
  APP_ENV: getEnvVar('VITE_APP_ENV', 'development'),
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export default ENV;
