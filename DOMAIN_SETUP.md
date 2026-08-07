# Domain & DNS Setup Guide

This guide details the end-to-end workflow for mapping your custom domain (e.g., `mrinstitute.edu`) to the MR Institute of Learning platform.

## Workflow Overview
1. **Domain Registrar** (GoDaddy, Namecheap, Route53, etc.)
2. **Vercel** (Hosting and SSL generation)
3. **Firebase** (Authorization linking)

## 1. Vercel Configuration
1. Go to your project on the Vercel Dashboard.
2. Click on **Settings** > **Domains**.
3. Enter your custom domain (e.g., `mrinstitute.edu`) and click **Add**.
4. Vercel will provide you with DNS records (typically an `A` record for the apex domain and a `CNAME` for the `www` subdomain).

## 2. Domain Registrar Configuration
1. Log in to the platform where you purchased your domain.
2. Navigate to DNS Management.
3. Add the records provided by Vercel:
   - **Type:** `A` | **Name:** `@` | **Value:** `76.76.21.21` (Vercel's IP)
   - **Type:** `CNAME` | **Name:** `www` | **Value:** `cname.vercel-dns.com`
4. Wait for DNS propagation (this can take a few minutes to a few hours).

## 3. SSL and HTTPS Validation
Progressive Web Apps (PWAs) **require** a secure context (HTTPS) to register Service Workers and prompt for installation. 
- Vercel automatically provisions a Let's Encrypt SSL certificate for your custom domain. 
- You can verify this in the Vercel Domains dashboard. Ensure the SSL status says **Valid**.

## 4. Firebase Authorized Domains Update
Once your domain is live, you must tell Firebase that this domain is allowed to use its services.
1. Open the **Firebase Console**.
2. Go to **Authentication** > **Settings** > **Authorized domains**.
3. Click **Add domain**.
4. Enter your custom domain (e.g., `mrinstitute.edu`).

If you do not complete Step 4, users will be completely unable to log in, and Firebase Auth will throw an "Unauthorized Domain" error.
