# Progressive Web App (PWA) Setup Guide

This document outlines the architecture, configuration, and testing procedures for the MR Institute of Learning Progressive Web App (PWA).

## 1. Architecture Overview
The platform uses `vite-plugin-pwa` coupled with Workbox to provide an installable, offline-resilient application experience.

### Key Components
- **Web App Manifest**: Injected into `dist/manifest.webmanifest`. Defines app branding, standalone display modes, and high-resolution icons.
- **Service Worker**: A Workbox service worker (`dist/sw.js`) that precaches static bundles and shell assets while bypassing dynamic API traffic to ensure live CRM consistency.
- **Offline Queue**: `src/services/OfflineQueue.ts` serializes intake form submissions to `localStorage` when offline and synchronizes with Supabase upon reconnection.
- **Offline Fallback UI**: `<OfflineBanner />` component embedded globally inside `App.tsx` utilizing `navigator.onLine` and event listeners.

## 2. Caching Strategy
The PWA leverages a tailored caching strategy defined in `vite.config.ts`:
- **CacheFirst**: Google Web Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) are cached for 365 days.
- **Static Assets**: All bundled JS, CSS, and structural HTML are precached (167 assets).
- **NetworkOnly (Bypassed)**: All Supabase REST, PostgREST, Auth, and Realtime WebSocket connections (`*.supabase.co`) bypass cache to prevent stale data.

## 3. How to Update PWA Icons
Icons are located in `public/`:
- `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`.
To update icons:
1. Replace `public/favicon.svg` with your vector logo.
2. Run `npx @vite-pwa/assets-generator --preset minimal public/favicon.svg` to regenerate all standard icon sizes.

## 4. Notifications
The application uses the browser Web Notifications API (`src/services/NotificationService.ts`) for system alerts alongside in-app React toast banners (`NotificationContext.tsx`) and Supabase Realtime subscriptions on the `notifications` table.

## 5. Offline Data Synchronization
When the user submits an intake form without network connectivity, `OfflineQueue.enqueue()` stores the payload locally. When network connectivity is restored (`online` event), `OfflineQueue.syncWithServer()` replays pending requests through `enquiriesRepository` and `formSubmissionsRepository`.
