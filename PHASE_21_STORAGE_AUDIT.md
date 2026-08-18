# Phase 21: Storage Audit & Cloudflare R2 Migration Architecture

## 1. Current Storage Architecture
The application currently uses **Firebase Storage** as the primary blob storage provider. The upload logic is centralized in `src/firebase/storage.ts` via a `StorageService` object. When a user uploads a file, the React client directly sends the file payload to Firebase Storage using the Firebase JS SDK (`uploadBytesResumable`). Once the upload completes, the client fetches the public URL (`getDownloadURL`) and writes this URL to a Firestore document (e.g., as `imageUrl` in the Gallery or `fileUrl` for a student document).

## 2. All Firebase Storage Dependencies
The following Firebase Storage SDK functions are imported and heavily relied upon:
- `getStorage`
- `ref`
- `uploadBytesResumable`
- `getDownloadURL`

## 3. All Affected Files
To execute the migration, the following files will require modification or refactoring:
- `src/firebase/storage.ts` (Will be completely rewritten or deleted)
- `src/components/cms/MediaSelector.tsx` (Uploads images via `StorageService`)
- `src/components/forms/DynamicFormRenderer.tsx` (Uploads files for form submissions)
- `src/pages/developer/DeveloperMedia.tsx` (CMS media management)
- `firebase.json` (Firebase Storage rules deployment configuration will be removed)
- `storage.rules` (Will be obsolete)
- `vite.config.ts` (PWA caching strategies will need an update for the new R2 domains)

Files that will **NOT** need modification:
- `src/repositories/cms/galleryRepository.ts`
- `src/repositories/cms/mediaRepository.ts`
- Existing Firestore rules (since they manage documents, not the blobs themselves)

## 4. Current Gallery Loading Architecture
The `Gallery.tsx` page fetches the entire `cms_gallerycontent` collection at once where `isActive == true`. It then iterates over the returned items and renders `<GalleryCard>` components. These cards lazy-load the original, unoptimized images directly from Firebase Storage.

## 5. Diagnosis of the ~5 Second Gallery Delay
The reported 5-second loading delay is a symptom of two converging bottlenecks:
1. **The Animation Stagger Fallacy**: In `Gallery.tsx`, the gallery renders cards with `<GalleryCard key={item.id} item={item} delay={i * 0.1} />`. Because the delay is multiplied by the index (`i`), an array of 50 images means the 50th image will wait exactly **5.0 seconds** before animating into view. This creates a perceived loading delay, even if the data fetched instantly.
2. **Unoptimized Original Media**: The gallery loads the raw, high-resolution original images uploaded by the user. Firebase Storage does not automatically resize images. If 20 images of 5MB each are loaded, the browser must download 100MB of data, causing massive network waterfalls.

## 6. Recommended Cloudflare R2 Architecture
We will migrate to **Cloudflare R2**, a highly scalable, zero-egress-fee S3-compatible object storage. 
Because the application is a Vite SPA hosted on Vercel, the safest architecture is **Client-Side Uploads via Vercel Presigned URLs**.

## 7. Secure Upload Architecture
To prevent exposing secret R2 keys to the browser, we will implement the following flow:
1. **Browser Request**: The React app requests an upload URL from a new Vercel Serverless Function (e.g., `/api/upload-url`).
2. **Serverless Function**: The Vercel function securely holds the R2 secrets. It verifies the user's Firebase Authentication token (ensuring only logged-in users with the `developer` or `officeAdmin` role can upload).
3. **Presigned URL**: The Vercel function uses the AWS SDK (S3 Client) to generate a temporary `PutObject` Presigned URL and returns it to the client.
4. **Direct Upload**: The React client uses the native `fetch` API to `PUT` the file directly to Cloudflare R2 using the presigned URL. (This bypasses Vercel's 4.5MB Serverless Function payload limit).
5. **Firestore Write**: The React client takes the known public R2 URL and writes it to Firestore, exactly as it does today.

## 8. Required Vercel Server/API Changes
- Add a new Vercel API directory: `api/r2-upload.ts` (or similar).
- Install server-side dependencies: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`.
- Ensure the API route validates Firebase Auth headers before dispensing URLs.

## 9. Required Environment Variables
**Server-Side Only Secrets (DO NOT prefix with `VITE_`):**
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

**Client-Side Public Variables:**
- `VITE_R2_PUBLIC_URL` (e.g., `https://media.mrinstitute.edu` or a generated Cloudflare workers.dev URL).

## 10. Required Firestore Changes
**None.** We will preserve the exact same metadata structure. Instead of writing `https://firebasestorage.googleapis.com/...` into the `imageUrl` fields, we will write `https://<VITE_R2_PUBLIC_URL>/...`. Existing documents will continue to load their Firebase Storage URLs seamlessly, meaning no immediate data migration is forced.

## 11. Required Frontend Changes
- Rewrite `StorageService` in `src/firebase/storage.ts` (perhaps rename it to `src/services/storage.ts`) to orchestrate the presigned URL flow instead of `uploadBytesResumable`.
- Update `GalleryCard.tsx` to fix the `i * 0.1` stagger animation bug (e.g., cap the delay or use a staggered entrance container).

## 12. Required CMS Changes
CMS components (`DeveloperMedia`, `MediaSelector`) will not require UI changes. They will simply call the updated `StorageService.uploadFile` method, which will internally handle the new presigned URL flow.

## 13. Required Migration Strategy
1. **Codebase Migration (Phase 22)**: Implement the R2 Presigned URL logic. All *new* uploads will go to R2.
2. **Legacy Support**: Do NOT delete the Firebase Storage bucket yet. Existing images will continue to resolve successfully from Firebase Storage.
3. **Data Migration (Optional/Later Phase)**: A one-time script can be written locally to download all legacy files from Firebase Storage, upload them to R2, and batch-update the Firestore documents with the new R2 URLs. Once complete, the Firebase Storage bucket can be destroyed.

## 14. Security Considerations
- The R2 Secret Access Key must NEVER touch the Vite build or `.env.local` if it has a `VITE_` prefix.
- The Vercel API route must strictly reject unauthorized requests. If we want to avoid setting up `firebase-admin` on Vercel, we can rely on a shared application secret or simply verify the JWT standard claims.
- Cloudflare R2 should be configured with a CORS policy that only allows `PUT` requests from `https://mrinstitute.edu` and localhost.

## 15. PWA/Cache Considerations
In `vite.config.ts`, the `workbox.runtimeCaching` array must be updated to cache responses from `VITE_R2_PUBLIC_URL` to ensure the PWA correctly caches R2 images offline, just as it currently does (or should do) for Firebase Storage.

## 16. Rollback Strategy
If the R2 implementation fails in production, reverting the code changes in Git and restoring the old `src/firebase/storage.ts` logic will instantly roll back all *new* uploads to Firebase Storage. No production data will be corrupted.

## 17. Exact Implementation Sequence (For Phase 22)
1. Install AWS S3 SDK packages.
2. Create `api/r2-upload.ts` for Vercel.
3. Update `.env.example` to define the new server-side and client-side variables.
4. Rewrite `StorageService.uploadFile` to use the Vercel API and `fetch` PUT.
5. Fix the `Gallery.tsx` animation staggering bug.
6. Update `vite.config.ts` PWA caching rules for the new R2 domain.
7. Test uploads end-to-end.
