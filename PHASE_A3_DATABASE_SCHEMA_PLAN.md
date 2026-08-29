# PHASE A.3 — DATABASE SCHEMA & RLS IMPLEMENTATION PLAN
**Project:** MR Institute of Learning  
**Target Database:** Supabase PostgreSQL (`jzsuozkgqlvlcrwwvpgu`)  
**Date:** 2026-08-26  
**Status:** PLAN ONLY — NO SQL EXECUTED, NO CODE MODIFIED  

---

## 1. Complete Table Inventory

The schema consists of **21 core tables** organized into 3 functional domains:

| # | Table Name | Domain | Purpose | Row Strategy | Realtime? |
|---|---|---|---|---|---|
| 1 | `user_profiles` | System | Extends `auth.users` with role & profile info | 1 row per staff user | No |
| 2 | `cms_homepage` | CMS | Homepage content (hero, features, stats, CTA) | Single row (`id = 'main'`) | No |
| 3 | `cms_about` | CMS | About page content (story, team, timeline) | Single row (`id = 'main'`) | No |
| 4 | `cms_courses` | CMS | Course catalogue & syllabus | Multi-row collection | **Yes** |
| 5 | `cms_services` | CMS | Institutional services catalogue | Multi-row collection | **Yes** |
| 6 | `cms_charity` | CMS | Charity programs & schemes | Single row (`id = 'main'`) | No |
| 7 | `cms_gallery` | CMS | Media gallery items | Multi-row collection | **Yes** |
| 8 | `cms_forms` | CMS | Dynamic form builder schemas | Multi-row collection | **Yes** |
| 9 | `cms_notices` | CMS | Announcements, news, exam notices | Multi-row collection | No |
| 10 | `cms_media` | CMS | Media library file tracking | Multi-row collection | **Yes** |
| 11 | `cms_settings` | CMS | Global site config, branches, contacts | Single row (`id = 'global'`) | No |
| 12 | `cms_testimonials`| CMS | Testimonials (seeded from initial data) | Multi-row collection | No |
| 13 | `applications` | Operations | Admissions applications | Multi-row intake | No |
| 14 | `students` | Operations | Enrolled student directory | Multi-row directory | No |
| 15 | `enquiries` | Operations | Contact form enquiries & leads | Multi-row intake | No |
| 16 | `scholarships` | Operations | Scholarship applications | Multi-row intake | No |
| 17 | `charity_applications` | Operations | Public charity assistance requests | Multi-row intake | No |
| 18 | `form_submissions`| Operations | Submissions from custom dynamic forms | Multi-row intake | **Yes** |
| 19 | `follow_ups` | Operations | Staff follow-up log for leads/applications | Multi-row log | No |
| 20 | `notifications` | Operations | Internal staff alert & notification inbox | Multi-row inbox | No |
| 21 | `activity_logs` | System | Audit trail of all administrative actions | Append-only audit log | No |

---

## 2. Complete Schema Definition

### Primary Key Convention
Every table uses `TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text`.
- **Reason:** Provides 100% backward-compatibility with existing TypeScript frontend types (`id: string`), supports standard UUIDs automatically, and allows predefined singletons (`'main'`, `'global'`).

---

### DOMAIN 1: SYSTEM & AUTHENTICATION

