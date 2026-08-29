-- Clean up any malformed test entries in auth.users and auth.identities
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('developer@mrinstitute.edu', 'office@mrinstitute.edu', 'developer.mrinstitute@gmail.com'));
DELETE FROM public.user_profiles WHERE email IN ('developer@mrinstitute.edu', 'office@mrinstitute.edu', 'developer.mrinstitute@gmail.com');
DELETE FROM auth.users WHERE email IN ('developer@mrinstitute.edu', 'office@mrinstitute.edu', 'developer.mrinstitute@gmail.com');
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
