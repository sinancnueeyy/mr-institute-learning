-- ==============================================================================
-- MR INSTITUTE OF LEARNING — COMPLETE DATABASE SCHEMA & RLS SCRIPT
-- Target: Supabase PostgreSQL (jzsuozkgqlvlcrwwvpgu)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE CREATION
-- ==============================================================================

-- SYSTEM & AUTHENTICATION
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('DEVELOPER', 'OFFICE_ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
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

-- CMS CONTENT TABLES
CREATE TABLE IF NOT EXISTS public.cms_homepage (
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

CREATE TABLE IF NOT EXISTS public.cms_about (
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

CREATE TABLE IF NOT EXISTS public.cms_courses (
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

CREATE TABLE IF NOT EXISTS public.cms_services (
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

CREATE TABLE IF NOT EXISTS public.cms_charity (
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

CREATE TABLE IF NOT EXISTS public.cms_gallery (
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

CREATE TABLE IF NOT EXISTS public.cms_forms (
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

CREATE TABLE IF NOT EXISTS public.cms_notices (
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

CREATE TABLE IF NOT EXISTS public.cms_media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'document', 'video')),
  size BIGINT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cms_settings (
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

CREATE TABLE IF NOT EXISTS public.cms_testimonials (
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

-- OPERATIONS & INTAKE TABLES
CREATE TABLE IF NOT EXISTS public.applications (
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

CREATE TABLE IF NOT EXISTS public.students (
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

CREATE TABLE IF NOT EXISTS public.enquiries (
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

CREATE TABLE IF NOT EXISTS public.scholarships (
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

CREATE TABLE IF NOT EXISTS public.charity_applications (
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

CREATE TABLE IF NOT EXISTS public.form_submissions (
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

CREATE TABLE IF NOT EXISTS public.follow_ups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting')),
  notes TEXT NOT NULL,
  next_follow_up_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL CHECK (type IN ('alert', 'info', 'success')),
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 3. RLS HELPER FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_developer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((public.get_auth_role() = 'DEVELOPER'), false);
$$;

CREATE OR REPLACE FUNCTION public.is_office_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((public.get_auth_role() = 'OFFICE_ADMIN'), false);
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((public.get_auth_role() IN ('DEVELOPER', 'OFFICE_ADMIN')), false);
$$;

-- ==============================================================================
-- 4. ENABLE RLS ON ALL TABLES
-- ==============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_charity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. RLS POLICIES
-- ==============================================================================

-- USER PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Developers can manage all profiles" ON public.user_profiles;
CREATE POLICY "Developers can manage all profiles" ON public.user_profiles
  FOR ALL USING (public.is_developer());

-- ACTIVITY LOGS
DROP POLICY IF EXISTS "Developers can view activity logs" ON public.activity_logs;
CREATE POLICY "Developers can view activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_developer());

DROP POLICY IF EXISTS "Authenticated users can create activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated users can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CMS CONTENT POLICIES (Public read active, Developer manage all)
DO $$
DECLARE
  tbl TEXT;
  cms_tables TEXT[] := ARRAY[
    'cms_homepage', 'cms_about', 'cms_courses', 'cms_services', 
    'cms_charity', 'cms_gallery', 'cms_forms', 'cms_notices', 'cms_testimonials'
  ];
BEGIN
  FOREACH tbl IN ARRAY cms_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Active %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public Read Active %I" ON public.%I FOR SELECT USING (is_active = true);', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Staff Read All %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Staff Read All %I" ON public.%I FOR SELECT USING (public.is_staff());', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Developer Full Access %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Developer Full Access %I" ON public.%I FOR ALL USING (public.is_developer());', tbl, tbl);
  END LOOP;
END $$;

-- CMS SETTINGS (Public read all, Developer manage)
DROP POLICY IF EXISTS "Public Read Settings" ON public.cms_settings;
CREATE POLICY "Public Read Settings" ON public.cms_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Developer Full Access Settings" ON public.cms_settings;
CREATE POLICY "Developer Full Access Settings" ON public.cms_settings
  FOR ALL USING (public.is_developer());

-- CMS MEDIA (Developer only)
DROP POLICY IF EXISTS "Developer Full Access Media" ON public.cms_media;
CREATE POLICY "Developer Full Access Media" ON public.cms_media
  FOR ALL USING (public.is_developer());

-- INTAKE TABLES (Public Insert, Staff Full Access)
DO $$
DECLARE
  tbl TEXT;
  intake_tables TEXT[] := ARRAY[
    'applications', 'enquiries', 'scholarships', 
    'charity_applications', 'form_submissions'
  ];
BEGIN
  FOREACH tbl IN ARRAY intake_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Insert %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public Insert %I" ON public.%I FOR INSERT WITH CHECK (true);', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Staff Manage %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Staff Manage %I" ON public.%I FOR ALL USING (public.is_staff());', tbl, tbl);
  END LOOP;
END $$;

-- STUDENTS & FOLLOW-UPS (Staff only)
DROP POLICY IF EXISTS "Staff Manage Students" ON public.students;
CREATE POLICY "Staff Manage Students" ON public.students
  FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Staff Manage Follow-ups" ON public.follow_ups;
CREATE POLICY "Staff Manage Follow-ups" ON public.follow_ups
  FOR ALL USING (public.is_staff());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Public Insert Notifications" ON public.notifications;
CREATE POLICY "Public Insert Notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff View Own Notifications" ON public.notifications;
CREATE POLICY "Staff View Own Notifications" ON public.notifications
  FOR SELECT USING (public.is_staff() AND (recipient_id IS NULL OR recipient_id = auth.uid()));

DROP POLICY IF EXISTS "Staff Update Own Notifications" ON public.notifications;
CREATE POLICY "Staff Update Own Notifications" ON public.notifications
  FOR UPDATE USING (public.is_staff() AND (recipient_id IS NULL OR recipient_id = auth.uid()));

DROP POLICY IF EXISTS "Developer Manage Notifications" ON public.notifications;
CREATE POLICY "Developer Manage Notifications" ON public.notifications
  FOR ALL USING (public.is_developer());

-- ==============================================================================
-- 6. STORAGE BUCKETS & STORAGE POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('mr-institute-media', 'mr-institute-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('mr-institute-documents', 'mr-institute-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Public Media Policies
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
CREATE POLICY "Public Read Media" ON storage.objects
  FOR SELECT USING (bucket_id = 'mr-institute-media');

DROP POLICY IF EXISTS "Developer Manage Media" ON storage.objects;
CREATE POLICY "Developer Manage Media" ON storage.objects
  FOR ALL USING (bucket_id = 'mr-institute-media' AND public.is_developer());

-- Private Documents Policies
DROP POLICY IF EXISTS "Public Upload Submissions" ON storage.objects;
CREATE POLICY "Public Upload Submissions" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'mr-institute-documents' 
    AND (storage.foldername(name))[1] = 'submissions'
  );

DROP POLICY IF EXISTS "Staff Read Documents" ON storage.objects;
CREATE POLICY "Staff Read Documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'mr-institute-documents' AND public.is_staff());

DROP POLICY IF EXISTS "Staff Manage Documents" ON storage.objects;
CREATE POLICY "Staff Manage Documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'mr-institute-documents' AND public.is_staff());


-- ==============================================================================
-- 7. REALTIME PUBLICATION
-- ==============================================================================

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_courses;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_services;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_gallery;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_forms;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_media;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ==============================================================================
-- 8. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_cms_courses_active ON public.cms_courses(is_active);
CREATE INDEX IF NOT EXISTS idx_cms_services_active_order ON public.cms_services(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_cms_gallery_active_order ON public.cms_gallery(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_cms_notices_active_pub ON public.cms_notices(is_active, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_cms_forms_type_active ON public.cms_forms(type, is_active);
CREATE INDEX IF NOT EXISTS idx_applications_status_date ON public.applications(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status_date ON public.enquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON public.scholarships(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_status ON public.form_submissions(form_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- 9. BASELINE SEED DATA
-- ==============================================================================

INSERT INTO public.cms_homepage (
  id, hero_headline, hero_subheadline, hero_description, hero_image,
  primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
  stats, features, partner_logos, announcement_text, announcement_link, is_active
) VALUES (
  'main',
  'Empowering Minds, Shaping Futures',
  'Premier Educational Excellence & Career Development',
  'Join MR Institute of Learning and unlock your true potential with our expert faculty, state-of-the-art curriculum, and holistic learning environment.',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
  'Explore Courses', '/courses', 'Contact Us', '/contact',
  '[{"label":"Students Trained","value":"15,000+","icon":"Users"},{"label":"Success Rate","value":"98%","icon":"Award"},{"label":"Expert Faculty","value":"50+","icon":"BookOpen"},{"label":"Years of Excellence","value":"12+","icon":"Clock"}]'::jsonb,
  '[{"title":"Expert Mentorship","description":"Learn directly from experienced educators and industry veterans.","icon":"BookOpen"},{"title":"Practical Training","description":"Hands-on labs and project-driven learning for real-world readiness.","icon":"Award"},{"title":"Career Guidance","description":"100% placement support and career counseling for all graduates.","icon":"Monitor"}]'::jsonb,
  '[]'::jsonb,
  'Admissions open for 2026-2027 Academic Year! Apply early to secure scholarship benefits.',
  '/courses',
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cms_settings (
  id, site_name, logo_url, contact_email, contact_phone, address,
  office_hours, branches, department_contacts, emergency_contacts,
  social_links, maintenance_mode
) VALUES (
  'global',
  'MR Institute of Learning',
  '',
  'info@mrinstitute.edu',
  '+91 98765 43210',
  'MR Institute Campus, Main Knowledge City Road, Kerala, India',
  'Mon - Sat: 8:30 AM - 5:30 PM',
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '{"facebook":"","instagram":"","twitter":"","linkedin":"","youtube":""}'::jsonb,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cms_about (
  id, title, story, vision, mission, values, timeline,
  chairman_message, principal_message, stats, team_members, achievements, infrastructure, is_active
) VALUES (
  'main',
  'About MR Institute',
  'Founded with the vision to deliver high-quality, inclusive, and future-ready education, MR Institute has transformed thousands of students into confident professionals and scholars.',
  'To become a globally recognized center of learning that fosters intellectual curiosity, innovation, and ethical leadership.',
  'To provide accessible, modern, and value-driven education that equips learners with the skills needed to excel in a rapidly evolving world.',
  '[{"title":"Excellence","description":"Striving for the highest standards in teaching and mentorship.","icon":"Award"},{"title":"Integrity","description":"Upholding ethical principles and transparency in all operations.","icon":"Check"},{"title":"Inclusivity","description":"Ensuring quality education is accessible to deserving students from all backgrounds.","icon":"Heart"}]'::jsonb,
  '[{"year":"2014","title":"Foundation","description":"MR Institute was established with our first campus."},{"year":"2018","title":"Expansion","description":"Introduced Degree Support and Advanced Technical programs."},{"year":"2023","title":"AI & Future Skills","description":"Launched specialized modern tech & AI curriculum."}]'::jsonb,
  '{"name":"Chairman","message":"Education is the most powerful catalyst for individual and societal transformation.","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"}'::jsonb,
  '{"name":"Principal","message":"Our mission is to nurture critical thinking, practical skills, and character.","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"}'::jsonb,
  '[{"label":"Campuses","value":"2"},{"label":"Programs","value":"25+"},{"label":"Alumni","value":"15,000+"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cms_charity (
  id, title, description, schemes, eligibility_criteria, required_documents,
  success_stories, impact_stats, videos, faqs, is_active
) VALUES (
  'main',
  'MR Educational Charity & Scholarships',
  'We believe financial constraints should never stand between a bright mind and a great education. Our charitable wing provides scholarships, fee waivers, and study resources.',
  '[{"title":"Merit-Cum-Means Scholarship","description":"Full or partial tuition fee waiver for academically bright students from underprivileged backgrounds.","eligibility":"Annual family income under INR 2.5 Lakhs; min 80% marks in previous exam.","docsRequired":["Income Certificate","Previous Marksheet","Aadhar Card"]},{"title":"Special Talent Endowment","description":"Support for students showcasing exceptional potential in STEM, arts, or sports.","eligibility":"Demonstrated achievement at state/national level.","docsRequired":["Certificate of Achievement","Recommendation Letter"]}]'::jsonb,
  '["Students belonging to low-income families","Differently-abled students with high academic drive","First-generation college learners"]'::jsonb,
  '["Government Income Certificate","Academic Transcripts","Proof of Identity (Aadhar Card)","Passport Size Photograph"]'::jsonb,
  '[]'::jsonb,
  '[{"label":"Scholarships Granted","value":"500+"},{"label":"Financial Aid Disbursed","value":"₹1.2 Cr+"},{"label":"Beneficiary Students","value":"1,200+"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  true
) ON CONFLICT (id) DO NOTHING;

-- SEED COURSES
INSERT INTO public.cms_courses (id, title, category, duration, mode, description, image, eligibility, highlights, syllabus, faqs, gallery, is_active)
VALUES
('c1', 'Advanced Mathematics for 12th', 'Academic Tuition', '1 Year', 'Offline', 'Comprehensive coaching covering the entire syllabus with regular tests and doubt-clearing sessions.', 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=800&q=80', '10th / 11th Standard pass', '["Chapter-wise Mock Exams", "Doubt Clearing Sessions", "Personalized Mentor Tracking"]'::jsonb, '["Calculus", "Vectors & 3D Geometry", "Probability & Statistics", "Algebra"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true),
('c2', 'B.Sc Computer Science Support', 'Degree Programs', '3 Years', 'Hybrid', 'End-to-end academic support for university students including practical labs and project guidance.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', '12th Standard Science stream pass', '["University Curriculum Aligned", "Practical Lab Support", "Final Year Project Mentorship"]'::jsonb, '["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Web Development"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true),
('c3', 'AI & Data Science Foundation', 'AI & Skill Development', '6 Months', 'Online', 'Learn the fundamentals of Artificial Intelligence, Machine Learning, and Data Analytics.', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80', 'Basic programming knowledge recommended', '["Python for Data Science", "Machine Learning Models", "Real-world Capstone Project"]'::jsonb, '["Python Fundamentals", "NumPy & Pandas", "Supervised Learning", "Deep Learning Intro"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true),
('c4', 'Direct 10th Examination Coaching', 'Direct Examination', '1 Year', 'Offline', 'Intensive preparation program for students appearing for direct board examinations.', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', 'Open to all eligible candidates', '["Exam-oriented Short Notes", "Weekly Testing Schedule", "Individual Student Attention"]'::jsonb, '["Mathematics", "Science", "Social Science", "English & Languages"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true),
('c5', 'Digital Marketing Mastery', 'Computer Courses', '3 Months', 'Online', 'Complete hands-on training in SEO, SMM, and Google Ads for career growth.', 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80', 'Basic computer literacy', '["Live Ad Campaign Practice", "Industry Recognized Certification", "Freelancing Guidance"]'::jsonb, '["Search Engine Optimization", "Social Media Ads", "Google Analytics & Ads", "Content Marketing"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true),
('c6', 'Medical Entrance (NEET) Prep', 'Competitive Exams', '2 Years', 'Offline', 'Rigorous coaching program designed to crack the toughest medical entrance exams.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80', '10th / 11th Standard pass with Science', '["Daily Practice Problems (DPP)", "All-India Level Test Series", "Experienced Faculty Team"]'::jsonb, '["Physics", "Chemistry", "Botany", "Zoology"]'::jsonb, '[]'::jsonb, '[]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- SEED TESTIMONIALS
INSERT INTO public.cms_testimonials (id, student_name, course, rating, review, image, is_featured, order_index, is_active)
VALUES
('t1', 'Sarah Ahmed', 'Medical Student', 5, 'MR Institute completely changed my approach to studying. The personalized attention helped me secure a top rank in my board exams.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', true, 1, true),
('t2', 'David Chen', 'Software Engineer', 5, 'The AI foundation course was incredibly practical. I gained skills that immediately helped me land my first tech internship.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', true, 2, true),
('t3', 'Priya Sharma', 'Higher Secondary Student', 5, 'The faculty at MR Institute are exceptionally supportive. The chapter tests and feedback sessions gave me immense confidence.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', true, 3, true)
ON CONFLICT (id) DO NOTHING;
