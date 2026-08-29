# MR Institute of Learning - Production Launch Guide

This document outlines the final steps to deploy the MR Institute of Learning platform to production.

## 1. Environment Preparation
Ensure you have configured your production environment variables (`.env.production` or host dashboard):
```ini
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://mrinstitute.edu
```

## 2. Production Build & Verification Commands
To test the build locally before deploying:
```bash
# Verify TypeScript typing
npx tsc --noEmit

# Build production bundle
npm run build

# Run automated verification suites
node verify_storage.js
node verify_auth.js
node verify_step4.js
```

## 3. Database & Roles Structure
The Supabase PostgreSQL database includes:
- **Authentication**: Email/Password managed via Supabase GoTrue.
- **Roles**: Governed by the `user_profiles` table (`DEVELOPER`, `OFFICE_ADMIN`).
- **Data Tables**: 21 normalized PostgreSQL tables with strict Row Level Security.
- **Storage**:
  - `mr-institute-media` (Public CMS assets)
  - `mr-institute-documents` (Private student intake documents)

## 4. Production Testing Checklist
- [ ] **Authentication**: Log in successfully with Developer (`developer@mrinstitute.edu`) and Office Admin (`office@mrinstitute.edu`).
- [ ] **CMS Operations**: Update a test course in the CMS and verify it reflects on the public site.
- [ ] **Form Submissions**: Submit an inquiry on `/contact` and verify it lands in Office Admin `/office/enquiries`.
- [ ] **Document Storage**: Upload a document through dynamic intake and verify it stores in `mr-institute-documents`.
- [ ] **PWA Support**: Inspect Service Worker in browser DevTools and verify offline banner displays on disconnect.

## 5. Security Notes
- Row Level Security is active on all 21 tables.
- `mr-institute-documents` is configured as a private bucket with signed URL access for staff.