#### 1. `user_profiles`
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('DEVELOPER', 'OFFICE_ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### 2. `activity_logs`
```sql
CREATE TABLE public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH', 'APPROVE', 'REJECT')),
  description TEXT NOT NULL,
  ip_address TEXT,
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

### DOMAIN 2: CMS CONTENT (Developer Managed)

#### 3. `cms_homepage`
```sql
CREATE TABLE public.cms_homepage (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_headline TEXT NOT NULL,
  hero_subheadline TEXT NOT NULL,
  hero_description TEXT,
  hero_image TEXT NOT NULL,
  hero_video TEXT,
  hero_overlay_opacity NUMERIC(3,2) DEFAULT 0.5,
  primary_cta_text TEXT,
  primary_cta_link TEXT,
  secondary_cta_text TEXT,
  secondary_cta_link TEXT,
  stats JSONB DEFAULT '[]'::jsonb NOT NULL,
  features JSONB DEFAULT '[]'::jsonb NOT NULL,
  partner_logos JSONB DEFAULT '[]'::jsonb NOT NULL,
  featured_course_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
  course_selection_type TEXT DEFAULT 'featured' CHECK (course_selection_type IN ('manual', 'latest', 'featured')),
  featured_service_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
  service_selection_type TEXT DEFAULT 'featured' CHECK (service_selection_type IN ('manual', 'latest', 'featured')),
  testimonial_selection_type TEXT DEFAULT 'latest' CHECK (testimonial_selection_type IN ('manual', 'latest')),
  testimonial_count INTEGER DEFAULT 3,
  announcement_text TEXT,
  announcement_link TEXT,
  seo JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 4. `cms_about`
```sql
CREATE TABLE public.cms_about (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  values JSONB DEFAULT '[]'::jsonb NOT NULL,
  timeline JSONB DEFAULT '[]'::jsonb NOT NULL,
  chairman_message JSONB DEFAULT '{}'::jsonb NOT NULL,
  principal_message JSONB DEFAULT '{}'::jsonb NOT NULL,
  stats JSONB DEFAULT '[]'::jsonb NOT NULL,
  team_members JSONB DEFAULT '[]'::jsonb NOT NULL,
  achievements JSONB DEFAULT '[]'::jsonb NOT NULL,
  infrastructure JSONB DEFAULT '[]'::jsonb NOT NULL,
  seo JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 5. `cms_courses`
```sql
CREATE TABLE public.cms_courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  mode TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
  faculty_ids JSONB DEFAULT '[]'::jsonb,
  syllabus_pdf TEXT,
  eligibility TEXT NOT NULL,
  fees TEXT,
  admission_dates TEXT,
  batch_schedule TEXT,
  highlights JSONB DEFAULT '[]'::jsonb NOT NULL,
  syllabus JSONB DEFAULT '[]'::jsonb NOT NULL,
  faqs JSONB DEFAULT '[]'::jsonb NOT NULL,
  related_course_ids JSONB DEFAULT '[]'::jsonb,
  brochure_pdf TEXT,
  form_type_mapping TEXT,
  seo JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 6. `cms_services`
```sql
CREATE TABLE public.cms_services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  image TEXT,
  benefits JSONB DEFAULT '[]'::jsonb NOT NULL,
  eligibility TEXT,
  cta_text TEXT,
  cta_link TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  seo JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 7. `cms_charity`
```sql
CREATE TABLE public.cms_charity (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  schemes JSONB DEFAULT '[]'::jsonb NOT NULL,
  eligibility_criteria JSONB DEFAULT '[]'::jsonb NOT NULL,
  required_documents JSONB DEFAULT '[]'::jsonb NOT NULL,
  success_stories JSONB DEFAULT '[]'::jsonb NOT NULL,
  impact_stats JSONB DEFAULT '[]'::jsonb NOT NULL,
  videos JSONB DEFAULT '[]'::jsonb NOT NULL,
  faqs JSONB DEFAULT '[]'::jsonb NOT NULL,
  form_type_mapping TEXT,
  seo JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 8. `cms_gallery`
```sql
CREATE TABLE public.cms_gallery (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 9. `cms_forms`
```sql
CREATE TABLE public.cms_forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 10. `cms_notices`
```sql
CREATE TABLE public.cms_notices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL CHECK (type IN ('news', 'announcement', 'exam', 'scholarship', 'holiday', 'event')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT,
  attachment_url TEXT,
  publish_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expiry_date TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 11. `cms_media`
```sql
CREATE TABLE public.cms_media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'document', 'video')),
  size BIGINT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### 12. `cms_settings`
```sql
CREATE TABLE public.cms_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  site_name TEXT NOT NULL,
  logo_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  branches JSONB DEFAULT '[]'::jsonb NOT NULL,
  department_contacts JSONB DEFAULT '[]'::jsonb NOT NULL,
  emergency_contacts JSONB DEFAULT '[]'::jsonb NOT NULL,
  office_hours TEXT NOT NULL,
  social_links JSONB DEFAULT '{}'::jsonb NOT NULL,
  form_type_mapping TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE NOT NULL,
  seo JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 13. `cms_testimonials`
```sql
CREATE TABLE public.cms_testimonials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  image TEXT,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

---

### DOMAIN 3: OPERATIONS & INTAKE (Staff Managed)

#### 14. `applications` (Admissions)
```sql
CREATE TABLE public.applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_id TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected')),
  documents JSONB DEFAULT '[]'::jsonb NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 15. `students` (Student Directory)
```sql
CREATE TABLE public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  enrollment_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'graduated', 'dropped')),
  course_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 16. `enquiries` (CRM Leads)
