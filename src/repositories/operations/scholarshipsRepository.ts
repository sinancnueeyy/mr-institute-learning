import { BaseRepository } from '../BaseRepository';
import type { ScholarshipApplication } from '../../types/operations';

class ScholarshipsRepository extends BaseRepository<ScholarshipApplication> {
  constructor() {
    super('scholarships');
  }
}

export const scholarshipsRepository = new ScholarshipsRepository();
