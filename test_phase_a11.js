import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const TEST_TAG = `A11_TEST_${Date.now()}`;

console.log('====================================================');
console.log('PHASE A.11 AUTOMATED VERIFICATION HARNESS');
console.log('Testing: Testimonials CMS & Activity Logs Subsystems');
console.log('====================================================\n');

async function runTests() {
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // TEST 1: Public read on cms_testimonials
  console.log('--- TEST GROUP 1: Public Testimonials Read ---');
  const { data: publicTestimonials, error: pubErr } = await anonClient
    .from('cms_testimonials')
    .select('*')
    .eq('is_active', true);
  
  assert(!pubErr, 'Anonymous client can read active cms_testimonials table');
  assert(Array.isArray(publicTestimonials), `Active testimonials returned as array (Count: ${publicTestimonials?.length || 0})`);

  // TEST 2: Developer Authentication
  console.log('\n--- TEST GROUP 2: Developer Authentication ---');
  const devClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authData, error: authErr } = await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });
  assert(!authErr && authData.session, 'Developer successfully authenticated');

  // TEST 3: Testimonials CMS CRUD (Developer Role)
  console.log('\n--- TEST GROUP 3: Testimonials CMS CRUD Operations ---');
  const testTestimonial = {
    student_name: `Test Student ${TEST_TAG}`,
    course: 'Full Stack Web Development',
    rating: 5,
    review: 'Outstanding learning experience at MR Institute.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    is_featured: true,
    is_active: true,
    order_index: 999
  };

  // 3.1 CREATE
  const { data: createdTestimonial, error: createErr } = await devClient
    .from('cms_testimonials')
    .insert(testTestimonial)
    .select()
    .single();

  assert(!createErr && createdTestimonial?.id, `Testimonial created with ID: ${createdTestimonial?.id}`);

  // 3.2 READ
  let testimonialId = createdTestimonial?.id;
  const { data: fetchedTestimonial, error: readErr } = await devClient
    .from('cms_testimonials')
    .select('*')
    .eq('id', testimonialId)
    .single();

  assert(!readErr && fetchedTestimonial?.student_name === testTestimonial.student_name, 'Testimonial read matches created data');

  // 3.3 UPDATE
  const { data: updatedTestimonial, error: updateErr } = await devClient
    .from('cms_testimonials')
    .update({ review: 'Updated review content for A.11 verification.' })
    .eq('id', testimonialId)
    .select()
    .single();

  assert(!updateErr && updatedTestimonial?.review === 'Updated review content for A.11 verification.', 'Testimonial update persisted');

  // 3.4 DELETE
  const { error: deleteErr } = await devClient
    .from('cms_testimonials')
    .delete()
    .eq('id', testimonialId);

  assert(!deleteErr, 'Testimonial deleted successfully');

  // Verify deletion
  const { data: deletedCheck } = await devClient
    .from('cms_testimonials')
    .select('*')
    .eq('id', testimonialId);
  assert(deletedCheck?.length === 0, 'Confirmed testimonial record completely removed');

  // TEST 4: Activity Logs Audit Trail
  console.log('\n--- TEST GROUP 4: Activity Logs System ---');
  
  // 4.1 Anonymous cannot read activity_logs (RLS verification)
  const { data: anonLogs, error: anonLogErr } = await anonClient
    .from('activity_logs')
    .select('*');
  assert(anonLogs === null || anonLogs.length === 0, 'Anonymous client blocked from reading activity_logs via RLS');

  // 4.2 Developer can read activity_logs
  const { data: devLogs, error: devLogErr } = await devClient
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  assert(!devLogErr && Array.isArray(devLogs), `Developer can read activity_logs audit trail (Count: ${devLogs?.length || 0})`);

  // 4.3 Write an activity log
  const testLog = {
    user_id: authData?.user?.id,
    user_email: 'developer@mrinstitute.edu',
    role: 'DEVELOPER',
    module: 'CMS_TESTIMONIALS',
    action: 'CREATE',
    description: `Phase A.11 verification audit test ${TEST_TAG}`,
    ip_address: '127.0.0.1',
    device_info: 'Node.js Test Harness'
  };

  const { data: createdLog, error: logWriteErr } = await devClient
    .from('activity_logs')
    .insert(testLog)
    .select()
    .single();

  assert(!logWriteErr && createdLog?.id, `Activity log entry written with ID: ${createdLog?.id}`);

  // Clean up test log
  if (createdLog?.id) {
    await devClient.from('activity_logs').delete().eq('id', createdLog.id);
  }

  // Sign out developer
  await devClient.auth.signOut();

  console.log('\n====================================================');
  console.log(`A.11 TEST RESULTS: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log('====================================================\n');

  if (passedCount === totalCount) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test harness fatal error:', err);
  process.exit(1);
});
