import { supabase } from '../supabase/client';
import type { 
  PaginationParams, 
  QueryFilter, 
  RepositoryResponse, 
  RepositoryListResponse, 
  AppError 
} from '../types';

/**
 * Mapping table from collection identifiers to canonical Supabase PostgreSQL tables.
 */
const TABLE_NAME_MAP: Record<string, string> = {
  // CMS Collections
  cms_homepagecontent: 'cms_homepage',
  homepage: 'cms_homepage',
  cms_homepage: 'cms_homepage',

  cms_aboutcontent: 'cms_about',
  about: 'cms_about',
  cms_about: 'cms_about',

  cms_coursecontent: 'cms_courses',
  courses: 'cms_courses',
  cms_courses: 'cms_courses',

  cms_servicecontent: 'cms_services',
  services: 'cms_services',
  cms_services: 'cms_services',

  cms_charitycontent: 'cms_charity',
  charity: 'cms_charity',
  cms_charity: 'cms_charity',

  cms_gallerycontent: 'cms_gallery',
  gallery: 'cms_gallery',
  cms_gallery: 'cms_gallery',

  cms_formschema: 'cms_forms',
  forms: 'cms_forms',
  cms_forms: 'cms_forms',

  cms_mediaasset: 'cms_media',
  media: 'cms_media',
  cms_media: 'cms_media',

  cms_settings: 'cms_settings',
  settings: 'cms_settings',

  cms_notices: 'cms_notices',
  notices: 'cms_notices',

  cms_testimonials: 'cms_testimonials',
  testimonials: 'cms_testimonials',

  // Operations Collections
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

  // System & Auth Collections
  users: 'user_profiles',
  user_profiles: 'user_profiles',

  activityLogs: 'activity_logs',
  activity_logs: 'activity_logs',
};

const NO_UPDATED_AT_TABLES = new Set(['notifications', 'follow_ups', 'activity_logs', 'cms_media']);
const SUBMITTED_AT_TABLES = new Set(['applications', 'scholarships', 'charity_applications', 'form_submissions']);

/**
 * Helper to convert camelCase keys to snake_case for top-level PostgreSQL column names.
 */
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Helper to convert snake_case column names to camelCase for TypeScript interface compatibility.
 */
function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Normalizes top-level keys of an outbound payload from camelCase to snake_case for PostgreSQL.
 * Preserves nested JSONB structures (e.g. form schemas, seo, custom objects) intact.
 */
function toDatabasePayload(data: Record<string, any>, tableName?: string): Record<string, any> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    let snakeKey = camelToSnakeCase(key);

    // Map created_at to submitted_at for intake tables without created_at column
    if (tableName && SUBMITTED_AT_TABLES.has(tableName) && snakeKey === 'created_at') {
      snakeKey = 'submitted_at';
    }

    // Skip updated_at for tables without updated_at column
    if (tableName && NO_UPDATED_AT_TABLES.has(tableName) && snakeKey === 'updated_at') {
      continue;
    }

    // Skip created_at for cms_media (uses uploaded_at)
    if (tableName === 'cms_media' && snakeKey === 'created_at') {
      continue;
    }

    // Normalize date timestamps if passed as numbers to ISO strings
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

/**
 * Normalizes top-level keys of an inbound PostgreSQL row to camelCase for frontend interfaces.
 */
function fromDatabaseRow<T>(row: Record<string, any>): T {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row as T;
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamelCase(key);
    result[camelKey] = value;
  }

  // Alias submittedAt to createdAt for backward-compatibility if missing
  if ((result as any).submittedAt && !(result as any).createdAt) {
    (result as any).createdAt = (result as any).submittedAt;
  }
  // Alias uploadedAt to createdAt for cms_media
  if ((result as any).uploadedAt && !(result as any).createdAt) {
    (result as any).createdAt = (result as any).uploadedAt;
  }
  // Alias createdAt to timestamp for activity_logs
  if ((result as any).createdAt && !(result as any).timestamp) {
    (result as any).timestamp = (result as any).createdAt;
  }

  return result as T;
}

/**
 * BaseRepository handles all Supabase CRUD operations, filtering, ordering, pagination,
 * and realtime subscriptions with automatic case transformation for seamless UI compatibility.
 */
