import { BaseRepository } from '../BaseRepository';
import { type ServiceContent } from '../../types/cms';
import { SUPABASE_TABLES } from '../../constants';

export class ServicesRepository extends BaseRepository<ServiceContent> {
  constructor() {
    super(SUPABASE_TABLES.CMS_SERVICES);
  }

  override async create(data: Omit<ServiceContent, 'id'>, customId?: string) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.create(payload, customId);
  }

  override async update(id: string, data: Partial<ServiceContent>) {
    const payload: any = { ...data };
    if ('order' in payload && !('orderIndex' in payload)) {
      payload.order_index = payload.order;
      delete payload.order;
    }
    return super.update(id, payload);
  }
}

export const servicesRepository = new ServicesRepository();
