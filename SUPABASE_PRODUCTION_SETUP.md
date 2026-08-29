# Supabase Production Setup Checklist

This document details the configuration needed within the Supabase Dashboard to launch the MR Institute of Learning platform.

## 1. Authentication Configuration
1. Navigate to **Authentication > Providers > Email**.
2. Confirm **Email provider** is enabled.
3. Under **Authentication > URL Configuration**:
   - Set **Site URL** to your production domain (e.g., `https://mrinstitute.edu`).
   - Add your Vercel domains (e.g., `https://mr-institute.vercel.app/**`) to **Redirect URLs**.

## 2. Database Schema & RLS
The database schema and Row Level Security policies are deployed:
- All 21 tables have RLS enabled (`ENABLE ROW LEVEL SECURITY`).
- `public.is_developer()` and `public.is_staff()` functions govern RBAC.
- Indexes on `is_active`, `status`, `created_at`, and foreign keys are active.

## 3. Storage Deployment
- **`mr-institute-media`**: Public bucket for CMS banners, gallery images, course assets.
- **`mr-institute-documents`**: Private bucket for applicant documents, certificates, and intake attachments.
- Access model: Authenticated staff access sensitive documents via signed URLs (`StorageService.getSignedDocumentUrl()`).

## 4. Realtime Publications
Verify Realtime is enabled for:
- `cms_courses`, `cms_services`, `cms_gallery`, `cms_forms`, `form_submissions`, `cms_media`, `applications`, `enquiries`, `notifications`.

## 5. Web Notifications & Analytics
- Browser Web Notifications API handles native system prompts.
- Google Analytics is initialized via `VITE_GA_MEASUREMENT_ID`.