```sql
CREATE TABLE public.enquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 17. `scholarships` (Scholarship Requests)
```sql
CREATE TABLE public.scholarships (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  income_bracket TEXT NOT NULL,
  reason TEXT NOT NULL,
  documents JSONB DEFAULT '[]'::jsonb NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 18. `charity_applications` (Assistance Requests)
```sql
CREATE TABLE public.charity_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  applicant_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  request_type TEXT NOT NULL,
  description TEXT NOT NULL,
  documents JSONB DEFAULT '[]'::jsonb NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 19. `form_submissions` (Dynamic Form Submissions)
```sql
CREATE TABLE public.form_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  form_id TEXT NOT NULL,
  form_type TEXT NOT NULL,
  form_title TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb NOT NULL,
  files JSONB DEFAULT '[]'::jsonb NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'under_review', 'approved', 'rejected', 'closed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

#### 20. `follow_ups` (Lead Follow-up Tracking)
```sql
CREATE TABLE public.follow_ups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting')),
  notes TEXT NOT NULL,
  next_follow_up_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### 21. `notifications` (Staff Notifications Inbox)
```sql
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL CHECK (type IN ('alert', 'info', 'success')),
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

## 3. Relationship Architecture Diagram

```
                 auth.users (Supabase Auth)
                     │
                     ├────────────── 1:1 ──────────────► public.user_profiles (role: DEVELOPER | OFFICE_ADMIN)
                     │
         ┌───────────┴───────────────────────┬───────────────────────────┐
         │ (created_by / updated_by)         │                           │ (recipient_id)
         ▼                                   ▼                           ▼
   CMS TABLES                          OPERATIONS TABLES          public.notifications
  ├─ cms_homepage                     ├─ applications
  ├─ cms_about                        ├─ students (application_id ─► applications.id)
  ├─ cms_courses ◄── (course_id) ──── ├─ enquiries
  ├─ cms_services                     ├─ scholarships (student_id ─► students.id)
  ├─ cms_charity                      ├─ charity_applications
  ├─ cms_gallery                      ├─ form_submissions (form_id ──► cms_forms.id)
  ├─ cms_forms ◄──────────────────────┤
  ├─ cms_notices                      └─ follow_ups (reference_id ──► enquiries.id / applications.id)
  ├─ cms_media
  ├─ cms_settings
  └─ cms_testimonials
```

---

## 4. Role Model & Security Helper Functions

To eliminate recursive RLS queries when policies check roles, we establish `SECURITY DEFINER` helper functions that query `user_profiles` directly:

```sql
-- Helper 1: Returns the authenticated user's role string
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Helper 2: Checks if caller is DEVELOPER
CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (public.get_auth_role() = 'DEVELOPER');
$$;

-- Helper 3: Checks if caller is OFFICE_ADMIN
CREATE OR REPLACE FUNCTION public.is_office_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (public.get_auth_role() = 'OFFICE_ADMIN');
$$;

-- Helper 4: Checks if caller is ANY staff member (DEVELOPER or OFFICE_ADMIN)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (public.get_auth_role() IN ('DEVELOPER', 'OFFICE_ADMIN'));
$$;
```

---

## 5. Row Level Security (RLS) Policy Matrix

All 21 tables will have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

| Table | `anon` (Public) SELECT | `anon` (Public) INSERT | `anon` UPDATE/DELETE | `OFFICE_ADMIN` Access | `DEVELOPER` Access |
|---|---|---|---|---|---|
| `user_profiles` | ❌ Denied | ❌ Denied | ❌ Denied | Read own profile (`id = auth.uid()`) | Read all, manage all |
| `cms_homepage` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_about` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_courses` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_services` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_charity` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_gallery` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_forms` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_notices` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_media` | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | Full CRUD |
| `cms_settings` | ✅ Allowed | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `cms_testimonials` | ✅ Allowed (`is_active=true`) | ❌ Denied | ❌ Denied | Read only | Full CRUD |
| `applications` | ❌ Denied | ✅ Allowed (Apply online) | ❌ Denied | Full CRUD | Full CRUD |
| `students` | ❌ Denied | ❌ Denied | ❌ Denied | Full CRUD | Full CRUD |
| `enquiries` | ❌ Denied | ✅ Allowed (Contact form) | ❌ Denied | Full CRUD | Full CRUD |
| `scholarships` | ❌ Denied | ✅ Allowed (Scholarship apply)| ❌ Denied | Full CRUD | Full CRUD |
| `charity_applications` | ❌ Denied | ✅ Allowed (Charity request)| ❌ Denied | Full CRUD | Full CRUD |
| `form_submissions` | ❌ Denied | ✅ Allowed (Dynamic form) | ❌ Denied | Full CRUD | Full CRUD |
| `follow_ups` | ❌ Denied | ❌ Denied | ❌ Denied | Full CRUD | Full CRUD |
| `notifications` | ❌ Denied | ✅ Allowed (Form alerts) | ❌ Denied | Read & Update own | Full CRUD |
| `activity_logs` | ❌ Denied | ❌ Denied (triggers only) | ❌ Denied | ❌ Denied | Read only |

---

## 6. Storage Architecture & Security Isolation

### Bucket Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE STORAGE BUCKETS                    │
├──────────────────────────────┬──────────────────────────────┤
│  mr-institute-media          │  mr-institute-documents      │
│  (PUBLIC BUCKET)             │  (PRIVATE BUCKET)            │
├──────────────────────────────┼──────────────────────────────┤
│ • CMS images & assets        │ • Student certificates       │
│ • Gallery images & videos    │ • Income certificates (proof)│
│ • Course brochures & logos   │ • Identity verification docs │
│ • Publicly accessible CDN    │ • Form submission uploads    │
│ • Upload: DEVELOPER only     │ • Upload: Public / Anon safe │
│                              │ • Read: Staff only           │
└──────────────────────────────┴──────────────────────────────┘
```

### Storage Security Policies

```sql
-- 1. Public Media Bucket Policies
-- Allow anyone to view public media
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'mr-institute-media');

