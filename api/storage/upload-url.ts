import { adminAuth, adminDb } from '../_utils/firebaseAdmin';
import { createClient } from '@supabase/supabase-js';

// Define allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf'
];

// 10 MB limit
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Verify Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!adminAuth || !adminDb) {
      return res.status(500).json({ error: 'Firebase Admin not initialized' });
    }

    // 2. Verify Firebase Token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (tokenError) {
      return res.status(401).json({ error: 'Invalid or expired Firebase token' });
    }

    const uid = decodedToken.uid;

    // 3. Verify User Role
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'User not found in database' });
    }

    const userData = userDoc.data();
    const role = userData?.role;

    // Only Developer and Office Admin can upload
    if (role !== 'developer' && role !== 'officeAdmin') {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    // 4. Validate File Metadata
    const { filename, contentType, size } = req.body;

    if (!filename || !contentType || size === undefined) {
      return res.status(400).json({ error: 'Missing file metadata' });
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    // 5. Generate Secure Path
    // Sanitize filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const randomId = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    const path = `media/${uid}/${timestamp}-${randomId}-${sanitizedFilename}`;

    // 6. Generate Supabase Signed Upload URL
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Supabase credentials not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .storage
      .from('mr-institute-media')
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('Supabase Signed URL Error:', error);
      return res.status(500).json({ error: 'Failed to generate upload URL' });
    }

    // 7. Generate Public URL to return to client
    const { data: publicUrlData } = supabase
      .storage
      .from('mr-institute-media')
      .getPublicUrl(path);

    // Return the signed URL, path, and public URL
    return res.status(200).json({
      signedUrl: data.signedUrl,
      path: path,
      publicUrl: publicUrlData.publicUrl
    });

  } catch (error) {
    console.error('Upload URL generation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
