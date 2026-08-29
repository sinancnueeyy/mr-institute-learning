import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

console.log('Connecting to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runVerification() {
  const results = {
    tables: {},
    seedData: {},
    storage: {},
    rlsCheck: {},
    overallSuccess: true,
    errors: []
  };

  const tablesToVerify = [
    'user_profiles',
    'activity_logs',
    'cms_homepage',
    'cms_about',
    'cms_courses',
    'cms_services',
    'cms_charity',
    'cms_gallery',
    'cms_forms',
    'cms_notices',
    'cms_media',
    'cms_settings',
    'cms_testimonials',
    'applications',
    'students',
    'enquiries',
    'scholarships',
    'charity_applications',
    'form_submissions',
    'follow_ups',
    'notifications'
  ];

  console.log('\n--- VERIFYING 21 DATABASE TABLES ---');
  for (const table of tablesToVerify) {
    try {
      const { data, error, status } = await supabase.from(table).select('*').limit(1);
      // If table exists, status is 200 (or empty array) or 401/403 (due to RLS blocking anon read, which is expected for operations/user tables!)
      if (error && error.code === '42P01') {
        // 42P01 = undefined_table (Table does not exist)
        results.tables[table] = { exists: false, error: error.message };
        results.overallSuccess = false;
        results.errors.push(`Table missing: ${table}`);
      } else {
        results.tables[table] = { exists: true, rlsActive: error ? error.message : 'Accessible (Public Read)' };
      }
    } catch (e) {
      results.tables[table] = { exists: false, error: e.message };
      results.overallSuccess = false;
    }
  }

  console.log('\n--- VERIFYING SEED DATA (PUBLIC ACCESSIBLE) ---');
  // 1. Homepage
  const { data: homeData, error: homeErr } = await supabase.from('cms_homepage').select('*').eq('id', 'main').single();
  results.seedData.cms_homepage = { exists: !!homeData, error: homeErr?.message, headline: homeData?.hero_headline };

  // 2. Settings
  const { data: settingsData, error: setErr } = await supabase.from('cms_settings').select('*').eq('id', 'global').single();
  results.seedData.cms_settings = { exists: !!settingsData, error: setErr?.message, siteName: settingsData?.site_name };

  // 3. About
  const { data: aboutData, error: aboutErr } = await supabase.from('cms_about').select('*').eq('id', 'main').single();
  results.seedData.cms_about = { exists: !!aboutData, error: aboutErr?.message, title: aboutData?.title };

  // 4. Charity
  const { data: charityData, error: charErr } = await supabase.from('cms_charity').select('*').eq('id', 'main').single();
  results.seedData.cms_charity = { exists: !!charityData, error: charErr?.message, title: charityData?.title };

  // 5. Courses (expecting 6)
  const { data: coursesData, error: courseErr } = await supabase.from('cms_courses').select('id, title, is_active');
  results.seedData.cms_courses = { count: coursesData?.length || 0, expected: 6, error: courseErr?.message };

  // 6. Testimonials (expecting 3)
  const { data: testData, error: testErr } = await supabase.from('cms_testimonials').select('id, student_name');
  results.seedData.cms_testimonials = { count: testData?.length || 0, expected: 3, error: testErr?.message };

  console.log('\n--- VERIFYING STORAGE BUCKETS ---');
  const { data: mediaFiles, error: mediaErr } = await supabase.storage.from('mr-institute-media').list();
  results.storage['mr-institute-media'] = { accessible: !mediaErr || mediaErr.message !== 'Bucket not found', error: mediaErr?.message };

  const { data: docFiles, error: docErr } = await supabase.storage.from('mr-institute-documents').list();
  results.storage['mr-institute-documents'] = { accessible: !docErr || docErr.message !== 'Bucket not found', error: docErr?.message };

  console.log('\n--- VERIFYING RLS SECURITY POLICIES ---');
  // Anon user should NOT be able to read applications, students, or user_profiles
  const { data: appData, error: appErr } = await supabase.from('applications').select('*');
  results.rlsCheck.applications = { blockedAsExpected: !appData || appData.length === 0, error: appErr?.message };

  const { data: studData, error: studErr } = await supabase.from('students').select('*');
  results.rlsCheck.students = { blockedAsExpected: !studData || studData.length === 0, error: studErr?.message };

  const { data: profData, error: profErr } = await supabase.from('user_profiles').select('*');
  results.rlsCheck.user_profiles = { blockedAsExpected: !profData || profData.length === 0, error: profErr?.message };

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('migration_verification_result.json', JSON.stringify(results, null, 2));
}

runVerification();
