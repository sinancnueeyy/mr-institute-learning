# MR Institute of Learning — Production Deployment Guide

This document outlines the complete deployment procedure for the platform.

## 1. Prerequisites
- Node.js (v18+)
- Firebase CLI installed globally (`npm install -g firebase-tools`)
- A Google Cloud / Firebase account with Owner permissions for the target project.

## 2. Environment Setup
Create a new file named `.env.production` at the root of the project. Copy the contents of `.env.example` into it and fill in the exact credentials for your Firebase project.

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:12345:web:abcd"
VITE_GA_MEASUREMENT_ID="G-XXXXXXXX"
VITE_SITE_URL="https://mrinstitute.edu"
```

## 3. Connect Firebase CLI
Authenticate with Firebase and link the project:
```bash
firebase login
firebase use --add
# Select your production project
```

## 4. Deploy Firebase Security Rules & Indexes
Before deploying the application, ensure the database is secured and optimized:
```bash
# Deploy Firestore rules & indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

## 5. Build the Application
Compile the TypeScript and React code into a production bundle:
```bash
npm install
npm run build
```
Verify that the output in the terminal shows successful chunking and no TypeScript errors. The generated files will be located in the `/dist` directory.

## 6. Deploy to Firebase Hosting
Deploy the `/dist` directory to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## 7. Custom Domain Setup
1. Open the Firebase Console -> Hosting.
2. Click **Add custom domain**.
3. Enter your domain (e.g., `mrinstitute.edu`).
4. Update your domain registrar's DNS settings with the provided `A` and `TXT` records.
5. Wait for SSL certificate provisioning (can take 1-24 hours).

## 8. Backup and Recovery
**Firestore**: 
Set up scheduled backups via Google Cloud Console:
1. Navigate to Google Cloud Console -> Cloud Scheduler.
2. Create a job that triggers a Firestore export to a Cloud Storage bucket on a daily/weekly basis.

**Storage**:
1. Navigate to Cloud Storage in GCP.
2. Enable Object Versioning or configure a bucket transfer service to replicate files to a cold storage bucket for disaster recovery.

## 9. Handling Mock Data
If this is the very first deployment, the Firestore database will be empty. 
To launch properly, you must create a primary Developer user:
1. Log into the Firebase Console -> Authentication.
2. Create a user manually (e.g., `admin@mrinstitute.edu`).
3. Retrieve the UID of that user.
4. Navigate to Firestore -> `users` collection.
5. Create a document with ID = the user's UID.
6. Set the `role` field to `developer`.

You can now log in to the platform and construct the Homepage and Public Website content via the CMS. Do NOT run development seed scripts in the production database.

## 10. Post-Deployment Verification
- Ensure the login portal works.
- Verify that standard users cannot access `/developer/*` or `/office/*`.
- Verify that uploading an image via the CMS works and the image is visible on the public site.
- Check browser console for any missing environment variable warnings.
