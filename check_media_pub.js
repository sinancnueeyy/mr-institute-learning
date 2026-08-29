import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const devClient = createClient(supabaseUrl, supabaseAnonKey);

async function checkMediaPublic() {
  await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  const testBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
  const path = `media/test_pub_${Date.now()}.gif`;

  const { data, error } = await devClient.storage
    .from('mr-institute-media')
    .upload(path, testBuffer, { contentType: 'image/gif' });

  if (error) {
    console.log('Upload error:', error.message);
    return;
  }

  const { data: pubData } = devClient.storage.from('mr-institute-media').getPublicUrl(path);
  console.log('Media Public URL:', pubData.publicUrl);

  const res = await fetch(pubData.publicUrl);
  console.log('HTTP Status:', res.status, res.statusText);

  // Clean up
  await devClient.storage.from('mr-institute-media').remove([path]);
}

checkMediaPublic();
