import { BaseRepository } from '../BaseRepository';
import { type FormSubmission } from '../../types/operations';
import { OfflineQueue } from '../../services/OfflineQueue';

class FormSubmissionsRepository extends BaseRepository<FormSubmission> {
  constructor() {
    super('formSubmissions');
  }

  async create(data: Omit<FormSubmission, 'id'>, customId?: string) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      OfflineQueue.enqueue('formSubmissions', data);
      return { data: { ...data, id: 'pending-offline' } as FormSubmission };
    }
    return super.create(data, customId);
  }
}

export const formSubmissionsRepository = new FormSubmissionsRepository();
