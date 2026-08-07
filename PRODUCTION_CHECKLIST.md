# MR Institute of Learning — Production Checklist

Complete this checklist before performing the final public deployment.

## 1. Security & Authentication
- [ ] Review `firestore.rules` and confirm no unintended wildcards exist.
- [ ] Review `storage.rules` and confirm read/write limits are correct.
- [ ] Confirm no mock user credentials exist in the production Firestore database.
- [ ] Confirm protected routes properly redirect unauthorized users to `/login`.

## 2. Firebase & Environment
- [ ] Copy `.env.example` to `.env.production` and fill in all real production credentials.
- [ ] Ensure `VITE_FIREBASE_API_KEY` and other sensitive configs are correctly populated.
- [ ] Run `firebase use --add` to connect to the correct production Firebase project.
- [ ] Verify `firebase.json` matches the intended hosting and routing structure.

## 3. Data & Content
- [ ] Remove all mock entries (dummy forms, dummy applications, dummy users) from Firestore.
- [ ] Retain structurally required CMS data (e.g., initial Homepage layout documents) if needed, or re-run the seed script in a controlled manner.
- [ ] Confirm the default Developer account has been created via Firebase Auth and has the `developer` role in the `users` collection.

## 4. Build & Performance
- [ ] Run `npm run build` locally. Check if it completes without any TypeScript or Vite errors.
- [ ] Confirm chunk splitting is working as expected (vendor, ui, firebase chunks).
- [ ] Run a Lighthouse audit on the preview deployment (verify accessibility, performance, and SEO scores).
- [ ] Verify images load efficiently without layout shift (`loading="lazy"`).

## 5. Domain & SSL
- [ ] Verify the custom domain (e.g., `mrinstitute.edu`) is configured in the Firebase Console under Hosting.
- [ ] Update DNS records (A/TXT) as provided by Firebase.
- [ ] Confirm SSL provisioning is complete (this can take up to 24 hours after DNS propagation).
- [ ] Force HTTPS redirects (handled automatically by Firebase Hosting).

## 6. SEO & Analytics
- [ ] Update `public/robots.txt` and `public/sitemap.xml` with the final production domain URL.
- [ ] Ensure `VITE_GA_MEASUREMENT_ID` is updated in `.env.production`.
- [ ] Add the domain to Google Search Console and verify ownership.

## 7. Backups
- [ ] Set up scheduled exports for Firestore data to a Google Cloud Storage backup bucket.
- [ ] Document emergency rollback procedures.
