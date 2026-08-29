import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectStorage() {
  console.log('=== INSPECTING SUPABASE STORAGE BUCKETS & POLICIES ===\n');

  // 1. List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('Error listing buckets with anon key:', bucketsError.message);
  } else {
    console.log('Buckets found (Anon):', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
  }

  // 2. Authenticate as Developer
  const devLogin = await supabase.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  if (devLogin.data?.session) {
    const { data: authBuckets, error: authBucketsError } = await supabase.storage.listBuckets();
    if (authBucketsError) {
      console.error('Error listing buckets as Developer:', authBucketsError.message);
    } else {
      console.log('Buckets found (Developer Auth):', authBuckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
    }
  }

  // 3. Test mr-institute-media bucket operations
  console.log('\n--- Checking Bucket: mr-institute-media ---');
  const { data: mediaFiles, error: mediaError } = await supabase.storage
    .from('mr-institute-media')
    .list();
  console.log('mr-institute-media list result:', mediaError ? `Error: ${mediaError.message}` : `Files count: ${mediaFiles?.length}`);

  // Test public URL generation
  const { data: mediaPubUrl } = supabase.storage
    .from('mr-institute-media')
    .getPublicUrl('test-sample.jpg');
  console.log('Sample public URL format:', mediaPubUrl.publicUrl);

  // 4. Test mr-institute-documents bucket operations
  console.log('\n--- Checking Bucket: mr-institute-documents ---');
  const { data: docFiles, error: docError } = await supabase.storage
    .from('mr-institute-documents')
    .list();
  console.log('mr-institute-documents list result:', docError ? `Error: ${docError.message}` : `Files count: ${docFiles?.length}`);

  const { data: docPubUrl } = supabase.storage
    .from('mr-institute-documents')
    .getPublicUrl('test-doc.pdf');
  console.log('Sample documents URL format:', docPubUrl.publicUrl);

  // Check anonymous upload permissions on mr-institute-documents (for public form submissions)
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const dummyBuffer = Buffer.from('Test Document Content');
  const testFileName = `test_probe_${Date.now()}.txt`;

  const { data: anonUpload, error: anonUploadError } = await anonClient.storage
    .from('mr-institute-documents')
    .upload(`submissions/${testFileName}`, dummyBuffer, { contentType: 'text/plain' });

  console.log('\n--- Checking Anonymous Upload on mr-institute-documents ---');
  if (anonUploadError) {
    console.log('🔒 Anonymous upload on mr-institute-documents:', anonUploadError.message);
  } else {
    console.log('✅ Anonymous upload permitted on mr-institute-documents (for form intake)!');
    // Clean up probe
    await supabase.storage.from('mr-institute-documents').remove([`submissions/${testFileName}`]);
  }

  // Check Developer upload on mr-institute-media
  const { data: devUpload, error: devUploadError } = await supabase.storage
    .from('mr-institute-media')
    .upload(`media/${testFileName}`, dummyBuffer, { contentType: 'text/plain' });

  console.log('\n--- Checking Developer Upload on mr-institute-media ---');
  if (devUploadError) {
    console.log('❌ Developer upload on mr-institute-media failed:', devUploadError.message);
  } else {
    console.log('✅ Developer upload on mr-institute-media: SUCCESS!');
    await supabase.storage.from('mr-institute-media').remove([`media/${testFileName}`]);
  }

  await supabase.auth.signOut();
}

inspectStorage();
