# Progressive Web App (PWA) Setup Guide

This document outlines the architecture, configuration, and testing procedures for the MR Institute of Learning Progressive Web App (PWA).

## 1. Architecture Overview
The platform uses `vite-plugin-pwa` coupled with Workbox to provide an installable, offline-capable application experience.

### Key Components
- **Web App Manifest**: Dynamically injected into `dist/manifest.webmanifest`. Defines app branding, standalone display modes, and standard touch icons.
- **Service Worker**: A Workbox service worker (`sw.js`) that caches static assets but strictly ignores dynamic API traffic to ensure real-time CRM functionality.
- **Offline Fallback**: An `<OfflineBanner />` component embedded globally inside `App.tsx` utilizing the Network API (`navigator.onLine`).

## 2. Caching Strategy
The PWA leverages a tailored caching strategy defined in `vite.config.ts`.

- **CacheFirst**: Google Web Fonts (fonts.googleapis.com, fonts.gstatic.com) are cached for 365 days.
- **Static Assets**: All bundled JS, CSS, and structural HTML are aggressively cached.
- **NetworkOnly (Bypassed)**: All Firebase HTTP/WebSocket connections for Firestore and Authentication are inherently bypassed by the static file glob, meaning backend CRM interactions never serve stale data.

## 3. How to Update the PWA Icons
Placeholder icons were generated automatically from the root SVG.
To brand the application:
1. Replace `public/favicon.svg` with the actual vector logo.
2. Run `npx @vite-pwa/assets-generator --preset minimal public/favicon.svg` to overwrite all PNGs and ICOs.

## 4. Push Notification Readiness
The Workbox service worker is fully extensible. To add Push Notifications in the future:
1. Initialize Firebase Cloud Messaging (FCM).
2. Create a custom Service Worker script and change `vite-plugin-pwa` strategy from `generateSW` to `injectManifest`.
3. Import `firebase-messaging-sw.js` directly within the injected SW.

## 5. Offline Data Access (Firestore)
Firestore supports local multi-tab IndexedDB persistence, which allows offline data reads of previously fetched CMS and CRM tables. By default, it is **disabled** to prioritize exact consistency, but can be enabled in `src/firebase/firestore.ts` via `enableMultiTabIndexedDbPersistence(db)` if requested.
