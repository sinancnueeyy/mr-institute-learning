-- ==============================================================================
-- MR INSTITUTE OF LEARNING — AUTHENTICATION TRIGGER & ACCOUNT PROVISIONING
-- Target: Supabase PostgreSQL (jzsuozkgqlvlcrwwvpgu)
-- ==============================================================================

-- 1. Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'OFFICE_ADMIN')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, public.user_profiles.display_name),
    role = COALESCE(new.raw_user_meta_data->>'role', public.user_profiles.role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Provision Default Accounts (DEVELOPER and OFFICE_ADMIN)
DO $$
DECLARE
  dev_id UUID := gen_random_uuid();
  office_id UUID := gen_random_uuid();
BEGIN
  -- Insert DEVELOPER if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'developer@mrinstitute.edu') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
    ) VALUES (
      dev_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'developer@mrinstitute.edu',
      crypt('Developer@2026!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"DEVELOPER","display_name":"System Developer"}'::jsonb,
      NOW(),
      NOW(),
      ''
    );

    INSERT INTO auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      dev_id,
      dev_id::text,
      dev_id,
      format('{"sub":"%s","email":"%s"}', dev_id, 'developer@mrinstitute.edu')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    INSERT INTO public.user_profiles (id, email, display_name, role)
    VALUES (dev_id, 'developer@mrinstitute.edu', 'System Developer', 'DEVELOPER')
    ON CONFLICT (id) DO UPDATE SET role = 'DEVELOPER';
  END IF;

  -- Insert OFFICE_ADMIN if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'office@mrinstitute.edu') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
    ) VALUES (
      office_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'office@mrinstitute.edu',
      crypt('OfficeAdmin@2026!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"OFFICE_ADMIN","display_name":"Office Administrator"}'::jsonb,
      NOW(),
      NOW(),
      ''
    );

    INSERT INTO auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      office_id,
      office_id::text,
      office_id,
      format('{"sub":"%s","email":"%s"}', office_id, 'office@mrinstitute.edu')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    INSERT INTO public.user_profiles (id, email, display_name, role)
    VALUES (office_id, 'office@mrinstitute.edu', 'Office Administrator', 'OFFICE_ADMIN')
    ON CONFLICT (id) DO UPDATE SET role = 'OFFICE_ADMIN';
  END IF;
END $$;
