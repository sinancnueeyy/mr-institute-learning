# PHASE 22A: Secure Firebase Auth → Supabase Storage Architecture

## 1. Current Architecture
- **Auth**: Firebase Authentication manages users and their roles (Developer, Office Admin).
- **Database**: Firebase Firestore stores application data and media URLs, secured by Firestore Rules.
- **Storage**: Firebase Storage stores the actual media files, secured by Firebase Storage Rules (`request.auth != null`).
- **Flow**: The client authenticates with Firebase, uploads directly to Firebase Storage using the Firebase SDK (enforced by Storage Rules), receives a public URL, and saves that URL to Firestore.

## 2. Security Problem with Anon INSERT
The Phase 22 audit identified that migrating to Supabase Storage using only the anon key would require opening the Supabase bucket's Row Level Security (RLS) policies to allow `INSERT` for the `anon` role. 
Because we are **not** migrating to Supabase Auth, Supabase has no context of the user's Firebase authentication state. Allowing anonymous uploads would mean **anyone on the internet** could upload arbitrary files to the MR Institute's production Supabase bucket, leading to severe security risks (malware hosting, storage cost exhaustion, and abuse).

## 3. Architecture Options

### Option 1: Vercel Serverless API with Signed Upload URLs
A Node.js serverless function hosted on Vercel (e.g., in the `/api` directory).
- **Flow**: The React client sends the user's Firebase ID token and requested filename to the Vercel API. The API verifies the token using `firebase-admin`, checks the user's role in Firestore or Custom Claims, and uses the Supabase Service Role Key to generate a **Supabase Signed Upload URL**. The client then uploads the file directly to Supabase using this URL.
- **Security**: Extremely High. The Supabase Service Role key never leaves the server. Firebase tokens are cryptographically verified using Google's official Admin SDK.
- **Complexity**: Medium. Requires adding an `/api` folder to the Vite project for Vercel Serverless Functions.
- **Performance**: High. Since the Vercel API only generates a short-lived URL (returning a string), it executes in milliseconds. The actual heavy file upload goes directly from the client's browser to Supabase Storage, bypassing Vercel.
- **Cost**: Low/Free. Fits well within Vercel's free tier since it doesn't process large payloads.
- **Compatibility**: Perfect. Keeps Firebase logic centralized in the Node ecosystem.
- **Upload size limitations**: Bypasses Vercel's 4.5MB payload limit. Bound only by Supabase bucket limits.

### Option 2: Supabase Edge Function
A Deno-based serverless function hosted on Supabase.
- **Flow**: Similar to Option 1, but the API lives on Supabase infrastructure.
- **Security**: High. Validates the Firebase token and uploads/generates a signed URL.
- **Complexity**: High. Deno does not natively support the official Node `firebase-admin` SDK. Manually verifying Firebase RS256 JWTs by fetching Google's public keys in Deno adds significant custom cryptographic logic and maintenance burden.
- **Performance**: High (Edge-deployed).
- **Cost**: Low/Free. Included in Supabase free tier.
- **Compatibility**: Poor. Splits backend logic between Vercel and Supabase, and lacks native Firebase Admin support.

### Option 3: Firebase Auth → Supabase Third-Party JWT Integration
Configuring Supabase to natively accept and trust Firebase JWTs.
- **Flow**: The Supabase project is configured with Google/Firebase's JWKS (JSON Web Key Set). The client passes the Firebase JWT directly in the `Authorization: Bearer` header to the Supabase Storage API. Supabase RLS policies are written to decode the Firebase JWT and check roles.
- **Security**: High. Relies on native cryptographic trust.
- **Complexity**: Very High. Requires configuring custom third-party JWT providers in the Supabase Dashboard, mapping custom claims in RLS (e.g., `(auth.jwt() ->> 'role') = 'Developer'`), and maintaining complex SQL policies.
- **Cost**: Low/Free (depending on whether custom JWT providers are available on the active Supabase tier).
- **Compatibility**: Good, but tightly couples Supabase SQL policies to Firebase's specific token schema.

## 4. Recommended Architecture
**Option 1: Vercel Serverless API generating Supabase Signed Upload URLs** is the recommended architecture for the MR Institute WebApp.

**Why?**
1. **Security**: Privileged keys (`SUPABASE_SERVICE_ROLE_KEY`, `FIREBASE_SERVICE_ACCOUNT`) remain securely on the server.
2. **Size Limits**: By generating a Signed Upload URL instead of proxying the file through the Vercel API, we bypass Vercel's strict 4.5MB serverless payload limit, allowing large video/document uploads directly to Supabase.
3. **Ecosystem**: You can use the official `firebase-admin` Node.js SDK inside the Vercel API, which makes verifying tokens and roles trivial.
4. **Role Integrity**: Developer and Office Admin roles can be easily verified in Node.js before issuing the upload URL.

