import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock-app-id",
};

// Log a very prominent warning in production if mock values are detected
if (import.meta.env.PROD && firebaseConfig.apiKey === 'mock-api-key') {
  console.error(
    "🚨 CRITICAL PRODUCTION ERROR 🚨\n" +
    "Firebase is initializing with mock credentials in a production build.\n" +
    "Please populate the correct VITE_FIREBASE_* environment variables before deploying."
  );
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
