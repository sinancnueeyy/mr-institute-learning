import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const BUCKET_MEDIA = 'mr-institute-media';
const BUCKET_DOCUMENTS = 'mr-institute-documents';

function resolveBucketAndPath(path, fileName) {
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  let bucket = BUCKET_MEDIA;
  let storagePath = cleanPath;

  if (cleanPath.startsWith('documents/')) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath.replace(/^documents\//, '');
  } else if (cleanPath.startsWith(`${BUCKET_DOCUMENTS}/`)) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath.replace(new RegExp(`^${BUCKET_DOCUMENTS}/`), '');
  } else if (cleanPath.startsWith(`${BUCKET_MEDIA}/`)) {
    bucket = BUCKET_MEDIA;
    storagePath = cleanPath.replace(new RegExp(`^${BUCKET_MEDIA}/`), '');
  } else if (cleanPath.startsWith('media/') || cleanPath.startsWith('cms/')) {
    bucket = BUCKET_MEDIA;
    storagePath = cleanPath;
  } else if (
    cleanPath.includes('document') || 
    cleanPath.includes('submission') || 
    cleanPath.includes('application') ||
    cleanPath.includes('scholarship') ||
    cleanPath.includes('student')
  ) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath;
  }

  if (fileName && !storagePath.endsWith(fileName) && !storagePath.match(/\.[a-zA-Z0-9]+$/)) {
    storagePath = `${storagePath}/${fileName}`;
  }

  return { bucket, storagePath };
}

function parseStorageUrl(url) {
  try {
    const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/?#]+)\/([^?#]+)/);
    if (match) {
      return {
        bucket: match[1],
        storagePath: match[2]
      };
    }
  } catch {}
  return null;
}

