# MR Institute of Learning — Production Deployment Guide

This document outlines the complete deployment procedure for the platform.

## 1. Prerequisites
- Node.js (v18+)
- Supabase Project (`https://jzsuozkgqlvlcrwwvpgu.supabase.co`)
- A Vercel or modern static hosting account.

## 2. Environment Setup
Create a `.env.production` or configure deployment environment variables with:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_GA_MEASUREMENT_ID="G-XXXXXXXX"
VITE_SITE_URL="https://mrinstitute.edu"
```

## 3. Database & Storage Initialization
The database schema, RLS policies, and storage buckets are initialized via Supabase:
- Schema & Tables (21 tables): Applied via `supabase_migration.sql` or Supabase CLI.
- Storage Buckets:
  - `mr-institute-media` (Public CMS media)
  - `mr-institute-documents` (Private applicant documents)
- Realtime: Publications configured on CMS, applications, enquiries, and notifications.

## 4. Build the Application
Compile the TypeScript and React code into a production bundle:
```bash
npm install
npm run build
```
Verify that the output shows `0` errors and successful chunking. The production files will be placed in the `dist/` directory.

## 5. Deploy to Production Host (Vercel)
1. Link your repository in Vercel.
2. Select Vite preset (`outputDirectory: dist`).
3. Add the production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GA_MEASUREMENT_ID`, `VITE_SITE_URL`).
4. Deploy.

## 6. Custom Domain & SSL Setup
1. In your hosting dashboard (e.g. Vercel), add your custom domain (e.g., `mrinstitute.edu`).
2. Add the required DNS records (CNAME / A) at your DNS provider.
3. Once SSL is active, update the Site URL in Supabase Dashboard > Authentication > URL Configuration.

## 7. Post-Deployment Verification
- Run the full verification suite: `node verify_storage.js`, `node verify_auth.js`, `node verify_step4.js`.
- Test public homepage, course details, dynamic forms, and staff portals.
- Verify that standard users cannot access `/developer/*` or `/office/*`.
- Verify that media uploads and document submissions resolve cleanly.
