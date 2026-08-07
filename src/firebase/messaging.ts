import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app } from './config';

// Initialize Firebase Cloud Messaging and get a reference to the service
// We wrap it in a promise because isSupported() is asynchronous
export const messagingPromise = isSupported().then(supported => {
  if (supported) {
    return getMessaging(app);
  }
  return null;
});

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = await messagingPromise;
      if (messaging) {
        // VAPID key is required for Web Push. 
        // Using a fallback empty string during dev, but MUST be set for prod.
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';
        
        const token = await getToken(messaging, { vapidKey });
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('An error occurred while requesting permission ', error);
    return null;
  }
};

export const onForegroundMessage = async (callback: (payload: any) => void) => {
  const messaging = await messagingPromise;
  if (messaging) {
    return onMessage(messaging, callback);
  }
  return () => {};
};
