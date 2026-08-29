# MR Institute of Learning - Vercel Deployment Guide

This document outlines the steps required to deploy the MR Institute of Learning platform to Vercel for production use.

## 1. Prerequisites
- A Vercel Account (https://vercel.com)
- A GitHub repository connected to your Vercel account
- Supabase Project Credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

## 2. GitHub Connection
1. Push this repository to your GitHub account:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mr-institute.git
   git push -u origin main
   ```

## 3. Vercel Import
1. Log in to Vercel and click **Add New... > Project**.
2. Select your `mr-institute` repository from GitHub.
3. Configure the Project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## 4. Environment Variables Setup
Before clicking Deploy, expand the **Environment Variables** section and add the production keys:

- `VITE_SUPABASE_URL` (e.g. `https://jzsuozkgqlvlcrwwvpgu.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` (Your public browser anon key)
- `VITE_GA_MEASUREMENT_ID` (Optional Google Analytics Measurement ID)
- `VITE_SITE_URL` (e.g. `https://mrinstitute.edu`)

*Note: Never expose the Supabase `service_role` key in Vercel client environment variables.*

## 5. Deploy
Click **Deploy**. Vercel will build the production bundle (`tsc -b && vite build`) and publish the app.
*Note: Our `vercel.json` ensures that all routes correctly rewrite to `/index.html` (SPA routing) and sets strict security headers.*

## 6. Custom Domain & SSL
1. Go to your Vercel Project Settings > **Domains**.
2. Add your custom domain (e.g., `mrinstitute.edu`).
3. Follow the DNS instructions (adding the CNAME/A records) with your domain registrar.
4. Vercel automatically provisions an SSL/TLS certificate. HTTPS is mandatory for PWA Service Workers and modern Web APIs.

## 7. Supabase Authentication Domain Configuration
Once deployed and your custom domain is connected:
1. Open your **Supabase Dashboard** > Authentication > URL Configuration.
2. Set the **Site URL** to your production URL (e.g., `https://mrinstitute.edu`).
3. Add your Vercel preview and production domains to **Redirect URLs**.
