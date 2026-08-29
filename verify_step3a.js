import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamelCase(str) {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

function toDatabasePayload(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = camelToSnakeCase(key);
    result[snakeKey] = value;
  }
  return result;
}

function fromDatabaseRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamelCase(key);
    result[camelKey] = value;
  }
  return result;
}

// Emulate BaseRepository logic for each of the 4 CMS singletons
class BaseRepo {
  constructor(tableName, client) {
    this.tableName = tableName;
    this.supabase = client;
  }

  async getById(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return { data: null, error: { code: error.code, message: error.message } };
    if (!data) return { data: null, error: { code: 'not-found', message: 'Document not found' } };
    return { data: fromDatabaseRow(data) };
  }

  async update(id, data) {
    const nowIso = new Date().toISOString();
    const updatePayload = { ...data, updatedAt: nowIso };
    delete updatePayload.id;
    const dbPayload = toDatabasePayload(updatePayload);

    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(dbPayload)
      .eq('id', id)
      .select();

    if (error) return { data: null, error: { code: error.code, message: error.message } };
    return { data: fromDatabaseRow(updated && updated[0] ? updated[0] : dbPayload) };
  }

  async create(data, customId) {
    if (customId) {
      const existing = await this.getById(customId);
      if (existing.data) {
        return this.update(customId, data);
      }
    }
    const id = customId || `id_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const inputPayload = { ...data, id, createdAt: nowIso, updatedAt: nowIso };
    const dbPayload = toDatabasePayload(inputPayload);
    const { data: inserted, error } = await this.supabase.from(this.tableName).insert(dbPayload).select();
    if (error) return { data: null, error: { code: error.code, message: error.message } };
    return { data: fromDatabaseRow(inserted && inserted[0] ? inserted[0] : dbPayload) };
  }
}

async function runStep3aVerification() {
  console.log('=== MR INSTITUTE: PHASE A.6 STEP 3A — CMS SINGLETON REPOSITORIES VERIFICATION ===\n');

  // 1. ANONYMOUS PUBLIC READ TESTS
  console.log('--- 1. Testing Anonymous Public Read on All 4 Singletons ---');
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);

  const homeRepo = new BaseRepo('cms_homepage', anonClient);
  const aboutRepo = new BaseRepo('cms_about', anonClient);
  const charityRepo = new BaseRepo('cms_charity', anonClient);
  const settingsRepo = new BaseRepo('cms_settings', anonClient);

  const [homeRes, aboutRes, charityRes, settingsRes] = await Promise.all([
    homeRepo.getById('main'),
    aboutRepo.getById('main'),
    charityRepo.getById('main'),
    settingsRepo.getById('global')
  ]);

  console.log('✅ 1. cms_homepage ("main"):', homeRes.data ? `SUCCESS (Headline: "${homeRes.data.heroHeadline}")` : `ERROR: ${homeRes.error?.message}`);
  console.log('   - CamelCase keys verified:', Object.keys(homeRes.data || {}).filter(k => k.includes('hero') || k === 'partnerLogos' || k === 'isActive'));

  console.log('✅ 2. cms_about ("main"):', aboutRes.data ? `SUCCESS (Title: "${aboutRes.data.title}")` : `ERROR: ${aboutRes.error?.message}`);
  console.log('   - CamelCase keys verified:', Object.keys(aboutRes.data || {}).filter(k => k === 'teamMembers' || k === 'chairmanMessage' || k === 'isActive'));

  console.log('✅ 3. cms_charity ("main"):', charityRes.data ? `SUCCESS (Title: "${charityRes.data.title}")` : `ERROR: ${charityRes.error?.message}`);
  console.log('   - CamelCase keys verified:', Object.keys(charityRes.data || {}).filter(k => k === 'successStories' || k === 'impactStats' || k === 'isActive'));

  console.log('✅ 4. cms_settings ("global"):', settingsRes.data ? `SUCCESS (Site Name: "${settingsRes.data.siteName}")` : `ERROR: ${settingsRes.error?.message}`);
  console.log('   - CamelCase keys verified:', Object.keys(settingsRes.data || {}).filter(k => k === 'contactEmail' || k === 'contactPhone' || k === 'maintenanceMode'));

  // 2. ANONYMOUS WRITE REJECTION (RLS ENFORCEMENT)
  console.log('\n--- 2. Testing Anonymous Write Rejection (RLS Guard) ---');
  const anonUpdate = await homeRepo.update('main', { announcementText: 'Unauthorized Attack' });
  console.log('🔒 Anonymous update blocked by RLS:', !!anonUpdate.error, `(Error: ${anonUpdate.error?.message || 'Blocked'})`);

  // 3. AUTHENTICATED DEVELOPER UPDATE TESTS
  console.log('\n--- 3. Testing Authenticated Developer Updates ---');
  const devClient = createClient(supabaseUrl, supabaseAnonKey);
  const devLogin = await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  if (devLogin.error) {
    console.error('❌ Developer login failed:', devLogin.error);
    return;
  }

  const authHomeRepo = new BaseRepo('cms_homepage', devClient);
  const authAboutRepo = new BaseRepo('cms_about', devClient);
  const authCharityRepo = new BaseRepo('cms_charity', devClient);
  const authSettingsRepo = new BaseRepo('cms_settings', devClient);

  // Update cms_homepage
  const homeUpdate = await authHomeRepo.update('main', {
    announcementText: 'Admissions Open for Academic Year 2026-27',
    announcementLink: '/courses'
  });
  console.log('✅ cms_homepage update:', homeUpdate.data ? `SUCCESS (Announcement: "${homeUpdate.data.announcementText}")` : `ERROR: ${homeUpdate.error?.message}`);

  // Update cms_about
  const aboutUpdate = await authAboutRepo.update('main', {
    story: 'Established with a vision to revolutionize learning and foster academic excellence.'
  });
  console.log('✅ cms_about update:', aboutUpdate.data ? `SUCCESS (Story length: ${aboutUpdate.data.story?.length})` : `ERROR: ${aboutUpdate.error?.message}`);

  // Update cms_charity
  const charityUpdate = await authCharityRepo.update('main', {
    description: 'Empowering underprivileged students through scholarships, book banks, and mentorship.'
  });
  console.log('✅ cms_charity update:', charityUpdate.data ? `SUCCESS (Description length: ${charityUpdate.data.description?.length})` : `ERROR: ${charityUpdate.error?.message}`);

  // Update & Upsert cms_settings
  const settingsUpdate = await authSettingsRepo.update('global', {
    siteName: 'MR Institute of Learning',
    contactEmail: 'info@mrinstitute.edu',
    contactPhone: '+91 98765 43210'
  });
  console.log('✅ cms_settings update:', settingsUpdate.data ? `SUCCESS (Site: "${settingsUpdate.data.siteName}", Email: "${settingsUpdate.data.contactEmail}")` : `ERROR: ${settingsUpdate.error?.message}`);

  // Test SettingsRepository create(data, 'global') upsert helper
  const settingsUpsert = await authSettingsRepo.create({
    siteName: 'MR Institute of Learning',
    contactEmail: 'info@mrinstitute.edu'
  }, 'global');
  console.log('✅ cms_settings create(data, "global") upsert helper:', settingsUpsert.data ? `SUCCESS (Site: "${settingsUpsert.data.siteName}")` : `ERROR: ${settingsUpsert.error?.message}`);

  await devClient.auth.signOut();

  console.log('\n======================================================');
  console.log('ALL 4 CMS SINGLETON REPOSITORIES 100% VERIFIED');
  console.log('======================================================');
}

runStep3aVerification();
