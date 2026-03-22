import { initializeApp } from 'firebase/app';

const fallbackProjectId = 'lumierepdc';
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackProjectId,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    `${import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackProjectId}.firebaseapp.com`,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    `${import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackProjectId}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const looksLikeFirebaseApiKey = (value) => /^AIza[\w-]{20,}$/.test(String(value || '').trim());
const missingCriticalConfig = !firebaseConfig.apiKey || !firebaseConfig.appId;
const invalidApiKey = firebaseConfig.apiKey && !looksLikeFirebaseApiKey(firebaseConfig.apiKey);
const firebaseConfigError = missingCriticalConfig
  ? 'Missing Firebase configuration.'
  : invalidApiKey
    ? 'Invalid Firebase API key.'
    : '';

if (firebaseConfigError && isProd) {
  throw new Error(
    `${firebaseConfigError} Set valid VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID before deploying.`,
  );
}

export const firebaseEnabled = !firebaseConfigError;
export const firebaseInitError = firebaseConfigError;

if (!firebaseEnabled && isDev) {
  console.warn(
    `${firebaseConfigError} Firebase is disabled in local dev mode. Local fallback paths will be used.`,
  );
}

const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;

export default app;