-- Allow DEVELOPER to upload/update/delete public media
CREATE POLICY "Developer Manage Media"
ON storage.objects FOR ALL
USING (bucket_id = 'mr-institute-media' AND public.is_developer());

-- 2. Private Documents Bucket Policies
-- Allow anyone (public) to upload documents into submissions/ folder
CREATE POLICY "Public Upload Submissions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'mr-institute-documents' 
  AND (storage.foldername(name))[1] = 'submissions'
);

-- Allow only STAFF to read private uploaded documents
CREATE POLICY "Staff Read Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'mr-institute-documents' AND public.is_staff());

-- Allow DEVELOPER or OFFICE_ADMIN to delete/manage documents if needed
CREATE POLICY "Staff Manage Documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'mr-institute-documents' AND public.is_staff());
```

---

## 7. Public Form Submission Security

The public `DynamicFormRenderer` allows prospective students to submit forms with attached documents.
- **Client Security:** Browser uses `VITE_SUPABASE_ANON_KEY`.
- **Upload Flow:** The frontend uploads directly to `mr-institute-documents/submissions/{submissionId}/{filename}`.
- **Storage Protection:** The Storage policy strictly limits `INSERT` to the `submissions/` prefix and forbids public `SELECT` or `DELETE`. Once uploaded, only authenticated staff can view or download the documents.
- **Database Protection:** Anonymous users can only `INSERT` rows into `applications`, `enquiries`, `scholarships`, `charity_applications`, and `form_submissions`. They can **never** `SELECT` (read others' submissions), `UPDATE`, or `DELETE`.

---

## 8. Realtime Considerations

To preserve the instant multi-tab update behavior in the Developer CMS, Supabase Realtime publication must be enabled on the 6 collection tables:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_forms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_media;
```

