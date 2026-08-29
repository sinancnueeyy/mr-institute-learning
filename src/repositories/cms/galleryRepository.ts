import { BaseRepository } from '../BaseRepository';
import { type GalleryContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class GalleryRepository extends BaseRepository<GalleryContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_GALLERY);
  }

  override async create(data: Omit<GalleryContent, 'id'>, customId?: string) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.create(payload, customId);
  }

  override async update(id: string, data: Partial<GalleryContent>) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.update(id, payload);
  }
}

export const galleryRepository = new GalleryRepository();
