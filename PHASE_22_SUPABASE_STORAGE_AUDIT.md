# PHASE 22: Supabase Storage Audit

## Current Architecture
The application currently uses Firebase Storage to host media and documents. Uploads are facilitated by a wrapper service (`StorageService`) in `src/firebase/storage.ts`. The resulting download URLs provided by Firebase (`firebasestorage.googleapis.com/...`) are then saved as standard string fields in various Firestore documents (e.g., MediaAssets, FormSubmissions, GalleryContent). 

When rendering media, the application simply uses these string URLs directly in HTML `<img>` tags or download links. There are no signed URLs or authenticated download requirements; all media URLs are public. 

## Firebase Storage Dependencies
1. **src/firebase/storage.ts**: Core wrapper containing `StorageService.uploadFile`.
2. **src/components/cms/MediaSelector.tsx**: Uploads images/videos/documents for the CMS.
3. **src/components/forms/DynamicFormRenderer.tsx**: Uploads user-submitted form attachments.
4. **src/pages/developer/DeveloperMedia.tsx**: The CMS media library upload interface.
5. **Firebase Storage Rules (`storage.rules`)**: Enforces authentication and a 10MB file size limit.

## Upload, Download, and Delete Operations
- **Uploads**: All uploads pass through `StorageService.uploadFile`, which uses Firebase's `uploadBytesResumable`.
- **Downloads/URLs**: Public URLs are generated post-upload using `getDownloadURL` and stored in Firestore. The UI reads these URLs from Firestore directly.
- **Deletions**: The application currently **does not perform any Firebase Storage file deletions**. Deleting an item in `DeveloperMedia.tsx` only deletes the Firestore reference, leaving the file orphaned in storage.

## Supabase Storage Migration Plan
Since the architecture completely decouples the file hosting from the database via public URLs, we can swap out the storage provider transparently:
1. **Initialize Supabase**: Add `@supabase/supabase-js`, and create a Supabase client using the Project URL and Publishable Key.
2. **Update `StorageService`**: Refactor `src/firebase/storage.ts` (or create a Supabase equivalent) to use `supabase.storage.from('bucket').upload()`.
3. **Generate Public URLs**: Use `supabase.storage.from('bucket').getPublicUrl()` to get the new URL string, which will be returned to the components and saved to Firestore just like before.
4. **Existing Data**: Old Firestore documents will still contain `firebasestorage.googleapis.com` URLs, which will continue to resolve successfully since we are keeping Firebase Storage intact.

## Security Considerations
Currently, Firebase Storage rules (`storage.rules`) enforce `request.auth != null` for uploads.
Since we are **not modifying Firebase Authentication**, the user's Auth state exists only in Firebase. The Supabase client, using only a Publishable Key and lacking a custom JWT integration, will consider all uploads as **Anonymous**.

To migrate without breaking the current Auth+Firestore setup, the Supabase Storage bucket policies (RLS) will temporarily need to allow `INSERT` for the `anon` role, or we must implement a secure edge function / JWT bridging mechanism if anonymous uploads are unacceptable.

## Required Environment Variables
The following will need to be added to `.env` files:
- `VITE_SUPABASE_URL` (Project URL)
- `VITE_SUPABASE_ANON_KEY` (Publishable Key)

*(No Supabase Secret Key will be used).*

## Affected Files
**Files requiring modification:**
- `.env.example` & `.env.production.example` (To add Supabase env vars)
- `package.json` & `vite.config.ts` (To add `@supabase/supabase-js`)
- `src/firebase/storage.ts` (To replace the upload implementation)

**Files that MUST NOT be modified:**
- `src/firebase/auth.ts`
- `src/firebase/firestore.ts`
- `src/firebase/config.ts` (Except possibly to remove unused storage exports)
- `firebase.json` & `firestore.rules`

## Migration Risks
- **Security Disconnect**: As noted, Supabase won't natively recognize Firebase Auth users without a custom JWT setup. 
- **CORS Issues**: Supabase Storage requires correct CORS configuration on the bucket to allow uploads directly from the browser (the frontend VITE_SITE_URL).
- **File Type Policies**: If Firebase had strict MIME type rules (it currently doesn't), we'd need to replicate them in Supabase RLS.

## Rollback Plan
Because we are only replacing the upload function and not modifying existing Firestore data or Firebase Auth, rolling back is trivial:
1. Revert the changes to `src/firebase/storage.ts`.
2. Any files uploaded to Supabase during the test period will still have valid Supabase URLs in Firestore.
3. Future uploads will revert to Firebase Storage.
