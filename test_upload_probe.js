import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  const testBuffer = Buffer.from('Test Document Content');
  const testDocName = `test_${Date.now()}.pdf`;
  const storagePath = `submissions/sub_123/${testDocName}`;

  console.log('Testing upload without upsert:');
  const res1 = await anonClient.storage
    .from('mr-institute-documents')
    .upload(storagePath, testBuffer, {
      contentType: 'application/pdf',
      upsert: false
    });

  console.log('Result (upsert: false):', res1.error ? `Error: ${res1.error.message}` : `Success: ${res1.data?.path}`);

  console.log('\nTesting upload with upsert: true:');
  const res2 = await anonClient.storage
    .from('mr-institute-documents')
    .upload(`submissions/sub_123/upsert_${testDocName}`, testBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  console.log('Result (upsert: true):', res2.error ? `Error: ${res2.error.message}` : `Success: ${res2.data?.path}`);
}

testUpload();
