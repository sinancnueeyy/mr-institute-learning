import { BaseRepository } from '../BaseRepository';
import type { ScholarshipApplication } from '../../types/operations';
import { SUPABASE_TABLES } from '../../constants';

export class ScholarshipsRepository extends BaseRepository<ScholarshipApplication> {
  constructor() {
    super(SUPABASE_TABLES.SCHOLARSHIPS);
  }
}

export const scholarshipsRepository = new ScholarshipsRepository();
