# MR Institute of Learning - Vercel Deployment Guide

This document outlines the steps required to deploy the MR Institute of Learning platform to Vercel for production use.

## 1. Prerequisites
- A Vercel Account (https://vercel.com)
- A GitHub Account
- Firebase Production Credentials
- ReCaptcha Enterprise Key
- VAPID Key for Push Notifications

## 2. GitHub Connection
1. Push this repository to your GitHub account:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mr-institute.git
   git push -u origin main
   ```

## 3. Vercel Import
1. Log in to Vercel and click **Add New... > Project**.
2. Select your newly created `mr-institute` repository from GitHub.
3. Configure the Project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## 4. Environment Variables Setup
Before clicking Deploy, expand the **Environment Variables** section and add all the keys from `.env.example`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GA_MEASUREMENT_ID`
- `VITE_SITE_URL`
- `VITE_FIREBASE_VAPID_KEY`
- `VITE_RECAPTCHA_ENTERPRISE_KEY`

*Ensure that none of your actual secrets are committed to the `.env` file in Git.*

## 5. Deploy
Click **Deploy**. Vercel will run the build and publish the app.
*Note: Our `vercel.json` ensures that all routing correctly falls back to `index.html` (SPA routing) and sets essential security headers.*

## 6. Custom Domain & SSL
1. Go to your Vercel Project Settings > **Domains**.
2. Add your custom domain (e.g., `mrinstitute.edu`).
3. Follow the DNS instructions (adding the CNAME/A Records) in your domain registrar.
4. **Important**: Vercel automatically issues an SSL certificate. This is critical because **Progressive Web App (PWA)** functionality, including Service Workers and Push Notifications, requires a secure HTTPS connection.

## 7. Firebase Configuration Update
Once deployed and your domain is linked:
1. Go to the **Firebase Console** > Authentication > Settings > Authorized domains.
2. Add your Vercel production domain.
3. If using App Check, register the new domain under the App Check settings.
