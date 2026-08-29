# MR Institute of Learning - Advanced PWA & Notification Architecture

This document outlines the Progressive Web App (PWA) configuration and background features implemented to ensure production readiness.

## 1. Notification Architecture
The platform implements a multi-tier notification model:
- **`src/services/NotificationService.ts`**: Handles standard browser Web Notifications (`Notification.requestPermission()`, `Notification.showNotification()`).
- **`src/contexts/NotificationContext.tsx`**: Manages interactive in-app toast alerts in React state.
- **`src/repositories/operations/notificationsRepository.ts`**: Subscribes to Supabase Realtime changes on the PostgreSQL `notifications` table to alert staff of new student applications and inquiries.

## 2. Offline Resilience (Intake Submissions)
To provide a smooth experience during intermittent connectivity:
- **`src/services/OfflineQueue.ts`**: Uses `localStorage` to queue submissions when `navigator.onLine` is false.
- **`enquiriesRepository.ts` / `formSubmissionsRepository.ts`**: Transparently enqueue failed submissions if offline.
- **`App.tsx`**: Listens for the `online` event and flushes the queue directly to Supabase PostgREST tables.

## 3. PWA Installation & Update Flow
- **`InstallPrompt.tsx`**: Listens for the `beforeinstallprompt` event to provide a clean install prompt for mobile and desktop users.
- **`UpdateNotification.tsx`**: Connected to `vite-plugin-pwa`, prompts users to reload when a new service worker bundle is activated.

## 4. Analytics
- **`AnalyticsService.ts`**: Google Analytics (GA4) integration using `VITE_GA_MEASUREMENT_ID`.
- Dynamically tracks route changes in `App.tsx` via `useLocation`.
