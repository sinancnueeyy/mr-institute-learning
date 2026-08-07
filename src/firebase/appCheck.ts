import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { app } from './config';

export const initAppCheck = () => {
  if (typeof window === 'undefined') return null;
  
  // App Check should ideally not run in local development unless configured
  if (import.meta.env.DEV) {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  const siteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY;
  if (!siteKey) {
    console.warn('App Check is disabled: VITE_RECAPTCHA_ENTERPRISE_KEY is missing');
    return null;
  }

  try {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    return appCheck;
  } catch (err) {
    console.error('Failed to initialize App Check:', err);
    return null;
  }
};
