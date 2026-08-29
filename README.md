# MR Institute of Learning

MR Institute of Learning is an enterprise educational platform containing a public website, Developer CMS, Office Operations Portal, and a Dynamic Form Engine, powered by Supabase and structured as a Progressive Web App (PWA).

## Project Overview
This repository contains the complete frontend architecture for the institution:
* **Public Website**: SEO-optimized, highly converting interface for prospective students.
* **Developer CMS**: A role-based content management system allowing zero-code updates to website content, courses, media, and settings.
* **Office Operations Portal**: An internal CRM and application management portal for admissions, scholarships, and student rosters.
* **Dynamic Form Engine**: A robust multi-step form builder that serves forms with conditional logic and file intake directly from the CMS.
* **Progressive Web App (PWA)**: Offline submission queueing, service worker precaching, and app-like installation capabilities.

## Technology Stack
* **Framework**: React 18 + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS + Custom Design System
* **Backend**: Supabase PostgreSQL 15, Supabase Auth (GoTrue), Supabase Storage, Supabase Realtime
* **Hosting**: Vercel / Static Web Host
* **PWA**: vite-plugin-pwa (Workbox)

## Local Development Setup

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```
Ensure you configure your Supabase project credentials:
```ini
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Development Server
Start the local development server:
```bash
npm run dev
```

### 4. Production Build & Verification
To create a production-ready build:
```bash
npm run build
```
To verify TypeScript compilation:
```bash
npx tsc --noEmit
```
The output will be generated in the `dist/` folder.

## Deployment

This platform is configured for instant deployment to Vercel or any standard SPA static hosting provider.

1. Connect your repository to Vercel.
2. Framework is detected as Vite (`outputDirectory: dist`).
3. Supply the environment variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_GA_MEASUREMENT_ID`.
4. Deploy.

For detailed deployment information, please consult [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).
