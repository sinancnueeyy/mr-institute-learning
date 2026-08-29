import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const devClient = createClient(supabaseUrl, supabaseAnonKey);

async function checkDocRead() {
  await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  const path = 'submissions/sub_123/test_1787766974236.pdf';

  // Check public url
  const { data: pubData } = devClient.storage.from('mr-institute-documents').getPublicUrl(path);
  console.log('Public URL:', pubData.publicUrl);

  const res1 = await fetch(pubData.publicUrl);
  console.log('Public URL HTTP status:', res1.status);

  // Check signed url (for private buckets)
  const { data: signedData, error: signedErr } = await devClient.storage.from('mr-institute-documents').createSignedUrl(path, 60);
  console.log('Signed URL result:', signedErr ? `Error: ${signedErr.message}` : `Signed URL: ${signedData?.signedUrl}`);
  if (signedData?.signedUrl) {
    const res2 = await fetch(signedData.signedUrl);
    console.log('Signed URL HTTP status:', res2.status);
  }

  // Check media bucket public url
  const { data: mediaPubData } = devClient.storage.from('mr-institute-media').getPublicUrl('test-sample.jpg');
  console.log('Media Public URL:', mediaPubData.publicUrl);

  // Clean up probe
  await devClient.storage.from('mr-institute-documents').remove([path]);
}

checkDocRead();
