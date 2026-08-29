-- Link profiles in public.user_profiles for the newly created auth users
INSERT INTO public.user_profiles (id, email, display_name, role)
SELECT id, email, 'System Developer', 'DEVELOPER'
FROM auth.users
WHERE email = 'developer@mrinstitute.edu'
ON CONFLICT (id) DO UPDATE SET role = 'DEVELOPER', display_name = 'System Developer';

INSERT INTO public.user_profiles (id, email, display_name, role)
SELECT id, email, 'Office Administrator', 'OFFICE_ADMIN'
FROM auth.users
WHERE email = 'office@mrinstitute.edu'
ON CONFLICT (id) DO UPDATE SET role = 'OFFICE_ADMIN', display_name = 'Office Administrator';
