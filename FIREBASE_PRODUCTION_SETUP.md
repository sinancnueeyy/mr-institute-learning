# Firebase Production Setup Checklist

This document details the exact configuration needed within the Firebase Console to securely launch the MR Institute of Learning platform.

## 1. Authentication Configuration
1. Navigate to **Authentication > Sign-in method**.
2. Enable **Email/Password**.
3. Under **Settings > Authorized domains**, add:
   - Your production domain (e.g., `mrinstitute.edu`)
   - Your Vercel deployment URL (e.g., `mr-institute.vercel.app`)
   - *Note: Do not remove localhost during initial testing, but remove it once live.*

## 2. Firestore Deployment
The platform relies on highly restrictive Security Rules and specifically indexed fields.

Deploy your Firestore rules and indexes using the Firebase CLI:
```bash
firebase deploy --only firestore
```
*Verification:*
- Check the **Rules** tab in the Firestore Console to ensure `firestore.rules` has been applied successfully.
- Check the **Indexes** tab to verify composite indexes from `firestore.indexes.json` are active.

## 3. Storage Deployment
Firebase Storage holds course materials, gallery images, and CMS uploads.

Deploy your Storage rules using the Firebase CLI:
```bash
firebase deploy --only storage
```
*Verification:*
- Check the **Rules** tab in the Storage Console to ensure `storage.rules` has been applied.
- Ensure unauthorized users cannot overwrite existing paths.

## 4. Firebase Cloud Messaging (Push Notifications)
1. Go to **Project Settings > Cloud Messaging**.
2. Under "Web configuration", generate a new **Key Pair**.
3. Copy this VAPID key and add it to your Vercel Environment Variables as `VITE_FIREBASE_VAPID_KEY`.

## 5. Firebase App Check (Security)
To prevent unauthorized access to your database from bots:
1. Navigate to **App Check** in the Firebase Console.
2. Register your web app using **reCAPTCHA Enterprise**.
3. Input the Site Key in your Vercel Environment Variables as `VITE_RECAPTCHA_ENTERPRISE_KEY`.
4. Once verified, enforce App Check for Firestore and Storage.
