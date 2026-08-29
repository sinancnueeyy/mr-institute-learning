# Admin Setup Guide

This document explains how administrator and staff accounts are configured in the Supabase production environment.

Due to strict Row Level Security (RLS) policies, administrative roles are managed directly through Supabase Auth and the `user_profiles` table.

## 1. Initial Production Accounts
The standard initial administrative accounts are:
* **Developer (Super Admin)**: `developer@mrinstitute.edu`
  - Profile Role: `DEVELOPER`
  - Scope: Full access across `/developer/*` (CMS, Media, Settings, System Logs) and `/office/*`.
* **Office Administrator**: `office@mrinstitute.edu`
  - Profile Role: `OFFICE_ADMIN`
  - Scope: Access to `/office/*` (Admissions, Students, CRM, Scholarships, Charity, Notifications, Reports).

## 2. Provisioning New Staff in Supabase

1. Open your **Supabase Dashboard** > **Authentication** > **Users**.
2. Click **Add User** > **Create User** and enter the staff member's email and temporary password.
3. Open the **SQL Editor** or **Table Editor** and navigate to `public.user_profiles`.
4. Insert or update the user's profile record:
   ```sql
   INSERT INTO public.user_profiles (id, email, display_name, role)
   VALUES (
     '<USER_UUID_FROM_AUTH>',
     'staff@mrinstitute.edu',
     'Staff Name',
     'OFFICE_ADMIN' -- or 'DEVELOPER'
   )
   ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
   ```
5. When the user signs in at `/login`, `AuthContext.tsx` reads their role and redirects them to their designated portal (`/office` or `/developer`).

## 3. Two-Tier Protection Model
- **Frontend Routing Guard:** `RoleRoute.tsx` checks the user's authenticated profile role. If an unauthorized role attempts access, they are redirected to `/unauthorized`.
- **Database-Level RLS:** Even if client-side routing is manipulated, PostgreSQL RLS policies (`public.is_developer()`, `public.is_staff()`) strictly deny unauthorized SELECT, INSERT, UPDATE, or DELETE actions.