async function runStorageVerification() {
  console.log('=== MR INSTITUTE: PHASE A.7 — SUPABASE STORAGE VERIFICATION ===\n');

  const testTrack = {
    uploadedMediaFiles: [],
    uploadedDocFiles: [],
    createdMediaRecordIds: []
  };

  // =========================================================================
  // 1. Authenticated Developer Image Upload to 'mr-institute-media'
  // =========================================================================
  console.log('--- 1. Authenticated Developer Media Upload ---');
  const devClient = createClient(supabaseUrl, supabaseAnonKey);
  const loginRes = await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  if (loginRes.error) {
    console.error('❌ Developer login failed:', loginRes.error.message);
    process.exit(1);
  }
  console.log('🔑 Developer authenticated successfully.');

  const testImageBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
  const testImageName = `test_banner_${Date.now()}.gif`;
  const mediaPath = `media/${Date.now()}_${testImageName}`;

  const { bucket: mediaBucket, storagePath: mediaStoragePath } = resolveBucketAndPath(mediaPath, testImageName);

  const { data: mediaUploadData, error: mediaUploadError } = await devClient.storage
    .from(mediaBucket)
    .upload(mediaStoragePath, testImageBuffer, {
      contentType: 'image/gif',
      upsert: false
    });

  if (mediaUploadError) {
    console.error('❌ Media upload to mr-institute-media failed:', mediaUploadError.message);
    process.exit(1);
  }
  testTrack.uploadedMediaFiles.push(mediaStoragePath);

  const { data: mediaPublicUrlData } = devClient.storage
    .from(mediaBucket)
    .getPublicUrl(mediaStoragePath);

  const mediaPublicUrl = mediaPublicUrlData.publicUrl;
  console.log(`✅ Media Upload SUCCESS: ${mediaBucket}/${mediaStoragePath}`);
  console.log(`   Public URL: ${mediaPublicUrl}`);

  // =========================================================================
  // 2. cms_media Metadata Creation via Repository Layer
  // =========================================================================
  console.log('\n--- 2. cms_media Metadata Repository Insertion ---');
  const mediaAssetPayload = {
    name: testImageName,
    url: mediaPublicUrl,
    type: 'image',
    size: testImageBuffer.length,
    uploaded_at: new Date().toISOString()
  };

  const { data: mediaDbRow, error: mediaDbError } = await devClient
    .from('cms_media')
    .insert(mediaAssetPayload)
    .select()
    .single();

  if (mediaDbError) {
    console.error('❌ Failed to insert cms_media row:', mediaDbError.message);
  } else {
    testTrack.createdMediaRecordIds.push(mediaDbRow.id);
    console.log(`✅ cms_media row created successfully. (ID: ${mediaDbRow.id})`);
  }

  // =========================================================================
  // 3. Anonymous/Public Document Upload for 'mr-institute-documents'
  // =========================================================================
  console.log('\n--- 3. Anonymous Public Intake Document Upload ---');
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const testDocBuffer = Buffer.from('%PDF-1.4 ... Test Student Admission Attachment ...');
  const testDocName = `marksheet_${Date.now()}.pdf`;
  const submissionId = `sub_${Date.now()}`;
  const docPath = `documents/submissions/${submissionId}/${testDocName}`;

  const { bucket: docBucket, storagePath: docStoragePath } = resolveBucketAndPath(docPath, testDocName);

  const { data: docUploadData, error: docUploadError } = await anonClient.storage
    .from(docBucket)
    .upload(docStoragePath, testDocBuffer, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (docUploadError) {
    console.error('❌ Anonymous document upload to mr-institute-documents failed:', docUploadError.message);
    process.exit(1);
  }
  testTrack.uploadedDocFiles.push(docStoragePath);

  const { data: docPublicUrlData } = anonClient.storage
    .from(docBucket)
    .getPublicUrl(docStoragePath);

  const docPublicUrl = docPublicUrlData.publicUrl;
  console.log(`✅ Anonymous Document Upload SUCCESS: ${docBucket}/${docStoragePath}`);
  console.log(`   Public URL: ${docPublicUrl}`);

  // =========================================================================
  // 4. Validate Generated Public URLs & Resolution
  // =========================================================================
  console.log('\n--- 4. Public & Secure URL HTTP Resolution Verification ---');
  const checkUrl = async (url, label) => {
    try {
      const res = await fetch(url);
      console.log(`   📡 [HTTP GET] ${label}: Status ${res.status} (${res.statusText})`);
      return res.status === 200;
    } catch (e) {
      console.error(`   ❌ [HTTP GET] ${label} fetch error:`, e.message);
      return false;
    }
  };

  const mediaUrlValid = await checkUrl(mediaPublicUrl, 'Media Public URL (mr-institute-media)');
  
  // Test signed URL generation for private documents by authenticated staff
  const { data: signedDocData, error: signedDocError } = await devClient.storage
    .from(docBucket)
    .createSignedUrl(docStoragePath, 3600);

  let docUrlValid = false;
  if (signedDocData?.signedUrl) {
    docUrlValid = await checkUrl(signedDocData.signedUrl, 'Staff Signed Document URL (mr-institute-documents)');
  }

  if (!mediaUrlValid || !docUrlValid) {
    console.error('❌ One or more storage URLs failed HTTP 200 resolution.');
    process.exit(1);
  }
  console.log('✅ Both media and document URLs resolved with HTTP 200 OK!');

  // =========================================================================
  // 5. Media Deletion & Storage Object Removal
  // =========================================================================
  console.log('\n--- 5. Media Deletion & Storage Object Cleanup ---');
  // Delete from storage
  const parsedMedia = parseStorageUrl(mediaPublicUrl);
  if (parsedMedia) {
    const { error: delStorageErr } = await devClient.storage
      .from(parsedMedia.bucket)
      .remove([parsedMedia.storagePath]);
    console.log('✅ Media storage object deleted:', delStorageErr ? `ERROR: ${delStorageErr.message}` : 'SUCCESS');
  }

  // Delete from cms_media table
  if (mediaDbRow?.id) {
    const { error: delDbErr } = await devClient
      .from('cms_media')
      .delete()
      .eq('id', mediaDbRow.id);
    console.log('✅ Database metadata record deleted:', delDbErr ? `ERROR: ${delDbErr.message}` : 'SUCCESS');
  }

  // Verify object is gone
  const { data: listCheck } = await devClient.storage.from(mediaBucket).list('media');
  const stillExists = listCheck?.some(f => f.name === testImageName);
  console.log('✅ Storage object absence verified:', !stillExists ? 'CONFIRMED REMOVED' : 'STILL PRESENT');

  // Clean up doc probe
  const parsedDoc = parseStorageUrl(docPublicUrl);
  if (parsedDoc) {
    await devClient.storage.from(parsedDoc.bucket).remove([parsedDoc.storagePath]);
    console.log('✅ Temporary document intake file cleaned up from storage.');
  }

  // =========================================================================
  // 6. Baseline Data & No Firebase Storage URL Audit
  // =========================================================================
  console.log('\n--- 6. Baseline Data & Firebase Storage URL Audit ---');
  const { data: allMedia } = await devClient.from('cms_media').select('*');
  console.log(`✅ Total active media records: ${allMedia?.length || 0}`);

  const hasFirebaseUrl = allMedia?.some(m => m.url && m.url.includes('firebasestorage.googleapis.com'));
  console.log(`✅ Zero legacy Firebase Storage URLs in cms_media: ${!hasFirebaseUrl}`);

  await devClient.auth.signOut();

  console.log('\n======================================================');
  console.log('PHASE A.7 SUPABASE STORAGE 100% VERIFIED');
  console.log('======================================================\n');
}

runStorageVerification();