export class BaseRepository<T extends { id?: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Resolves the canonical PostgreSQL table name for the given repository.
   */
  protected get tableName(): string {
    return TABLE_NAME_MAP[this.collectionName] || this.collectionName;
  }

  /**
   * Translates error responses to the standard AppError format.
   */
  protected handleError(error: any): AppError {
    console.error(`[Repository Error - ${this.tableName}]:`, error);
    return {
      code: error.code || error.status?.toString() || 'unknown',
      message: error.message || error.details || 'An unknown database error occurred.',
      details: error
    };
  }

  /**
   * Fetch a single document by ID.
   */
  async getById(id: string): Promise<RepositoryResponse<T>> {
    if (!id) {
      return { data: null, error: { code: 'invalid-argument', message: 'Document ID is required' } };
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      if (!data) {
        return { data: null, error: { code: 'not-found', message: 'Document not found' } };
      }

      return { data: fromDatabaseRow<T>(data) };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Create a new document in the table.
   * Handles both authenticated staff inserts and anonymous intake form submissions seamlessly.
   */
  async create(data: Omit<T, 'id'>, customId?: string): Promise<RepositoryResponse<T>> {
    try {
      const id = customId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
      const nowIso = new Date().toISOString();

      const inputPayload: Record<string, any> = {
        ...data,
        id,
        createdAt: (data as any).createdAt 
          ? (typeof (data as any).createdAt === 'number' ? new Date((data as any).createdAt).toISOString() : (data as any).createdAt) 
          : nowIso,
        updatedAt: nowIso,
      };

      const dbPayload = toDatabasePayload(inputPayload, this.tableName);

      // Attempt insert with select() first (standard for authenticated queries)
      const { data: insertedRows, error: insertError } = await supabase
        .from(this.tableName)
        .insert(dbPayload)
        .select();

      if (insertError) {
        // Fallback for intake tables where RLS permits INSERT but restricts SELECT for anonymous users
        const { error: retryError } = await supabase
          .from(this.tableName)
          .insert(dbPayload);

        if (retryError) {
          return { data: null, error: this.handleError(retryError) };
        }

        return { data: fromDatabaseRow<T>(dbPayload) };
      }

      if (insertedRows && insertedRows.length > 0) {
        return { data: fromDatabaseRow<T>(insertedRows[0]) };
      }

      return { data: fromDatabaseRow<T>(dbPayload) };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Update an existing document by ID.
   */
  async update(id: string, data: Partial<T>): Promise<RepositoryResponse<T>> {
    if (!id) {
      return { data: null, error: { code: 'invalid-argument', message: 'Document ID is required for update' } };
    }

    try {
      const nowIso = new Date().toISOString();
      const updatePayload: Record<string, any> = {
        ...data,
        updatedAt: nowIso,
      };

      // Do not attempt to update the primary key id
      delete updatePayload.id;

      const dbPayload = toDatabasePayload(updatePayload, this.tableName);

      const { data: updatedRows, error } = await supabase
        .from(this.tableName)
        .update(dbPayload)
        .eq('id', id)
        .select();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      if (updatedRows && updatedRows.length > 0) {
        return { data: fromDatabaseRow<T>(updatedRows[0]) };
      }

      return this.getById(id);
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Delete a document by ID.
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    if (!id) {
      return { data: null, error: { code: 'invalid-argument', message: 'Document ID is required for deletion' } };
    }

    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: true };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Query multiple documents with filter constraints, ordering, and pagination.
   */
  async query(
    filters: QueryFilter[] = [], 
    pagination?: PaginationParams
  ): Promise<RepositoryListResponse<T>> {
    try {
      let queryBuilder: any = supabase.from(this.tableName).select('*');

      for (const f of filters) {
        let snakeField = camelToSnakeCase(f.field);
        if (SUBMITTED_AT_TABLES.has(this.tableName) && snakeField === 'created_at') {
          snakeField = 'submitted_at';
        }

        switch (f.operator) {
          case '==':
            queryBuilder = queryBuilder.eq(snakeField, f.value);
            break;
          case '<':
            queryBuilder = queryBuilder.lt(snakeField, f.value);
            break;
          case '<=':
            queryBuilder = queryBuilder.lte(snakeField, f.value);
            break;
          case '>':
            queryBuilder = queryBuilder.gt(snakeField, f.value);
            break;
          case '>=':
            queryBuilder = queryBuilder.gte(snakeField, f.value);
            break;
          case 'in':
            queryBuilder = queryBuilder.in(snakeField, Array.isArray(f.value) ? f.value : [f.value]);
            break;
          case 'array-contains':
            queryBuilder = queryBuilder.contains(snakeField, Array.isArray(f.value) ? f.value : [f.value]);
            break;
          case 'array-contains-any':
            queryBuilder = queryBuilder.overlaps(snakeField, Array.isArray(f.value) ? f.value : [f.value]);
            break;
          default:
            queryBuilder = queryBuilder.eq(snakeField, f.value);
        }
      }

      if (pagination?.orderBy) {
        let snakeOrderBy = camelToSnakeCase(pagination.orderBy);
        if (SUBMITTED_AT_TABLES.has(this.tableName) && snakeOrderBy === 'created_at') {
          snakeOrderBy = 'submitted_at';
        }
        queryBuilder = queryBuilder.order(snakeOrderBy, { ascending: pagination.direction !== 'desc' });
      }

      if (pagination?.limit) {
        queryBuilder = queryBuilder.limit(pagination.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        return { data: [], hasMore: false, error: this.handleError(error) };
      }

      const items = (data || []).map((row: any) => fromDatabaseRow<T>(row));
      const lastDoc = items[items.length - 1];

      return {
        data: items,
        lastDocId: lastDoc?.id,
        hasMore: pagination?.limit ? items.length === pagination.limit : false
      };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  /**
   * Fetch all records from the table.
   */
  async getAll(): Promise<RepositoryListResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*');

      if (error) {
        return { data: [], hasMore: false, error: this.handleError(error) };
      }

      const items = (data || []).map((row: any) => fromDatabaseRow<T>(row));
      return {
        data: items,
        hasMore: false
      };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  /**
   * Real-time listener for a single document.
   * Emits the initial document immediately and notifies on subsequent updates or deletions.
   */
  listen(id: string, callback: (data: T | null, error?: AppError) => void): () => void {
    let isSubscribed = true;

    // Fetch initial document state
    this.getById(id).then(res => {
      if (isSubscribed) {
        callback(res.data, res.error);
      }
    });

    const channelId = `realtime_${this.tableName}_doc_${id}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName,
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (!isSubscribed) return;

          if (payload.eventType === 'DELETE') {
            callback(null, { code: 'not-found', message: 'Document was deleted' });
          } else if (payload.new) {
            callback(fromDatabaseRow<T>(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }

  /**
   * Real-time listener for an entire table / collection.
   * Emits the initial collection immediately and refetches upon any table mutation.
   */
  listenAll(callback: (data: T[], error?: AppError) => void): () => void {
    let isSubscribed = true;

    const fetchAndEmit = async () => {
      const res = await this.getAll();
      if (isSubscribed) {
        callback(res.data, res.error);
      }
    };

    // Fetch initial collection data
    fetchAndEmit();

    const channelId = `realtime_${this.tableName}_all_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName
        },
        () => {
          if (isSubscribed) {
            fetchAndEmit();
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }

  /**
   * Batch create multiple records in a single operation.
   */
  async batchCreate(items: Omit<T, 'id'>[]): Promise<RepositoryResponse<boolean>> {
    if (!items || items.length === 0) {
      return { data: true };
    }

    try {
      const nowIso = new Date().toISOString();
      const dbRows = items.map(item => {
        const id = (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
        const inputPayload: Record<string, any> = {
          ...item,
          id,
          createdAt: (item as any).createdAt 
            ? (typeof (item as any).createdAt === 'number' ? new Date((item as any).createdAt).toISOString() : (item as any).createdAt) 
            : nowIso,
          updatedAt: nowIso,
        };
        return toDatabasePayload(inputPayload, this.tableName);
      });

      const { error } = await supabase
        .from(this.tableName)
        .insert(dbRows);

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      return { data: true };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }
}
