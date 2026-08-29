import { BaseRepository } from '../BaseRepository';
import { type FormSubmission } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';
import { OfflineQueue } from '../../services/OfflineQueue';

export class FormSubmissionsRepository extends BaseRepository<FormSubmission> {
  constructor() {
    super(SUPABASE_TABLES.FORM_SUBMISSIONS);
  }

  override async create(data: Omit<FormSubmission, 'id'>, customId?: string) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      OfflineQueue.enqueue('formSubmissions', data);
      return { data: { ...data, id: 'pending-offline' } as FormSubmission };
    }
    return super.create(data, customId);
  }
}

export const formSubmissionsRepository = new FormSubmissionsRepository();
