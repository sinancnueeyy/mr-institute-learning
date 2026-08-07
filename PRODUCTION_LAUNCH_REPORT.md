# MR Institute of Learning - Production Launch Guide

This document outlines the final steps to deploy the MR Institute of Learning platform to a production Firebase environment.

## 1. Environment Preparation
Before deploying, ensure you have set up your `.env.production` file using the `.env.production.example` template provided. 
This includes mapping the correct production API keys, domains, and project IDs.

## 2. Firebase Deployment Commands
To deploy the application to your production Firebase project, run the following command from the root of the project:

```bash
# Build the production bundle
npm run build

# Deploy all rules, indexes, and hosting assets to production
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```

## 3. Database Initialization Guide

Once deployed, the production database will be completely empty. Follow these steps to initialize it safely without using development scripts:

### A. Create the Initial Developer Account
1. Open your Firebase Console.
2. Navigate to **Authentication** -> **Users**.
3. Manually add a new user with an email and password (e.g., `developer@mrinstitute.edu`).
4. Navigate to **Firestore Database**.
5. Create a collection named `users`.
6. Add a new document with the Document ID matching the UID of the user you just created.
7. Add the following fields to the document:
   - `email`: (string) `developer@mrinstitute.edu`
   - `role`: (string) `developer`
   - `name`: (string) `System Developer`
   - `createdAt`: (string) `[Current ISO Date]`
   - `status`: (string) `active`

### B. Create the Office Admin Account
Log into the deployed application as the Developer, and navigate to the Developer CMS -> User Management. Use the interface to create the first `office_admin` account.

### C. Initialize CMS Data
Use the Developer CMS to populate the initial content:
- Set up Site Settings.
- Add initial Courses and Services.
- Add Homepage content.

## 4. Production Testing Checklist

Once deployed, perform the following verification checks:
- [ ] **Authentication**: Log in successfully with the developer account.
- [ ] **CMS Operations**: Create a test course in the CMS and verify it appears on the public website.
- [ ] **Form Submissions**: Submit a contact or enquiry form on the public website and verify it appears in the Office Portal.
- [ ] **Storage Rules**: Attempt to upload a file through the CMS (e.g., an image) and verify it succeeds.
- [ ] **PWA Support**: Open Chrome DevTools -> Application -> Service Workers and confirm the Service Worker is registered and active. Disconnect from the internet and verify the offline fallback banner appears.

## 5. Security Notes
- **DO NOT** run any scripts from the `scripts/` directory against the production database, as these contain placeholder data intended only for local development.
- Ensure that your `firestore.rules` and `storage.rules` are active and preventing unauthorized writes.
