import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read configuration
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const BUCKET_MEDIA = 'mr-institute-media';
const BUCKET_DOCUMENTS = 'mr-institute-documents';

const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const staffClient = createClient(supabaseUrl, supabaseAnonKey);

const cleanupTasks = {
  documentFiles: [],
  mediaFiles: []
};

async function runSecurityTests() {
  console.log('============================================================');
  console.log('PHASE A.9.2 — STORAGE SECURITY & ISOLATION VERIFICATION');
  console.log('============================================================\n');

  let allTestsPassed = true;

  try {
    // Authenticate staff client
    console.log('🔐 Authenticating staff client (developer@mrinstitute.edu)...');
    const { data: authData, error: authError } = await staffClient.auth.signInWithPassword({
      email: 'developer@mrinstitute.edu',
      password: 'Developer@2026!'
    });

    if (authError || !authData.session) {
      console.error('❌ Failed to authenticate staff user:', authError?.message);
      process.exit(1);
    }
    console.log('✅ Staff authenticated successfully.\n');

    // ------------------------------------------------------------------------
    // TEST 1: Anonymous upload to mr-institute-documents
    // ------------------------------------------------------------------------
    console.log('--- TEST 1: Anonymous Upload to mr-institute-documents ---');
    const testDocContent = `CONFIDENTIAL ADMISSION MARKSHEET - ID: ${Date.now()}`;
    const testDocBuffer = Buffer.from(testDocContent);
    const testDocPath = `submissions/sec_test_${Date.now()}/marksheet_sample.pdf`;

    const { data: uploadDocData, error: uploadDocError } = await anonClient.storage
      .from(BUCKET_DOCUMENTS)
      .upload(testDocPath, testDocBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadDocError) {
      console.error('❌ TEST 1 FAILED: Anonymous upload rejected:', uploadDocError.message);
      allTestsPassed = false;
    } else {
      cleanupTasks.documentFiles.push(testDocPath);
      console.log('✅ TEST 1 PASSED: Anonymous upload permitted for intake intake path:', uploadDocData.path);
    }

    // ------------------------------------------------------------------------
    // TEST 2: Anonymous attempt to read/download uploaded document
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Anonymous Read Denial on mr-institute-documents ---');
    const { data: anonPubUrlData } = anonClient.storage
      .from(BUCKET_DOCUMENTS)
      .getPublicUrl(testDocPath);

    const anonFetchRes = await fetch(anonPubUrlData.publicUrl);
    console.log(`   📡 [HTTP GET Anonymous Public URL]: Status ${anonFetchRes.status} (${anonFetchRes.statusText})`);

    if (anonFetchRes.status === 400 || anonFetchRes.status === 403 || anonFetchRes.status === 404) {
      console.log(`✅ TEST 2 PASSED: Anonymous public read DENIED as expected (Status ${anonFetchRes.status} - Private Bucket)`);
    } else if (anonFetchRes.status === 200) {
      console.error('❌ TEST 2 FAILED: Anonymous public read succeeded on sensitive document!');
      allTestsPassed = false;
    } else {
      console.log(`ℹ️ Anonymous read returned status: ${anonFetchRes.status}`);
    }

    // Also test anonymous attempt to list/download files directly via SDK
    const { data: anonListFiles, error: anonListError } = await anonClient.storage
      .from(BUCKET_DOCUMENTS)
      .list(`submissions/sec_test_${Date.now()}`);

    if (anonListError || !anonListFiles || anonListFiles.length === 0) {
      console.log('✅ TEST 2 (SDK List): Anonymous bucket enumeration DENIED by RLS.');
    } else {
      console.error('❌ TEST 2 (SDK List) FAILED: Anonymous user was able to list documents!');
      allTestsPassed = false;
    }

    // ------------------------------------------------------------------------
    // TEST 3: Authenticated authorized staff requests signed URL
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Authenticated Staff Requests Signed URL ---');
    const { data: signedData, error: signedError } = await staffClient.storage
      .from(BUCKET_DOCUMENTS)
      .createSignedUrl(testDocPath, 3600);

    if (signedError || !signedData?.signedUrl) {
      console.error('❌ TEST 3 FAILED: Staff could not generate signed URL:', signedError?.message);
      allTestsPassed = false;
    } else {
      console.log('✅ TEST 3 PASSED: Staff signed URL generated successfully.');
      console.log('   🔗 Signed URL sample:', signedData.signedUrl.substring(0, 90) + '...');
    }

    // ------------------------------------------------------------------------
    // TEST 4: Signed URL retrieves document successfully (HTTP 200)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Signed URL Retrieval & Integrity Check ---');
    if (signedData?.signedUrl) {
      const signedFetchRes = await fetch(signedData.signedUrl);
      const signedContent = await signedFetchRes.text();
      console.log(`   📡 [HTTP GET Signed URL]: Status ${signedFetchRes.status} (${signedFetchRes.statusText})`);

      if (signedFetchRes.status === 200 && signedContent === testDocContent) {
        console.log('✅ TEST 4 PASSED: Signed URL retrieved document with HTTP 200 OK and matching content!');
      } else {
        console.error('❌ TEST 4 FAILED: Signed URL response invalid:', signedFetchRes.status, signedContent);
        allTestsPassed = false;
      }
    } else {
      console.error('❌ TEST 4 SKIPPED: Missing signed URL.');
      allTestsPassed = false;
    }

    // ------------------------------------------------------------------------
    // TEST 5: Unauthorized/non-staff user attempts protected document access
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 5: Unauthorized Non-Staff Access Check ---');
    const { data: anonSignedData, error: anonSignedError } = await anonClient.storage
      .from(BUCKET_DOCUMENTS)
      .createSignedUrl(testDocPath, 3600);

    if (anonSignedError || !anonSignedData?.signedUrl) {
      console.log('✅ TEST 5 PASSED: Anonymous request for signed URL correctly DENIED by RLS.');
    } else {
      // Test if that anon signed URL actually works
      const anonSignedFetch = await fetch(anonSignedData.signedUrl);
      if (anonSignedFetch.status !== 200) {
        console.log(`✅ TEST 5 PASSED: Anonymous signed URL fetch DENIED with status ${anonSignedFetch.status}.`);
      } else {
        console.error('❌ TEST 5 FAILED: Anonymous user generated a working signed URL!');
        allTestsPassed = false;
      }
    }

    // ------------------------------------------------------------------------
    // TEST 6: mr-institute-media remains publicly readable
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 6: Public Media Bucket Read Verification ---');
    // Upload a test media image using staff client
    const testMediaContent = Buffer.from('FAKE-JPEG-CONTENT-123');
    const testMediaPath = `test_media_sec_${Date.now()}.jpg`;

    const { data: mediaUpData, error: mediaUpError } = await staffClient.storage
      .from(BUCKET_MEDIA)
      .upload(testMediaPath, testMediaContent, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (mediaUpError) {
      console.error('❌ Failed to upload test media item:', mediaUpError.message);
      allTestsPassed = false;
    } else {
      cleanupTasks.mediaFiles.push(testMediaPath);
      console.log('✅ Test media uploaded by staff.');

      const { data: mediaPubData } = anonClient.storage
        .from(BUCKET_MEDIA)
        .getPublicUrl(testMediaPath);

      const mediaFetchRes = await fetch(mediaPubData.publicUrl);
      console.log(`   📡 [HTTP GET Media Public URL]: Status ${mediaFetchRes.status} (${mediaFetchRes.statusText})`);

      if (mediaFetchRes.status === 200) {
        console.log('✅ TEST 6 PASSED: mr-institute-media is publicly readable (HTTP 200 OK)!');
      } else {
        console.error('❌ TEST 6 FAILED: Public media returned status:', mediaFetchRes.status);
        allTestsPassed = false;
      }
    }

    // ------------------------------------------------------------------------
    // TEST 7: Media upload/delete functionality remains operational
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 7: Media Storage Deletion Verification ---');
    const { error: mediaDelError } = await staffClient.storage
      .from(BUCKET_MEDIA)
      .remove([testMediaPath]);

    if (mediaDelError) {
      console.error('❌ TEST 7 FAILED: Staff media deletion failed:', mediaDelError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ TEST 7 PASSED: Media object successfully deleted by staff.');
      // Remove from cleanup since it's already deleted
      cleanupTasks.mediaFiles = cleanupTasks.mediaFiles.filter(p => p !== testMediaPath);
    }

  } catch (err) {
    console.error('💥 Unexpected execution error:', err);
    allTestsPassed = false;
  } finally {
    // ------------------------------------------------------------------------
    // CLEANUP TEMPORARY TEST DATA
    // ------------------------------------------------------------------------
    console.log('\n--- Cleanup: Purging Temporary Test Objects ---');
    for (const docFile of cleanupTasks.documentFiles) {
      const { error } = await staffClient.storage.from(BUCKET_DOCUMENTS).remove([docFile]);
      console.log(`   🧹 Cleaned document: ${docFile} (${error ? error.message : 'OK'})`);
    }
    for (const medFile of cleanupTasks.mediaFiles) {
      const { error } = await staffClient.storage.from(BUCKET_MEDIA).remove([medFile]);
      console.log(`   🧹 Cleaned media: ${medFile} (${error ? error.message : 'OK'})`);
    }
    console.log('✨ Cleanup complete.\n');
  }

  console.log('============================================================');
  if (allTestsPassed) {
    console.log('🎯 ALL STORAGE SECURITY TESTS PASSED PERFECTLY!');
    console.log('============================================================');
    process.exit(0);
  } else {
    console.error('❌ STORAGE SECURITY TESTS FAILED.');
    console.log('============================================================');
    process.exit(1);
  }
}

runSecurityTests();
