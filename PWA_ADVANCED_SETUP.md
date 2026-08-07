# MR Institute of Learning - Advanced PWA & Firebase Configuration

This document outlines the advanced Progressive Web App (PWA) configuration and Firebase setup implemented to ensure production readiness.

## 1. Firebase Cloud Messaging (Push Notifications)

We have implemented Push Notifications for critical system alerts and re-engagement.

### Setup Requirements
1. In the Firebase Console, navigate to Project Settings > Cloud Messaging.
2. Under "Web Push certificates", generate a new Key Pair.
3. Add the key pair to your `.env` file as `VITE_FIREBASE_VAPID_KEY`.

### Architecture
- **`src/firebase/messaging.ts`**: Initializes FCM and handles permission requests.
- **`src/services/NotificationService.ts`**: Acts as a wrapper, extracting the token and sending it to a backend/Firestore if needed.
- **`public/firebase-messaging-sw.js`**: Background service worker to receive push messages when the app is closed.

## 2. Offline Strategy (Form Submissions)

Direct offline persistence is disabled on Firestore to prevent Admin data collision.
Instead, we implemented a custom `OfflineQueue` for critical user actions.

### How it Works:
- **`src/services/OfflineQueue.ts`**: Uses `localStorage` to queue objects when `navigator.onLine` is false.
- **`enquiriesRepository.ts` / `formSubmissionsRepository.ts`**: Overrides the `create` method to push to the queue if offline.
- **`App.tsx`**: Listens for the `online` event and flushes the queue back to Firestore.

## 3. PWA Installation UI

- **`InstallPrompt.tsx`**: Triggers based on the `beforeinstallprompt` event to gently encourage users to install the web app to their homescreen.
- **`UpdateNotification.tsx`**: Tied to `vite-plugin-pwa`, it displays an alert when a new service worker detects updated assets, allowing users to refresh seamlessly.

## 4. Analytics

- **`AnalyticsService.ts`**: A wrapper for Google Analytics (GA4).
- Tracks initialization on load and tracks page views dynamically within `App.tsx` on route changes using `useLocation`.