## 5. Request/Response Flow
1. **Client**: User selects a file in the UI.
2. **Client**: Requests a Signed Upload URL from `/api/storage/generate-upload-url`, passing the `Firebase ID Token`, `filename`, and `contentType`.
3. **Vercel API**: Uses `firebase-admin` to verify the ID Token and extract the user's role.
4. **Vercel API**: If authorized (Developer or Office Admin), initializes `@supabase/supabase-js` with the Service Role Key.
5. **Vercel API**: Calls `supabase.storage.from('media').createSignedUploadUrl(path)`.
6. **Vercel API**: Returns the `signedUrl` to the client.
7. **Client**: Performs an HTTP `PUT` request directly to the `signedUrl` with the file blob.
8. **Client**: Constructs the public URL (`https://[project].supabase.co/storage/v1/object/public/media/[path]`) and saves it to Firestore.

## 6. Authentication Flow
- The client authenticates via standard Firebase Auth.
- `firebase.auth().currentUser.getIdToken()` retrieves the JWT.
- Vercel API uses `getAuth().verifyIdToken(token)` to validate it against Google's servers.

## 7. Role Verification Flow
- Once `verifyIdToken` decodes the JWT, the API checks the user's role.
- If roles are stored in Firestore (e.g., `/users/{uid}`), the API queries Firestore using `firebase-admin`.
- If roles are in Firebase Custom Claims, the API reads `decodedToken.role`.
- **Developer**: Full permitted media management.
- **Office Admin**: Restricted to their existing allowed scopes.
- **Unauthorized**: API returns `403 Forbidden`, no Signed URL is generated.

## 8. Upload Flow
- Uploads happen completely client-side via a `PUT` request to the Supabase Signed URL.
- Supports both Images and PDFs natively.
- No file data passes through Vercel, ensuring maximum throughput and no serverless timeouts.

## 9. Public Media Read Flow
- The Supabase bucket will be configured as **Public**.
- Public website visitors, authenticated CMS users, and administrators will all read media exactly as they do now: by rendering the public URL (`https://...`) stored in Firestore directly in standard HTML `<img>` or `<a>` tags.
- No Signed URLs are required for *reading*, meaning performance is identical to a standard CDN.

## 10. Security Rules/Policies Required
- **Supabase Bucket RLS**:
  - `SELECT` (Read): Allowed for `anon` (Public).
  - `INSERT`, `UPDATE`, `DELETE`: **Restricted**. No policies are needed for these operations because the Service Role Key used by the Vercel API bypasses RLS to generate the Signed URL, and the Signed URL acts as a cryptographic authorization token for the specific upload.
- **Existing Public Bucket Delete/Update Behavior**: Because there are no `anon` write policies, anonymous users cannot delete or update existing files.

## 11. Required Environment Variables
**Vercel Server (Node.js)**:
- `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string for `firebase-admin`)
- `SUPABASE_URL` (Project URL)
- `SUPABASE_SERVICE_ROLE_KEY` (Secret key for generating signed URLs)

**Vite Client (Browser)**:
- No new variables needed for storage. The client just calls the Vercel API.

## 12. Required Packages
- `firebase-admin` (Server-side)
- `@supabase/supabase-js` (Server-side)

## 13. Exact Files That Would Need Modification
1. **`package.json`**: Add `firebase-admin` and `@supabase/supabase-js`.
2. **`src/firebase/storage.ts`**: Update `StorageService.uploadFile` to call the Vercel API for a signed URL, then `PUT` the file to that URL.
3. **`api/storage/upload-url.ts` (NEW)**: Create the Vercel Serverless Function to verify Firebase auth and issue the Supabase Signed Upload URL.

## 14. Files That Must Remain Unchanged
- `src/firebase/auth.ts`
- `src/firebase/firestore.ts`
- `src/firebase/config.ts`
- `firestore.rules`
- All Firestore repository files (e.g., `mediaRepository.ts`, `galleryRepository.ts`)

## 15. Free-Tier/Cost Considerations
- **Vercel**: API route executes in <50ms. Easily fits into the 100GB-hours free tier. Network bandwidth for the actual file upload is $0 for Vercel because the client uploads directly to Supabase.
- **Supabase**: Only consumes standard Storage bandwidth and limits (1GB storage, 2GB bandwidth on Free tier). API calls are minimal.
- **Firebase**: Admin SDK token verification is free.

## 16. Rollback Strategy
1. Keep the Firebase Storage bucket active.
2. If the Supabase implementation fails, revert `src/firebase/storage.ts` to use `uploadBytesResumable` from the Firebase SDK.
3. Delete the `api/storage/upload-url.ts` file.
4. Any files already uploaded to Supabase remain accessible since the public URLs stored in Firestore will still resolve.
