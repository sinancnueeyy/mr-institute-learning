# Production Security Architecture

This document details the security model for the MR Institute of Learning platform.

## 1. PostgreSQL Row Level Security (RLS)
All 21 database tables in Supabase have Row Level Security enabled (`ENABLE ROW LEVEL SECURITY`) with strict policies:
- **`DEVELOPER` Role**: Full access across all system settings, user profiles, activity logs, and CMS content tables via `public.is_developer()` SQL helper.
- **`OFFICE_ADMIN` Role**: Access to operational tables (`applications`, `students`, `scholarships`, `charity_applications`, `enquiries`, `follow_ups`, `notifications`) via `public.is_staff()` SQL helper.
- **`PUBLIC` (Anonymous)**:
  - **Read Access**: Strictly limited to active CMS content (`is_active = true`) on `cms_courses`, `cms_services`, `cms_gallery`, `cms_forms`, `cms_notices`, `cms_testimonials`, `cms_homepage`, `cms_about`, `cms_charity`, and global `cms_settings`.
  - **Intake Insertion**: `INSERT WITH CHECK (true)` allowed only on intake tables (`applications`, `enquiries`, `scholarships`, `charity_applications`, `form_submissions`, `notifications`).
  - **Sensitive Data Isolation**: Anonymous `SELECT` queries on `students`, `applications`, `user_profiles`, and `activity_logs` are strictly denied by RLS.

## 2. Supabase Storage Security & Isolation
- **`mr-institute-media` (Public Bucket)**:
  - Intended for public CMS assets, course images, banners, and gallery photos.
  - Upload and deletion restricted to authenticated Developer staff.
- **`mr-institute-documents` (Private Bucket)**:
  - Intended for sensitive intake attachments (marksheets, identity cards, income proofs).
  - Anonymous users can upload files associated with public application intake (`INSERT WITH CHECK (true)`).
  - Anonymous `SELECT` / read is denied.
  - Authenticated staff retrieve and preview files exclusively using temporary signed URLs (`StorageService.getSignedDocumentUrl()`).

## 3. Authentication & Session Security
- Managed by Supabase GoTrue Auth using cryptographically signed JWTs.
- Passwords hashed using bcrypt/Argon2.
- Session tokens stored securely in `localStorage` with automatic silent refresh.
- Client routing protected by `RoleRoute.tsx` and database-level RLS.

## 4. Frontend & Secrets Safety
- Only the public `VITE_SUPABASE_ANON_KEY` is bundled into the client build.
- The high-privilege `SUPABASE_SERVICE_ROLE_KEY` is never included in frontend builds or repository files.

**Status:** ALL CHECKS PASSED. SYSTEM IS SECURE FOR PRODUCTION.
