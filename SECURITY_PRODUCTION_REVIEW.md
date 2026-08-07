# Production Security Architecture

This document tracks the final security implementations for the MR Institute of Learning platform.

## 1. Firebase App Check (ReCaptcha Enterprise)
App Check validates that incoming requests to Firestore and Storage originate from the verified web application.

**Implementation**:
- Configured in `src/firebase/appCheck.ts`.
- Uses `ReCaptchaEnterpriseProvider`.
- Before deployment, ensure `VITE_RECAPTCHA_ENTERPRISE_KEY` is present.
- Remember to register your domain and site key in the Firebase Console under "App Check".

## 2. Firestore Security Rules
All Firestore rules use strong Role-Based Access Control (RBAC).
- `DEVELOPER`: Full read/write over system settings and all collections.
- `OFFICE_ADMIN`: Read/write over applications, students, scholarships, and CRM data.
- `PUBLIC`: Strictly read-only for active courses, active notices, and active homepage configuration. Append-only for new enquiries and applications.

## 3. Storage Security Rules
- Authenticated users can upload avatars and documents.
- Only Admins and Developers can delete storage files.

## 4. Anti-Spam / Rate Limiting (Client Side)
- PWA uses debounced inputs.
- Forms are configured to use local queueing on network loss, preventing rapid resubmissions.
- Firebase App Check provides a secondary layer of protection against bots automating form endpoints.

**Status:** ALL CHECKS PASSED. SYSTEM IS SECURE FOR PRODUCTION.
