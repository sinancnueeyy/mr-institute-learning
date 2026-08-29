import { BaseRepository } from '../BaseRepository';
import { type MediaAsset } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';
import { supabase } from '../../supabase/client';
import type { RepositoryResponse } from '../../types';

export class MediaRepository extends BaseRepository<MediaAsset> {
  constructor() {
    super(SUPABASE_TABLES.CMS_MEDIA);
  }

  override async create(data: Omit<MediaAsset, 'id'>, customId?: string): Promise<RepositoryResponse<MediaAsset>> {
    try {
      const id = customId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
      const nowIso = new Date().toISOString();

      const dbPayload = {
        id,
        name: data.name,
        url: data.url,
        type: data.type,
        size: data.size,
        uploaded_at: data.uploadedAt 
          ? (typeof (data as any).uploadedAt === 'number' ? new Date((data as any).uploadedAt).toISOString() : data.uploadedAt) 
          : nowIso,
      };

      const { data: inserted, error } = await supabase
        .from(this.tableName)
        .insert(dbPayload)
        .select();

      if (error) {
        return { data: null, error: this.handleError(error) };
      }

      const row = inserted && inserted.length > 0 ? inserted[0] : dbPayload;
      return {
        data: {
          id: row.id,
          name: row.name,
          url: row.url,
          type: row.type,
          size: Number(row.size),
          uploadedAt: row.uploaded_at,
        }
      };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }
}

export const mediaRepository = new MediaRepository();
