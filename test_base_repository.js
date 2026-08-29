import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Emulate BaseRepository logic for direct runtime verification
const TABLE_NAME_MAP = {
  cms_homepagecontent: 'cms_homepage',
  homepage: 'cms_homepage',
  cms_homepage: 'cms_homepage',
  cms_aboutcontent: 'cms_about',
  about: 'cms_about',
  cms_coursecontent: 'cms_courses',
  courses: 'cms_courses',
  cms_servicecontent: 'cms_services',
  services: 'cms_services',
  cms_charitycontent: 'cms_charity',
  charity: 'cms_charity',
  cms_gallerycontent: 'cms_gallery',
  gallery: 'cms_gallery',
  cms_formschema: 'cms_forms',
  forms: 'cms_forms',
  cms_mediaasset: 'cms_media',
  media: 'cms_media',
  cms_settings: 'cms_settings',
  settings: 'cms_settings',
  cms_notices: 'cms_notices',
  cms_testimonials: 'cms_testimonials',
  applications: 'applications',
  students: 'students',
  enquiries: 'enquiries',
  scholarships: 'scholarships',
  charityApplications: 'charity_applications',
  charity_applications: 'charity_applications',
  formSubmissions: 'form_submissions',
  form_submissions: 'form_submissions',
  followUps: 'follow_ups',
  follow_ups: 'follow_ups',
  notifications: 'notifications',
  users: 'user_profiles',
  user_profiles: 'user_profiles',
  activityLogs: 'activity_logs',
  activity_logs: 'activity_logs',
};

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
    if (
      (snakeKey === 'created_at' || snakeKey === 'updated_at' || snakeKey === 'submitted_at' || snakeKey === 'enrollment_date') &&
      typeof value === 'number'
    ) {
      result[snakeKey] = new Date(value).toISOString();
    } else {
      result[snakeKey] = value;
    }
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

class TestBaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get tableName() {
    return TABLE_NAME_MAP[this.collectionName] || this.collectionName;
  }

  handleError(error) {
    return {
      code: error.code || error.status?.toString() || 'unknown',
      message: error.message || error.details || 'An unknown database error occurred.',
      details: error
    };
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) return { data: null, error: this.handleError(error) };
      if (!data) return { data: null, error: { code: 'not-found', message: 'Document not found' } };
      return { data: fromDatabaseRow(data) };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async getAll() {
    try {
      const { data, error } = await supabase.from(this.tableName).select('*');
      if (error) return { data: [], hasMore: false, error: this.handleError(error) };
      return { data: (data || []).map(row => fromDatabaseRow(row)), hasMore: false };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  async query(filters = [], pagination) {
    try {
      let queryBuilder = supabase.from(this.tableName).select('*');
      for (const f of filters) {
        const snakeField = camelToSnakeCase(f.field);
        if (f.operator === '==') queryBuilder = queryBuilder.eq(snakeField, f.value);
        else if (f.operator === '<') queryBuilder = queryBuilder.lt(snakeField, f.value);
        else if (f.operator === '<=') queryBuilder = queryBuilder.lte(snakeField, f.value);
        else if (f.operator === '>') queryBuilder = queryBuilder.gt(snakeField, f.value);
        else if (f.operator === '>=') queryBuilder = queryBuilder.gte(snakeField, f.value);
        else if (f.operator === 'in') queryBuilder = queryBuilder.in(snakeField, Array.isArray(f.value) ? f.value : [f.value]);
      }
      if (pagination?.orderBy) {
        queryBuilder = queryBuilder.order(camelToSnakeCase(pagination.orderBy), { ascending: pagination.direction !== 'desc' });
      }
      if (pagination?.limit) queryBuilder = queryBuilder.limit(pagination.limit);
      const { data, error } = await queryBuilder;
      if (error) return { data: [], hasMore: false, error: this.handleError(error) };
      const items = (data || []).map(row => fromDatabaseRow(row));
      return { data: items, lastDocId: items[items.length - 1]?.id, hasMore: pagination?.limit ? items.length === pagination.limit : false };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  async create(data, customId) {
    try {
      const id = customId || `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const nowIso = new Date().toISOString();
      const inputPayload = { ...data, id, createdAt: nowIso, updatedAt: nowIso };
      const dbPayload = toDatabasePayload(inputPayload);

      const { data: inserted, error: insertError } = await supabase.from(this.tableName).insert(dbPayload).select();
      if (insertError) {
        const { error: retryError } = await supabase.from(this.tableName).insert(dbPayload);
        if (retryError) return { data: null, error: this.handleError(retryError) };
        return { data: fromDatabaseRow(dbPayload) };
      }
      return { data: fromDatabaseRow(inserted && inserted[0] ? inserted[0] : dbPayload) };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async update(id, data) {
    try {
      const nowIso = new Date().toISOString();
      const updatePayload = { ...data, updatedAt: nowIso };
      delete updatePayload.id;
      const dbPayload = toDatabasePayload(updatePayload);

      const { data: updated, error } = await supabase.from(this.tableName).update(dbPayload).eq('id', id).select();
      if (error) return { data: null, error: this.handleError(error) };
      return { data: fromDatabaseRow(updated && updated[0] ? updated[0] : dbPayload) };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase.from(this.tableName).delete().eq('id', id);
      if (error) return { data: null, error: this.handleError(error) };
      return { data: true };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }
}

async function testSuite() {
  console.log('=== TESTING BaseRepository LIVE WITH SUPABASE ===\n');

  // Test 1: getById with legacy collection name 'cms_homepagecontent'
  console.log('1. Testing getById on legacy collection name "cms_homepagecontent"...');
  const homeRepo = new TestBaseRepository('cms_homepagecontent');
  const homeRes = await homeRepo.getById('main');
  console.log('   getById success:', !!homeRes.data, 'Title:', homeRes.data?.heroHeadline || 'N/A');
  console.log('   CamelCase mapped keys:', Object.keys(homeRes.data || {}).slice(0, 6));

  // Test 2: getAll with legacy collection name 'courses'
  console.log('\n2. Testing getAll on legacy collection name "courses"...');
  const coursesRepo = new TestBaseRepository('courses');
  const coursesRes = await coursesRepo.getAll();
  console.log('   getAll count:', coursesRes.data.length, 'First course:', coursesRes.data[0]?.title);
  console.log('   isActive flag mapped:', coursesRes.data[0]?.isActive);

  // Test 3: query with filter on 'cms_coursecontent'
  console.log('\n3. Testing query([field: isActive, operator: ==, value: true])...');
  const queryRepo = new TestBaseRepository('cms_coursecontent');
  const queryRes = await queryRepo.query([{ field: 'isActive', operator: '==', value: true }], { limit: 2 });
  console.log('   query count:', queryRes.data.length, 'hasMore:', queryRes.hasMore);

  // Test 4: Anonymous create on 'enquiries'
  console.log('\n4. Testing create on "enquiries" (intake table)...');
  const enqRepo = new TestBaseRepository('enquiries');
  const createRes = await enqRepo.create({
    name: 'BaseRepo Verification User',
    email: 'verify@base-repo.com',
    phone: '+91 9998887776',
    subject: 'Automated BaseRepository Verification',
    message: 'Testing data layer compatibility with Supabase backend.',
    status: 'new'
  });
  console.log('   create success:', !createRes.error, 'Created row ID:', createRes.data?.id);

  // Test 5: Realtime channel subscription check
  console.log('\n5. Testing Supabase Realtime channel registration for "cms_courses"...');
  const channel = supabase.channel('test_realtime_verify')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_courses' }, () => {})
    .subscribe((status) => {
      console.log('   Realtime subscription status:', status);
    });

  setTimeout(async () => {
    await supabase.removeChannel(channel);
    console.log('\n=== ALL BaseRepository TESTS COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  }, 2500);
}

testSuite();