---

## 9. Required Database Indexes

For maximum query performance:

```sql
-- Indexes for CMS Public Filtering
CREATE INDEX idx_cms_courses_active ON public.cms_courses(is_active);
CREATE INDEX idx_cms_services_active_order ON public.cms_services(is_active, order_index);
CREATE INDEX idx_cms_gallery_active_order ON public.cms_gallery(is_active, order_index);
CREATE INDEX idx_cms_notices_active_pub ON public.cms_notices(is_active, publish_date DESC);
CREATE INDEX idx_cms_forms_type_active ON public.cms_forms(type, is_active);

-- Indexes for Operations / CRM Lookups
CREATE INDEX idx_applications_status_date ON public.applications(status, submitted_at DESC);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_enquiries_status_date ON public.enquiries(status, created_at DESC);
CREATE INDEX idx_scholarships_status ON public.scholarships(status);
CREATE INDEX idx_form_submissions_form_status ON public.form_submissions(form_id, status);
CREATE INDEX idx_notifications_recipient_read ON public.notifications(recipient_id, is_read);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
```

---

## 10. Seed Data Requirements

When the tables are created in the next phase, the database must be seeded with baseline content matching existing defaults:

1. **`cms_homepage` (`id = 'main'`):** Headline, default stats, CTA links, features from `initialData.ts`.
2. **`cms_settings` (`id = 'global'`):** Default contact phone, address, office hours, email.
3. **`cms_about` (`id = 'main'`):** Default story, vision, mission, chairman/principal placeholder messages.
4. **`cms_charity` (`id = 'main'`):** Default schemes and eligibility text.
5. **`cms_courses` (6 initial courses):** Seeded with `initialCourses` from `src/data/initialData.ts`.
6. **`cms_testimonials` (3 initial testimonials):** Seeded with `initialTestimonials` from `src/data/initialData.ts`.

---

## 11. Decisions & Risks Requiring Approval

1. **Primary Key Format:** Using `TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text` instead of `UUID PRIMARY KEY` guarantees 100% compatibility with string IDs (e.g. `'main'`, `'global'`, `'c1'`) in the existing TypeScript code.
2. **Storage RLS vs. Serverless Upload URL:** The planned Storage RLS policy allows direct browser uploads to `submissions/` in the private bucket, eliminating the need for serverless upload proxies for basic form submissions.

---

## 12. Exact SQL Execution Plan for Next Step (Phase A.4)

When approved, the setup will be executed in a single structured migration script consisting of:
1. **Part 1:** Extension setup (`pgcrypto`, `uuid-ossp`)
2. **Part 2:** Tables & constraints creation
3. **Part 3:** Helper functions (`get_auth_role`, `is_developer`, `is_office_admin`, `is_staff`)
4. **Part 4:** RLS enablement & policy creation for all 21 tables
5. **Part 5:** Storage bucket provisioning & storage policies
6. **Part 6:** Realtime publication configuration
7. **Part 7:** Index creation
8. **Part 8:** Baseline seed data insertion

---

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   PHASE A.3 STATUS:  ✅ PLAN GENERATED & AUDITED       ║
║   AWAITING USER APPROVAL TO EXECUTE SQL IN PHASE A.4   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

*Execution has stopped. No SQL was run. Please review and provide your approval to execute this schema.*
