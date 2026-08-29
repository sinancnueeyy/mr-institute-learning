# MR Institute of Learning — Production Checklist

Complete this checklist before performing the final public deployment.

## 1. Security & Authentication
- [ ] Review PostgreSQL Row Level Security (RLS) policies on all 21 tables.
- [ ] Verify `mr-institute-documents` is private and `mr-institute-media` is public.
- [ ] Confirm protected routes properly redirect unauthorized users to `/login` or `/unauthorized`.
- [ ] Confirm no high-privilege service-role keys are exposed in client environment variables.

## 2. Supabase & Environment Configuration
- [ ] Populate `.env.local` / deployment environment with real credentials:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GA_MEASUREMENT_ID`
  - `VITE_SITE_URL`
- [ ] Configure Site URL and Redirect URLs in Supabase Authentication Dashboard.

## 3. Data & Content
- [ ] Confirm seed CMS content exists for `cms_homepage`, `cms_about`, `cms_charity`, and `cms_settings`.
- [ ] Confirm Developer and Office Admin profiles exist in `user_profiles`.

## 4. Build & Performance
- [ ] Run `npx tsc --noEmit` and confirm 0 errors.
- [ ] Run `npm run build` locally. Confirm successful chunking and service worker generation.
- [ ] Run a Lighthouse audit on the preview deployment (verify accessibility, performance, and SEO scores).
- [ ] Verify images load efficiently with responsive layouts.

## 5. Domain & SSL
- [ ] Configure custom domain in hosting provider (e.g., Vercel).
- [ ] Update DNS records (CNAME / A) at domain registrar.
- [ ] Confirm SSL provisioning is active and HTTPS redirects are forced.

## 6. SEO & Analytics
- [ ] Update `public/robots.txt` and `public/sitemap.xml` with the final production domain.
- [ ] Verify Google Analytics measurement ID receives page view events.
