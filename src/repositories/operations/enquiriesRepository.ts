import { BaseRepository } from '../BaseRepository';
import type { Enquiry } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';
import { OfflineQueue } from '../../services/OfflineQueue';

export class EnquiriesRepository extends BaseRepository<Enquiry> {
  constructor() {
    super(SUPABASE_TABLES.ENQUIRIES);
  }

  override async create(data: Omit<Enquiry, 'id'>, customId?: string) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      OfflineQueue.enqueue('enquiries', data);
      return { data: { ...data, id: 'pending-offline' } as Enquiry };
    }
    return super.create(data, customId);
  }
}

export const enquiriesRepository = new EnquiriesRepository();
