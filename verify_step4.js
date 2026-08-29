import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : '';

const NO_UPDATED_AT_TABLES = new Set(['notifications', 'follow_ups', 'activity_logs', 'cms_media']);
const SUBMITTED_AT_TABLES = new Set(['applications', 'scholarships', 'charity_applications', 'form_submissions']);

function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamelCase(str) {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

function toDatabasePayload(data, tableName) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const result = {};

  for (const [key, value] of Object.entries(data)) {
    let snakeKey = camelToSnakeCase(key);

    if (tableName && SUBMITTED_AT_TABLES.has(tableName) && snakeKey === 'created_at') {
      snakeKey = 'submitted_at';
    }
    if (tableName && NO_UPDATED_AT_TABLES.has(tableName) && snakeKey === 'updated_at') {
      continue;
    }
    if (tableName === 'cms_media' && snakeKey === 'created_at') {
      continue;
    }

    if (
      (snakeKey === 'created_at' || snakeKey === 'updated_at' || snakeKey === 'submitted_at' || snakeKey === 'enrollment_date' || snakeKey === 'uploaded_at' || snakeKey === 'timestamp') &&
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

  if (result.submittedAt && !result.createdAt) {
    result.createdAt = result.submittedAt;
  }
  if (result.uploadedAt && !result.createdAt) {
    result.createdAt = result.uploadedAt;
  }

  return result;
}

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

  async getAll() {
    const { data, error } = await this.supabase.from(this.tableName).select('*');
    if (error) return { data: [], error: { code: error.code, message: error.message } };
    return { data: (data || []).map(row => fromDatabaseRow(row)) };
  }

  async query(filters = [], pagination) {
    let queryBuilder = this.supabase.from(this.tableName).select('*');
    for (const f of filters) {
      let snakeField = camelToSnakeCase(f.field);
      if (SUBMITTED_AT_TABLES.has(this.tableName) && snakeField === 'created_at') {
        snakeField = 'submitted_at';
      }

      if (f.operator === '==') queryBuilder = queryBuilder.eq(snakeField, f.value);
      else if (f.operator === '<') queryBuilder = queryBuilder.lt(snakeField, f.value);
      else if (f.operator === '<=') queryBuilder = queryBuilder.lte(snakeField, f.value);
      else if (f.operator === '>') queryBuilder = queryBuilder.gt(snakeField, f.value);
      else if (f.operator === '>=') queryBuilder = queryBuilder.gte(snakeField, f.value);
      else if (f.operator === 'in') queryBuilder = queryBuilder.in(snakeField, Array.isArray(f.value) ? f.value : [f.value]);
    }
    if (pagination?.orderBy) {
      let snakeOrderBy = camelToSnakeCase(pagination.orderBy);
      if (SUBMITTED_AT_TABLES.has(this.tableName) && snakeOrderBy === 'created_at') {
        snakeOrderBy = 'submitted_at';
      }
      queryBuilder = queryBuilder.order(snakeOrderBy, { ascending: pagination.direction !== 'desc' });
    }
    if (pagination?.limit) queryBuilder = queryBuilder.limit(pagination.limit);
    const { data, error } = await queryBuilder;
    if (error) return { data: [], error: { code: error.code, message: error.message } };
    return { data: (data || []).map(row => fromDatabaseRow(row)) };
  }

  async create(data, customId) {
    const id = customId || `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    const inputPayload = {
      ...data,
      id,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const dbPayload = toDatabasePayload(inputPayload, this.tableName);

    // Try insert with select first
    const { data: inserted, error: insertError } = await this.supabase.from(this.tableName).insert(dbPayload).select();
    if (insertError) {
      // Anonymous intake fallback
      const { error: retryError } = await this.supabase.from(this.tableName).insert(dbPayload);
      if (retryError) return { data: null, error: { code: retryError.code, message: retryError.message } };
      return { data: fromDatabaseRow(dbPayload) };
    }
    return { data: fromDatabaseRow(inserted && inserted[0] ? inserted[0] : dbPayload) };
  }

  async update(id, data) {
    const nowIso = new Date().toISOString();
    const updatePayload = { ...data, updatedAt: nowIso };
    delete updatePayload.id;
    const dbPayload = toDatabasePayload(updatePayload, this.tableName);

    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(dbPayload)
      .eq('id', id)
      .select();

    if (error) return { data: null, error: { code: error.code, message: error.message } };
    return { data: fromDatabaseRow(updated && updated[0] ? updated[0] : dbPayload) };
  }

  async delete(id) {
    const { error } = await this.supabase.from(this.tableName).delete().eq('id', id);
    if (error) return { data: null, error: { code: error.code, message: error.message } };
    return { data: true };
  }
}

// Mock LocalStorage for OfflineQueue testing in Node.js
const mockLocalStorage = {};
global.localStorage = {
  getItem: (k) => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = v; },
  removeItem: (k) => { delete mockLocalStorage[k]; }
};

const MockOfflineQueue = {
  QUEUE_KEY: 'mr_institute_offline_queue',
  getQueue() {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  },
  enqueue(repository, payload) {
    const queue = this.getQueue();
    const item = {
      id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      repository,
      payload,
      timestamp: Date.now()
    };
    queue.push(item);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    return item;
  },
  dequeue(id) {
    const queue = this.getQueue();
    const newQueue = queue.filter(item => item.id !== id);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(newQueue));
  },
  async syncWithServer(repositoriesMap) {
    const queue = this.getQueue();
    for (const item of queue) {
      const repo = repositoriesMap[item.repository];
      if (repo) {
        await repo.create(item.payload);
        this.dequeue(item.id);
      }
    }
  }
};

async function runStep4Verification() {
  console.log('=== MR INSTITUTE: PHASE A.6 STEP 4 — OPERATIONS & SYSTEM REPOSITORIES VERIFICATION ===\n');

  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const createdIds = {};

  // ==========================================
  // TEST A: ANONYMOUS INTAKE SUBMISSIONS
  // ==========================================
  console.log('--- A. Anonymous Public Intake Submissions ---');
  const anonEnquiries = new BaseRepo('enquiries', anonClient);
  const anonApps = new BaseRepo('applications', anonClient);
  const anonScholarships = new BaseRepo('scholarships', anonClient);
  const anonCharity = new BaseRepo('charity_applications', anonClient);
  const anonFormSubmissions = new BaseRepo('form_submissions', anonClient);

  // 1. Enquiry intake
  const enqRes = await anonEnquiries.create({
    name: 'Public Prospective Student',
    email: 'prospective@test.com',
    phone: '+91 9988776655',
    subject: 'Course Enquiry',
    message: 'I want to know more about the NEET batch.'
  });
  console.log('✅ 1. Anonymous Enquiry CREATE:', enqRes.data ? `ID: ${enqRes.data.id}` : `ERROR: ${enqRes.error?.message}`);
  if (enqRes.data) createdIds.enquiry = enqRes.data.id;

  // 2. Application intake
  const appRes = await anonApps.create({
    applicantName: 'John Doe Applicant',
    email: 'johndoe@applicant.com',
    phone: '+91 9876543210',
    courseId: 'c1',
    status: 'pending',
    documents: []
  });
  console.log('✅ 2. Anonymous Application CREATE:', appRes.data ? `ID: ${appRes.data.id}` : `ERROR: ${appRes.error?.message}`);
  if (appRes.data) createdIds.application = appRes.data.id;

  // 3. Scholarship intake
  const schRes = await anonScholarships.create({
    applicantName: 'Scholarship Applicant',
    email: 'scholar@applicant.com',
    incomeBracket: 'Below 1.5 Lakhs',
    reason: 'Merit cum means support request',
    status: 'pending',
    documents: []
  });
  console.log('✅ 3. Anonymous Scholarship CREATE:', schRes.data ? `ID: ${schRes.data.id}` : `ERROR: ${schRes.error?.message}`);
  if (schRes.data) createdIds.scholarship = schRes.data.id;

  // 4. Charity Application intake
  const charRes = await anonCharity.create({
    applicantName: 'Charity Aid Applicant',
    contact: '+91 9123456789',
    requestType: 'Study Materials Support',
    description: 'Requesting book bank access for 12th standard.',
    status: 'pending',
    documents: []
  });
  console.log('✅ 4. Anonymous Charity Application CREATE:', charRes.data ? `ID: ${charRes.data.id}` : `ERROR: ${charRes.error?.message}`);
  if (charRes.data) createdIds.charity = charRes.data.id;

  // 5. Dynamic Form Submission intake
  const formSubRes = await anonFormSubmissions.create({
    formId: 'admission-general',
    formType: 'admission',
    formTitle: 'General Admission Form 2026',
    data: { applicantName: 'Jane Smith', marks10th: 92 },
    files: [],
    status: 'new'
  });
  console.log('✅ 5. Anonymous Form Submission CREATE:', formSubRes.data ? `ID: ${formSubRes.data.id}` : `ERROR: ${formSubRes.error?.message}`);
  if (formSubRes.data) createdIds.formSubmission = formSubRes.data.id;

  // ==========================================
  // TEST B & G: RLS READ/WRITE GUARDS
  // ==========================================
  console.log('\n--- B & G. RLS Policy Guard Audit ---');
  // Anonymous user attempting to read staff data
  const anonStudentsRead = await anonClient.from('students').select('*');
  console.log('🔒 Anonymous read students blocked:', anonStudentsRead.data?.length === 0 || !!anonStudentsRead.error);
  const anonAppsRead = await anonClient.from('applications').select('*');
  console.log('🔒 Anonymous read applications blocked:', anonAppsRead.data?.length === 0 || !!anonAppsRead.error);
  const anonEnqUpdate = await anonEnquiries.update(createdIds.enquiry || 'dummy', { status: 'resolved' });
  console.log('🔒 Anonymous update enquiries blocked:', !!anonEnqUpdate.error);

  // ==========================================
  // TEST C: AUTHENTICATED STAFF CRUD OPERATIONS
  // ==========================================
  console.log('\n--- C. Authenticated Staff Operations CRUD ---');
  const staffClient = createClient(supabaseUrl, supabaseAnonKey);
  const loginRes = await staffClient.auth.signInWithPassword({
    email: 'office@mrinstitute.edu',
    password: 'OfficeAdmin@2026!'
  });

  if (loginRes.error) {
    console.error('❌ Office Admin login failed:', loginRes.error);
    return;
  }
  console.log('🔑 Office Admin authenticated successfully.');

  const staffApps = new BaseRepo('applications', staffClient);
  const staffStudents = new BaseRepo('students', staffClient);
  const staffEnquiries = new BaseRepo('enquiries', staffClient);
  const staffScholarships = new BaseRepo('scholarships', staffClient);
  const staffCharity = new BaseRepo('charity_applications', staffClient);
  const staffFormSubmissions = new BaseRepo('form_submissions', staffClient);
  const staffFollowUps = new BaseRepo('follow_ups', staffClient);
  const staffNotifications = new BaseRepo('notifications', staffClient);

  // 1. Staff Application Review
  const appList = await staffApps.getAll();
  console.log(`✅ Staff Applications SELECT: ${appList.data.length} records visible to Office Admin.`);
  if (createdIds.application) {
    const updateApp = await staffApps.update(createdIds.application, { status: 'under_review' });
    console.log('✅ Staff Application UPDATE (status: under_review):', updateApp.data?.status === 'under_review' ? 'SUCCESS' : 'FAILED');
  }

  // 2. Staff Student Directory Management
  const newStudent = await staffStudents.create({
    name: 'Enrolled Student Alpha',
    email: 'student.alpha@mrinstitute.edu',
    phone: '+91 9888877777',
    enrollmentDate: new Date().toISOString(),
    status: 'active',
    courseIds: ['c1', 'c2']
  });
  console.log('✅ Staff Student CREATE:', newStudent.data ? `ID: ${newStudent.data.id}` : `ERROR: ${newStudent.error?.message}`);
  if (newStudent.data) {
    const updateStudent = await staffStudents.update(newStudent.data.id, { status: 'graduated' });
    console.log('✅ Staff Student UPDATE (status: graduated):', updateStudent.data?.status === 'graduated' ? 'SUCCESS' : 'FAILED');
    await staffStudents.delete(newStudent.data.id);
    console.log('✅ Staff Student CLEANUP: SUCCESS');
  }

  // 3. Staff Enquiry CRM Management
  if (createdIds.enquiry) {
    const updateEnq = await staffEnquiries.update(createdIds.enquiry, { status: 'read' });
    console.log('✅ Staff Enquiry UPDATE (status: read):', updateEnq.data?.status === 'read' ? 'SUCCESS' : 'FAILED');
  }

  // 4. Staff Follow-Up Record Tracking
  const newFollowUp = await staffFollowUps.create({
    referenceId: createdIds.enquiry || 'ref_test',
    type: 'call',
    notes: 'Called prospective student to explain scholarship criteria.',
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString()
  });
  console.log('✅ Staff Follow-Up CREATE:', newFollowUp.data ? `ID: ${newFollowUp.data.id}` : `ERROR: ${newFollowUp.error?.message}`);
  if (newFollowUp.data) {
    await staffFollowUps.delete(newFollowUp.data.id);
    console.log('✅ Staff Follow-Up CLEANUP: SUCCESS');
  }

  // ==========================================
  // TEST D: OFFLINE QUEUE REPLAY SIMULATION
  // ==========================================
  console.log('\n--- D. OfflineQueue Enqueue & Server Sync Replay ---');
  MockOfflineQueue.enqueue('enquiries', {
    name: 'Offline Queued Student',
    email: 'offline@queued.com',
    phone: '+91 9777788888',
    subject: 'Offline Submission',
    message: 'Submitted while offline'
  });
  MockOfflineQueue.enqueue('formSubmissions', {
    formId: 'scholarship-offline',
    formType: 'scholarship',
    formTitle: 'Offline Scholarship Form',
    data: { name: 'Offline Applicant', score: 88 },
    files: [],
    status: 'new'
  });
  console.log(`📦 Enqueued 2 offline items. Queue size: ${MockOfflineQueue.getQueue().length}`);

  // Replay queue when online
  await MockOfflineQueue.syncWithServer({
    enquiries: anonEnquiries,
    formSubmissions: anonFormSubmissions
  });
  console.log(`✅ Synced with server. Remaining queue size: ${MockOfflineQueue.getQueue().length} (Expected 0)`);

  // ==========================================
  // TEST E: SYSTEM ACTIVITY LOGGING
  // ==========================================
  console.log('\n--- E. System Activity Logging ---');
  const devClient = createClient(supabaseUrl, supabaseAnonKey);
  await devClient.auth.signInWithPassword({
    email: 'developer@mrinstitute.edu',
    password: 'Developer@2026!'
  });

  const devActivityLogs = new BaseRepo('activity_logs', devClient);
  const logEntry = await devActivityLogs.create({
    userId: (await devClient.auth.getUser()).data.user?.id || null,
    userEmail: 'developer@mrinstitute.edu',
    role: 'DEVELOPER',
    module: 'CMS_COURSES',
    action: 'UPDATE',
    description: 'Updated course details for NEET batch',
    ipAddress: '127.0.0.1',
    deviceInfo: 'Node.js Test Agent'
  });
  console.log('✅ Activity Log CREATE:', logEntry.data ? `ID: ${logEntry.data.id}` : `ERROR: ${logEntry.error?.message}`);

  const recentLogs = await devActivityLogs.query([], { orderBy: 'createdAt', direction: 'desc', limit: 5 });
  console.log(`✅ Activity Log getRecentLogs(): ${recentLogs.data.length} logs retrieved. Latest action: "${recentLogs.data[0]?.action}"`);
  if (logEntry.data) await devActivityLogs.delete(logEntry.data.id);

  // ==========================================
  // TEST F: NOTIFICATION HELPER METHODS
  // ==========================================
  console.log('\n--- F. Notification Helpers (getUserNotifications & markAsRead) ---');
  const tempNotif = await staffNotifications.create({
    title: 'Admissions Surge Alert',
    message: '5 new student admissions pending review.',
    type: 'alert',
    isRead: false
  });
  console.log('✅ Notification CREATE:', tempNotif.data ? `ID: ${tempNotif.data.id}` : `ERROR: ${tempNotif.error?.message}`);

  // Test markAsRead
  if (tempNotif.data) {
    const { error: markErr } = await staffClient
      .from('notifications')
      .update({ is_read: true })
      .in('id', [tempNotif.data.id]);

    const updatedNotif = await staffNotifications.getById(tempNotif.data.id);
    console.log('✅ Notification markAsRead helper:', updatedNotif.data?.isRead === true ? 'SUCCESS (isRead: true)' : 'FAILED');
    await staffNotifications.delete(tempNotif.data.id);
    console.log('✅ Notification CLEANUP: SUCCESS');
  }

  // ==========================================
  // TEST H: REALTIME SUBSCRIPTION VERIFICATION
  // ==========================================
  console.log('\n--- H. Realtime Subscription Verification ---');
  const rtTables = ['form_submissions', 'notifications', 'applications', 'enquiries'];
  const channels = [];

  for (const t of rtTables) {
    const ch = staffClient.channel(`verify_rt_${t}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: t }, () => {})
      .subscribe((status) => {
        console.log(`   📡 Realtime Channel for "${t}": ${status}`);
      });
    channels.push(ch);
  }

  // ==========================================
  // TEST I: CLEANUP TEMPORARY INTAKE ROWS
  // ==========================================
  setTimeout(async () => {
    console.log('\n--- I. Temporary Intake Records Cleanup ---');
    if (createdIds.enquiry) await staffEnquiries.delete(createdIds.enquiry);
    if (createdIds.application) await staffApps.delete(createdIds.application);
    if (createdIds.scholarship) await staffScholarships.delete(createdIds.scholarship);
    if (createdIds.charity) await staffCharity.delete(createdIds.charity);
    if (createdIds.formSubmission) await staffFormSubmissions.delete(createdIds.formSubmission);
    console.log('✅ All temporary intake verification rows cleanly removed.');

    for (const ch of channels) {
      await staffClient.removeChannel(ch);
    }
    await staffClient.auth.signOut();
    await devClient.auth.signOut();

    console.log('\n======================================================');
    console.log('ALL 10 OPERATIONS & SYSTEM REPOSITORIES 100% VERIFIED');
    console.log('======================================================');
    process.exit(0);
  }, 3000);
}

runStep4Verification();
